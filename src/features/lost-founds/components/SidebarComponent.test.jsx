import { describe, it, expect, vi } from "vitest";
import { screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { renderWithProviders } from "../../../test-utils.jsx";
import SidebarComponent from "./SidebarComponent.jsx";

describe("SidebarComponent", () => {
  it("renders menu and closes on link click", async () => {
    const onClose = vi.fn();
    renderWithProviders(<SidebarComponent open={false} onClose={onClose} />);
    expect(screen.queryByTestId("backdrop")).toBeNull();
    await userEvent.click(screen.getByRole("link", { name: /Pengguna/ }));
    expect(onClose).toHaveBeenCalled();
  });

  it("shows backdrop when open and closes it", async () => {
    const onClose = vi.fn();
    renderWithProviders(<SidebarComponent open onClose={onClose} />);
    await userEvent.click(screen.getByTestId("backdrop"));
    expect(onClose).toHaveBeenCalled();
    expect(screen.getByRole("link", { name: /Dashboard/ })).toHaveClass("bg-indigo-50");
  });
});
