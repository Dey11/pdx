import { Resend } from "resend";

const fromEmail =
  process.env.AUTH_EMAIL_FROM ?? "NoteFormula <support@noteformula.com>";

const getResend = () => {
  const apiKey = process.env.AUTH_RESEND_KEY;

  if (!apiKey) {
    throw new Error("AUTH_RESEND_KEY is required to send auth email");
  }

  return new Resend(apiKey);
};

type PasswordResetEmail = {
  name?: string | null;
  resetUrl: string;
  to: string;
};

export const sendPasswordResetEmail = async ({
  name,
  resetUrl,
  to,
}: PasswordResetEmail) => {
  await getResend().emails.send({
    from: fromEmail,
    to,
    subject: "Reset your NoteFormula password",
    text: [
      `Hi ${name || "there"},`,
      "",
      "Use this link to reset your NoteFormula password. It expires in 30 minutes.",
      resetUrl,
      "",
      "If you did not request this, you can ignore this email.",
    ].join("\n"),
  });
};
