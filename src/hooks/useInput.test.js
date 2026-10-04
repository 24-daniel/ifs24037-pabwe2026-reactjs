import { describe, it, expect } from "vitest";
import { renderHook, act } from "@testing-library/react";
import useInput from "./useInput.js";

describe("useInput", () => {
  it("updates through onChange and setter", () => {
    const { result } = renderHook(() => useInput("a"));
    expect(result.current[0]).toBe("a");
    act(() => result.current[1]({ target: { value: "b" } }));
    expect(result.current[0]).toBe("b");
    act(() => result.current[2]("c"));
    expect(result.current[0]).toBe("c");
  });
  it("defaults to empty string", () => { expect(renderHook(() => useInput()).result.current[0]).toBe(""); });
});
