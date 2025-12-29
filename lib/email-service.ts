/**
 * Serviço de envio de emails do Sistema Vibing
 * Usa Mailtrap para envio
 */

import { sendEmail, getFromEmail } from './mailtrap-service';
import type { MailtrapEmail } from './mailtrap-service';

const APP_URL = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000';

/**
 * Envia email de verificação para hóspede
 */
export async function sendVerificationEmail(
  email: string,
  name: string,
  verificationToken: string
): Promise<{ success: boolean; error?: string }> {
  const verificationLink = `${APP_URL}/hospede/verificar-email?token=${verificationToken}`;

  const emailData: MailtrapEmail = {
    from: {
      email: getFromEmail(),
      name: 'Sistema Vibing',
    },
    to: [{ email, name }],
    subject: 'Verifique seu email - Sistema Vibing',
    category: 'email-verification',
    html: `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <style>
          body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
          .container { max-width: 600px; margin: 0 auto; padding: 20px; }
          .button { display: inline-block; padding: 12px 24px; background: linear-gradient(135deg, #1e30f3 0%, #e21e80 100%); color: white; text-decoration: none; border-radius: 8px; margin: 20px 0; }
        </style>
      </head>
      <body>
        <div class="container">
          <h1>Bem-vindo ao Sistema Vibing, ${name}!</h1>
          <p>Por favor, verifique seu email clicando no botão abaixo:</p>
          <a href="${verificationLink}" class="button">Verificar Email</a>
          <p>Ou copie e cole este link no seu navegador:</p>
          <p>${verificationLink}</p>
          <p>Este link expira em 24 horas.</p>
        </div>
      </body>
      </html>
    `,
    text: `
      Bem-vindo ao Sistema Vibing, ${name}!
      
      Por favor, verifique seu email acessando este link:
      ${verificationLink}
      
      Este link expira em 24 horas.
    `,
  };

  return await sendEmail(emailData);
}

/**
 * Envia email de reset de senha
 */
export async function sendPasswordResetEmail(
  email: string,
  name: string,
  resetToken: string
): Promise<{ success: boolean; error?: string }> {
  const resetLink = `${APP_URL}/auth/reset-password?token=${resetToken}`;

  const emailData: MailtrapEmail = {
    from: {
      email: getFromEmail(),
      name: 'Sistema Vibing',
    },
    to: [{ email, name }],
    subject: 'Redefinir sua senha - Sistema Vibing',
    category: 'password-reset',
    html: `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <style>
          body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
          .container { max-width: 600px; margin: 0 auto; padding: 20px; }
          .button { display: inline-block; padding: 12px 24px; background: linear-gradient(135deg, #1e30f3 0%, #e21e80 100%); color: white; text-decoration: none; border-radius: 8px; margin: 20px 0; }
        </style>
      </head>
      <body>
        <div class="container">
          <h1>Redefinir Senha</h1>
          <p>Olá ${name},</p>
          <p>Você solicitou a redefinição de senha. Clique no botão abaixo para criar uma nova senha:</p>
          <a href="${resetLink}" class="button">Redefinir Senha</a>
          <p>Ou copie e cole este link no seu navegador:</p>
          <p>${resetLink}</p>
          <p>Este link expira em 1 hora.</p>
          <p>Se você não solicitou esta redefinição, ignore este email.</p>
        </div>
      </body>
      </html>
    `,
    text: `
      Redefinir Senha
      
      Olá ${name},
      Você solicitou a redefinição de senha. Acesse este link:
      ${resetLink}
      
      Este link expira em 1 hora.
      Se você não solicitou esta redefinição, ignore este email.
    `,
  };

  return await sendEmail(emailData);
}

/**
 * Envia convite de reserva para hóspede
 */
