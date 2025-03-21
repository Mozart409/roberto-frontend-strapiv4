"use server";
import { redirect } from "next/navigation";
import { Resend } from "resend";
import { z } from "zod";
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

export async function createEmail(formData: FormData) {
  try {
    const { username, email, phonenumber, subject, message } =
      EmailSchema.parse(formData);

    console.debug("Email", email);

    const plaintext = `Email from ${username} with email ${email}, subject: ${subject}, phone: ${phonenumber}, message: ${message.trim()}`;
    const resend = new Resend(process.env.RESEND_API_KEY);

    redirect("/kontakt");
  } catch (error) {
    return "Error sending Email";
  }
}
