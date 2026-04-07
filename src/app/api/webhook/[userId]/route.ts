import { NextRequest, NextResponse } from 'next/server';
import { createAdminClient } from '@/lib/supabase/server';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ userId: string }> }
) {
  const { userId } = await params;
  const { searchParams } = new URL(request.url);

  const mode = searchParams.get('hub.mode');
  const token = searchParams.get('hub.verify_token');
  const challenge = searchParams.get('hub.challenge');

  if (mode !== 'subscribe' || !token || !challenge) {
    return NextResponse.json({ error: 'Missing parameters' }, { status: 400 });
  }

  const supabase = createAdminClient();
  const { data: config } = await supabase
    .from('whatsapp_configs')
    .select('webhook_verify_token')
    .eq('user_id', userId)
    .single();

  const verifyToken = config?.webhook_verify_token;

  if (!verifyToken || verifyToken !== token) {
    console.error(`\n❌ Webhook Verification Failed for user ${userId}`);
    console.error(`   Meta sent token: "${token}"`);
    console.error(`   Your DB has token: "${verifyToken}"`);
    console.error(`   Please ensure these match exactly!\n`);
    return new Response('Forbidden', { status: 403 });
  }

  console.log(`\n✅ Webhook Verified successfully for user: ${userId}\n`);
  // Return challenge as plain text for Meta verification
  return new Response(challenge, { status: 200 });
}

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ userId: string }> }
) {
  const { userId } = await params;

  // Always return 200 immediately to Meta to prevent retries
  try {
    const body = await request.json();
    const supabase = createAdminClient();

    const entry = body?.entry?.[0];
    if (!entry) {
      return NextResponse.json({ status: 'ok' });
    }

    const changes = entry.changes?.[0]?.value;
    if (!changes) {
      return NextResponse.json({ status: 'ok' });
    }

    // Handle incoming messages
    if (changes.messages && changes.messages.length > 0) {
      for (const msg of changes.messages) {
        const phoneNumber = msg.from;
        const profileName =
          changes.contacts?.[0]?.profile?.name || phoneNumber;
        const waMessageId = msg.id;
        const messageContent = msg.text?.body || msg.caption || '[media]';
        const messageType = msg.type || 'text';

        // Upsert contact
        const { data: contact } = await supabase
          .from('contacts')
          .upsert(
            {
              user_id: userId,
              phone_number: phoneNumber,
              name: profileName,
              profile_name: profileName,
            },
            { onConflict: 'user_id,phone_number' }
          )
          .select('id')
          .single();

        if (!contact) continue;

        // Upsert conversation
        const { data: conversation } = await supabase
          .from('conversations')
          .upsert(
            {
              user_id: userId,
              contact_id: contact.id,
              last_message: messageContent,
              last_message_at: new Date().toISOString(),
            },
            { onConflict: 'user_id,contact_id' }
          )
          .select('id, unread_count')
          .single();

        if (!conversation) continue;

        // Increment unread count
        await supabase
          .from('conversations')
          .update({ unread_count: (conversation.unread_count || 0) + 1 })
          .eq('id', conversation.id);

        // Insert message
        await supabase.from('messages').insert({
          user_id: userId,
          conversation_id: conversation.id,
          wa_message_id: waMessageId,
          direction: 'inbound',
          content: messageContent,
          message_type: messageType,
          status: 'sent',
        });
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

        if (statusValue === 'delivered') {
          updateData.delivered_at = timestamp;
        } else if (statusValue === 'read') {
          updateData.delivered_at = updateData.delivered_at || timestamp;
          updateData.seen_at = timestamp;
        } else if (statusValue === 'failed') {
          console.error(`\n❌ WhatsApp Message Failed Delivery (wamid: ${waMessageId}):`, JSON.stringify(status.errors || status, null, 2), `\n`);
        }

        await supabase
          .from('messages')
          .update(updateData)
          .eq('wa_message_id', waMessageId)
          .eq('user_id', userId);
      }
    }
  } catch (err) {
    console.error('Webhook processing error:', err);
  }

  return NextResponse.json({ status: 'ok' });
}
