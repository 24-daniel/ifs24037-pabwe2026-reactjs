import { describe, it, expect, vi, beforeEach } from "vitest";
import { screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { renderWithProviders } from "../../../test-utils.jsx";
import ProfilePage from "./ProfilePage.jsx";
import * as api from "../api/userApi.js";
import * as tools from "../../../helpers/toolsHelper.js";

vi.mock("../api/userApi.js");
vi.mock("../../../helpers/toolsHelper.js");

const user = { id: "1", name: "Ani", email: "a@b.c", photo: "p.png" };
const withProfile = (p = user) => ({ preloadedState: { users: { users: [], user: p, profile: p, isProfile: true,
  isChangeProfile: false, isChangeProfilePhoto: false, isChangeProfilePassword: false } } });

describe("ProfilePage", () => {
  beforeEach(() => { vi.resetAllMocks(); api.getMe.mockResolvedValue({ data: { user } }); });

  it("fills the form and saves profile", async () => {
    api.updateMe.mockResolvedValue({});
    renderWithProviders(<ProfilePage />, withProfile());
    expect(screen.getByLabelText("Nama")).toHaveValue("Ani");
    expect(screen.getByAltText("avatar")).toBeInTheDocument();
    await userEvent.click(screen.getByRole("button", { name: "Simpan Profil" }));
    await waitFor(() => expect(api.getMe).toHaveBeenCalled());
  });

  it("renders without profile or photo", () => {
    renderWithProviders(<ProfilePage />);
    expect(screen.queryByAltText("avatar")).toBeNull();
  });

  it("shows error when saving profile fails", async () => {
    api.updateMe.mockRejectedValueOnce(new Error("x"));
    renderWithProviders(<ProfilePage />, withProfile());
    await userEvent.click(screen.getByRole("button", { name: "Simpan Profil" }));
    await waitFor(() => expect(tools.showErrorDialog).toHaveBeenCalledWith("x"));
  });

  it("falls back to default error text", async () => {
    api.updateMe.mockRejectedValueOnce(Object.assign(new Error(), { message: undefined }));
    api.uploadPhoto.mockRejectedValueOnce(Object.assign(new Error(), { message: undefined }));
    api.changePassword.mockRejectedValueOnce(Object.assign(new Error(), { message: undefined }));
    renderWithProviders(<ProfilePage />, withProfile());
    await userEvent.click(screen.getByRole("button", { name: "Simpan Profil" }));
    await userEvent.upload(screen.getByLabelText("Unggah foto profil"), new File(["x"], "a.png", { type: "image/png" }));
    await userEvent.click(screen.getByRole("button", { name: "Ubah Kata Sandi" }));
    await waitFor(() => expect(tools.showErrorDialog).toHaveBeenCalledTimes(3));
    expect(tools.showErrorDialog).toHaveBeenCalledWith("Gagal");
  });

  it("uploads photo and handles failure / no file", async () => {
    api.uploadPhoto.mockResolvedValueOnce({}).mockRejectedValueOnce(new Error("p"));
    renderWithProviders(<ProfilePage />, withProfile());
    const input = screen.getByLabelText("Unggah foto profil");
    const file = new File(["x"], "a.png", { type: "image/png" });
    await userEvent.upload(input, file);
    await waitFor(() => expect(tools.showSuccessDialog).toHaveBeenCalledWith("Foto diperbarui"));
    await userEvent.upload(input, new File(["y"], "b.png", { type: "image/png" }));
    await waitFor(() => expect(tools.showErrorDialog).toHaveBeenCalledWith("p"));
    const { fireEvent } = await import("@testing-library/react");
    fireEvent.change(input, { target: { files: [] } });
    expect(api.uploadPhoto).toHaveBeenCalledTimes(2);
  });

  it("changes password and handles failure", async () => {
    api.changePassword.mockResolvedValueOnce({}).mockRejectedValueOnce(new Error("pw"));
    renderWithProviders(<ProfilePage />, withProfile());
    await userEvent.type(screen.getByLabelText("Kata sandi lama"), "old123");
    await userEvent.type(screen.getByLabelText("Kata sandi baru"), "new123");
    await userEvent.click(screen.getByRole("button", { name: "Ubah Kata Sandi" }));
    await waitFor(() => expect(screen.getByLabelText("Kata sandi lama")).toHaveValue(""));
    await userEvent.click(screen.getByRole("button", { name: "Ubah Kata Sandi" }));
    await waitFor(() => expect(tools.showErrorDialog).toHaveBeenCalledWith("pw"));
  });
});
