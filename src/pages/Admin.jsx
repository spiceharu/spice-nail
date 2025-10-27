import { useEffect, useRef, useState } from 'react';
import { fetchConfig, saveConfig } from '../lib/siteConfig.js';

export default function Admin() {
  const [cfg, setCfg] = useState(null);
  const [preview, setPreview] = useState('');
  const [saving, setSaving] = useState(false);
  const inputRef = useRef(null);
  const fileRef = useRef(null);

  useEffect(() => {
    fetchConfig().then(setCfg).catch(() => setCfg({}));
  }, []);

  function onSelectFile(e) {
    const f = e.target.files?.[0];
    if (!f) return;
    fileRef.current = f;
    setPreview(URL.createObjectURL(f));
  }

  function onDrop(e) {
    e.preventDefault();
    const f = e.dataTransfer.files?.[0];
    if (!f) return;
    fileRef.current = f;
    setPreview(URL.createObjectURL(f));
  }
  function allowDrop(e) { e.preventDefault(); }

  async function onSave() {
    try {
      setSaving(true);
      let heroUrl = cfg?.heroUrl || '';

      const f = fileRef.current;
      if (f) {
        // 画像アップロード
        const fd = new FormData();
        fd.append('file', f);
        const up = await fetch('/api/upload', { method: 'POST', body: fd });
        const payload = await up.json();
        if (!up.ok) throw new Error(payload.error || 'upload failed');
        heroUrl = payload.url;
      }

      await saveConfig({ heroUrl });
      setCfg((c) => ({ ...(c || {}), heroUrl }));
      alert('保存しました！');
    } catch (err) {
      console.error(err);
      alert('保存に失敗しました…');
    } finally {
      setSaving(false);
    }
  }

  if (!cfg) return <div style={{ padding: 20 }}>読み込み中…</div>;

  return (
    <div className="container">
      <h1>管理画面</h1>

      <section style={{ marginTop: 24 }} className="card">
        <h2>トップ画像</h2>

        <div
          onDragOver={allowDrop}
          onDrop={onDrop}
          onClick={() => inputRef.current?.click()}
          style={{
            border: '2px dashed #aaa',
            borderRadius: 12,
            padding: 24,
            textAlign: 'center',
            cursor: 'pointer',
            background: '#fafafa',
          }}
        >
          <p style={{ margin: 0 }}>
            ここに <b>画像ファイル</b> をドラッグ＆ドロップ（またはクリックで選択）
          </p>
          <p style={{ color: '#666' }}>
            対応: png / jpg / jpeg / webp ／ 推奨サイズ 1800×1800 以上
          </p>
          <input
            type="file"
            accept="image/*"
            ref={inputRef}
            onChange={onSelectFile}
            style={{ display: 'none' }}
          />
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16, marginTop: 16 }}>
          <div className="card" style={{ border: '1px solid #eee' }}>
            <div style={{ fontWeight: 600, marginBottom: 8 }}>現在の画像</div>
            <img
              src={cfg.heroUrl || '/images/hero-desktop.png'}
              alt="current"
              style={{ width: '100%', height: 240, objectFit: 'cover', borderRadius: 12 }}
            />
          </div>
          <div className="card" style={{ border: '1px solid #eee' }}>
            <div style={{ fontWeight: 600, marginBottom: 8 }}>プレビュー</div>
            {preview ? (
              <img
                src={preview}
                alt="preview"
                style={{ width: '100%', height: 240, objectFit: 'cover', borderRadius: 12 }}
              />
            ) : (
              <div style={{ color: '#888' }}>未選択</div>
            )}
          </div>
        </div>

        <div style={{ marginTop: 16 }}>
          <button
            onClick={onSave}
            disabled={saving}
            style={{
              padding: '10px 20px',
              borderRadius: 8,
              border: 'none',
              background: saving ? '#bbb' : '#111',
              color: '#fff',
              cursor: saving ? 'not-allowed' : 'pointer',
            }}
          >
            {saving ? '保存中…' : '保存する'}
          </button>
        </div>
      </section>
    </div>
  );
}
