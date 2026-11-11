import nodemailer from 'nodemailer';

/**
 * Configure Nodemailer Transporter using Gmail SMTP credentials from .env
 */
const getTransporter = () => {
  const user = process.env.EMAIL_USER;
  const pass = process.env.EMAIL_PASS ? process.env.EMAIL_PASS.replace(/\s+/g, '') : '';

  if (!user || !pass) {
    return null;
  }

  return nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user,
      pass
    }
  });
};

/**
 * Send an email using Nodemailer with smart fallback
 */
export const sendEmail = async ({ to, subject, html, text }) => {
  const transporter = getTransporter();
  const fromName = 'Quantum Mobile Store';
  const fromEmail = process.env.EMAIL_USER || 'support@quantummobile.lk';

  if (!transporter) {
    console.warn('⚠️ [EMAIL SANDBOX] No EMAIL_USER/EMAIL_PASS configured. Email simulated:');
    console.warn(`To: ${to} | Subject: ${subject}`);
    return { success: true, simulated: true };
  }

  try {
    const info = await transporter.sendMail({
      from: `"${fromName}" <${fromEmail}>`,
      to,
      subject,
      text: text || '',
      html
    });

    console.log(`✅ [EMAIL SENT] MessageId: ${info.messageId} to ${to}`);
    return { success: true, messageId: info.messageId };
  } catch (error) {
    console.error('❌ [EMAIL ERROR] Failed to send email:', error.message);
    throw error;
  }
};

/**
 * Send Password Reset Email with responsive branded template
 */
export const sendPasswordResetEmail = async (email, name, resetUrl) => {
  const subject = '🔑 Quantum Mobile — Password Reset Request';
  const html = `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <style>
        body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; background-color: #0b0f19; color: #f1f5f9; margin: 0; padding: 24px; }
        .card { max-width: 540px; margin: 0 auto; background: #131b2e; border: 1px solid #1e293b; border-radius: 16px; overflow: hidden; box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.5); }
        .header { background: linear-gradient(135deg, #1e3a8a 0%, #3b82f6 100%); padding: 32px 24px; text-align: center; }
        .header h1 { margin: 0; font-size: 24px; font-weight: 800; color: #ffffff; letter-spacing: -0.5px; }
        .header p { margin: 6px 0 0; font-size: 14px; color: #bfdbfe; }
        .body { padding: 32px 28px; line-height: 1.6; color: #cbd5e1; }
        .greeting { font-size: 18px; font-weight: 600; color: #f8fafc; margin-bottom: 12px; }
        .btn-container { text-align: center; margin: 32px 0; }
        .btn { display: inline-block; background: #3b82f6; color: #ffffff !important; font-weight: 700; font-size: 15px; padding: 14px 32px; border-radius: 10px; text-decoration: none; box-shadow: 0 4px 14px 0 rgba(59, 130, 246, 0.39); }
        .btn:hover { background: #2563eb; }
        .warning-box { background: rgba(239, 68, 68, 0.1); border-left: 4px solid #ef4444; padding: 12px 16px; border-radius: 6px; font-size: 13px; color: #fca5a5; margin-top: 24px; }
        .url-box { margin-top: 20px; font-size: 12px; color: #64748b; word-break: break-all; }
        .footer { padding: 20px 28px; background: #0f172a; border-top: 1px solid #1e293b; text-align: center; font-size: 12px; color: #64748b; }
      </style>
    </head>
    <body>
      <div class="card">
        <div class="header">
          <h1>⚡ Quantum Mobile Store</h1>
          <p>Sri Lanka's Premier Smartphone & Tech Lab</p>
        </div>
        <div class="body">
          <div class="greeting">Hello ${name || 'Valued Customer'},</div>
          <p>We received a request to reset the password for your Quantum Mobile account (<strong>${email}</strong>).</p>
          <p>Click the secure button below to choose a new password. This reset link is active for <strong>15 minutes</strong>.</p>
          
          <div class="btn-container">
            <a href="${resetUrl}" target="_blank" class="btn">Reset My Password</a>
          </div>

          <div class="warning-box">
            ⚠️ If you did not request this password reset, please ignore this email or notify our security team. Your account remains completely safe.
          </div>

          <div class="url-box">
            Button not opening? Copy and paste this URL into your browser:<br/>
            <a href="${resetUrl}" style="color: #60a5fa;">${resetUrl}</a>
          </div>
        </div>
        <div class="footer">
          Quantum Mobile Store • Galle Road, Colombo 03, Sri Lanka<br/>
          Direct support: +94 11 234 5678 • support@quantummobile.lk
        </div>
      </div>
    </body>
    </html>
  `;

  return await sendEmail({ to: email, subject, html, text: `Reset link: ${resetUrl}` });
};

