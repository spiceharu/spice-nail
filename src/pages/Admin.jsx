import { useEffect, useRef, useState } from "react";
import { fetchConfig, saveConfig } from "../lib/siteConfig";
import { DEFAULT_SITE } from "../lib/siteStore";

export default function Admin() {
  const [cfg, setCfg] = useState(DEFAULT_SITE);
  const [previewD, setPreviewD] = useState("");
  const [previewM, setPreviewM] = useState("");
  const [fileD, setFileD] = useState(null);
  const [fileM, setFileM] = useState(null);
  const [saving, setSaving] = useState(false);
  const inputD = useRef(null);
  const inputM = useRef(null);

  useEffect(() => {
    fetchConfig().then((c) => {
      setCfg(c);
      setPreviewD(c.hero?.desktopImage || "");
      setPreviewM(c.hero?.mobileImage || "");
    });
  }, []);

  const pick =
    (ref) =>
    (e) => {
      e.preventDefault();
      ref.current?.click();
    };

  const onSelect =
    (setterFile, setterPreview) =>
    (e) => {
      const f = e.target.files?.[0];
      if (!f) return;
      setterFile(f);
      setterPreview(URL.createObjectURL(f));
    };

  const onDrop =
    (setterFile, setterPreview) =>
    (e) => {
      e.preventDefault();
      const f = e.dataTransfer.files?.[0];
      if (!f) return;
      setterFile(f);
      setterPreview(URL.createObjectURL(f));
    };

  async function uploadBlob(f) {
    const fd = new FormData();
    fd.append("file", f);
    const up = await fetch("/api/upload", { method: "POST", body: fd });
    if (!up.ok) throw new Error("upload failed");
    const { url } = await up.json();
    return url;
  }

  async function onSave() {
    try {
      setSaving(true);
      let desktop = cfg.hero.desktopImage;
      let mobile = cfg.hero.mobileImage;
      if (fileD) desktop = await uploadBlob(fileD);
      if (fileM) mobile = await uploadBlob(fileM);

      const payload = {
        ...cfg,
        hero: { desktopImage: desktop, mobileImage: mobile }
      };
      await saveConfig(payload);
      alert("保存しました！");
      setFileD(null);
      setFileM(null);
    } catch (e) {
      console.error(e);
      alert("保存に失敗しました");
    } finally {
      setSaving(false);
    }
  }

  function updateSocial(key, val) {
    setCfg((c) => ({ ...c, socials: { ...c.socials, [key]: val } }));
  }
  function updateMap(key, val) {
    setCfg((c) => ({ ...c, map: { ...c.map, [key]: val } }));
  }

  function moveSection(idx, dir) {
    setCfg((c) => {
      const arr = [...(c.sectionsOrder || [])];
      const ni = idx + dir;
      if (ni < 0 || ni >= arr.length) return c;
      [arr[idx], arr[ni]] = [arr[ni], arr[idx]];
      return { ...c, sectionsOrder: arr };
    });
  }

  const allow = (e) => e.preventDefault();

  return (
    <div className="container">
      <h1>管理画面</h1>

      {/* Hero Desktop */}
      <section className="card">
        <h2>トップ画像（PC）</h2>
        <div
          className="pill"
          style={{ display: "inline-flex" }}
          onClick={pick(inputD)}
          onDragOver={allow}
          onDrop={onDrop(setFileD, setPreviewD)}
          title="クリックまたはドラッグ＆ドロップ"
        >
          画像を入れる（PC）
        </div>
        <input ref={inputD} type="file" accept="image/*" hidden onChange={onSelect(setFileD, setPreviewD)} />
        {previewD ? (
          <div style={{ marginTop: 12 }}>
            <img src={previewD} alt="" style={{ width: "100%", maxWidth: 600, borderRadius: 12 }} />
          </div>
        ) : null}
      </section>

      {/* Hero Mobile */}
      <section className="card">
        <h2>トップ画像（スマホ）</h2>
        <div
          className="pill"
          style={{ display: "inline-flex" }}
          onClick={pick(inputM)}
          onDragOver={allow}
          onDrop={onDrop(setFileM, setPreviewM)}
          title="クリックまたはドラッグ＆ドロップ"
        >
          画像を入れる（スマホ）
        </div>
        <input ref={inputM} type="file" accept="image/*" hidden onChange={onSelect(setFileM, setPreviewM)} />
        {previewM ? (
          <div style={{ marginTop: 12 }}>
            <img src={previewM} alt="" style={{ width: 260, height: 260, objectFit: "cover", borderRadius: 12 }} />
          </div>
        ) : null}
      </section>

      {/* SNS */}
      <section className="card">
        <h2>SNSリンク</h2>
        <div className="row">
          {["instagram", "tiktok", "x", "youtube"].map((k) => (
            <div key={k} style={{ flex: "1 1 240px" }}>
              <label className="small">{k.toUpperCase()}</label>
              <input
                className="input"
                placeholder={`https://...`}
                value={cfg.socials?.[k] || ""}
                onChange={(e) => updateSocial(k, e.target.value)}
              />
            </div>
          ))}
        </div>
      </section>

      {/* Map */}
      <section className="card">
        <h2>アクセス（Googleマップ）</h2>
        <div className="row">
          <div>
            <label className="small">店名</label>
            <input
              className="input"
              value={cfg.map?.placeName || ""}
              onChange={(e) => updateMap("placeName", e.target.value)}
            />
          </div>
          <div>
            <label className="small">住所</label>
            <input
              className="input"
              value={cfg.map?.address || ""}
              onChange={(e) => updateMap("address", e.target.value)}
            />
          </div>
        </div>
        <div style={{ marginTop: 8 }}>
          <label className="small">埋め込みURL（iframe の src）</label>
          <input
            className="input"
            placeholder="https://www.google.com/maps/embed?..."
            value={cfg.map?.embedSrc || ""}
            onChange={(e) => updateMap("embedSrc", e.target.value)}
          />
        </div>
      </section>

      {/* 表示順 */}
      <section className="card">
        <h2>表示順</h2>
        <ul className="section-order">
          {(cfg.sectionsOrder || DEFAULT_SITE.sectionsOrder).map((s, i) => (
            <li key={s}>
              <span>{s}</span>
              <span>
                <button className="btn" style={{ marginRight: 6 }} onClick={() => moveSection(i, -1)}>
                  ↑
                </button>
                <button className="btn" onClick={() => moveSection(i, +1)}>
                  ↓
                </button>
              </span>
            </li>
          ))}
        </ul>
        <p className="small">（hero / banner / sns / reservation / map）</p>
      </section>

      <div style={{ marginTop: 16 }}>
        <button className="btn" onClick={onSave} disabled={saving}>
          {saving ? "保存中..." : "保存する"}
        </button>
      </div>
      <div className="small" style={{ marginTop: 6 }}>
        /admin にアクセスできる人だけが編集できます
      </div>
    </div>
  );
}
