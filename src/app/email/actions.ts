"use server";
import { redirect } from "next/navigation";
import { Resend } from "resend";
import { z } from "zod";
import { EmailTemplate } from "../components/email-template";
const EmailSchema = z.object({
  username: z.string().min(1, { message: "Name is required" }),
  email: z
    .string()
    .email({ message: "Email is not valid" })
    .min(1, { message: "Email is required" }),
  phonenumber: z.string().optional(),
  subject: z.string().min(1, { message: "Subject is required" }),
  message: z.string().min(1, { message: "Message is required" }),
});

export type EmailSchema = z.infer<typeof EmailSchema>;

export async function createEmail(
  prevState: {
    message: string;
  },
  formData: FormData,
) {
  const parse = EmailSchema.safeParse({
    username: formData.get("username"),
    email: formData.get("email"),
    phonenumber: formData.get("phonenumber"),
    subject: formData.get("subject"),
    message: formData.get("message"),
  });

  console.debug("formData", formData);

  if (!parse.success) {
    return { message: `Schema parse failed ${parse.error}`, type: "error" };
  }

  const { username, email, phonenumber, subject, message } = parse.data;

  console.debug("Email", email);

  const plaintext = `Email from ${username} with email ${email}, subject: ${subject}, phone: ${phonenumber}, message: ${message.trim()}`;

  try {
    const RESEND_API_KEY = process.env.RESEND_API_KEY;

    const res = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${RESEND_API_KEY}`,
      },
      body: JSON.stringify({
        from: "hallo@ideal-coaching.com",
        to: ["roberto.morbio@ideal-coaching.de"],
        subject: subject,
        tags: [
          {
            name: "category",
            value: "strapi_email",
          },
        ],
        html: plaintext,
      }),
    });

    if (!res.ok) {
      return { message: `Failed to send email ${res.status}`, type: "error" };
    }

    const data = await res.json();

    return { message: `Send email ${data?.id}`, type: "success" };
  } catch (e) {
    return { message: `Failed to send email ${e}`, type: "error" };
  }
}
