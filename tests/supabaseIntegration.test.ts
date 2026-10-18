import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { EventEmitter } from "node:events";
import {
  setMockSupabaseClient,
  resetSupabaseClientCache,
} from "../src/lib/server/supabase";
import {
  createProjectRecord,
  createInquiryRecord,
  getAllInquiries,
  updateInquiryStatusRecord,
  deleteInquiryRecord,
} from "../src/lib/server/db";
import { projectInputSchema } from "../src/lib/projects/schema";
import { handleApiRequest } from "../src/lib/server/apiRouter";
import { verifyAdminToken } from "../src/lib/server/auth";

describe("Supabase Integration & RLS Authorization Tests", () => {
  beforeEach(() => {
    resetSupabaseClientCache();
    process.env.SUPABASE_URL = "https://mock.supabase.co";
    process.env.SUPABASE_ANON_KEY = "mock-anon-key-with-valid-length-at-least-20-chars";
    process.env.ADMIN_AUTH_SECRET = "test-auth-secret-32-characters-minimum-length";
  });

  afterEach(() => {
    setMockSupabaseClient(null);
    resetSupabaseClientCache();
    process.env.SUPABASE_URL = "";
    process.env.SUPABASE_ANON_KEY = "";
  });

  it("handles Supabase RLS permission denial gracefully with actionable error guidance", async () => {
    const mockClient = {
      from: vi.fn().mockReturnValue({
        insert: vi.fn().mockReturnValue({
          select: vi.fn().mockReturnValue({
            single: vi.fn().mockResolvedValue({
              data: null,
              error: {
                code: "42501",
                message: "new row violates row-level security policy for table 'projects'",
              },
            }),
          }),
        }),
      }),
    } as any;

    setMockSupabaseClient(mockClient);

    const projectInput = projectInputSchema.parse({
      title: "Test Project",
      slug: "test-project",
      summary: "A test project summary",
      technologies: ["React", "TypeScript"],
      status: "draft",
    });

    await expect(createProjectRecord(projectInput)).rejects.toThrow(/Row Level Security/i);
  });

  it("handles unique slug collision error (code 23505) from Supabase", async () => {
    const mockClient = {
      from: vi.fn().mockReturnValue({
        insert: vi.fn().mockReturnValue({
          select: vi.fn().mockReturnValue({
            single: vi.fn().mockResolvedValue({
              data: null,
              error: {
                code: "23505",
                message: "duplicate key value violates unique constraint 'projects_slug_key'",
              },
            }),
          }),
        }),
      }),
    } as any;

    setMockSupabaseClient(mockClient);

    const projectInput = projectInputSchema.parse({
      title: "Duplicate Slug Project",
      slug: "duplicate-slug",
      summary: "Summary for duplicate test",
      technologies: [],
      status: "draft",
    });

    await expect(createProjectRecord(projectInput)).rejects.toThrow(/already exists/i);
  });

  it("invokes submit_contact_inquiry RPC and handles rate-limit PT429 error", async () => {
    const mockClient = {
      rpc: vi.fn().mockResolvedValue({
        error: {
          code: "PT429",
          message: "rate_limited",
        },
      }),
    } as any;

    setMockSupabaseClient(mockClient);

    await expect(
      createInquiryRecord({
        name: "Test Client",
        email: "client@test.com",
        category: "Website or web application",
        message: "We need a new web application.",
      })
    ).rejects.toThrow(/Too many contact submissions/i);

    expect(mockClient.rpc).toHaveBeenCalledWith("submit_contact_inquiry", expect.any(Object));
  });

  it("calls purge_expired_inquiries RPC when retrieving all inquiries", async () => {
    const purgeMock = vi.fn().mockResolvedValue({ data: 0, error: null });
    const mockInquiries = [
      {
        id: "inq-1",
        name: "Alice Smith",
        email: "alice@example.com",
        category: "Website or web application",
        message: "Interested in architectural consulting.",
        created_at: new Date().toISOString(),
        client_hash: "mockhash123",
        status: "new",
      },
    ];

    const mockClient = {
      rpc: purgeMock,
      from: vi.fn().mockReturnValue({
        select: vi.fn().mockReturnValue({
          order: vi.fn().mockResolvedValue({
            data: mockInquiries,
            error: null,
          }),
        }),
      }),
    } as any;

    setMockSupabaseClient(mockClient);

    const inquiries = await getAllInquiries();
    expect(purgeMock).toHaveBeenCalledWith("purge_expired_inquiries");
    expect(inquiries).toHaveLength(1);
    expect(inquiries[0].name).toBe("Alice Smith");
    expect(inquiries[0].status).toBe("new");
  });

  it("updates inquiry status via updateInquiryStatusRecord", async () => {
    const mockClient = {
      from: vi.fn().mockReturnValue({
        update: vi.fn().mockReturnValue({
          eq: vi.fn().mockReturnValue({
            select: vi.fn().mockReturnValue({
              single: vi.fn().mockResolvedValue({
                data: {
                  id: "inq-1",
                  name: "Alice Smith",
                  email: "alice@example.com",
                  category: "Website or web application",
                  message: "Consulting inquiry",
                  created_at: new Date().toISOString(),
                  client_hash: null,
                  status: "read",
                },
                error: null,
              }),
            }),
          }),
        }),
      }),
    } as any;

    setMockSupabaseClient(mockClient);

    const updated = await updateInquiryStatusRecord("inq-1", "read");
    expect(updated.status).toBe("read");
  });

  it("deletes an inquiry record via deleteInquiryRecord", async () => {
    const mockClient = {
      from: vi.fn().mockReturnValue({
        delete: vi.fn().mockReturnValue({
          eq: vi.fn().mockResolvedValue({
            count: 1,
            error: null,
          }),
        }),
      }),
    } as any;

    setMockSupabaseClient(mockClient);

    const deleted = await deleteInquiryRecord("inq-1");
    expect(deleted).toBe(true);
  });

  describe("Administrative Authentication & RLS Gatekeeping", () => {
    function createMockReqRes(options: {
      method?: string;
      url?: string;
      body?: any;
      headers?: Record<string, string>;
    }) {
      const req = new EventEmitter() as any;
      req.method = options.method || "GET";
      req.url = options.url || "/";
      req.headers = options.headers || {};
      req.socket = { remoteAddress: "127.0.0.1" };

      const res = {
        statusCode: 200,
        headers: {} as Record<string, string>,
        body: "",
        setHeader(key: string, val: string) {
          this.headers[key.toLowerCase()] = val;
        },
        end(content: string) {
          this.body = content;
        },
      } as any;

      setTimeout(() => {
        if (options.body !== undefined) {
          req.emit("data", Buffer.from(JSON.stringify(options.body)));
        }
        req.emit("end");
      }, 10);

      return { req, res };
    }

    it("authenticates via Supabase Auth and embeds JWT when user is in admin_users", async () => {
      const mockSupabase = {
        auth: {
          signInWithPassword: vi.fn().mockResolvedValue({
            data: {
              session: {
                access_token: "mock-supabase-access-jwt",
                refresh_token: "mock-supabase-refresh-token",
              },
              user: {
                id: "auth-user-uuid-1234",
                email: "kennedycheroben001@gmail.com",
              },
            },
            error: null,
          }),
        },
        from: vi.fn().mockReturnValue({
          select: vi.fn().mockReturnValue({
            eq: vi.fn().mockReturnValue({
              maybeSingle: vi.fn().mockResolvedValue({
                data: { user_id: "auth-user-uuid-1234", is_active: true },
                error: null,
              }),
            }),
          }),
        }),
      } as any;

      setMockSupabaseClient(mockSupabase);

      const { req, res } = createMockReqRes({
        method: "POST",
        url: "/api/admin/login",
        body: {
          email: "kennedycheroben001@gmail.com",
          password: "correct-password-123",
        },
      });

      const handled = await handleApiRequest(req, res);
      expect(handled).toBe(true);
      expect(res.statusCode).toBe(200);

      const parsedBody = JSON.parse(res.body);
      expect(parsedBody.success).toBe(true);
      expect(parsedBody.token).toBeDefined();

      const session = verifyAdminToken(parsedBody.token);
      expect(session).not.toBeNull();
      expect(session?.userId).toBe("auth-user-uuid-1234");
      expect(session?.supabaseToken).toBe("mock-supabase-access-jwt");
    });

    it("blocks Supabase Auth login with 403 NOT_ADMIN when user is not present in admin_users", async () => {
      const mockSupabase = {
        auth: {
          signInWithPassword: vi.fn().mockResolvedValue({
            data: {
              session: {
                access_token: "non-admin-access-jwt",
                refresh_token: "non-admin-refresh-token",
              },
              user: {
                id: "stranger-uuid-9999",
                email: "stranger@example.com",
              },
            },
            error: null,
          }),
        },
        from: vi.fn().mockReturnValue({
          select: vi.fn().mockReturnValue({
            eq: vi.fn().mockReturnValue({
              maybeSingle: vi.fn().mockResolvedValue({
                data: null,
                error: null,
              }),
            }),
          }),
        }),
      } as any;

      setMockSupabaseClient(mockSupabase);

      const { req, res } = createMockReqRes({
        method: "POST",
        url: "/api/admin/login",
        body: {
          email: "stranger@example.com",
          password: "valid-supabase-password",
        },
      });

      const handled = await handleApiRequest(req, res);
      expect(handled).toBe(true);
      expect(res.statusCode).toBe(403);

      const parsedBody = JSON.parse(res.body);
      expect(parsedBody.code).toBe("NOT_ADMIN");
    });

    it("falls back to server master credentials when Supabase Auth returns an error", async () => {
      process.env.ADMIN_EMAIL = "master-admin@example.com";
      process.env.ADMIN_PASSWORD = "strong-master-password-123";

      const mockSupabase = {
        auth: {
          signInWithPassword: vi.fn().mockResolvedValue({
            data: null,
            error: { message: "Invalid login credentials" },
          }),
        },
      } as any;

      setMockSupabaseClient(mockSupabase);

      const { req, res } = createMockReqRes({
        method: "POST",
        url: "/api/admin/login",
        body: {
          email: "master-admin@example.com",
          password: "strong-master-password-123",
        },
      });

      const handled = await handleApiRequest(req, res);
      expect(handled).toBe(true);
      expect(res.statusCode).toBe(200);

      const parsedBody = JSON.parse(res.body);
      expect(parsedBody.success).toBe(true);

      const session = verifyAdminToken(parsedBody.token);
      expect(session).not.toBeNull();
      expect(session?.email).toBe("master-admin@example.com");
      expect(session?.supabaseToken).toBeUndefined();
    });

    it("evaluates non-overlapping project SELECT logic correctly", () => {
      // Simulating the unified, non-overlapping SELECT predicate:
      // (status = 'published') OR (role = 'authenticated' AND is_admin = true)
      const evaluateSelect = (row: { status: string }, callerRole: "anon" | "authenticated", isAdmin: boolean) => {
        return row.status === "published" || (callerRole === "authenticated" && isAdmin);
      };

      const publishedRow = { status: "published" };
      const draftRow = { status: "draft" };

      // Anon caller:
      expect(evaluateSelect(publishedRow, "anon", false)).toBe(true);
      expect(evaluateSelect(draftRow, "anon", false)).toBe(false);

      // Authenticated non-admin caller:
      expect(evaluateSelect(publishedRow, "authenticated", false)).toBe(true);
      expect(evaluateSelect(draftRow, "authenticated", false)).toBe(false);

      // Authenticated inactive admin caller (is_active = false):
      expect(evaluateSelect(publishedRow, "authenticated", false)).toBe(true);
      expect(evaluateSelect(draftRow, "authenticated", false)).toBe(false);

      // Authenticated active admin caller (is_active = true):
      expect(evaluateSelect(publishedRow, "authenticated", true)).toBe(true);
      expect(evaluateSelect(draftRow, "authenticated", true)).toBe(true);
    });

    it("evaluates project mutation permissions across user categories correctly", () => {
      // Simulating mutation policies:
      // INSERT: with check (app_private.is_admin())
      // UPDATE: using (app_private.is_admin()) with check (app_private.is_admin())
      // DELETE: using (app_private.is_admin())
      const canMutate = (callerRole: "anon" | "authenticated", isUserInAdminUsers: boolean, isActive: boolean) => {
        if (callerRole !== "authenticated") return false;
        return isUserInAdminUsers && isActive;
      };

      // 1. Anonymous user
      expect(canMutate("anon", false, false)).toBe(false);

      // 2. Ordinary authenticated user (not in admin_users)
      expect(canMutate("authenticated", false, false)).toBe(false);

      // 3. Inactive administrator (in admin_users but is_active = false)
      expect(canMutate("authenticated", true, false)).toBe(false);

      // 4. Active administrator (in admin_users and is_active = true)
      expect(canMutate("authenticated", true, true)).toBe(true);
    });
  });

  describe("Contact Form Rate Limiting & Concurrency Hardening", () => {
    it("handles ordinary successful submission without rate limiting", async () => {
      const mockRpc = vi.fn().mockResolvedValue({ error: null });
      setMockSupabaseClient({ rpc: mockRpc } as any);

      const res = await createInquiryRecord({
        name: "Jane Doe",
        email: "jane@example.com",
        category: "Website or web application",
        message: "We would like to discuss building a new web application.",
        clientHash: "a".repeat(64),
      });

      expect(res.name).toBe("Jane Doe");
      expect(res.email).toBe("jane@example.com");
      expect(mockRpc).toHaveBeenCalledWith("submit_contact_inquiry", {
        p_name: "Jane Doe",
        p_email: "jane@example.com",
        p_category: "Website or web application",
        p_message: "We would like to discuss building a new web application.",
        p_client_hash: "a".repeat(64),
      });
    });

    it("enforces global ceiling rate limit (PT429) across all submissions", async () => {
      const mockRpc = vi.fn().mockResolvedValue({
        error: { code: "PT429", message: "rate_limited" },
      });
      setMockSupabaseClient({ rpc: mockRpc } as any);

      await expect(
        createInquiryRecord({
          name: "Attacker Bot",
          email: "bot@target.com",
          category: "Something else",
          message: "Global spam burst message exceeding limit.",
        })
      ).rejects.toThrow(/Too many contact submissions/i);
    });

    it("enforces per-email rate limit even when client hash rotates", async () => {
      // Simulating 3 submissions with same email but different hashes
      let emailSubmissionCount = 0;
      const targetEmail = "repeated@example.com";

      const mockRpc = vi.fn().mockImplementation((_fnName, args) => {
        if (args.p_email === targetEmail) {
          emailSubmissionCount++;
          if (emailSubmissionCount > 3) {
            return Promise.resolve({
              error: { code: "PT429", message: "rate_limited" },
            });
          }
        }
        return Promise.resolve({ error: null });
      });

      setMockSupabaseClient({ rpc: mockRpc } as any);

      // First 3 submissions with different rotating client hashes succeed
      for (let i = 1; i <= 3; i++) {
        const hash = i.toString().repeat(64);
        await expect(
          createInquiryRecord({
            name: "Sender",
            email: targetEmail,
            category: "Design and build",
            message: `Legitimate inquiry submission number ${i}.`,
            clientHash: hash,
          })
        ).resolves.toBeDefined();
      }

      // 4th submission with another new client hash must be blocked by email rate limit
      const fourthHash = "4".repeat(64);
      await expect(
        createInquiryRecord({
          name: "Sender",
          email: targetEmail,
          category: "Design and build",
          message: "Fourth inquiry attempt with rotating IP hash.",
          clientHash: fourthHash,
        })
      ).rejects.toThrow(/Too many contact submissions/i);
    });

    it("enforces per-client-hash rate limit even when email address rotates", async () => {
      // Simulating a single client hash rotating email addresses
      let hashSubmissionCount = 0;
      const sharedClientHash = "f".repeat(64);

      const mockRpc = vi.fn().mockImplementation((_fnName, args) => {
        if (args.p_client_hash === sharedClientHash) {
          hashSubmissionCount++;
          if (hashSubmissionCount > 5) {
            return Promise.resolve({
              error: { code: "PT429", message: "rate_limited" },
            });
          }
        }
        return Promise.resolve({ error: null });
      });

      setMockSupabaseClient({ rpc: mockRpc } as any);

      // First 5 submissions with different rotating emails succeed
      for (let i = 1; i <= 5; i++) {
        await expect(
          createInquiryRecord({
            name: `User ${i}`,
            email: `rotating-email-${i}@example.com`,
            category: "Something else",
            message: `Message from rotating email ${i} sharing the same client hash.`,
            clientHash: sharedClientHash,
          })
        ).resolves.toBeDefined();
      }

      // 6th submission from a new email sharing the same client hash is blocked
      await expect(
        createInquiryRecord({
          name: "User 6",
          email: "rotating-email-6@example.com",
          category: "Something else",
          message: "Sixth message sharing the same client hash.",
          clientHash: sharedClientHash,
        })
      ).rejects.toThrow(/Too many contact submissions/i);
    });

    it("handles invalid input check constraint failure (PT400) from database", async () => {
      const mockRpc = vi.fn().mockResolvedValue({
        error: { code: "PT400", message: "invalid_input" },
      });
      setMockSupabaseClient({ rpc: mockRpc } as any);

      // If the RPC throws PT400 due to constraint violations, it should not succeed
      await expect(
        createInquiryRecord({
          name: "X", // too short
          email: "invalid-email",
          category: "Something else",
          message: "Too short",
        })
      ).rejects.toThrow();
    });
  });
});
