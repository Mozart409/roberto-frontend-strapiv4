import { http, HttpResponse } from "msw";

import { createEmail } from "@/app/email/actions";
import { server } from "../setup/msw";

function buildFormData(overrides?: Partial<Record<string, string>>) {
  const formData = new FormData();

  formData.set("username", "Ada Lovelace");
  formData.set("email", "ada@example.com");
  formData.set("phonenumber", "+49-123-456");
  formData.set("subject", "Hello");
  formData.set("message", "Test message");

  if (overrides) {
    for (const [key, value] of Object.entries(overrides)) {
      if (value !== undefined) {
        formData.set(key, value);
      }
    }
  }

  return formData;
}

describe("createEmail", () => {
  beforeEach(() => {
    process.env.RESEND_API_KEY = "test-key";
  });

  afterEach(() => {
    delete process.env.RESEND_API_KEY;
  });

  it("returns success when Resend accepts the email", async () => {
    let authHeader: string | null = null;

    server.use(
      http.post("https://api.resend.com/emails", async ({ request }) => {
        authHeader = request.headers.get("authorization");
        return HttpResponse.json({ id: "email_123" }, { status: 200 });
      }),
    );

    const result = await createEmail({ message: "" }, buildFormData());

    expect(authHeader).toBe("Bearer test-key");
    expect(result.type).toBe("success");
    expect(result.message).toBe("Send email");
  });

  it("returns validation errors when required fields are missing", async () => {
    const formData = buildFormData({ email: "" });
    const result = await createEmail({ message: "" }, formData);

    expect(result.type).toBe("error");
    expect(result.message).toContain("Schema parse failed");
  });

  it("returns error when Resend rejects the request", async () => {
    server.use(
      http.post("https://api.resend.com/emails", () => {
        return HttpResponse.json({ error: "Bad request" }, { status: 500 });
      }),
    );

    const result = await createEmail({ message: "" }, buildFormData());

    expect(result.type).toBe("error");
    expect(result.message).toContain("Failed to send email 500");
  });
});