export async function sendReservationInviteEmail(
  email: string,
  name: string,
  propertyName: string,
  checkinLink: string
): Promise<{ success: boolean; error?: string }> {
  const emailData: MailtrapEmail = {
    from: {
      email: getFromEmail(),
      name: 'Sistema Vibing',
    },
    to: [{ email, name }],
    subject: `Convite de Check-in - ${propertyName}`,
    category: 'reservation-invite',
    html: `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <style>
          body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
          .container { max-width: 600px; margin: 0 auto; padding: 20px; }
          .button { display: inline-block; padding: 12px 24px; background: linear-gradient(135deg, #1e30f3 0%, #e21e80 100%); color: white; text-decoration: none; border-radius: 8px; margin: 20px 0; }
        </style>
      </head>
      <body>
        <div class="container">
          <h1>Convite de Check-in</h1>
          <p>Olá ${name},</p>
          <p>Você foi convidado para fazer check-in na propriedade <strong>${propertyName}</strong>.</p>
          <p>Clique no botão abaixo para acessar o link de check-in:</p>
          <a href="${checkinLink}" class="button">Fazer Check-in</a>
          <p>Ou copie e cole este link no seu navegador:</p>
          <p>${checkinLink}</p>
        </div>
      </body>
      </html>
    `,
    text: `
      Convite de Check-in
      
      Olá ${name},
      Você foi convidado para fazer check-in na propriedade ${propertyName}.
      Acesse: ${checkinLink}
    `,
  };

  return await sendEmail(emailData);
}

/**
 * Envia convite de condomínio
 */
export async function sendCondominiumInviteEmail(
  email: string,
  condominiumName: string,
  propertyName: string,
  inviteToken: string
): Promise<{ success: boolean; error?: string }> {
  const inviteLink = `${APP_URL}/condominio/convite/${inviteToken}`;

  const emailData: MailtrapEmail = {
    from: {
      email: getFromEmail(),
      name: 'Sistema Vibing',
    },
    to: [{ email }],
    subject: `Convite para Condomínio - ${condominiumName}`,
    category: 'condominium-invite',
    html: `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <style>
          body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
          .container { max-width: 600px; margin: 0 auto; padding: 20px; }
          .button { display: inline-block; padding: 12px 24px; background: linear-gradient(135deg, #1e30f3 0%, #e21e80 100%); color: white; text-decoration: none; border-radius: 8px; margin: 20px 0; }
        </style>
      </head>
      <body>
        <div class="container">
          <h1>Convite para Condomínio</h1>
          <p>Você foi convidado para gerenciar reservas do condomínio <strong>${condominiumName}</strong> para a propriedade <strong>${propertyName}</strong>.</p>
          <p>Clique no botão abaixo para aceitar o convite:</p>
          <a href="${inviteLink}" class="button">Aceitar Convite</a>
          <p>Ou copie e cole este link no seu navegador:</p>
          <p>${inviteLink}</p>
          <p>Este link expira em 7 dias.</p>
        </div>
      </body>
      </html>
    `,
    text: `
      Convite para Condomínio
      
      Você foi convidado para gerenciar reservas do condomínio ${condominiumName} para a propriedade ${propertyName}.
      Acesse: ${inviteLink}
      Este link expira em 7 dias.
    `,
  };

  return await sendEmail(emailData);
}

/**
 * Envia notificação de reserva para condomínio
 */
export async function sendCondominiumReservationEmail(
  email: string,
  condominiumName: string,
  propertyName: string,
  reservationDetails: string,
  dashboardLink: string
): Promise<{ success: boolean; error?: string }> {
  const emailData: MailtrapEmail = {
    from: {
      email: getFromEmail(),
      name: 'Sistema Vibing',
    },
    to: [{ email }],
    subject: `Nova Reserva - ${propertyName}`,
    category: 'condominium-reservation',
    html: `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <style>
          body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
          .container { max-width: 600px; margin: 0 auto; padding: 20px; }
          .button { display: inline-block; padding: 12px 24px; background: linear-gradient(135deg, #1e30f3 0%, #e21e80 100%); color: white; text-decoration: none; border-radius: 8px; margin: 20px 0; }
        </style>
      </head>
      <body>
        <div class="container">
          <h1>Nova Reserva Recebida</h1>
          <p>Olá ${condominiumName},</p>
          <p>Uma nova reserva foi criada para a propriedade <strong>${propertyName}</strong>.</p>
          <div style="background: #f8f9fa; padding: 15px; border-radius: 8px; margin: 20px 0;">
            ${reservationDetails}
          </div>
          <a href="${dashboardLink}" class="button">Ver no Dashboard</a>
        </div>
      </body>
      </html>
    `,
    text: `
      Nova Reserva Recebida
      
      Olá ${condominiumName},
      Uma nova reserva foi criada para a propriedade ${propertyName}.
      ${reservationDetails}
      Ver no Dashboard: ${dashboardLink}
    `,
  };

  return await sendEmail(emailData);
}

