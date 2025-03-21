"use server";

export const runtime = "edge";

import { Resend } from "resend";
import { z, ZodError } from "zod";
import { EmailTemplate } from "./components/email-template";

export type FormState = {
  message: string;
};

export const fromErrorToFormState = async (error: unknown) => {
  // if validation error with Zod, return first error message
  if (error instanceof ZodError) {
    return {
      message: error.errors[0].message,
    };
    // if another error instance, return error message
    // e.g. database error
  }
  if (error instanceof Error) {
    return {
      message: error.message,
    };
    // if not an error instance but something else crashed
    // return generic error message
  }
  return {
    message: "An unknown error occurred",
  };
};

const EmailSchema = z.object({
  username: z.string().optional(),
  email: z
    .string()
    .email({ message: "Email is not valid" })
    .min(1, { message: "Email is required" }),
  phonenumber: z.string().optional(),
  subject: z.string().min(1, { message: "Subject is required" }),
  message: z.string().min(1, { message: "Message is required" }),
});

export type EmailSchema = z.infer<typeof EmailSchema>;

// console.info("RESEND_API_KEY", process.env.RESEND_API_KEY?.slice(0, 5));

const resend = new Resend(process.env.RESEND_API_KEY);

type TMessage = {
  type: "error" | "success";
  message: string;
};

export async function sendResendEmail(
  formData: EmailSchema,
): Promise<TMessage> {
  console.info("formData", formData);

  try {
    const { username, email, phonenumber, subject, message } =
      EmailSchema.parse(formData);

    const plaintext = `Email from ${username} with email ${email}, subject: ${subject}, phone: ${phonenumber}, message: ${message.trim()}`;

    const { data, error } = await resend.emails.send({
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
      react: EmailTemplate({
        username,
        message,
        email,
        phonenumber,
        subject,
      }) as React.ReactElement,
    });
    console.info("resend data", data);
    console.error("resend error", error);

    if (error) {
      return { type: "error", message: error.message };
    }
    // revalidatePath("/kontakt");
    return { type: "success", message: `Email sent from ${email}` };
  } catch (error) {
    return {
      type: "error",
      message: (await fromErrorToFormState(error)).message,
    };
  }
}
