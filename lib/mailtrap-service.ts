/**
 * Serviço de integração com Mailtrap API
 */

const MAILTRAP_API_URL = 'https://sandbox.api.mailtrap.io/api/send';
const MAILTRAP_API_TOKEN = process.env.MAILTRAP_API_TOKEN;
const MAILTRAP_FROM_EMAIL = process.env.MAILTRAP_FROM_EMAIL || 'comercial@plugnrent.com.br';

export interface MailtrapEmail {
  from: {
    email: string;
    name?: string;
  };
  to: Array<{
    email: string;
    name?: string;
  }>;
  subject: string;
  text?: string;
  html?: string;
  category?: string;
  cc?: Array<{ email: string; name?: string }>;
  bcc?: Array<{ email: string; name?: string }>;
}

export async function sendEmail(email: MailtrapEmail): Promise<{ success: boolean; messageIds?: string[]; error?: string }> {
  if (!MAILTRAP_API_TOKEN) {
    throw new Error('MAILTRAP_API_TOKEN não configurado');
  }

  try {
    const response = await fetch(MAILTRAP_API_URL, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${MAILTRAP_API_TOKEN}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        from: {
          email: email.from.email,
          name: email.from.name || 'Sistema Vibing',
        },
        to: email.to,
        subject: email.subject,
        text: email.text,
        html: email.html,
        category: email.category,
        cc: email.cc,
        bcc: email.bcc,
      }),
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.message || `Erro ao enviar email: ${response.statusText}`);
    }

    const data = await response.json();
    return {
      success: true,
      messageIds: data.message_ids || [],
    };
  } catch (error) {
    console.error('Erro ao enviar email via Mailtrap:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Erro desconhecido ao enviar email',
    };
  }
}

export function getFromEmail(): string {
  return MAILTRAP_FROM_EMAIL;
}