/**
 * Envia link público de reserva para condomínio
 */
export async function sendPublicReservationLinkEmail(
  email: string,
  propertyName: string,
  publicLink: string,
  expiresAt: string
): Promise<{ success: boolean; error?: string }> {
  const emailData: MailtrapEmail = {
    from: {
      email: getFromEmail(),
      name: 'Sistema Vibing',
    },
    to: [{ email }],
    subject: `Link Público de Reserva - ${propertyName}`,
    category: 'public-reservation-link',
    html: `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <style>
          body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
          .container { max-width: 600px; margin: 0 auto; padding: 20px; }
          .button { display: inline-block; padding: 12px 24px; background: linear-gradient(135deg, #1e30f3 0%, #e21e80 100%); color: white; text-decoration: none; border-radius: 8px; margin: 20px 0; }
        </style>
      </head>
      <body>
        <div class="container">
          <h1>Link Público de Reserva</h1>
          <p>Um link público foi gerado para a propriedade <strong>${propertyName}</strong>.</p>
          <p>Este link permite acesso temporário aos detalhes da reserva.</p>
          <a href="${publicLink}" class="button">Acessar Reserva</a>
          <p>Ou copie e cole este link:</p>
          <p>${publicLink}</p>
          <p>Este link expira em: ${new Date(expiresAt).toLocaleString('pt-BR')}</p>
        </div>
      </body>
      </html>
    `,
    text: `
      Link Público de Reserva
      
      Um link público foi gerado para a propriedade ${propertyName}.
      Acesse: ${publicLink}
      Este link expira em: ${new Date(expiresAt).toLocaleString('pt-BR')}
    `,
  };

  return await sendEmail(emailData);
}

/**
 * Envia email de conta temporária para hóspede
 */
export async function sendTemporaryAccountEmail(
  email: string,
  name: string,
  password: string,
  reservationLink: string
): Promise<{ success: boolean; error?: string }> {
  const emailData: MailtrapEmail = {
    from: {
      email: getFromEmail(),
      name: 'Sistema Vibing',
    },
    to: [{ email, name }],
    subject: 'Conta Temporária Criada - Sistema Vibing',
    category: 'temporary-account',
    html: `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <style>
          body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
          .container { max-width: 600px; margin: 0 auto; padding: 20px; }
          .button { display: inline-block; padding: 12px 24px; background: linear-gradient(135deg, #1e30f3 0%, #e21e80 100%); color: white; text-decoration: none; border-radius: 8px; margin: 20px 0; }
          .credentials { background: #f8f9fa; padding: 15px; border-radius: 8px; margin: 20px 0; }
        </style>
      </head>
      <body>
        <div class="container">
          <h1>Conta Temporária Criada</h1>
          <p>Olá ${name},</p>
          <p>Uma conta temporária foi criada para você no Sistema Vibing.</p>
          <div class="credentials">
            <p><strong>Email:</strong> ${email}</p>
            <p><strong>Senha temporária:</strong> ${password}</p>
          </div>
          <p>Por favor, altere sua senha após o primeiro login.</p>
          <a href="${reservationLink}" class="button">Acessar Reserva</a>
        </div>
      </body>
      </html>
    `,
    text: `
      Conta Temporária Criada
      
      Olá ${name},
      Uma conta temporária foi criada para você.
      Email: ${email}
      Senha temporária: ${password}
      Por favor, altere sua senha após o primeiro login.
      Acessar: ${reservationLink}
    `,
  };

  return await sendEmail(emailData);
}

