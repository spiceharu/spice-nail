import { eq, desc } from "drizzle-orm";
import { drizzle } from "drizzle-orm/mysql2";
import { InsertUser, users, siteConfig, images, snsLinks, InsertSiteConfig, InsertImage, InsertSnsLink } from "../drizzle/schema";
import { ENV } from './_core/env';

let _db: ReturnType<typeof drizzle> | null = null;

// Lazily create the drizzle instance so local tooling can run without a DB.
export async function getDb() {
  if (!_db && process.env.DATABASE_URL) {
    try {
      _db = drizzle(process.env.DATABASE_URL);
    } catch (error) {
      console.warn("[Database] Failed to connect:", error);
      _db = null;
    }
  }
  return _db;
}

export async function upsertUser(user: InsertUser): Promise<void> {
  if (!user.openId) {
    throw new Error("User openId is required for upsert");
  }

  const db = await getDb();
  if (!db) {
    console.warn("[Database] Cannot upsert user: database not available");
    return;
  }

  try {
    const values: InsertUser = {
      openId: user.openId,
    };
    const updateSet: Record<string, unknown> = {};

    const textFields = ["name", "email", "loginMethod"] as const;
    type TextField = (typeof textFields)[number];

    const assignNullable = (field: TextField) => {
      const value = user[field];
      if (value === undefined) return;
      const normalized = value ?? null;
      values[field] = normalized;
      updateSet[field] = normalized;
    };

    textFields.forEach(assignNullable);

    if (user.lastSignedIn !== undefined) {
      values.lastSignedIn = user.lastSignedIn;
      updateSet.lastSignedIn = user.lastSignedIn;
    }
    if (user.role !== undefined) {
      values.role = user.role;
      updateSet.role = user.role;
    } else if (user.openId === ENV.ownerOpenId) {
      values.role = 'admin';
      updateSet.role = 'admin';
    }

    if (!values.lastSignedIn) {
      values.lastSignedIn = new Date();
    }

    if (Object.keys(updateSet).length === 0) {
      updateSet.lastSignedIn = new Date();
    }

    await db.insert(users).values(values).onDuplicateKeyUpdate({
      set: updateSet,
    });
  } catch (error) {
    console.error("[Database] Failed to upsert user:", error);
    throw error;
  }
}

export async function getUserByOpenId(openId: string) {
  const db = await getDb();
  if (!db) {
    console.warn("[Database] Cannot get user: database not available");
    return undefined;
  }

  const result = await db.select().from(users).where(eq(users.openId, openId)).limit(1);

  return result.length > 0 ? result[0] : undefined;
}

// サイト設定関連
export async function getSiteConfig(key: string) {
  const db = await getDb();
  if (!db) return undefined;
  const result = await db.select().from(siteConfig).where(eq(siteConfig.key, key)).limit(1);
  return result.length > 0 ? result[0] : undefined;
}

export async function getAllSiteConfig() {
  const db = await getDb();
  if (!db) return [];
  return await db.select().from(siteConfig);
}

export async function upsertSiteConfig(data: InsertSiteConfig) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  await db.insert(siteConfig).values(data).onDuplicateKeyUpdate({
    set: { value: data.value, updatedAt: new Date() },
  });
}

// 画像関連
export async function getImagesByCategory(category: string) {
  const db = await getDb();
  if (!db) return [];
  return await db.select().from(images).where(eq(images.category, category)).orderBy(images.sortOrder);
}

export async function getAllImages() {
  const db = await getDb();
  if (!db) return [];
  return await db.select().from(images).orderBy(images.category, images.sortOrder);
}

export async function insertImage(data: InsertImage) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  const result = await db.insert(images).values(data);
  return result;
}

export async function deleteImage(id: number) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  await db.delete(images).where(eq(images.id, id));
}

export async function deleteImagesByCategory(category: string) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  await db.delete(images).where(eq(images.category, category));
}

// SNSリンク関連
export async function getAllSnsLinks() {
  const db = await getDb();
  if (!db) return [];
  return await db.select().from(snsLinks).orderBy(snsLinks.sortOrder);
}

export async function insertSnsLink(data: InsertSnsLink) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  const result = await db.insert(snsLinks).values(data);
  return result;
}

export async function updateSnsLink(id: number, data: Partial<InsertSnsLink>) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  await db.update(snsLinks).set(data).where(eq(snsLinks.id, id));
}

export async function deleteSnsLink(id: number) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  await db.delete(snsLinks).where(eq(snsLinks.id, id));
}
