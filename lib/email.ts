import nodemailer from 'nodemailer';

const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: parseInt(process.env.SMTP_PORT || '587'),
  secure: process.env.SMTP_PORT === '465',
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
});

export async function sendOTP(email: string, firstName: string, otp: string) {
  const html = `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
      <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); padding: 30px; text-align: center; border-radius: 10px 10px 0 0;">
        <h1 style="color: white; margin: 0;">Verify Your Email</h1>
      </div>
      
      <div style="padding: 30px; background: #f9fafb; border-radius: 0 0 10px 10px;">
        <p style="font-size: 16px; color: #374151;">Hello ${firstName},</p>
        <p style="font-size: 16px; color: #374151;">Thank you for signing up! Please use the verification code below to verify your email address.</p>
        
        <div style="text-align: center; margin: 30px 0; padding: 20px; background: white; border-radius: 10px; box-shadow: 0 2px 4px rgba(0,0,0,0.1);">
          <h2 style="font-size: 36px; letter-spacing: 10px; color: #4F46E5; margin: 0; font-weight: bold;">${otp}</h2>
        </div>
        
        <p style="font-size: 14px; color: #6B7280;">This code will expire in 10 minutes.</p>
        <p style="font-size: 14px; color: #6B7280;">If you didn't create an account, you can safely ignore this email.</p>
        
        <hr style="border: none; border-top: 1px solid #e5e7eb; margin: 20px 0;" />
        
        <p style="font-size: 12px; color: #9CA3AF; text-align: center;">
          This is an automated message. Please do not reply to this email.
        </p>
      </div>
    </div>
  `;

  await transporter.sendMail({
    from: process.env.EMAIL_FROM,
    to: email,
    subject: 'Verify Your Email - ChatBot SaaS',
    html,
  });
}

export async function sendPasswordReset(email: string, firstName: string, resetUrl: string) {
  const html = `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
      <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); padding: 30px; text-align: center; border-radius: 10px 10px 0 0;">
        <h1 style="color: white; margin: 0;">Reset Your Password</h1>
      </div>
      
      <div style="padding: 30px; background: #f9fafb; border-radius: 0 0 10px 10px;">
        <p style="font-size: 16px; color: #374151;">Hello ${firstName},</p>
        <p style="font-size: 16px; color: #374151;">We received a request to reset your password. Click the button below to create a new password.</p>
        
        <div style="text-align: center; margin: 30px 0;">
          <a href="${resetUrl}" style="display: inline-block; padding: 12px 40px; background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; text-decoration: none; border-radius: 8px; font-weight: 600;">Reset Password</a>
        </div>
        
        <p style="font-size: 14px; color: #6B7280;">This link will expire in 1 hour.</p>
        <p style="font-size: 14px; color: #6B7280;">If you didn't request a password reset, you can safely ignore this email.</p>
        
        <hr style="border: none; border-top: 1px solid #e5e7eb; margin: 20px 0;" />
        
        <p style="font-size: 12px; color: #9CA3AF; text-align: center;">
          This is an automated message. Please do not reply to this email.
        </p>
      </div>
    </div>
  `;

  await transporter.sendMail({
    from: process.env.EMAIL_FROM,
    to: email,
    subject: 'Reset Your Password - ChatBot SaaS',
    html,
  });
}