import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { MemoryRouter, Routes, Route } from "react-router-dom";
import { AdminAuthProvider } from "../src/admin/AdminAuthContext";
import { AdminLogin } from "../src/admin/AdminLogin";
import { AdminLayout } from "../src/admin/AdminLayout";

describe("Administrative CMS Enclave", () => {
  beforeEach(() => {
    localStorage.clear();
    vi.restoreAllMocks();
  });

  it("renders AdminLogin with email and password inputs and strictly NO demo autofill buttons", () => {
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
    // Regression check: demo autofill button MUST NOT exist
    expect(screen.queryByRole("button", { name: /Autofill Default Credentials/i })).not.toBeInTheDocument();
    expect(screen.queryByText(/Autofill/i)).not.toBeInTheDocument();
  });

  it("accepts user credentials securely without exposing defaults", () => {
    render(
      <MemoryRouter initialEntries={["/admin/login"]}>
        <AdminAuthProvider>
          <AdminLogin />
        </AdminAuthProvider>
      </MemoryRouter>
    );

    const emailInput = screen.getByLabelText(/Administrator Email/i) as HTMLInputElement;
    const passInput = screen.getByLabelText(/Password/i) as HTMLInputElement;

    // Initially blank
    expect(emailInput.value).toBe("");
    expect(passInput.value).toBe("");

    fireEvent.change(emailInput, { target: { value: "operator@kennedycheroben.co.ke" } });
    fireEvent.change(passInput, { target: { value: "SecretPassword123!" } });

    expect(emailInput.value).toBe("operator@kennedycheroben.co.ke");
    expect(passInput.value).toBe("SecretPassword123!");
  });

  it("redirects unauthenticated users in AdminLayout to /admin/login", async () => {
    render(
      <MemoryRouter initialEntries={["/admin/dashboard"]}>
        <AdminAuthProvider>
          <Routes>
            <Route path="/admin" element={<AdminLayout />}>
              <Route path="dashboard" element={<div>Admin Protected Content</div>} />
            </Route>
            <Route path="/admin/login" element={<div>Admin Login Portal Screen</div>} />
          </Routes>
        </AdminAuthProvider>
      </MemoryRouter>
    );

    await waitFor(() => {
      expect(screen.getByText("Admin Login Portal Screen")).toBeInTheDocument();
    });
  });
});
