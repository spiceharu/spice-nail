// src/lib/siteStore.js
const KEY = "spice-nail-cache-v1";

export const DEFAULT_SITE = {
  hero: { pc: "", sp: "" },
  background: { pc: "", sp: "" },
  banners: [],
  socials: [],
  map: { embedSrc: "", address: "" }
};

export function loadSite() {
  if (typeof window === "undefined") return DEFAULT_SITE;
  try {
    const raw = localStorage.getItem(KEY);
    if (!raw) return DEFAULT_SITE;
    return { ...DEFAULT_SITE, ...JSON.parse(raw) };
  } catch {
    return DEFAULT_SITE;
  }
}

export function saveSite(site) {
  try {
    localStorage.setItem(KEY, JSON.stringify(site));
  } catch {
    // ignore
  }
}
