"use server";

import { z } from "zod";

const EmailSchema = z.object({
  username: z.string().min(1, { message: "Name is required" }).max(200),
  email: z
    .string()
    .email({ message: "Email is not valid" })
    .min(1, { message: "Email is required" })
    .max(320),
  phonenumber: z.string().max(50).optional(),
  subject: z.string().min(1, { message: "Subject is required" }).max(300),
  message: z.string().min(1, { message: "Message is required" }).max(10000),
});

export type EmailSchema = z.infer<typeof EmailSchema>;

const SEND_ERROR =
  "Ihre Nachricht konnte leider nicht gesendet werden. Bitte versuchen Sie es später erneut.";

async function verifyTurnstile(token: FormDataEntryValue | null) {
  const secret = process.env.TURNSTILE_SECRET_KEY;
  if (!secret) {
    console.error("TURNSTILE_SECRET_KEY is not set");
    return false;
  }
  if (typeof token !== "string" || !token) return false;

  const res = await fetch(
    "https://challenges.cloudflare.com/turnstile/v0/siteverify",
    {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ secret, response: token }),
    },
  );
  const outcome: { success: boolean; "error-codes"?: string[] } =
    await res.json();
  if (!outcome.success) {
    console.error("Turnstile rejected", outcome["error-codes"]);
  }
  return outcome.success;
}

export async function createEmail(
  prevState: {
    message: string;
  },
  formData: FormData,
) {
  if (!(await verifyTurnstile(formData.get("cf-turnstile-response")))) {
    return {
      message:
        "Die Sicherheitsprüfung ist fehlgeschlagen. Bitte erneut versuchen.",
      type: "error",
    };
  }

  const parse = EmailSchema.safeParse({
    username: formData.get("username"),
    email: formData.get("email"),
    phonenumber: formData.get("phonenumber"),
    subject: formData.get("subject"),
    message: formData.get("message"),
  });

  if (!parse.success) {
    console.error("Schema parse failed", parse.error);
    return {
      message: "Bitte füllen Sie alle Pflichtfelder korrekt aus.",
      type: "error",
    };
  }

  const { username, email, phonenumber, subject, message } = parse.data;

  const plaintext = `Email from ${username} with email ${email}, subject: ${subject}, phone: ${phonenumber}, message: ${message.trim()}`;

  try {
    const RESEND_API_KEY = process.env.RESEND_API_KEY;
    if (!RESEND_API_KEY) {
      console.error("RESEND_API_KEY is not set");
      return { message: SEND_ERROR, type: "error" };
    }

    const res = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${RESEND_API_KEY}`,
      },
      body: JSON.stringify({
        from: "hallo@ideal-coaching.com",
        to: ["roberto.morbio@ideal-coaching.de"],
        reply_to: email,
        subject: subject,
        tags: [
          {
            name: "category",
            value: "strapi_email",
          },
        ],
        // Plain text so user input can't inject markup into the email.
        text: plaintext,
      }),
    });

    if (!res.ok) {
      console.error("Resend error", res.status, await res.text());
      return { message: SEND_ERROR, type: "error" };
    }

    return {
      message: "Vielen Dank! Ihre Nachricht wurde gesendet.",
      type: "success",
    };
  } catch (e) {
    console.error("Failed to send email", e);
    return { message: SEND_ERROR, type: "error" };
  }
}
