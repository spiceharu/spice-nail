// /api/book.js  (create a booking)
export const config = { runtime: "nodejs" };

import { put, list } from "@vercel/blob";

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
  if (req.method !== "POST") return res.status(405).send("Method Not Allowed");

  const body = req.body || {};
  const { date, time, name, contact, note } = body;
  if (!date || !time || !name || !contact) {
    return res.status(400).json({ error: "missing fields" });
  }

  const rows = await readJson(BOOKINGS_KEY);
  const entry = {
    id: Date.now().toString(36),
    date,
    time,
    name,
    contact,
    note: note || "",
    createdAt: new Date().toISOString()
  };
  rows.push(entry);

  await put(BOOKINGS_KEY, JSON.stringify(rows), {
    access: "public",
    contentType: "application/json",
    addRandomSuffix: false
  });

  return res.status(200).json({ ok: true, entry });
}
