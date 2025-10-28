// /api/config.js
export const config = { runtime: "nodejs" };

import { put, list } from "@vercel/blob";

const CONFIG_KEY = "config/site.json";

async function readConfigFromBlob() {
  const blobs = await list({ prefix: "config/" });
  const found = blobs.blobs.find(b => b.pathname === CONFIG_KEY);
  if (!found) return null;
  const res = await fetch(found.url, { cache: "no-store" });
  if (!res.ok) return null;
  return await res.json();
}

export default async function handler(req) {
  if (req.method === "GET") {
    const current = (await readConfigFromBlob()) ?? null;
    // 見つからなくても 200 で空オブジェクト（フロント側で既定値にフォールバック）
    return new Response(JSON.stringify(current ?? {}), {
      status: 200,
      headers: { "Content-Type": "application/json", "Cache-Control": "no-store" }
    });
  }

  if (req.method === "POST") {
    const body = await req.json();
    await put(CONFIG_KEY, JSON.stringify(body), {
      access: "public",
      contentType: "application/json",
      addRandomSuffix: false
    });
    return new Response(JSON.stringify({ ok: true }), {
      status: 200,
      headers: { "Content-Type": "application/json" }
    });
  }

  return new Response("Method Not Allowed", { status: 405 });
}
