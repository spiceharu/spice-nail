import { COOKIE_NAME } from "@shared/const";
import { getSessionCookieOptions } from "./_core/cookies";
import { systemRouter } from "./_core/systemRouter";
import { publicProcedure, router, protectedProcedure } from "./_core/trpc";
import { z } from "zod";
import * as db from "./db";
import { storagePut } from "./storage";

export const appRouter = router({
    // if you need to use socket.io, read and register route in server/_core/index.ts, all api should start with '/api/' so that the gateway can route correctly
  system: systemRouter,
  auth: router({
    me: publicProcedure.query(opts => opts.ctx.user),
    logout: publicProcedure.mutation(({ ctx }) => {
      const cookieOptions = getSessionCookieOptions(ctx.req);
      ctx.res.clearCookie(COOKIE_NAME, { ...cookieOptions, maxAge: -1 });
      return {
        success: true,
      } as const;
    }),
  }),

  // サイト設定関連API
  site: router({
    getConfig: publicProcedure.query(async () => {
      const config = await db.getAllSiteConfig();
      const configMap: Record<string, string> = {};
      config.forEach(item => {
        if (item.value) configMap[item.key] = item.value;
      });
      return configMap;
    }),
    updateConfig: protectedProcedure
      .input(z.object({
        key: z.string(),
        value: z.string(),
      }))
      .mutation(async ({ input }) => {
        await db.upsertSiteConfig(input);
        return { success: true };
      }),
  }),

  // 画像関連API
  images: router({
    getAll: publicProcedure.query(async () => {
      return await db.getAllImages();
    }),
    getByCategory: publicProcedure
      .input(z.object({ category: z.string() }))
      .query(async ({ input }) => {
        return await db.getImagesByCategory(input.category);
      }),
    upload: protectedProcedure
      .input(z.object({
        category: z.string(),
        fileData: z.string(), // base64
        fileName: z.string(),
        mimeType: z.string(),
        sortOrder: z.number().default(0),
      }))
      .mutation(async ({ input }) => {
        const buffer = Buffer.from(input.fileData, 'base64');
        const timestamp = Date.now();
        const fileKey = `nail-salon/${input.category}/${timestamp}-${input.fileName}`;
        const { url } = await storagePut(fileKey, buffer, input.mimeType);
        
        await db.insertImage({
          category: input.category,
          url,
          fileKey,
          sortOrder: input.sortOrder,
        });
        
        return { success: true, url };
      }),
    delete: protectedProcedure
      .input(z.object({ id: z.number() }))
      .mutation(async ({ input }) => {
        await db.deleteImage(input.id);
        return { success: true };
      }),
    deleteByCategory: protectedProcedure
      .input(z.object({ category: z.string() }))
      .mutation(async ({ input }) => {
        await db.deleteImagesByCategory(input.category);
        return { success: true };
      }),
  }),

  // SNSリンク関連API
  sns: router({
    getAll: publicProcedure.query(async () => {
      return await db.getAllSnsLinks();
    }),
    add: protectedProcedure
      .input(z.object({
        platform: z.string(),
        url: z.string(),
        displayName: z.string().optional(),
        sortOrder: z.number().default(0),
      }))
      .mutation(async ({ input }) => {
        await db.insertSnsLink(input);
        return { success: true };
      }),
    update: protectedProcedure
      .input(z.object({
        id: z.number(),
        platform: z.string().optional(),
        url: z.string().optional(),
        displayName: z.string().optional(),
        sortOrder: z.number().optional(),
      }))
      .mutation(async ({ input }) => {
        const { id, ...data } = input;
        await db.updateSnsLink(id, data);
        return { success: true };
      }),
    delete: protectedProcedure
      .input(z.object({ id: z.number() }))
      .mutation(async ({ input }) => {
        await db.deleteSnsLink(input.id);
        return { success: true };
      }),
  }),
});

export type AppRouter = typeof appRouter;
