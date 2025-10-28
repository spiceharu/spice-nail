// /api/bookings.js (list all bookings)
export const config = { runtime: "nodejs" };

import { list } from "@vercel/blob";

const BOOKINGS_KEY = "data/bookings.json";

async function readJson(pathname) {
  const blobs = await list({ prefix: "data/" });
  const found = blobs.blobs.find((b) => b.pathname === pathname);
  if (!found) return [];
  const res = await fetch(found.url, { cache: "no-store" });
  if (!res.ok) return [];
  return await res.json();
}

export default async function handler(req, res) {
  if (req.method !== "GET") return res.status(405).send("Method Not Allowed");
  const rows = await readJson(BOOKINGS_KEY);
  return res.status(200).json({ rows });
}
