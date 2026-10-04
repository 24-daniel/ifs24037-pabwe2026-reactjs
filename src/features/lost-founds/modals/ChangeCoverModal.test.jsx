import { describe, it, expect, vi, beforeEach } from "vitest";
import { screen, waitFor, fireEvent } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { renderWithProviders } from "../../../test-utils.jsx";
import ChangeCoverModal from "./ChangeCoverModal.jsx";
import * as api from "../api/lostFoundApi.js";
import * as tools from "../../../helpers/toolsHelper.js";

vi.mock("../api/lostFoundApi.js");
vi.mock("../../../helpers/toolsHelper.js");

const file = new File(["x"], "a.png", { type: "image/png" });

describe("ChangeCoverModal", () => {
  beforeEach(() => { vi.resetAllMocks(); URL.createObjectURL = vi.fn(() => "blob:preview"); });

  it("warns when no file", async () => {
    renderWithProviders(<ChangeCoverModal id="1" onClose={() => {}} onDone={() => {}} />);
    await userEvent.click(screen.getByRole("button", { name: "Unggah" }));
    expect(tools.showWarningDialog).toHaveBeenCalled();
  });

  it("previews, clears preview and uploads", async () => {
    api.changeCover.mockResolvedValue({});
    const onDone = vi.fn(); const onClose = vi.fn();
    renderWithProviders(<ChangeCoverModal id="1" onClose={onClose} onDone={onDone} />);
    const input = screen.getByTestId("cover-input");
    await userEvent.upload(input, file);
    expect(screen.getByAltText("pratinjau cover")).toBeInTheDocument();
    fireEvent.change(input, { target: { files: [] } });
    expect(screen.queryByAltText("pratinjau cover")).toBeNull();
    await userEvent.upload(input, file);
    await userEvent.click(screen.getByRole("button", { name: "Unggah" }));
    await waitFor(() => expect(onDone).toHaveBeenCalled());
    expect(onClose).toHaveBeenCalled();
  });

  it("shows errors and cancels", async () => {
    api.changeCover.mockRejectedValueOnce(new Error("bad")).mockRejectedValueOnce(Object.assign(new Error(), { message: undefined }));
    const onClose = vi.fn();
    renderWithProviders(<ChangeCoverModal id="1" onClose={onClose} onDone={() => {}} />);
    await userEvent.upload(screen.getByTestId("cover-input"), file);
    await userEvent.click(screen.getByRole("button", { name: "Unggah" }));
    await waitFor(() => expect(tools.showErrorDialog).toHaveBeenCalledWith("bad"));
    await userEvent.click(screen.getByRole("button", { name: "Unggah" }));
    await waitFor(() => expect(tools.showErrorDialog).toHaveBeenCalledWith("Gagal"));
    await userEvent.click(screen.getByRole("button", { name: "Batal" }));
    expect(onClose).toHaveBeenCalled();
  });
});
