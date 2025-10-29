// src/lib/siteConfig.js
// 設定の取得/保存（/api/config）
// 画像アップロード（/api/upload）

export async function fetchConfig() {
  const res = await fetch('/api/config', { cache: 'no-store' });
  if (!res.ok) throw new Error('failed to load config');
  return res.json();
}

export async function saveConfig(partial) {
  const res = await fetch('/api/config', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(partial),
  });
  if (!res.ok) throw new Error('failed to save config');
  return res.json();
}

export async function uploadImage(file) {
  const fd = new FormData();
  fd.append('file', file);
  const up = await fetch('/api/upload', { method: 'POST', body: fd });
  if (!up.ok) throw new Error('upload failed');
  return up.json(); // { url }
}
