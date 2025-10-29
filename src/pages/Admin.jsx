// src/pages/Admin.jsx
import { useEffect, useRef, useState } from 'react';
import { fetchConfig, saveConfig, uploadImage } from '../lib/siteConfig';
import { DEFAULT_SITE, loadSite, saveSite } from '../lib/siteStore';

export default function Admin() {
  const [cfg, setCfg] = useState(DEFAULT_SITE);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  // 画像入力用
  const heroPCRef = useRef(null);
  const heroSPRef = useRef(null);
  const bgPCRef   = useRef(null);
  const bgSPRef   = useRef(null);

  useEffect(() => {
    // ローカルの既存値で即表示 → API で上書き
    setCfg(loadSite());
    fetchConfig()
      .then(c => setCfg(prev => ({ ...prev, ...c })))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  async function handleImage(ref, path) {
    const f = ref.current?.files?.[0];
    if (!f) return null;
    const up = await uploadImage(f); // {url}
    return up.url; // そのまま保存
  }

  async function onSave() {
    try {
      setSaving(true);

      const next = structuredClone(cfg);

      // 画像アップロードがあれば反映
      const hp = await handleImage(heroPCRef);
      if (hp) next.hero.desktopImage = hp;

      const hs = await handleImage(heroSPRef);
      if (hs) next.hero.mobileImage = hs;

      const bp = await handleImage(bgPCRef);
      if (bp) next.background.desktopImage = bp;

      const bs = await handleImage(bgSPRef);
      if (bs) next.background.mobileImage = bs;

      // 保存（API & LocalStorage）
      await saveConfig(next);
      saveSite(next);
      setCfg(next);
      alert('保存しました！');
    } catch (e) {
      console.error(e);
      alert('保存に失敗しました…');
    } finally {
      setSaving(false);
    }
  }

  if (loading) return <div style={{ padding: 20 }}>読み込み中…</div>;

  return (
    <main style={{ maxWidth: 860, margin: '20px auto', fontFamily: 'sans-serif' }}>
      <h1 style={{ fontSize: 22, marginBottom: 16 }}>管理画面</h1>

      {/* ヒーロー画像 */}
      <section style={boxStyle}>
        <h2 style={h2}>トップ画像（ヒーロー）</h2>
        <div style={grid2}>
          <div>
            <p>PC用</p>
            <img src={cfg.hero.desktopImage} alt="" style={preview} />
            <input type="file" accept="image/*" ref={heroPCRef} />
          </div>
          <div>
            <p>スマホ用</p>
            <img src={cfg.hero.mobileImage} alt="" style={preview} />
            <input type="file" accept="image/*" ref={heroSPRef} />
          </div>
        </div>
      </section>

      {/* 背景画像 */}
      <section style={boxStyle}>
        <h2 style={h2}>背景画像</h2>
        <div style={grid2}>
          <div>
            <p>PC用</p>
            {cfg.background.desktopImage ? (
              <img src={cfg.background.desktopImage} alt="" style={preview} />
            ) : <div style={placeholder}>未設定</div>}
            <input type="file" accept="image/*" ref={bgPCRef} />
          </div>
          <div>
            <p>スマホ用</p>
            {cfg.background.mobileImage ? (
              <img src={cfg.background.mobileImage} alt="" style={preview} />
            ) : <div style={placeholder}>未設定</div>}
            <input type="file" accept="image/*" ref={bgSPRef} />
          </div>
        </div>
      </section>

      {/* SNS */}
      <section style={boxStyle}>
        <h2 style={h2}>SNSリンク</h2>
        <div style={grid2}>
          <label style={label}>
            Instagram
            <input
              style={input}
              placeholder="https://www.instagram.com/..."
              value={cfg.socials.instagram || ''}
              onChange={e=>setCfg(v=>({...v, socials:{...v.socials, instagram:e.target.value}}))}
            />
          </label>
          <label style={label}>
            X（Twitter）
            <input
              style={input}
              placeholder="https://x.com/..."
              value={cfg.socials.x || ''}
              onChange={e=>setCfg(v=>({...v, socials:{...v.socials, x:e.target.value}}))}
            />
          </label>
          <label style={label}>
            LINE
            <input
              style={input}
              placeholder="https://line.me/..."
              value={cfg.socials.line || ''}
              onChange={e=>setCfg(v=>({...v, socials:{...v.socials, line:e.target.value}}))}
            />
          </label>
          <label style={label}>
            TikTok
            <input
              style={input}
              placeholder="https://www.tiktok.com/@..."
              value={cfg.socials.tiktok || ''}
              onChange={e=>setCfg(v=>({...v, socials:{...v.socials, tiktok:e.target.value}}))}
            />
          </label>
          <label style={label}>
            YouTube
            <input
              style={input}
              placeholder="https://www.youtube.com/..."
              value={cfg.socials.youtube || ''}
              onChange={e=>setCfg(v=>({...v, socials:{...v.socials, youtube:e.target.value}}))}
            />
          </label>
        </div>
      </section>

      {/* Google Map */}
      <section style={boxStyle}>
        <h2 style={h2}>Google マップ</h2>
        <label style={label}>
          埋め込み URL（`<iframe src="...">` の中の URL）
          <input
            style={input}
            placeholder="https://www.google.com/maps/embed?pb=..."
            value={cfg.map.embedSrc || ''}
            onChange={e=>setCfg(v=>({...v, map:{...v.map, embedSrc:e.target.value}}))}
          />
        </label>
        <label style={label}>
          住所（任意）
          <input
            style={input}
            placeholder="東京都〇〇区..."
            value={cfg.map.address || ''}
            onChange={e=>setCfg(v=>({...v, map:{...v.map, address:e.target.value}}))}
          />
        </label>
      </section>

      <div style={{ textAlign:'right', marginTop: 20 }}>
        <button onClick={onSave} disabled={saving} style={saveBtn}>
          {saving ? '保存中…' : '保存'}
        </button>
      </div>
    </main>
  );
}

const boxStyle = {
  background: '#fff',
  borderRadius: 12,
  padding: 16,
  boxShadow: '0 2px 8px rgba(0,0,0,0.05)',
  marginTop: 16
};
const h2 = { fontSize: 18, margin:'4px 0 12px' };
const grid2 = { display:'grid', gridTemplateColumns: '1fr 1fr', gap: 16 };
const preview = { width:'100%', height:180, objectFit:'cover', borderRadius:8, display:'block', background:'#f4f5f6' };
const placeholder = { ...preview, display:'grid', placeItems:'center', color:'#888' };
const label = { display:'grid', gap:6 };
const input = {
  padding:'10px 12px',
  borderRadius:8,
  border:'1px solid #ddd',
  fontSize:16
};
const saveBtn = {
  background:'#111', color:'#fff', border:'none', borderRadius:8,
  padding:'10px 16px', cursor:'pointer'
};
