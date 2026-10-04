import { describe, it, expect, vi } from "vitest";
import * as l from "./lostFoundApi.js";
import { apiFetch } from "../../../helpers/apiHelper.js";

vi.mock("../../../helpers/apiHelper.js");

describe("lostFoundApi", () => {
  it("calls every endpoint", async () => {
    await l.getLostFounds({ status: "lost", isCompleted: 1, isMe: true });
    await l.getLostFounds();
    await l.getLostFound("1");
    await l.addLostFound({ title: "t", description: "d", status: "lost" });
    await l.changeLostFound("1", { title: "t", description: "d", status: "found", isCompleted: true });
    await l.changeLostFound("1", { title: "t", description: "d", status: "found", isCompleted: false });
    await l.changeCover("1", new File([""], "a.png"));
    await l.deleteLostFound("1");
    await l.getDailyStats(); await l.getMonthlyStats();
    expect(apiFetch.mock.calls[0][1].params).toEqual({ status: "lost", is_completed: 1, is_me: 1 });
    expect(apiFetch.mock.calls[1][1].params.is_me).toBeUndefined();
    expect(apiFetch.mock.calls[4][1].body.is_completed).toBe(1);
    expect(apiFetch.mock.calls[5][1].body.is_completed).toBe(0);
    expect(apiFetch.mock.calls.map((c) => `${c[1]?.method ?? "GET"} ${c[0]}`)).toEqual(expect.arrayContaining([
      "GET /lost-founds/1", "POST /lost-founds", "PUT /lost-founds/1", "POST /lost-founds/1/cover",
      "DELETE /lost-founds/1", "GET /lost-founds/stats/daily", "GET /lost-founds/stats/monthly",
    ]));
  });
});
