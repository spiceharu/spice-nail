// /src/lib/siteConfig.js
export const DEFAULT_SITE = {
  hero: {
    desktopImage: "/images/hero-desktop.png",
    mobileImage: "/images/hero-mobile.png",
    videoUrl: ""
  },
  bannersDesktop: [],
  bannersMobile: [],
  socials: { youtube: "", instagram: "", tiktok: "", x: "" },
  map: { embedSrc: "", placeName: "", address: "" },
  sectionsOrder: ["hero", "sns", "reservation", "map"],
  scrollSpeed: 6
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

export async function saveConfigSafe(partial) {
  const res = await fetch("/api/config", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(partial)
  });
  if (!res.ok) throw new Error(`POST /api/config ${res.status}`);
  return res.json();
}
