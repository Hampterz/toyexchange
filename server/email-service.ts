import nodemailer from 'nodemailer';

// Create reusable transporter object using SMTP transport
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

export interface EmailOptions {
  to: string;
  subject: string;
  text?: string;
  html?: string;
}

/**
 * Send an email using the configured transporter
 * @param options Email sending options
 * @returns Promise resolving to success status
 */
export async function sendEmail(options: EmailOptions): Promise<boolean> {
  try {
    const mailOptions = {
      from: `"ToyShare" <${process.env.EMAIL_USER}>`,
      to: options.to,
      subject: options.subject,
      text: options.text,
      html: options.html,
    };

    await transporter.sendMail(mailOptions);
    console.log(`Email sent successfully to ${options.to}`);
    return true;
  } catch (error) {
    console.error('Error sending email:', error);
    return false;
  }
}

/**
 * Send a password reset email with a reset link
 * @param to Recipient email address
 * @param resetToken The password reset token
 * @param baseUrl Base URL of the application
 * @returns Promise resolving to success status
 */
export async function sendPasswordResetEmail(
  to: string,
  resetToken: string,
  baseUrl: string
): Promise<boolean> {
  const resetLink = `${baseUrl}/reset-password?token=${resetToken}`;
  
  const subject = 'ToyShare Password Reset';
  const text = `
    Hello,
    
    You requested a password reset for your ToyShare account.
    
    Please click the following link to reset your password:
    ${resetLink}
    
    This link will expire in 1 hour.
    
    If you did not request this reset, please ignore this email and your password will remain unchanged.
    
    Best regards,
    The ToyShare Team
  `;
  
  const html = `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
      <div style="background-color: #2c5282; padding: 20px; text-align: center;">
        <h1 style="color: white; margin: 0;">ToyShare</h1>
      </div>
      <div style="padding: 20px; border: 1px solid #e2e8f0; border-top: none;">
        <p>Hello,</p>
        <p>You requested a password reset for your ToyShare account.</p>
        <p>Please click the button below to reset your password:</p>
        <p style="text-align: center;">
          <a href="${resetLink}" style="display: inline-block; background-color: #3182ce; color: white; padding: 12px 24px; text-decoration: none; border-radius: 4px; font-weight: bold;">Reset Password</a>
        </p>
        <p>Or copy and paste this link into your browser:</p>
        <p style="background-color: #f7fafc; padding: 10px; border-radius: 4px; word-break: break-all;">
          ${resetLink}
        </p>
        <p>This link will expire in 1 hour.</p>
        <p>If you did not request this reset, please ignore this email and your password will remain unchanged.</p>
        <p>Best regards,<br>The ToyShare Team</p>
      </div>
      <div style="background-color: #edf2f7; padding: 15px; text-align: center; font-size: 12px; color: #718096;">
        <p>This is an automated email. Please do not reply to this message.</p>
      </div>
    </div>
  `;
  
  return sendEmail({
    to,
    subject,
    text,
    html
  });
}