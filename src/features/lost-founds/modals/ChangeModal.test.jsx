import { describe, it, expect, vi, beforeEach } from "vitest";
import { screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { renderWithProviders } from "../../../test-utils.jsx";
import ChangeModal from "./ChangeModal.jsx";
import * as api from "../api/lostFoundApi.js";
import * as tools from "../../../helpers/toolsHelper.js";

vi.mock("../api/lostFoundApi.js");
vi.mock("../../../helpers/toolsHelper.js");

const item = { id: "9", title: "Kunci", description: "Di kantin", status: "lost", is_completed: 0 };

describe("ChangeModal", () => {
  beforeEach(() => vi.resetAllMocks());

  it("validates required fields", async () => {
    renderWithProviders(<ChangeModal item={item} onClose={() => {}} onDone={() => {}} />);
    await userEvent.clear(screen.getByLabelText("Judul"));
    await userEvent.click(screen.getByRole("button", { name: "Simpan" }));
    expect(tools.showWarningDialog).toHaveBeenCalled();
  });

  it("updates with completion toggle", async () => {
    api.changeLostFound.mockResolvedValue({});
    const onDone = vi.fn(); const onClose = vi.fn();
    renderWithProviders(<ChangeModal item={item} onClose={onClose} onDone={onDone} />);
    await userEvent.click(screen.getByLabelText("Tandai selesai"));
    await userEvent.selectOptions(screen.getByLabelText("Jenis laporan"), "found");
    await userEvent.click(screen.getByRole("button", { name: "Simpan" }));
    await waitFor(() => expect(onDone).toHaveBeenCalled());
    expect(api.changeLostFound).toHaveBeenCalledWith("9", expect.objectContaining({ status: "found", isCompleted: true }));
  });

  it("starts checked when completed, shows errors and cancels", async () => {
    api.changeLostFound.mockRejectedValueOnce(new Error("bad")).mockRejectedValueOnce(Object.assign(new Error(), { message: undefined }));
    const onClose = vi.fn();
    renderWithProviders(<ChangeModal item={{ ...item, is_completed: 1 }} onClose={onClose} onDone={() => {}} />);
    expect(screen.getByLabelText("Tandai selesai")).toBeChecked();
    await userEvent.type(screen.getByLabelText("Deskripsi"), "!");
    await userEvent.click(screen.getByRole("button", { name: "Simpan" }));
    await waitFor(() => expect(tools.showErrorDialog).toHaveBeenCalledWith("bad"));
    await userEvent.click(screen.getByRole("button", { name: "Simpan" }));
    await waitFor(() => expect(tools.showErrorDialog).toHaveBeenCalledWith("Gagal"));
    await userEvent.click(screen.getByRole("button", { name: "Batal" }));
    expect(onClose).toHaveBeenCalled();
  });
});
