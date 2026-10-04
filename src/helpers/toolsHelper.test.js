import { describe, it, expect, vi } from "vitest";
import Swal from "sweetalert2";
import { showSuccessDialog, showSuccessToast, showErrorDialog, showWarningDialog, showConfirmDialog, formatDate } from "./toolsHelper.js";

vi.mock("sweetalert2", () => ({ default: { fire: vi.fn() } }));

describe("toolsHelper", () => {
  it("shows dialogs", async () => {
    await showSuccessDialog("a"); await showErrorDialog("b"); await showWarningDialog("c"); await showSuccessToast("t");
    expect(Swal.fire).toHaveBeenCalledWith(expect.objectContaining({ icon: "success", text: "a" }));
    expect(Swal.fire).toHaveBeenCalledWith(expect.objectContaining({ icon: "error", text: "b" }));
    expect(Swal.fire).toHaveBeenCalledWith(expect.objectContaining({ icon: "warning", text: "c" }));
    expect(Swal.fire).toHaveBeenCalledWith(expect.objectContaining({ toast: true, title: "t" }));
  });
  it("returns confirm result", async () => {
    Swal.fire.mockResolvedValueOnce({ isConfirmed: true });
    expect(await showConfirmDialog("x")).toBe(true);
    Swal.fire.mockResolvedValueOnce({ isConfirmed: false });
    expect(await showConfirmDialog("x")).toBe(false);
  });
  it("formats dates", () => { expect(formatDate("2026-01-05T10:00:00Z")).toMatch(/2026/); });
});
