// src/lib/siteConfig.js
export async function fetchConfig() {
  const res = await fetch("/api/config", { cache: "no-store" });
  if (!res.ok) throw new Error("failed to load config");
  return await res.json();
}

export async function saveConfig(site) {
  const res = await fetch("/api/config", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(site)
  });
  if (!res.ok) throw new Error("failed to save");
  return await res.json();
}

export async function uploadImage(file) {
  const fd = new FormData();
  fd.append("file", file);
  const res = await fetch("/api/upload", {
    method: "POST",
    body: fd
  });
  if (!res.ok) throw new Error("upload failed");
  return await res.json(); // { url }
}

export async function checkPassword(pw) {
  const res = await fetch("/api/pw-check", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ pw })
  });
  if (!res.ok) return false;
  const json = await res.json();
  return !!json.ok;
}
