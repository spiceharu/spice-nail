// /src/lib/siteConfig.js
export async function fetchConfig() {
  const res = await fetch('/api/config', { cache: 'no-store' });
  if (!res.ok) throw new Error('failed to load config');
  return await res.json();
}

export async function saveConfig(partial) {
  const res = await fetch('/api/config', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(partial),
  });
  if (!res.ok) throw new Error('failed to save config');
  return await res.json();
}
