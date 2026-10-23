/// <reference types="vitest/globals" />

import { http, HttpResponse } from "msw";

import { createEmail } from "@/app/email/actions";
import { server } from "../setup/msw";

const TURNSTILE_VERIFY_URL =
  "https://challenges.cloudflare.com/turnstile/v0/siteverify";

function buildFormData(overrides?: Partial<Record<string, string>>) {
  const formData = new FormData();

  formData.set("username", "Ada Lovelace");
  formData.set("email", "ada@example.com");
  formData.set("phonenumber", "+49-123-456");
  formData.set("subject", "Hello");
  formData.set("message", "Test message");
  formData.set("cf-turnstile-response", "turnstile-token");

  if (overrides) {
    for (const [key, value] of Object.entries(overrides)) {
      if (value !== undefined) {
        formData.set(key, value);
      }
    }
  }

  return formData;
}

function mockTurnstile(success: boolean) {
  server.use(
    http.post(TURNSTILE_VERIFY_URL, () =>
      HttpResponse.json({
        success,
        "error-codes": success ? [] : ["invalid-input-response"],
      }),
    ),
  );
}

describe("createEmail", () => {
  beforeEach(() => {
    process.env.RESEND_API_KEY = "test-key";
    process.env.TURNSTILE_SECRET_KEY = "turnstile-secret";
    mockTurnstile(true);
  });

  afterEach(() => {
    delete process.env.RESEND_API_KEY;
    delete process.env.TURNSTILE_SECRET_KEY;
  });

  it("returns success when Resend accepts the email", async () => {
    let authHeader: string | null = null;
    // biome-ignore lint/suspicious/noExplicitAny: captured request payload
    let payload: any;

    server.use(
      http.post("https://api.resend.com/emails", async ({ request }) => {
        authHeader = request.headers.get("authorization");
        payload = await request.json();
        return HttpResponse.json({ id: "email_123" }, { status: 200 });
      }),
    );

    const result = await createEmail({ message: "" }, buildFormData());

    expect(authHeader).toBe("Bearer test-key");
    expect(payload.reply_to).toBe("ada@example.com");
    expect(payload.text).toContain("Test message");
    expect(payload.html).toBeUndefined();
    expect(result.type).toBe("success");
    expect(result.message).toBe("Vielen Dank! Ihre Nachricht wurde gesendet.");
  });

  it("forwards the token and secret to Turnstile", async () => {
    // biome-ignore lint/suspicious/noExplicitAny: captured request payload
    let verifyBody: any;

    server.use(
      http.post(TURNSTILE_VERIFY_URL, async ({ request }) => {
        verifyBody = await request.json();
        return HttpResponse.json({ success: true });
      }),
      http.post("https://api.resend.com/emails", () =>
        HttpResponse.json({ id: "email_123" }),
      ),
    );

    await createEmail({ message: "" }, buildFormData());

    expect(verifyBody).toEqual({
      secret: "turnstile-secret",
      response: "turnstile-token",
    });
  });

  it("rejects the submission when Turnstile fails", async () => {
    mockTurnstile(false);
    let resendCalled = false;

    server.use(
      http.post("https://api.resend.com/emails", () => {
        resendCalled = true;
        return HttpResponse.json({ id: "email_123" });
      }),
    );

    const result = await createEmail({ message: "" }, buildFormData());

    expect(resendCalled).toBe(false);
    expect(result.type).toBe("error");
    expect(result.message).toContain("Sicherheitsprüfung");
  });

  it("rejects the submission without a Turnstile token", async () => {
    const result = await createEmail(
      { message: "" },
      buildFormData({ "cf-turnstile-response": "" }),
    );

    expect(result.type).toBe("error");
    expect(result.message).toContain("Sicherheitsprüfung");
  });

  it("returns validation errors when required fields are missing", async () => {
    const formData = buildFormData({ email: "" });
    const result = await createEmail({ message: "" }, formData);

    expect(result.type).toBe("error");
    expect(result.message).toContain("Pflichtfelder");
  });

  it("returns a generic error when Resend rejects the request", async () => {
    server.use(
      http.post("https://api.resend.com/emails", () => {
        return HttpResponse.json({ error: "Bad request" }, { status: 500 });
      }),
    );

    const result = await createEmail({ message: "" }, buildFormData());

    expect(result.type).toBe("error");
    expect(result.message).toContain("nicht gesendet werden");
  });
});
