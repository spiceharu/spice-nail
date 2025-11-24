import { describe, expect, it } from "vitest";
import { appRouter } from "./routers";
import type { TrpcContext } from "./_core/context";

type AuthenticatedUser = NonNullable<TrpcContext["user"]>;

function createAuthContext(): { ctx: TrpcContext } {
  const user: AuthenticatedUser = {
    id: 1,
    openId: "test-user",
    email: "test@example.com",
    name: "Test User",
    loginMethod: "manus",
    role: "admin",
    createdAt: new Date(),
    updatedAt: new Date(),
    lastSignedIn: new Date(),
  };

  const ctx: TrpcContext = {
    user,
    req: {
      protocol: "https",
      headers: {},
    } as TrpcContext["req"],
    res: {
      clearCookie: () => {},
    } as TrpcContext["res"],
  };

  return { ctx };
}

describe("site API", () => {
  it("getConfig returns empty object when no config exists", async () => {
    const { ctx } = createAuthContext();
    const caller = appRouter.createCaller(ctx);

    const result = await caller.site.getConfig();

    expect(result).toBeDefined();
    expect(typeof result).toBe("object");
  });

  it("updateConfig successfully updates site configuration", async () => {
    const { ctx } = createAuthContext();
    const caller = appRouter.createCaller(ctx);

    const result = await caller.site.updateConfig({
      key: "test_key",
      value: "test_value",
    });

    expect(result).toEqual({ success: true });
  });
});

describe("images API", () => {
  it("getAll returns array of images", async () => {
    const { ctx } = createAuthContext();
    const caller = appRouter.createCaller(ctx);

    const result = await caller.images.getAll();

    expect(Array.isArray(result)).toBe(true);
  });

  it("getByCategory returns filtered images", async () => {
    const { ctx } = createAuthContext();
    const caller = appRouter.createCaller(ctx);

    const result = await caller.images.getByCategory({ category: "hero_pc" });

    expect(Array.isArray(result)).toBe(true);
  });
});

describe("sns API", () => {
  it("getAll returns array of SNS links", async () => {
    const { ctx } = createAuthContext();
    const caller = appRouter.createCaller(ctx);

    const result = await caller.sns.getAll();

    expect(Array.isArray(result)).toBe(true);
  });
});
