const KEY = "site_v2";
export const DEFAULT_SITE = {
  hero: {
    desktopImage: "",       // ロゴ入り大画像（PC）
    mobileImage: "",        // ロゴ入り大画像（スマホ）
    videoUrl: "",           // 動画にしたい場合（mp4/webm）
    bannersDesktop: [],     // 3:1 横長画像（PC）
    bannersMobile: [],      // 3:1 横長画像（SP）
    scrollSpeed: 6
  },
  socials: { youtube: "", instagram: "", tiktok: "", x: "" },
  map: { embedSrc: "", placeName: "", address: "" },
  menus: [{ name: "ワンカラー", minutes: 60, price: 5500 }],
  sectionsOrder: ["hero","banner","sns","reservation","map"]
};

export function loadSite(){
  try{
    const raw = localStorage.getItem(KEY);
    return { ...DEFAULT_SITE, ...(raw ? JSON.parse(raw) : {}) };
  }catch{ return DEFAULT_SITE; }
}
export function saveSite(site){ localStorage.setItem(KEY, JSON.stringify(site)); }
