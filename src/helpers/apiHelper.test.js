import { describe, it, expect, vi, beforeEach } from "vitest";
import { apiFetch, getAccessToken, putAccessToken, removeAccessToken } from "./apiHelper.js";

const mockFetch = (ok, json) => vi.stubGlobal("fetch", vi.fn().mockResolvedValue({ ok, json: async () => json }));

describe("apiHelper", () => {
  beforeEach(() => { localStorage.clear(); vi.unstubAllGlobals(); });

  it("stores, reads and removes token", () => {
    putAccessToken("abc");
    expect(getAccessToken()).toBe("abc");
    removeAccessToken();
    expect(getAccessToken()).toBeNull();
  });

  it("sends bearer token, params and json body", async () => {
    putAccessToken("tok");
    mockFetch(true, { success: true });
    await apiFetch("/x", { method: "POST", params: { a: 1, b: undefined, c: null, d: "" }, body: { k: "v" } });
    const [url, init] = fetch.mock.calls[0];
    expect(url).toContain("a=1");
    expect(url).not.toContain("b=");
    expect(init.headers.Authorization).toBe("Bearer tok");
    expect(init.body).toBe('{"k":"v"}');
  });

  it("handles FormData, no auth, no body, no token", async () => {
    putAccessToken("tok");
    mockFetch(true, { success: true });
    const fd = new FormData();
    await apiFetch("/x", { body: fd, auth: false });
    expect(fetch.mock.calls[0][1].headers.Authorization).toBeUndefined();
    expect(fetch.mock.calls[0][1].body).toBe(fd);
    await apiFetch("/y");
    expect(fetch.mock.calls[1][1].body).toBeUndefined();
    localStorage.clear();
    await apiFetch("/z");
    expect(fetch.mock.calls[2][1].headers.Authorization).toBeUndefined();
  });

  it("throws api message or default", async () => {
    mockFetch(false, { success: false, message: "bad" });
    await expect(apiFetch("/x")).rejects.toThrow("bad");
    mockFetch(true, { success: false });
    await expect(apiFetch("/x")).rejects.toThrow("Request failed");
  });
});
