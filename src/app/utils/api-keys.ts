import { secret } from "@aws-amplify/backend";
import { z } from "zod";

const ResendKeySchema = z
  .string()
  .min(1, { message: "RESEND KEY is required" });

export const getResendKey = () => {
  // biome-ignore lint/suspicious/noImplicitAnyLet: <explanation>
  let resendKey;
  if (process.env.NODE_ENV === "development") {
    if (!process.env.RESEND_API_KEY) {
      throw new Error("Resend Key in Development is undefined");
    }
    resendKey = process.env.RESEND_API_KEY;
  } else {
    resendKey = secret("RESEND_API_KEY");
  }

  // Validate and ensure the return type is a string
  return ResendKeySchema.parse(resendKey);
};
