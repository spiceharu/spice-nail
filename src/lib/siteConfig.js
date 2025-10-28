// /src/lib/siteConfig.js
export const DEFAULT_SITE = {
  backgroundImage: "", // ここに背景画像URL（未設定なら無地）
  hero: {
    desktopImage: "/images/hero-desktop.png",
    mobileImage: "/images/hero-mobile.png"
  },
  socials: {
    youtube: "",
    tiktok: "",
    instagram: "",
    x: ""
  },
  map: { placeName: "", address: "", embedSrc: "" },
  sectionsOrder: ["hero", "sns", "reservation", "map"]
};

export async function fetchConfigSafe() {
  try {
    const res = await fetch("/api/config", { cache: "no-store" });
    if (!res.ok) throw new Error(`GET /api/config ${res.status}`);
    const json = await res.json();
    return { ...DEFAULT_SITE, ...json };
  } catch (e) {
    console.error("[fetchConfigSafe] fallback:", e?.message || e);
    return DEFAULT_SITE;
  }
}

export async function saveConfigSafe(next) {
  const res = await fetch("/api/config", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(next)
  });
  if (!res.ok) throw new Error(`POST /api/config ${res.status}`);
  return res.json();
}
