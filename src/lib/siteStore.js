const KEY = 'site@v2';

export const DEFAULT_SITE = {
  heroUrl: '/images/hero-desktop.png',    // ← ここがトップ画像（無い時の予備）
  socials: { youtube: '', instagram: '', tiktok: '', x: '' },
  map: { embedSrc: '', placeName: '', address: '' },
  menus: [],
};

export function loadSite() {
  try {
    const raw = localStorage.getItem(KEY);
    return raw ? { ...DEFAULT_SITE, ...JSON.parse(raw) } : DEFAULT_SITE;
  } catch {
    return DEFAULT_SITE;
  }
}

export function saveSite(site) {
  localStorage.setItem(KEY, JSON.stringify(site));
}
