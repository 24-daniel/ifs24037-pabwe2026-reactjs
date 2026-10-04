import { describe, it, expect, vi, beforeEach } from "vitest";
import { makeStore } from "../../../test-utils.jsx";
import * as A from "./action.js";
import { resetUsers, resetUserFlags } from "./reducer.js";
import * as api from "../api/userApi.js";

vi.mock("../api/userApi.js");
const user = { id: "1", name: "n", email: "e" };

describe("users states", () => {
  beforeEach(() => vi.resetAllMocks());

  it("loads users and profile", async () => {
    api.getUsers.mockResolvedValue({ data: { users: [user] } });
    api.getMe.mockResolvedValueOnce({ data: { user } });
    const s = makeStore();
    await s.dispatch(A.asyncGetUsers("q"));
    await s.dispatch(A.asyncGetProfile());
    expect(s.getState().users.users).toHaveLength(1);
    expect(s.getState().users.isProfile).toBe(true);
    api.getMe.mockRejectedValueOnce(new Error("x"));
    await s.dispatch(A.asyncGetProfile());
    expect(s.getState().users.profile).toBeNull();
  });

  it("handles change actions success and failure", async () => {
    api.updateMe.mockResolvedValue({}); api.uploadPhoto.mockResolvedValue({}); api.changePassword.mockResolvedValue({});
    const s = makeStore();
    await s.dispatch(A.asyncChangeProfile({ name: "n", email: "e" }));
    await s.dispatch(A.asyncChangeProfilePhoto(new File([""], "a.png")));
    await s.dispatch(A.asyncChangeProfilePassword({ password: "a", newPassword: "b" }));
    const st = s.getState().users;
    expect(st.isChangeProfile && st.isChangeProfilePhoto && st.isChangeProfilePassword).toBe(true);
    s.dispatch(resetUserFlags());
    expect(s.getState().users.isChangeProfile).toBe(false);
    s.dispatch(resetUsers());
    api.updateMe.mockRejectedValue(new Error("a"));
    expect((await s.dispatch(A.asyncChangeProfile({ name: "n", email: "e" }))).payload).toBe("a");
  });
});
