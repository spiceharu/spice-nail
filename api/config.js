// /api/config.js
export const config = { runtime: "nodejs" };

import { put, list } from "@vercel/blob";

const CONFIG_KEY = "config/site.json";

async function readJson(pathname) {
  const blobs = await list({ prefix: pathname.split("/")[0] + "/" });
  const found = blobs.blobs.find((b) => b.pathname === pathname);
  if (!found) return null;
  const res = await fetch(found.url, { cache: "no-store" });
  if (!res.ok) return null;
  return await res.json();
}

export default async function handler(req, res) {
  if (req.method === "GET") {
    const current = (await readJson(CONFIG_KEY)) ?? {};
    return res.status(200).json(current);
  }
  if (req.method === "POST") {
    const body = req.body || {};
    await put(CONFIG_KEY, JSON.stringify(body), {
      access: "public",
      contentType: "application/json",
      addRandomSuffix: false
    });
    return res.status(200).json({ ok: true });
  }
  return res.status(405).send("Method Not Allowed");
}