/**
 * Send Order Confirmation Email
 */
export const sendOrderConfirmationEmail = async (email, name, order) => {
  const subject = `🛍️ Order Confirmed #${order._id.toString().slice(-6).toUpperCase()} — Quantum Mobile`;
  const itemsHtml = order.orderItems
    ?.map(
      (item) => `
      <tr style="border-bottom: 1px solid #1e293b;">
        <td style="padding: 10px 0; font-size: 14px; color: #f8fafc;">${item.name}</td>
        <td style="padding: 10px 0; text-align: center; color: #94a3b8;">x${item.qty}</td>
        <td style="padding: 10px 0; text-align: right; font-weight: 600; color: #38bdf8;">LKR ${(item.price * item.qty).toLocaleString()}</td>
      </tr>
    `
    )
    .join('');

  const html = `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <style>
        body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; background-color: #0b0f19; color: #f1f5f9; margin: 0; padding: 24px; }
        .card { max-width: 580px; margin: 0 auto; background: #131b2e; border: 1px solid #1e293b; border-radius: 16px; overflow: hidden; }
        .header { background: linear-gradient(135deg, #059669 0%, #10b981 100%); padding: 32px 24px; text-align: center; }
        .header h1 { margin: 0; font-size: 24px; font-weight: 800; color: #ffffff; }
        .body { padding: 32px 28px; line-height: 1.6; }
        table { width: 100%; border-collapse: collapse; margin: 20px 0; }
        .total-row { font-size: 16px; font-weight: 700; color: #10b981; }
        .footer { padding: 20px 28px; background: #0f172a; text-align: center; font-size: 12px; color: #64748b; }
      </style>
    </head>
    <body>
      <div class="card">
        <div class="header">
          <h1>📦 Order Placed Successfully!</h1>
          <p style="margin: 4px 0 0; color: #d1fae5;">Thank you for shopping with Quantum Mobile</p>
        </div>
        <div class="body">
          <p>Hi ${name || 'Customer'}, your order <strong>#${order._id.toString().slice(-6).toUpperCase()}</strong> has been confirmed and is being prepped for courier handover.</p>
          <table>
            <thead>
              <tr style="border-bottom: 2px solid #334155; color: #94a3b8; font-size: 13px; text-align: left;">
                <th style="padding-bottom: 8px;">Product</th>
                <th style="padding-bottom: 8px; text-align: center;">Qty</th>
                <th style="padding-bottom: 8px; text-align: right;">Amount</th>
              </tr>
            </thead>
            <tbody>
              ${itemsHtml}
            </tbody>
            <tfoot>
              <tr>
                <td colspan="2" style="padding-top: 14px; font-weight: 700;">Total Paid:</td>
                <td style="padding-top: 14px; text-align: right; font-size: 18px; font-weight: 800; color: #10b981;">LKR ${order.totalPrice?.toLocaleString()}</td>
              </tr>
            </tfoot>
          </table>
          <p style="font-size: 13px; color: #94a3b8;">Delivery to: ${order.shippingAddress?.street || ''}, ${order.shippingAddress?.city || ''}</p>
        </div>
        <div class="footer">
          Quantum Mobile Store • Colombo, Sri Lanka
        </div>
      </div>
    </body>
    </html>
  `;

  return await sendEmail({ to: email, subject, html });
};

