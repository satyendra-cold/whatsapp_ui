import axios from 'axios';

interface SendMessageParams {
  to: string;
  message: string;
  accessToken: string;
  phoneNumberId: string;
}

interface SendMessageResponse {
  messageId: string;
}

/**
 * Send a text message via WhatsApp Cloud API
 */
export async function sendWhatsAppMessage({
  to,
  message,
  accessToken,
  phoneNumberId,
}: SendMessageParams): Promise<SendMessageResponse> {
  const url = `https://graph.facebook.com/v19.0/${phoneNumberId}/messages`;

  const response = await axios.post(
    url,
    {
      messaging_product: 'whatsapp',
      to,
      type: 'text',
      text: { body: message },
    },
    {
      headers: {
        Authorization: `Bearer ${accessToken}`,
        'Content-Type': 'application/json',
      },
    }
  );

  const waMessageId = response.data?.messages?.[0]?.id;
  if (!waMessageId) {
    throw new Error('No message ID returned from WhatsApp API');
  }

  return { messageId: waMessageId };
}

/**
 * Verify the Meta access token is valid by calling the API
 */
export async function verifyMetaToken(
  accessToken: string,
  phoneNumberId: string
): Promise<{ valid: boolean; phoneNumber?: string; error?: string }> {
  try {
    const url = `https://graph.facebook.com/v19.0/${phoneNumberId}`;
    const response = await axios.get(url, {
      headers: { Authorization: `Bearer ${accessToken}` },
    });
    return {
      valid: true,
      phoneNumber: response.data?.display_phone_number || response.data?.verified_name,
    };
  } catch (err: any) {
    return {
      valid: false,
      error: err?.response?.data?.error?.message || 'Invalid token or phone number ID',
    };
  }
}
