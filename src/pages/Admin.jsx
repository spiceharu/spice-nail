// src/pages/Admin.jsx
import React, { useEffect, useRef, useState } from "react";
import {
  fetchConfig,
  saveConfig,
  uploadImage,
  checkPassword
} from "../lib/siteConfig.js";
import { DEFAULT_SITE, saveSite } from "../lib/siteStore.js";

export default function Admin() {
  const [authed, setAuthed] = useState(false);
  const [pw, setPw] = useState("");
  const [tab, setTab] = useState("images");
  const [site, setSite] = useState(DEFAULT_SITE);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  // 画像input refs
  const heroPcRef = useRef(null);
  const heroSpRef = useRef(null);
  const bgPcRef = useRef(null);
  const bgSpRef = useRef(null);
  const bannerRefs = useRef([]); // 動的に使う

  // ログイン済みならセッションから復元
  useEffect(() => {
    if (sessionStorage.getItem("admin_ok") === "1") {
      setAuthed(true);
    }
  }, []);

  // 認証後に設定読み込み
  useEffect(() => {
    if (!authed) return;
    fetchConfig()
      .then((data) => {
        // 空を埋める
        const merged = {
          hero: { pc: "", sp: "", ...(data.hero || {}) },
          background: { pc: "", sp: "", ...(data.background || {}) },
          banners: data.banners || [],
          socials: data.socials || [],
          map: data.map || { embedSrc: "", address: "" }
        };
        setSite(merged);
        saveSite(merged);
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, [authed]);

  async function handleLogin(e) {
    e.preventDefault();
    const ok = await checkPassword(pw);
    if (!ok) {
      alert("パスワードが違います");
      return;
    }
    sessionStorage.setItem("admin_ok", "1");
    setAuthed(true);
  }

  async function handleSave() {
    try {
      setSaving(true);

      // まず現在のsiteをコピー
      const next = structuredClone(site);

      // 各画像inputにファイルがあればアップロード
      async function maybeUpload(ref, assign) {
        const f = ref.current?.files?.[0];
        if (!f) return;
        const up = await uploadImage(f);
        assign(up.url);
      }

      await maybeUpload(heroPcRef, (url) => (next.hero.pc = url));
      await maybeUpload(heroSpRef, (url) => (next.hero.sp = url));
      await maybeUpload(bgPcRef, (url) => (next.background.pc = url));
      await maybeUpload(bgSpRef, (url) => (next.background.sp = url));

      // バナーは複数
      const newBanners = [...(next.banners || [])];
      for (let i = 0; i < (bannerRefs.current?.length || 0); i++) {
        const f = bannerRefs.current[i]?.files?.[0];
        if (!f) continue;
        const up = await uploadImage(f);
        newBanners[i] = up.url;
      }
      next.banners = newBanners;

      // サーバーに保存
      await saveConfig(next);

      // ローカルにもキャッシュ
      saveSite(next);
      setSite(next);
      alert("保存しました！");
    } catch (e) {
      console.error(e);
      alert("保存に失敗しました…");
    } finally {
      setSaving(false);
    }
  }

  function addBannerSlot() {
    setSite((prev) => ({
      ...prev,
      banners: [...(prev.banners || []), ""]
    }));
  }

  function updateSocial(i, key, val) {
    setSite((prev) => {
      const arr = [...(prev.socials || [])];
      arr[i] = { ...(arr[i] || {}), [key]: val };
      return { ...prev, socials: arr };
    });
  }

  function addSocial() {
    setSite((prev) => ({
      ...prev,
      socials: [...(prev.socials || []), { name: "", url: "" }]
    }));
  }

  function deleteSocial(i) {
    setSite((prev) => {
      const arr = [...(prev.socials || [])];
      arr.splice(i, 1);
      return { ...prev, socials: arr };
    });
  }

  if (!authed) {
    return (
      <div className="login-box">
        <h2>管理画面ログイン</h2>
        <p style={{ fontSize: 12, color: "#888", marginBottom: 16 }}>
          環境変数 ADMIN_PASSWORD か、なければ「5793」
        </p>
        <form onSubmit={handleLogin}>
          <input
            type="password"
            value={pw}
            onChange={(e) => setPw(e.target.value)}
            placeholder="パスワード"
            style={{
              width: "100%",
              padding: 10,
              borderRadius: 8,
              border: "1px solid #ddd",
              marginBottom: 12
            }}
          />
          <button className="button" style={{ width: "100%" }}>
            ログイン
          </button>
        </form>
      </div>
    );
  }

  if (loading) return <div className="app-shell">読み込み中…</div>;

  return (
    <div className="app-shell admin-wrap">
      <h1>管理画面</h1>

      {/* タブ */}
      <div style={{ display: "flex", gap: 8, marginBottom: 16 }}>
        <button
          className="button"
          style={{ background: tab === "images" ? "#111" : "#ccc" }}
          onClick={() => setTab("images")}
        >
          画像設定
        </button>
        <button
          className="button"
          style={{ background: tab === "sns" ? "#111" : "#ccc" }}
          onClick={() => setTab("sns")}
        >
          SNS設定
        </button>
        <button
          className="button"
          style={{ background: tab === "map" ? "#111" : "#ccc" }}
          onClick={() => setTab("map")}
        >
          マップ
        </button>
      </div>

      {/* 画像タブ */}
      {tab === "images" && (
        <>
          <div className="card">
            <h2>トップ画像（PC）</h2>
            <p style={{ fontSize: 12, color: "#888" }}>
              推奨サイズ：1800 × 800px / 横長
            </p>
            {site.hero?.pc ? (
              <img
                src={site.hero.pc}
                style={{ width: "100%", maxWidth: 380, borderRadius: 12, marginBottom: 8 }}
              />
            ) : null}
            <input type="file" accept="image/*" ref={heroPcRef} />
          </div>

          <div className="card">
            <h2>トップ画像（スマホ）</h2>
            <p style={{ fontSize: 12, color: "#888" }}>
              推奨サイズ：1000 × 1000px / 正方形〜少し縦長
            </p>
            {site.hero?.sp ? (
              <img
                src={site.hero.sp}
                style={{ width: "100%", maxWidth: 380, borderRadius: 12, marginBottom: 8 }}
              />
            ) : null}
            <input type="file" accept="image/*" ref={heroSpRef} />
          </div>

          <div className="card">
            <h2>背景画像（PC）</h2>
            <p style={{ fontSize: 12, color: "#888" }}>
              推奨サイズ：1920 × 1080px / 大きめ横長
            </p>
            {site.background?.pc ? (
              <img
                src={site.background.pc}
                style={{ width: "100%", maxWidth: 380, borderRadius: 12, marginBottom: 8 }}
              />
            ) : null}
            <input type="file" accept="image/*" ref={bgPcRef} />
          </div>

          <div className="card">
            <h2>背景画像（スマホ）</h2>
            <p style={{ fontSize: 12, color: "#888" }}>
              推奨サイズ：1080 × 1920px / 縦長
            </p>
            {site.background?.sp ? (
              <img
                src={site.background.sp}
                style={{ width: "100%", maxWidth: 380, borderRadius: 12, marginBottom: 8 }}
              />
            ) : null}
            <input type="file" accept="image/*" ref={bgSpRef} />
          </div>

          <div className="card">
            <h2>スライドバナー</h2>
            <p style={{ fontSize: 12, color: "#888" }}>
              推奨サイズ：1200 × 400px / 3:1
            </p>
            {(site.banners || []).map((b, i) => (
              <div key={i} style={{ marginBottom: 10 }}>
                {b ? (
                  <img
                    src={b}
                    style={{ width: "100%", maxWidth: 380, borderRadius: 12, marginBottom: 6 }}
                  />
                ) : null}
                <input
                  type="file"
                  accept="image/*"
                  ref={(el) => (bannerRefs.current[i] = el)}
                />
              </div>
            ))}
            <button className="button" onClick={addBannerSlot}>
              ＋ バナーを追加
            </button>
          </div>
        </>
      )}

      {/* SNSタブ */}
      {tab === "sns" && (
        <div className="card">
          <h2>SNSリンク</h2>
          {(site.socials || []).map((s, i) => (
            <div
              key={i}
              style={{ display: "flex", gap: 8, marginBottom: 8, alignItems: "center" }}
            >
              <input
                value={s.name}
                onChange={(e) => updateSocial(i, "name", e.target.value)}
                placeholder="Instagram"
                style={{ flex: "0 0 140px", padding: 8, borderRadius: 8, border: "1px solid #ddd" }}
              />
              <input
                value={s.url}
                onChange={(e) => updateSocial(i, "url", e.target.value)}
                placeholder="https://..."
                style={{ flex: 1, padding: 8, borderRadius: 8, border: "1px solid #ddd" }}
              />
              <button className="button" onClick={() => deleteSocial(i)}>
                削除
              </button>
            </div>
          ))}
          <button className="button" onClick={addSocial}>
            ＋ SNSを追加
          </button>
        </div>
      )}

      {/* マップタブ */}
      {tab === "map" && (
        <div className="card">
          <h2>Googleマップ</h2>
          <div className="input-row">
            <label>埋め込みURL（iframeのsrcだけ）</label>
            <input
              value={site.map?.embedSrc || ""}
              onChange={(e) =>
                setSite((prev) => ({
                  ...prev,
                  map: { ...(prev.map || {}), embedSrc: e.target.value }
                }))
              }
              placeholder="https://www.google.com/maps/embed?..."
            />
          </div>
          <div className="input-row">
            <label>住所テキスト</label>
            <input
              value={site.map?.address || ""}
              onChange={(e) =>
                setSite((prev) => ({
                  ...prev,
                  map: { ...(prev.map || {}), address: e.target.value }
                }))
              }
              placeholder="千葉県〇〇市…"
            />
          </div>
        </div>
      )}

      <div style={{ textAlign: "right", marginTop: 16, marginBottom: 50 }}>
        <button className="button" onClick={handleSave} disabled={saving}>
          {saving ? "保存中…" : "保存する"}
        </button>
      </div>
    </div>
  );
}
