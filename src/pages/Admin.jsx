// src/pages/Admin.jsx
import { useEffect, useRef, useState } from 'react';
import { fetchConfig, saveConfig } from '../lib/siteConfig';

export default function Admin() {
  const [cfg, setCfg] = useState(null);
  const [file, setFile] = useState(null);
  const [preview, setPreview] = useState('');
  const [saving, setSaving] = useState(false);
  const inputRef = useRef(null);

  useEffect(() => {
    fetchConfig().then(c => {
      setCfg(c);
      setPreview(c.heroUrl || '');
    }).catch(console.error);
  }, []);

  function onSelectFile(e) {
    const f = e.target.files?.[0];
    if (!f) return;
    setFile(f);
    setPreview(URL.createObjectURL(f));
  }

  function onDrop(e) {
    e.preventDefault();
    const f = e.dataTransfer.files?.[0];
    if (!f) return;
    setFile(f);
    setPreview(URL.createObjectURL(f));
  }

  const allowDrop = (e) => e.preventDefault();

  async function onSave() {
    try {
      setSaving(true);

      let heroUrl = cfg?.heroUrl || '';

      if (file) {
        // ここでアップロード
        const fd = new FormData();
        fd.append('file', file);
        const up = await fetch('/api/upload', { method: 'POST', body: fd });
        const payload = await up.json();
        if (!up.ok) throw new Error(payload.error || 'upload failed');
        heroUrl = payload.url;
      }

      await saveConfig({ heroUrl });
      setCfg({ ...cfg, heroUrl });
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
    <div style={{ padding: 20, maxWidth: 720, margin: '0 auto' }}>
      <h1>管理画面</h1>

      <section style={{ marginTop: 24 }}>
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
            background: '#fafafa'
          }}
        >
          <p style={{ margin: 0 }}>
            ここに画像をドラッグ＆ドロップ、またはクリックして選択
          </p>
          <input
            ref={inputRef}
            type="file"
            accept="image/*"
            onChange={onSelectFile}
            style={{ display: 'none' }}
          />
        </div>

        {preview && (
          <div style={{ marginTop: 16 }}>
            <p style={{ margin: '8px 0' }}>プレビュー</p>
            <img
              src={preview}
              alt="preview"
              style={{ width: '100%', height: 320, objectFit: 'cover', borderRadius: 12 }}
            />
          </div>
        )}

        <button
          onClick={onSave}
          disabled={saving}
          style={{
            marginTop: 16,
            padding: '10px 18px',
            borderRadius: 8,
            border: '1px solid #ddd',
            background: saving ? '#eee' : '#111',
            color: saving ? '#555' : '#fff',
            cursor: saving ? 'not-allowed' : 'pointer'
          }}
        >
          {saving ? '保存中…' : '保存'}
        </button>

        <div style={{ marginTop: 12, fontSize: 14 }}>
          現在のURL: <a href={cfg.heroUrl} target="_blank" rel="noreferrer">{cfg.heroUrl}</a>
        </div>
      </section>
    </div>
  );
}
