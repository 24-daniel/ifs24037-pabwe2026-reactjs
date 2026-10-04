import { describe, it, expect, vi, beforeEach } from "vitest";
import { screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { renderWithProviders } from "../../../test-utils.jsx";
import AddModal from "./AddModal.jsx";
import * as api from "../api/lostFoundApi.js";
import * as tools from "../../../helpers/toolsHelper.js";

vi.mock("../api/lostFoundApi.js");
vi.mock("../../../helpers/toolsHelper.js");

const fill = async () => {
  await userEvent.type(screen.getByLabelText("Judul"), "Dompet");
  await userEvent.type(screen.getByLabelText("Deskripsi"), "Warna hitam");
  await userEvent.selectOptions(screen.getByLabelText("Jenis laporan"), "found");
};

describe("AddModal", () => {
  beforeEach(() => vi.resetAllMocks());

  it("validates required fields", async () => {
    renderWithProviders(<AddModal onClose={() => {}} onDone={() => {}} />);
    await userEvent.click(screen.getByRole("button", { name: "Simpan" }));
    expect(tools.showWarningDialog).toHaveBeenCalled();
  });

  it("submits successfully", async () => {
    api.addLostFound.mockResolvedValue({});
    const onClose = vi.fn(); const onDone = vi.fn();
    renderWithProviders(<AddModal onClose={onClose} onDone={onDone} />);
    await fill();
    await userEvent.click(screen.getByRole("button", { name: "Simpan" }));
    await waitFor(() => expect(onDone).toHaveBeenCalled());
    expect(onClose).toHaveBeenCalled();
    expect(api.addLostFound).toHaveBeenCalledWith({ title: "Dompet", description: "Warna hitam", status: "found" });
  });

  it("shows errors and cancels", async () => {
    api.addLostFound.mockRejectedValueOnce(new Error("bad")).mockRejectedValueOnce(Object.assign(new Error(), { message: undefined }));
    const onClose = vi.fn();
    renderWithProviders(<AddModal onClose={onClose} onDone={() => {}} />);
    await fill();
    await userEvent.click(screen.getByRole("button", { name: "Simpan" }));
    await waitFor(() => expect(tools.showErrorDialog).toHaveBeenCalledWith("bad"));
    await userEvent.click(screen.getByRole("button", { name: "Simpan" }));
    await waitFor(() => expect(tools.showErrorDialog).toHaveBeenCalledWith("Gagal"));
    await userEvent.click(screen.getByRole("button", { name: "Batal" }));
    expect(onClose).toHaveBeenCalled();
  });
});
