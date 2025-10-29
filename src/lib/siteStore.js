// 簡易キャッシュ（失敗時のフォールバック）
const KEY = 'site_v2';

export const DEFAULT_SITE = {
  hero: { desktopImage: '', mobileImage: '' },
  background: { desktopImage: '', mobileImage: '' },
  socials: { instagram: '', x: '', line: '', tiktok: '', youtube: '' },
  map: { embedSrc: '', address: '' }
};

export function loadSite() {
  try {
    const raw = localStorage.getItem(KEY);
    if (!raw) return DEFAULT_SITE;
    const json = JSON.parse(raw);
    return { ...DEFAULT_SITE, ...json };
  } catch { return DEFAULT_SITE; }
}

export function saveSite(site) {
  try { localStorage.setItem(KEY, JSON.stringify(site)); } catch {}
}
