// src/lib/siteStore.js
const KEY = "site_v3";

// 既定値（ない項目はここで埋まる）
export const DEFAULT_SITE = {
  hero: {
    desktopImage: "/images/hero-desktop.png",
    mobileImage: "/images/hero-mobile.png",
  },
  background: {
    desktopImage: "",
    mobileImage: "",
  },
  socials: {
    instagram: "",
    x: "",
    line: "",
    tiktok: "",
    youtube: ""
  },
  map: {
    embedSrc: "",   // Google Maps の埋め込み URL
    address: ""
  },
  sectionsOrder: ["hero", "sns", "reservation", "map"]
};

// LocalStorage 保管（APIが動かない時の簡易バックアップ）
export function loadSite() {
  try {
    const raw = localStorage.getItem(KEY);
    if (!raw) return DEFAULT_SITE;
    return { ...DEFAULT_SITE, ...JSON.parse(raw) };
  } catch {
    return DEFAULT_SITE;
  }
}

export function saveSite(site) {
  localStorage.setItem(KEY, JSON.stringify(site));
}
