import nodemailer from 'nodemailer';

// Email configuration - you should replace these with your actual email service credentials
const emailConfig = {
  host: process.env.EMAIL_HOST || 'smtp.gmail.com',
  port: parseInt(process.env.EMAIL_PORT || '587'),
  secure: false,
  auth: {
    user: process.env.EMAIL_USER || 'your-email@gmail.com',
    pass: process.env.EMAIL_PASS || 'your-app-password'
  }
};

const transporter = nodemailer.createTransport(emailConfig);

export interface EmailOptions {
  to: string;
  subject: string;
  html: string;
}

export const sendEmail = async (options: EmailOptions): Promise<boolean> => {
  try {
    const mailOptions = {
      from: process.env.EMAIL_FROM || 'ModestMuse <noreply@modestmuse.com>',
      ...options
    };

    await transporter.sendMail(mailOptions);
    return true;
  } catch (error) {
    console.error('Error sending email:', error);
    return false;
  }
};

export const sendVerificationEmail = async (email: string, code: string): Promise<boolean> => {
  const subject = 'Verify Your Email - ModestMuse';
  const html = `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
      <h2 style="color: #333;">Email Verification</h2>
      <p>Thank you for signing up with ModestMuse!</p>
      <p>Your verification code is:</p>
      <div style="background-color: #f5f5f5; padding: 20px; text-align: center; font-size: 24px; font-weight: bold; letter-spacing: 2px; margin: 20px 0;">
        ${code}
      </div>
      <p>This code will expire in 15 minutes.</p>
      <p>If you didn't request this verification, please ignore this email.</p>
      <hr style="border: none; border-top: 1px solid #eee; margin: 30px 0;">
      <p style="color: #666; font-size: 12px;">ModestMuse Team</p>
    </div>
  `;

  return await sendEmail({ to: email, subject, html });
};

export const sendWelcomeEmail = async (email: string, firstName: string, userType: string): Promise<boolean> => {
  const subject = `Welcome to ModestMuse, ${firstName}!`;
  const html = `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
      <h2 style="color: #333;">Welcome to ModestMuse!</h2>
      <p>Hello ${firstName},</p>
      <p>Thank you for joining ModestMuse as a ${userType}!</p>
      <p>Your account has been successfully verified and you can now start using our platform.</p>
      <p>If you have any questions, feel free to reach out to our support team.</p>
      <hr style="border: none; border-top: 1px solid #eee; margin: 30px 0;">
      <p style="color: #666; font-size: 12px;">Happy shopping/selling!<br>ModestMuse Team</p>
    </div>
  `;

  return await sendEmail({ to: email, subject, html });
};
