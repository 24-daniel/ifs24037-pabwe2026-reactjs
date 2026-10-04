import { describe, it, expect, vi } from "vitest";
import { login, register } from "./authApi.js";
import { apiFetch } from "../../../helpers/apiHelper.js";

vi.mock("../../../helpers/apiHelper.js");

describe("authApi", () => {
  it("calls login and register", async () => {
    await login("e", "p");
    expect(apiFetch).toHaveBeenCalledWith("/auth/login", expect.objectContaining({ method: "POST", auth: false }));
    await register("n", "e", "p");
    expect(apiFetch).toHaveBeenCalledWith("/auth/register", expect.objectContaining({ body: { name: "n", email: "e", password: "p" } }));
  });
});