/**
 * Envia email de boas-vindas para condomínio
 */
export async function sendCondominiumWelcomeEmail(
  email: string,
  condominiumName: string
): Promise<{ success: boolean; error?: string }> {
  const dashboardLink = `${APP_URL}/condominio/dashboard`;

  const emailData: MailtrapEmail = {
    from: {
      email: getFromEmail(),
      name: 'Sistema Vibing',
    },
    to: [{ email }],
    subject: 'Bem-vindo ao Sistema Vibing!',
    category: 'condominium-welcome',
    html: `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <style>
          body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
          .container { max-width: 600px; margin: 0 auto; padding: 20px; }
          .button { display: inline-block; padding: 12px 24px; background: linear-gradient(135deg, #1e30f3 0%, #e21e80 100%); color: white; text-decoration: none; border-radius: 8px; margin: 20px 0; }
        </style>
      </head>
      <body>
        <div class="container">
          <h1>Bem-vindo ao Sistema Vibing!</h1>
          <p>Olá ${condominiumName},</p>
          <p>Sua conta de condomínio foi criada com sucesso!</p>
          <p>Agora você pode gerenciar todas as reservas das propriedades vinculadas ao seu condomínio.</p>
          <a href="${dashboardLink}" class="button">Acessar Dashboard</a>
          <p>Se você tiver alguma dúvida, não hesite em entrar em contato conosco.</p>
        </div>
      </body>
      </html>
    `,
    text: `
      Bem-vindo ao Sistema Vibing!
      
      Olá ${condominiumName},
      Sua conta de condomínio foi criada com sucesso!
      Acesse seu dashboard: ${dashboardLink}
    `,
  };

  return await sendEmail(emailData);
}

/**
 * Envia email de boas-vindas para novo usuário (host)
 */
export async function sendWelcomeEmail(
  email: string,
  name: string
): Promise<{ success: boolean; error?: string }> {
  const loginLink = `${APP_URL}/auth/login`;
  const dashboardLink = `${APP_URL}/dashboard`;

  const emailData: MailtrapEmail = {
    from: {
      email: getFromEmail(),
      name: 'Sistema Vibing',
    },
    to: [{ email, name }],
    subject: 'Bem-vindo ao Sistema Vibing!',
    category: 'welcome',
    html: `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <style>
          body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
          .container { max-width: 600px; margin: 0 auto; padding: 20px; }
          .button { display: inline-block; padding: 12px 24px; background: linear-gradient(135deg, #1e30f3 0%, #e21e80 100%); color: white; text-decoration: none; border-radius: 8px; margin: 20px 0; }
        </style>
      </head>
      <body>
        <div class="container">
          <h1>Bem-vindo ao Sistema Vibing, ${name}!</h1>
          <p>Sua conta foi criada com sucesso!</p>
          <p>Por favor, verifique seu email clicando no link de confirmação que enviamos.</p>
          <p>Após confirmar seu email, você poderá:</p>
          <ul>
            <li>Gerenciar suas propriedades</li>
            <li>Criar e gerenciar reservas</li>
            <li>Acompanhar seus hóspedes</li>
            <li>E muito mais!</li>
          </ul>
          <a href="${loginLink}" class="button">Fazer Login</a>
          <p>Ou acesse diretamente seu <a href="${dashboardLink}">Dashboard</a> após confirmar o email.</p>
          <p>Se você tiver alguma dúvida, não hesite em entrar em contato conosco.</p>
        </div>
      </body>
      </html>
    `,
    text: `
      Bem-vindo ao Sistema Vibing, ${name}!
      
      Sua conta foi criada com sucesso!
      Por favor, verifique seu email clicando no link de confirmação que enviamos.
      
      Após confirmar seu email, você poderá gerenciar suas propriedades, criar reservas e muito mais!
      
      Fazer login: ${loginLink}
      Dashboard: ${dashboardLink}
    `,
  };

  return await sendEmail(emailData);
}

