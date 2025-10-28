// /src/pages/Admin.jsx
import { useEffect, useRef, useState } from "react";
import { fetchConfigSafe, saveConfigSafe } from "../lib/siteConfig";

export default function Admin() {
  const [cfg, setCfg] = useState(null);
  const [saving, setSaving] = useState(false);

  const [filePc, setFilePc] = useState(null);
  const [fileSp, setFileSp] = useState(null);
  const [previewPc, setPreviewPc] = useState("");
  const [previewSp, setPreviewSp] = useState("");

  const pcInput = useRef(null);
  const spInput = useRef(null);

  useEffect(() => {
    (async () => {
      const c = await fetchConfigSafe();
      setCfg(c);
      setPreviewPc(c.hero?.desktopImage || "");
      setPreviewSp(c.hero?.mobileImage || "");
    })();
  }, []);

  const onSelectPc = (e) => {
    const f = e.target.files?.[0];
    if (!f) return;
    setFilePc(f);
    setPreviewPc(URL.createObjectURL(f));
  };
  const onSelectSp = (e) => {
    const f = e.target.files?.[0];
    if (!f) return;
    setFileSp(f);
    setPreviewSp(URL.createObjectURL(f));
  };

  const allowDrop = (e) => e.preventDefault();
  const onDropPc = (e) => {
    e.preventDefault();
    const f = e.dataTransfer.files?.[0];
    if (!f) return;
    setFilePc(f);
    setPreviewPc(URL.createObjectURL(f));
  };
  const onDropSp = (e) => {
    e.preventDefault();
    const f = e.dataTransfer.files?.[0];
    if (!f) return;
    setFileSp(f);
    setPreviewSp(URL.createObjectURL(f));
  };

  async function upload(file) {
    const fd = new FormData();
    fd.append("file", file);
    const up = await fetch("/api/upload", { method: "POST", body: fd });
    const j = await up.json();
    if (!up.ok) throw new Error(j.error || "upload failed");
    return j.url;
  }

  async function onSave() {
    if (!cfg) return;
    setSaving(true);
    try {
      let desktop = cfg.hero?.desktopImage || "";
      let mobile = cfg.hero?.mobileImage || "";
      if (filePc) desktop = await upload(filePc);
      if (fileSp) mobile = await upload(fileSp);

      const next = {
        ...cfg,
        hero: { ...(cfg.hero || {}), desktopImage: desktop, mobileImage: mobile }
      };
      await saveConfigSafe(next);
      setCfg(next);
      alert("保存しました！");
    } catch (e) {
      console.error(e);
      alert("保存に失敗しました。");
    } finally {
      setSaving(false);
    }
  }

  if (!cfg)
    return (
      <main>
        <div className="card">読み込み中…</div>
      </main>
    );

  return (
    <main>
      <h1 className="card" style={{ fontSize: 20, fontWeight: 700 }}>
        管理画面
      </h1>

      <section className="card">
        <h2>トップ画像（PC / スマホ）</h2>
        <div className="row">
          <div className="col">
            <div
              className="drop"
              onDragOver={allowDrop}
              onDrop={onDropPc}
              onClick={() => pcInput.current?.click()}
            >
              PC用：ここに画像をドラッグ＆ドロップ / クリックして選択
            </div>
            <input
              ref={pcInput}
              type="file"
              accept="image/*"
              style={{ display: "none" }}
              onChange={onSelectPc}
            />
            {previewPc && <img src={previewPc} className="thumb" alt="pc" />}
          </div>

          <div className="col">
            <div
              className="drop"
              onDragOver={allowDrop}
              onDrop={onDropSp}
              onClick={() => spInput.current?.click()}
            >
              スマホ用：ここに画像をドラッグ＆ドロップ / クリックして選択
            </div>
            <input
              ref={spInput}
              type="file"
              accept="image/*"
              style={{ display: "none" }}
              onChange={onSelectSp}
            />
            {previewSp && <img src={previewSp} className="thumb" alt="sp" />}
          </div>
        </div>

        <div style={{ marginTop: 16 }}>
          <button className="btn" onClick={onSave} disabled={saving}>
            {saving ? "保存中…" : "保存する"}
          </button>
        </div>
      </section>

      <footer>© Spice Nail</footer>
    </main>
  );
}
