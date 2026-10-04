import { describe, it, expect, vi, beforeEach } from "vitest";
import { screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { Route, Routes } from "react-router-dom";
import { renderWithProviders } from "../../../test-utils.jsx";
import DetailPage from "./DetailPage.jsx";
import * as api from "../api/lostFoundApi.js";
import * as tools from "../../../helpers/toolsHelper.js";

vi.mock("../api/lostFoundApi.js");
vi.mock("../../../helpers/toolsHelper.js");

const item = (o = {}) => ({
  id: "5", title: "Dompet", description: "hitam", status: "lost", is_completed: 0,
  cover: "c.png", created_at: "2026-01-01T00:00:00Z", user: { id: "1", name: "Ani" }, ...o,
});
const profile = (id = "1") => ({ users: { users: [], user: null, profile: { id, name: "Ani", email: "a@b.c" }, isProfile: true,
  isChangeProfile: false, isChangeProfilePhoto: false, isChangeProfilePassword: false } });
const ui = (
  <Routes>
    <Route path="/lost-founds/:id" element={<DetailPage />} />
    <Route path="/" element={<p>home page</p>} />
  </Routes>
);
const open = (o, id = "1") => {
  api.getLostFound.mockResolvedValue({ data: { lost_found: item(o) } });
  return renderWithProviders(ui, { route: "/lost-founds/5", preloadedState: profile(id) });
};

describe("DetailPage", () => {
  beforeEach(() => { vi.resetAllMocks(); tools.formatDate.mockReturnValue("1 Jan 2026"); });

  it("shows loading first", () => {
    api.getLostFound.mockReturnValue(new Promise(() => {}));
    renderWithProviders(ui, { route: "/lost-founds/5" });
    expect(screen.getByText("Memuat...")).toBeInTheDocument();
  });

  it("shows details without owner buttons for other users", async () => {
    open({}, "2");
    expect(await screen.findByRole("heading", { name: "Dompet" })).toBeInTheDocument();
    expect(screen.getByText("Hilang")).toBeInTheDocument();
    expect(screen.getByText("Belum selesai")).toBeInTheDocument();
    expect(screen.queryByText("Hapus")).toBeNull();
  });

  it("handles found/completed, no cover and author fallback", async () => {
    api.getLostFound.mockResolvedValue({ data: { lost_found: item({ status: "found", is_completed: 1, cover: null, user: undefined, author: { id: "1", name: "Budi" } }) } });
    renderWithProviders(ui, { route: "/lost-founds/5", preloadedState: profile() });
    expect(await screen.findByText("Ditemukan")).toBeInTheDocument();
    expect(screen.getByText("Selesai")).toBeInTheDocument();
    expect(screen.getByText("Budi")).toBeInTheDocument();
    expect(screen.queryByAltText("Cover Dompet")).toBeNull();
  });

  it("is not owner when no profile or owner info", async () => {
    api.getLostFound.mockResolvedValue({ data: { lost_found: item({ user: undefined }) } });
    renderWithProviders(ui, { route: "/lost-founds/5" });
    await screen.findByRole("heading", { name: "Dompet" });
    expect(screen.queryByText("Hapus")).toBeNull();
  });

  it("owner opens edit and cover modals", async () => {
    open();
    await userEvent.click(await screen.findByRole("button", { name: "Ubah Laporan" }));
    expect(screen.getByRole("dialog", { name: "Ubah laporan" })).toBeInTheDocument();
    await userEvent.click(screen.getByRole("button", { name: "Batal" }));
    await userEvent.click(screen.getByRole("button", { name: "Ubah Cover" }));
    expect(screen.getByRole("dialog", { name: "Ubah cover" })).toBeInTheDocument();
    await userEvent.click(screen.getByRole("button", { name: "Batal" }));
    expect(screen.queryByRole("dialog")).toBeNull();
  });

  it("deletes after confirmation", async () => {
    tools.showConfirmDialog.mockResolvedValue(true);
    api.deleteLostFound.mockResolvedValue({});
    open();
    await userEvent.click(await screen.findByRole("button", { name: "Hapus" }));
    await waitFor(() => expect(screen.getByText("home page")).toBeInTheDocument());
  });

  it("does not delete when cancelled", async () => {
    tools.showConfirmDialog.mockResolvedValue(false);
    open();
    await userEvent.click(await screen.findByRole("button", { name: "Hapus" }));
    expect(api.deleteLostFound).not.toHaveBeenCalled();
  });

  it("shows errors when delete fails", async () => {
    tools.showConfirmDialog.mockResolvedValue(true);
    api.deleteLostFound.mockRejectedValueOnce(new Error("bad")).mockRejectedValueOnce(Object.assign(new Error(), { message: undefined }));
    open();
    const btn = await screen.findByRole("button", { name: "Hapus" });
    await userEvent.click(btn);
    await waitFor(() => expect(tools.showErrorDialog).toHaveBeenCalledWith("bad"));
    await userEvent.click(btn);
    await waitFor(() => expect(tools.showErrorDialog).toHaveBeenCalledWith("Gagal"));
  });
});
