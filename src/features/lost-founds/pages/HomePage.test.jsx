import { describe, it, expect, vi, beforeEach } from "vitest";
import { screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { renderWithProviders } from "../../../test-utils.jsx";
import HomePage from "./HomePage.jsx";
import * as api from "../api/lostFoundApi.js";

vi.mock("../api/lostFoundApi.js");

const items = [
  { id: "1", title: "Dompet", description: "hitam", status: "lost", is_completed: 0, cover: "c.png", created_at: "2026-01-01T00:00:00Z" },
  { id: "2", title: "Kunci", description: "perak", status: "found", is_completed: 1, created_at: "2026-01-02T00:00:00Z" },
];

describe("HomePage", () => {
  beforeEach(() => {
    vi.resetAllMocks();
    api.getLostFounds.mockResolvedValue({ data: { lost_founds: items } });
    api.getDailyStats.mockResolvedValue({ data: [] });
    api.getMonthlyStats.mockResolvedValue({ data: [{ m: 1 }] });
  });

  it("shows stats, cards and monthly summary", async () => {
    renderWithProviders(<HomePage />);
    expect(await screen.findByText("Dompet")).toBeInTheDocument();
    expect(screen.getByText("Kunci")).toBeInTheDocument();
    expect(screen.getByAltText("Cover Dompet")).toBeInTheDocument();
    expect(screen.getByText("Selesai", { selector: "span" })).toBeInTheDocument();
    expect(await screen.findByText(/statistik bulanan/i)).toBeInTheDocument();
  });

  it("hides monthly summary when stats are not a list", async () => {
    api.getMonthlyStats.mockResolvedValue({ data: {} });
    renderWithProviders(<HomePage />);
    await screen.findByText("Dompet");
    expect(screen.queryByText(/statistik bulanan/i)).toBeNull();
  });

  it("filters by type, completion and search", async () => {
    renderWithProviders(<HomePage />);
    await screen.findByText("Dompet");
    await userEvent.selectOptions(screen.getByLabelText("Filter jenis"), "found");
    expect(screen.queryByText("Dompet")).toBeNull();
    await userEvent.selectOptions(screen.getByLabelText("Filter jenis"), "all");
    await userEvent.selectOptions(screen.getByLabelText("Filter penyelesaian"), "1");
    expect(screen.queryByText("Dompet")).toBeNull();
    expect(screen.getByText("Kunci")).toBeInTheDocument();
    await userEvent.selectOptions(screen.getByLabelText("Filter penyelesaian"), "0");
    expect(screen.getByText("Dompet")).toBeInTheDocument();
    await userEvent.selectOptions(screen.getByLabelText("Filter penyelesaian"), "all");
    await userEvent.type(screen.getByLabelText("Cari laporan"), "zzz");
    expect(screen.getByText("Belum ada laporan.")).toBeInTheDocument();
  });

  it("switches between all and my reports", async () => {
    renderWithProviders(<HomePage />);
    await screen.findByText("Dompet");
    await userEvent.click(screen.getByRole("button", { name: "Laporan Saya" }));
    await waitFor(() => expect(api.getLostFounds).toHaveBeenLastCalledWith({ isMe: true }));
    await userEvent.click(screen.getByRole("button", { name: "Semua" }));
    await waitFor(() => expect(api.getLostFounds).toHaveBeenLastCalledWith({ isMe: false }));
  });

  it("opens and closes the add modal", async () => {
    renderWithProviders(<HomePage />);
    await screen.findByText("Dompet");
    await userEvent.click(screen.getByLabelText("Tambah laporan"));
    expect(screen.getByRole("dialog")).toBeInTheDocument();
    await userEvent.click(screen.getByRole("button", { name: "Batal" }));
    expect(screen.queryByRole("dialog")).toBeNull();
  });
});
