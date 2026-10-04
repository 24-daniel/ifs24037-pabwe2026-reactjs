import { describe, it, expect, vi, beforeEach } from "vitest";
import { makeStore } from "../../../test-utils.jsx";
import { asyncLogin, asyncRegister, asyncLogout } from "./action.js";
import { resetAuth } from "./reducer.js";
import * as api from "../api/authApi.js";

vi.mock("../api/authApi.js");

describe("auth states", () => {
  beforeEach(() => { localStorage.clear(); vi.resetAllMocks(); });

  it("login success and failure", async () => {
    api.login.mockResolvedValueOnce({ data: { token: "t" } });
    const s = makeStore();
    await s.dispatch(asyncLogin({ email: "a", password: "b" }));
    expect(s.getState().auth.isAuthLogin).toBe(true);
    expect(localStorage.getItem("accessToken")).toBe("t");
    api.login.mockRejectedValueOnce(new Error("no"));
    const r = await s.dispatch(asyncLogin({ email: "a", password: "b" }));
    expect(r.payload).toBe("no");
    expect(s.getState().auth.isAuthLogin).toBe(false);
  });

  it("register success and failure", async () => {
    const s = makeStore();
    api.register.mockResolvedValueOnce({});
    await s.dispatch(asyncRegister({ name: "n", email: "e", password: "p" }));
    expect(s.getState().auth.isAuthRegister).toBe(true);
    api.register.mockRejectedValueOnce(new Error("x"));
    await s.dispatch(asyncRegister({ name: "n", email: "e", password: "p" }));
    expect(s.getState().auth.isAuthRegister).toBe(false);
  });

  it("logout and reset", async () => {
    localStorage.setItem("accessToken", "t");
    const s = makeStore();
    await s.dispatch(asyncLogout());
    expect(s.getState().auth.isAuthLogout).toBe(true);
    expect(localStorage.getItem("accessToken")).toBeNull();
    s.dispatch(resetAuth());
    expect(s.getState().auth.isAuthLogout).toBe(false);
  });
});
