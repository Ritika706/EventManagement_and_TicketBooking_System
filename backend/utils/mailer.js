import nodemailer from "nodemailer";

const requiredEnv = (name) => {
  const v = process.env[name];
  return v && String(v).trim() ? String(v).trim() : null;
};

export const isEmailConfigured = () => {
  return Boolean(requiredEnv("SMTP_HOST") && requiredEnv("SMTP_PORT") && requiredEnv("SMTP_USER") && requiredEnv("SMTP_PASS"));
};

const getTransporter = () => {
  const host = requiredEnv("SMTP_HOST");
  const portRaw = requiredEnv("SMTP_PORT");
  const user = requiredEnv("SMTP_USER");
  const pass = requiredEnv("SMTP_PASS");

  if (!host || !portRaw || !user || !pass) {
    throw new Error("Email is not configured. Set SMTP_HOST, SMTP_PORT, SMTP_USER, SMTP_PASS in backend/.env");
  }

  const port = Number(portRaw);
  const secure = port === 465;

  return nodemailer.createTransport({
    host,
    port,
    secure,
    auth: { user, pass },
  });
};

export const sendPasswordResetEmail = async ({ to, name, resetUrl, resetUrlDisplay, role }) => {
  const from = requiredEnv("SMTP_FROM") || requiredEnv("SMTP_USER") || "no-reply@example.com";
  const appName = process.env.APP_NAME || "Eventra";
  const support = process.env.SUPPORT_EMAIL || from;

  const transporter = getTransporter();

  const safeRole = role === "admin" ? "Admin" : "User";
  const subject = `${appName} ${safeRole} Password Reset`;

  const greeting = name ? `Hi ${name},` : "Hi,";

  const text = [
    greeting,
    "",
    `We received a request to reset your ${safeRole.toLowerCase()} account password for ${appName}.`,
    "",
    "Open this reset page (valid for 15 minutes):",
    resetUrlDisplay || resetUrl,
    "",
    "If you did not request this, you can ignore this email.",
    "",
    `Need help? Contact ${support}`,
  ].join("\n");

  const html = `
    <div style="font-family: Arial, sans-serif; line-height: 1.5; color: #111;">
      <p>${greeting}</p>
      <p>We received a request to reset your <strong>${safeRole.toLowerCase()}</strong> account password for <strong>${appName}</strong>.</p>
      <p><strong>Open this reset page (valid for 15 minutes):</strong></p>
      <p><a href="${resetUrl}" target="_blank" rel="noreferrer">${resetUrlDisplay || resetUrl}</a></p>
      <p>If you did not request this, you can ignore this email.</p>
      <p style="color:#555; font-size: 12px;">Need help? Contact ${support}</p>
    </div>
  `;

  await transporter.sendMail({
    from,
    to,
    subject,
    text,
    html,
  });
};
