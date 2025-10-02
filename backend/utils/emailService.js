import nodemailer from "nodemailer";

const ses = {
    smtpHost: process.env.SES_SMTP_HOST || '',
    smtpPort: parseInt(process.env.SES_SMTP_PORT || '587', 10),
    smtpUser: process.env.SES_SMTP_USER || '',
    smtpPass: process.env.SES_SMTP_PASS || '',
    smtpFrom: process.env.SES_SMTP_FROM || '',
};

class EmailService {
  constructor() {
    this.transporter = nodemailer.createTransport({
      host: ses.smtpHost, // change region if needed
      port: ses.smtpPort,
      secure: false, // true if using port 465
      auth: {
        user: ses.smtpUser, // from SES SMTP credentials
        pass: ses.smtpPass,
      },
    });
  }

  async sendMail(to, subject, html) {
    try {
      const info = await this.transporter.sendMail({
        from: ses.smtpFrom, // e.g. "noreply@yourdomain.com"
        to,
        subject,
        html,
      });

      console.log("✅ Email sent successfully:", info.messageId);
    } catch (error) {
      console.error("❌ Email sending failed:", error);
      throw new Error("Failed to send email");
    }
  }

  async sendOTPEmail(email, otp) {
    const subject = "ClownApp.fun – Verify Your Email";

    const html = `
  <div style="font-family: 'Helvetica Neue', Arial, sans-serif; max-width: 600px; margin: 0 auto; border: 1px solid #e0e0e0; border-radius: 8px; overflow: hidden;">
    
    <div style="background: #ff3f8b; color: white; padding: 20px; text-align: center;">
      <h2 style="margin: 0;">ClownApp.fun</h2>
    </div>

    <div style="padding: 30px; text-align: center;">
      <p style="font-size: 16px; color: #333;">Welcome to Clown! To complete your sign-up, please verify your email address.</p>

      <div style="background: #f9f9f9; padding: 20px; margin: 20px 0; border-radius: 6px;">
        <h1 style="color: #ff3f8b; font-size: 36px; margin: 0;">${otp}</h1>
      </div>

      <p style="font-size: 14px; color: #666;">This verification code is valid for the next 10 minutes.</p>

      <p style="font-size: 14px; color: #666;">If you didn't request this, you can safely ignore this email.</p>
    </div>

    <div style="background: #f5f5f5; padding: 15px; text-align: center; font-size: 12px; color: #999;">
      &copy; ${new Date().getFullYear()} ClownApp.fun. All rights reserved.
    </div>
  </div>
`;

    await this.sendMail(email, subject, html);
  }
}

export default new EmailService();
