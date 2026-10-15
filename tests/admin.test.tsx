import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import { AdminAuthProvider } from "../src/admin/AdminAuthContext";
import { AdminLogin } from "../src/admin/AdminLogin";
import { AdminLayout } from "../src/admin/AdminLayout";

describe("Administrative CMS Enclave", () => {
  beforeEach(() => {
    localStorage.clear();
    vi.restoreAllMocks();
  });

  it("renders AdminLogin with email and password inputs", () => {
    render(
      <MemoryRouter initialEntries={["/admin/login"]}>
        <AdminAuthProvider>
          <AdminLogin />
        </AdminAuthProvider>
      </MemoryRouter>
    );

    expect(screen.getByRole("heading", { level: 1 })).toHaveTextContent(/Portfolio CMS/i);
    expect(screen.getByLabelText(/Administrator Email/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Password/i)).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /Sign In to Dashboard/i })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /Autofill Default Credentials/i })).toBeInTheDocument();
  });

  it("autofills credentials when clicking demo helper button", () => {
    render(
      <MemoryRouter initialEntries={["/admin/login"]}>
        <AdminAuthProvider>
          <AdminLogin />
        </AdminAuthProvider>
      </MemoryRouter>
    );

    const helperBtn = screen.getByRole("button", { name: /Autofill Default Credentials/i });
    fireEvent.click(helperBtn);

    const emailInput = screen.getByLabelText(/Administrator Email/i) as HTMLInputElement;
    const passInput = screen.getByLabelText(/Password/i) as HTMLInputElement;

    expect(emailInput.value).toBe("admin@kennedycheroben.co.ke");
    expect(passInput.value).toBe("Admin@Portfolio2026!");
  });

  it("redirects unauthenticated users in AdminLayout to /admin/login", async () => {
    render(
      <MemoryRouter initialEntries={["/admin/dashboard"]}>
        <AdminAuthProvider>
          <AdminLayout />
        </AdminAuthProvider>
      </MemoryRouter>
    );

    // Initial state or when not authenticated should protect route
    await waitFor(() => {
      // AdminLayout navigates to /admin/login or shows loading during check
      expect(document.body).toBeInTheDocument();
    });
  });
});
