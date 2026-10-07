/**
 * emailService.js — Transactional emails via Nodemailer
 * Templates: email verification, password reset, report status update
 */
const nodemailer = require("nodemailer");
const logger     = require("../config/logger");

const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: Number(process.env.SMTP_PORT) || 587,
  secure: false, // STARTTLS
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
});

const FROM = `"AI TransportHub" <${process.env.EMAIL_FROM}>`;

const sendEmail = async ({ to, subject, html }) => {
  try {
    const info = await transporter.sendMail({ from: FROM, to, subject, html });
    logger.info(`Email sent to ${to}: ${info.messageId}`);
    return info;
  } catch (err) {
    logger.error(`Email send failed: ${err.message}`);
    throw err;
  }
};

// ── Email templates ──────────────────────────────────────────────────────────

const sendVerificationEmail = (to, name, token) => {
  const url = `${process.env.FRONTEND_URL}/verify-email?token=${token}`;
  return sendEmail({
    to,
    subject: "Verify your AI TransportHub account",
    html: `
      <div style="font-family:Inter,sans-serif;max-width:480px;margin:0 auto;padding:32px;background:#f8fafc;border-radius:16px">
        <h2 style="color:#1e3a8a;margin:0 0 8px">Welcome to AI TransportHub, ${name}!</h2>
        <p style="color:#475569;margin:0 0 24px">Click the button below to verify your email address.</p>
        <a href="${url}" style="display:inline-block;background:#2563eb;color:#fff;text-decoration:none;padding:12px 28px;border-radius:10px;font-weight:600">Verify Email</a>
        <p style="color:#94a3b8;font-size:12px;margin:24px 0 0">Link expires in 24 hours. If you didn't sign up, ignore this email.</p>
      </div>`,
  });
};

const sendPasswordResetEmail = (to, name, token) => {
  const url = `${process.env.FRONTEND_URL}/reset-password?token=${token}`;
  return sendEmail({
    to,
    subject: "Reset your AI TransportHub password",
    html: `
      <div style="font-family:Inter,sans-serif;max-width:480px;margin:0 auto;padding:32px;background:#f8fafc;border-radius:16px">
        <h2 style="color:#1e3a8a;margin:0 0 8px">Password Reset Request</h2>
        <p style="color:#475569;margin:0 0 24px">Hi ${name}, click below to reset your password.</p>
        <a href="${url}" style="display:inline-block;background:#2563eb;color:#fff;text-decoration:none;padding:12px 28px;border-radius:10px;font-weight:600">Reset Password</a>
        <p style="color:#94a3b8;font-size:12px;margin:24px 0 0">Link expires in 1 hour. If you didn't request this, ignore this email.</p>
      </div>`,
  });
};

const sendReportUpdateEmail = (to, name, reportId, status) => {
  const statusLabel = { acknowledged: "acknowledged", investigating: "being investigated", resolved: "resolved" }[status] || status;
  return sendEmail({
    to,
    subject: `Your report has been ${statusLabel}`,
    html: `
      <div style="font-family:Inter,sans-serif;max-width:480px;margin:0 auto;padding:32px;background:#f8fafc;border-radius:16px">
        <h2 style="color:#1e3a8a;margin:0 0 8px">Report Update</h2>
        <p style="color:#475569">Hi ${name}, your road report (ID: ${reportId}) is now <strong>${statusLabel}</strong>.</p>
        <a href="${process.env.FRONTEND_URL}/reports" style="display:inline-block;background:#16a34a;color:#fff;text-decoration:none;padding:12px 28px;border-radius:10px;font-weight:600;margin-top:16px">View Report</a>
      </div>`,
  });
};

module.exports = { sendVerificationEmail, sendPasswordResetEmail, sendReportUpdateEmail };
