import { NextRequest, NextResponse } from "next/server";
import { createAdminClient } from "@/lib/supabase/server";
import { fetchWhatsAppTemplates, resolveTemplateBody } from "@/lib/whatsapp";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ userId: string }> },
) {
  const { userId } = await params;
  const { searchParams } = new URL(request.url);

  const mode = searchParams.get("hub.mode");
  const token = searchParams.get("hub.verify_token");
  const challenge = searchParams.get("hub.challenge");

  if (mode !== "subscribe" || !token || !challenge) {
    return NextResponse.json({ error: "Missing parameters" }, { status: 400 });
  }

  const supabase = createAdminClient();
  const { data: config } = await supabase
    .from("whatsapp_configs")
    .select("webhook_verify_token")
    .eq("user_id", userId)
    .single();

  const verifyToken = config?.webhook_verify_token;

  if (!verifyToken || verifyToken !== token) {
    console.error(`\n❌ Webhook Verification Failed for user ${userId}`);
    console.error(`   Meta sent token: "${token}"`);
    console.error(`   Your DB has token: "${verifyToken}"`);
    console.error(`   Please ensure these match exactly!\n`);
    return new Response("Forbidden", { status: 403 });
  }

  console.log(`\n✅ Webhook Verified successfully for user: ${userId}\n`);
  // Return challenge as plain text for Meta verification
  return new Response(challenge, { status: 200 });
}

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ userId: string }> },
) {
  const { userId } = await params;

  // Always return 200 immediately to Meta to prevent retries
  try {
    const body = await request.json();
    const supabase = createAdminClient();

    console.log("👉 Full Webhook Body:", JSON.stringify(body, null, 2));

    const entry = body?.entry?.[0];
    if (!entry) {
      return NextResponse.json({ status: "ok" });
    }

    const changes = entry.changes?.[0]?.value;
    if (!changes) {
      return NextResponse.json({ status: "ok" });
    }

    console.log(
      "👉 Changes Payload received:",
      JSON.stringify(changes, null, 2),
    );

    // Handle incoming messages
    if (changes.messages && changes.messages.length > 0) {
      for (const msg of changes.messages) {
        const phoneNumber = msg.from;
        const profileName = changes.contacts?.[0]?.profile?.name || phoneNumber;
        const waMessageId = msg.id;
        const messageContent = msg.text?.body || msg.caption || "[media]";
        const messageType = msg.type || "text";

        // Upsert contact
        const { data: contact, error: contactError } = await supabase
          .from("contacts")
          .upsert(
            {
              user_id: userId,
              phone_number: phoneNumber,
              name: profileName,
              profile_name: profileName,
            },
            { onConflict: "user_id,phone_number" },
          )
          .select("id")
          .single();

        if (contactError || !contact) {
          console.error("❌ Error upserting contact:", contactError);
          continue;
        }

        // Upsert conversation
        const { data: conversation, error: convError } = await supabase
          .from("conversations")
          .upsert(
            {
              user_id: userId,
              contact_id: contact.id,
              last_message: messageContent,
              last_message_at: new Date().toISOString(),
            },
            { onConflict: "user_id,contact_id" },
          )
          .select("id, unread_count")
          .single();

        if (convError || !conversation) {
          console.error("❌ Error upserting conversation:", convError);
          continue;
        }

        // Increment unread count
        await supabase
          .from("conversations")
          .update({ unread_count: (conversation.unread_count || 0) + 1 })
          .eq("id", conversation.id);

        // Insert message
        const { error: msgInsertError } = await supabase
          .from("messages")
          .insert({
            user_id: userId,
            conversation_id: conversation.id,
            wa_message_id: waMessageId,
            direction: "inbound",
            content: messageContent,
            message_type: messageType,
            status: "sent",
          });

        if (msgInsertError) {
          console.error("❌ Error inserting incoming message:", msgInsertError);
        } else {
          console.log(
            `✅ Success: Message inserted for user ${userId} and wamid ${waMessageId}`,
          );
        }
      }
    }

    // Handle status updates (delivered / read)
    if (changes.statuses && changes.statuses.length > 0) {
      for (const status of changes.statuses) {
        const waMessageId = status.id;
        const statusValue = status.status; // sent, delivered, read, failed
        const timestamp = status.timestamp
          ? new Date(parseInt(status.timestamp) * 1000).toISOString()
          : new Date().toISOString();

        const updateData: Record<string, any> = { status: statusValue };

        if (statusValue === "delivered") {
          updateData.delivered_at = timestamp;
        } else if (statusValue === "read") {
          updateData.delivered_at = updateData.delivered_at || timestamp;
          updateData.seen_at = timestamp;
        } else if (statusValue === "failed") {
          console.error(
            `\n❌ WhatsApp Message Failed Delivery (wamid: ${waMessageId}):`,
            JSON.stringify(status.errors || status, null, 2),
            `\n`,
          );
        }

        // Add returning representation to catch when a record is not found!
        const { data: updatedRecord, error: statusUpdateError } = await supabase
          .from("messages")
          .update(updateData)
          .eq("wa_message_id", waMessageId)
          .eq("user_id", userId)
          .select("id")
          .maybeSingle();

        if (statusUpdateError) {
          console.error("❌ Error updating message status:", statusUpdateError);
        } else if (!updatedRecord) {
          console.warn(
            `⚠️ Warning: Status '${statusValue}' received, but no matching message found in DB for wa_message_id: ${waMessageId}`,
          );

          // Fallback: If a message was sent externally (e.g. Template via Meta API), resolve the actual template text
          if (status.recipient_id) {
            console.log(
              `♻️ Creating external template message for ${waMessageId} to ${status.recipient_id}`,
            );

            // Fetch the user's WhatsApp config to get WABA ID and access token
            const { data: config } = await supabase
              .from("whatsapp_configs")
              .select("waba_id, access_token")
              .eq("user_id", userId)
              .single();

            // Resolve the actual template body text from Meta's API
            let templateContent = "[Template Message]";
            if (config?.waba_id && config?.access_token) {
              const pricingCategory = status.pricing?.category; // e.g. "utility", "marketing"
              console.log(
                `📋 Fetching templates from Meta (WABA: ${config.waba_id}, category: ${pricingCategory})...`,
              );
              const templates = await fetchWhatsAppTemplates({
                wabaId: config.waba_id,
                accessToken: config.access_token,
              });
              console.log(`📋 Found ${templates.length} approved templates`);
              templateContent = resolveTemplateBody(templates, pricingCategory);
              console.log(
                `📋 Resolved template content: "${templateContent.substring(0, 80)}..."`,
              );
            }

            const { data: contact, error: contactError } = await supabase
              .from("contacts")
              .upsert(
                { user_id: userId, phone_number: status.recipient_id },
                { onConflict: "user_id,phone_number" },
              )
              .select("id")
              .single();

            if (!contactError && contact) {
              const { data: conversation, error: convError } = await supabase
                .from("conversations")
                .upsert(
                  {
                    user_id: userId,
                    contact_id: contact.id,
                    last_message: templateContent,
                    last_message_at: timestamp,
                  },
                  { onConflict: "user_id,contact_id" },
                )
                .select("id")
                .single();

              if (!convError && conversation) {
                const insertData: any = {
                  user_id: userId,
                  conversation_id: conversation.id,
                  wa_message_id: waMessageId,
                  direction: "outbound",
                  content: templateContent,
                  message_type: "template",
                  status: statusValue,
                  created_at: timestamp,
                };
                if (statusValue === "delivered")
                  insertData.delivered_at = timestamp;
                if (statusValue === "read") {
                  insertData.delivered_at = timestamp;
                  insertData.seen_at = timestamp;
                }

                const { error: insertErr } = await supabase
                  .from("messages")
                  .insert(insertData);
                if (!insertErr) {
                  console.log(
                    `✅ Success: Template message inserted with real content`,
                  );
                } else if (insertErr.code === "23505") {
                  console.log(
                    `⚠️ Duplicate key for ${waMessageId} (already exists). Updating status instead.`,
                  );
                  const { error: retryUpdateErr } = await supabase
                    .from("messages")
                    .update(updateData)
                    .eq("wa_message_id", waMessageId);
                  if (retryUpdateErr)
                    console.error(
                      "❌ Error retrying message update after duplicate key:",
                      retryUpdateErr,
                    );
                } else {
                  console.error(
                    "❌ Error inserting template message:",
                    insertErr,
                  );
                }
              }
            }
          }
        } else {
          console.log(
            `✅ Success: Status '${statusValue}' updated for message ${waMessageId}`,
          );
        }
      }
    }
  } catch (err) {
    console.error("Webhook processing error:", err);
  }

  return NextResponse.json({ status: "ok" });
}
