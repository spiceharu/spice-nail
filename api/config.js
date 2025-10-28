// /api/config.js
export const config = { runtime: "edge" };

import { put, list } from "@vercel/blob";

const CONFIG_KEY = "config/site.json";

async function readConfigFromBlob() {
  // 既存の site.json があればそれを読む
  const blobs = await list({ prefix: CONFIG_KEY });
  const found = blobs.blobs.find(b => b.pathname === CONFIG_KEY);
  if (!found) return null;
  const res = await fetch(found.url, { cache: "no-store" });
  if (!res.ok) return null;
  return await res.json();
}

export default async function handler(req) {
  if (req.method === "GET") {
    const current = (await readConfigFromBlob()) ?? {
      hero: {
        desktopImage: "/images/hero-desktop.png",
        mobileImage: "/images/hero-mobile.png"
      },
      socials: { instagram: "", tiktok: "", x: "", youtube: "" },
      map: { placeName: "", address: "", embedSrc: "" },
      sectionsOrder: ["hero", "banner", "sns", "reservation", "map"]
    };
    return new Response(JSON.stringify(current), {
      status: 200,
      headers: { "Content-Type": "application/json", "Cache-Control": "no-store" }
    });
  }

  if (req.method === "POST") {
    const payload = await req.json();
    const toSave = {
      hero: {
        desktopImage: payload.hero?.desktopImage || "/images/hero-desktop.png",
        mobileImage: payload.hero?.mobileImage || "/images/hero-mobile.png"
      },
      socials: payload.socials || { instagram: "", tiktok: "", x: "", youtube: "" },
      map: payload.map || { placeName: "", address: "", embedSrc: "" },
      sectionsOrder:
        payload.sectionsOrder || ["hero", "banner", "sns", "reservation", "map"]
    };

    await put(CONFIG_KEY, JSON.stringify(toSave), {
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
