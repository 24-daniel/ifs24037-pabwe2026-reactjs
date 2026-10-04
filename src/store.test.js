import { describe, it, expect } from "vitest";
import { store } from "./store.js";

describe("store", () => {
  it("combines auth, users and lostFounds", () => {
    expect(Object.keys(store.getState()).sort()).toEqual(["auth", "lostFounds", "users"]);
  });
});
