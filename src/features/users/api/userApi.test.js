import { describe, it, expect, vi } from "vitest";
import * as u from "./userApi.js";
import { apiFetch } from "../../../helpers/apiHelper.js";

vi.mock("../../../helpers/apiHelper.js");

describe("userApi", () => {
  it("calls every endpoint", async () => {
    await u.getUsers("a"); await u.getMe(); await u.updateMe("n", "e");
    await u.uploadPhoto(new File([""], "a.png")); await u.changePassword("a", "b");
    expect(apiFetch.mock.calls.map((c) => `${c[1]?.method ?? "GET"} ${c[0]}`)).toEqual([
      "GET /users", "GET /users/me", "PUT /users/me", "POST /users/me/photo", "PUT /users/me/password",
    ]);
  });
});
