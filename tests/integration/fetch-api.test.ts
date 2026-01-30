import { http, HttpResponse } from "msw";

import { fetchAPI } from "@/app/utils/fetch-api";
import { server } from "../setup/msw";

describe("fetchAPI", () => {
  it("requests Strapi with query parameters", async () => {
    let requestedUrl = "";

    server.use(
      http.get("http://localhost:1337/api/test", ({ request }) => {
        requestedUrl = request.url;
        return HttpResponse.json({ ok: true });
      }),
    );

    const data = await fetchAPI("/test", { foo: "bar" });

    expect(data).toEqual({ ok: true });
    expect(requestedUrl).toContain("foo=bar");
  });
});
