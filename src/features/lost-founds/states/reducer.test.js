import { describe, it, expect, vi, beforeEach } from "vitest";
import { makeStore } from "../../../test-utils.jsx";
import * as A from "./action.js";
import { resetLostFounds, resetLostFoundFlags } from "./reducer.js";
import * as api from "../api/lostFoundApi.js";

vi.mock("../api/lostFoundApi.js");
const item = { id: "1", title: "t", description: "d", status: "lost", is_completed: 0, created_at: "" };

describe("lostFounds states", () => {
  beforeEach(() => vi.resetAllMocks());

  it("loads list, detail and stats", async () => {
    api.getLostFounds.mockResolvedValue({ data: { lost_founds: [item] } });
    api.getLostFound.mockResolvedValueOnce({ data: { lost_found: item } });
    api.getDailyStats.mockResolvedValue({ data: [1] });
    api.getMonthlyStats.mockResolvedValue({ data: [2] });
    const s = makeStore();
    await s.dispatch(A.asyncGetLostFounds({}));
    await s.dispatch(A.asyncGetLostFound("1"));
    await s.dispatch(A.asyncGetStats());
    const st = s.getState().lostFounds;
    expect(st.lostFounds).toHaveLength(1);
    expect(st.isLostFound).toBe(true);
    expect(st.lostFoundStats).toEqual({ daily: [1], monthly: [2] });
    api.getLostFound.mockRejectedValueOnce(new Error("x"));
    await s.dispatch(A.asyncGetLostFound("1"));
    expect(s.getState().lostFounds.lostFound).toBeNull();
  });

  it("tracks mutations", async () => {
    api.addLostFound.mockResolvedValue({}); api.changeLostFound.mockResolvedValue({});
    api.changeCover.mockResolvedValue({}); api.deleteLostFound.mockResolvedValue({});
    const s = makeStore();
    await s.dispatch(A.asyncAddLostFound({ title: "t", description: "d", status: "lost" }));
    await s.dispatch(A.asyncChangeLostFound({ id: "1", title: "t", description: "d", status: "lost", isCompleted: true }));
    await s.dispatch(A.asyncChangeCover({ id: "1", file: new File([""], "a.png") }));
    await s.dispatch(A.asyncDeleteLostFound("1"));
    const st = s.getState().lostFounds;
    expect(st.isLostFoundAdded && st.isLostFoundChanged && st.isLostFoundChangedCover && st.isLostFoundDeleted).toBe(true);
    api.addLostFound.mockRejectedValueOnce(new Error("bad"));
    const r = await s.dispatch(A.asyncAddLostFound({}));
    expect(r.payload).toBe("bad");
    expect(s.getState().lostFounds.isLostFoundAdded).toBe(false);
    s.dispatch(resetLostFoundFlags());
    expect(s.getState().lostFounds.isLostFoundDeleted).toBe(false);
    s.dispatch(resetLostFounds());
    expect(s.getState().lostFounds.lostFounds).toEqual([]);
  });
});
