import { useEffect, useRef, useState } from 'react';
import { fetchConfig, saveConfig, uploadImage, checkPw } from '../lib/siteConfig';
import { DEFAULT_SITE, loadSite, saveSite } from '../lib/siteStore';

export default function Admin() {
  const [authed, setAuthed] = useState(false);
  const [pw, setPw] = useState('');
  const [cfg, setCfg] = useState(DEFAULT_SITE);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const heroPCRef = useRef(null);
  const heroSPRef = useRef(null);
  const bgPCRef = useRef(null);
  const bgSPRef = useRef(null);

  // 既に通過していれば復元
  useEffect(() => {
    if (sessionStorage.getItem('admin_ok') === '1') setAuthed(true);
  }, []);

  // 認証後に設定を読込
  useEffect(() => {
    if (!authed) return;
    (async () => {
      try {
        setCfg(loadSite());
        const c = await fetchConfig();
        setCfg(prev => ({ ...prev, ...c }));
      } catch {}
      setLoading(false);
    })();
  }, [authed]);

  async function onLogin(e) {
    e.preventDefault();
    const ok = await checkPw(pw);
    if (ok) {
      sessionStorage.setItem('admin_ok', '1');
      setAuthed(true);
    } else {
      alert('パスワードが違います');
    }
  }

  async function handleImage(ref) {
    const f = ref.current?.files?.[0];
    if (!f) return null;
    const up = await uploadImage(f);
    return up.url;
  }

  async function onSave() {
    try {
      setSaving(true);
      const next = structuredClone(cfg);

      const hp = await handleImage(heroPCRef); if (hp) next.hero.desktopImage = hp;
      const hs = await handleImage(heroSPRef); if (hs) next.hero.mobileImage = hs;
      const bp = await handleImage(bgPCRef);  if (bp) next.background.desktopImage = bp;
      const bs = await handleImage(bgSPRef);  if (bs) next.background.mobileImage = bs;

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

  // 未認証：ログイン
  if (!authed) {
    return (
      <main className="container">
        <div className="card">
          <h1 style={{ marginBottom: 12 }}>管理画面ログイン</h1>
          <form onSubmit={onLogin}>
            <input
              type="password"
              placeholder="パスワード"
              value={pw}
              onChange={(e)=>setPw(e.target.value)}
            />
            <div style={{ marginTop: 12 }}>
              <button type="submit">ログイン</button>
            </div>
          </form>
        </div>
      </main>
    );
  }

  // 読み込み中
  if (loading) return <div className="container">読み込み中…</div>;

  return (
    <main className="container">
      <h1 style={{ marginBottom: 12 }}>管理画面</h1>

      {/* ヒーロー */}
      <section className="card">
        <h2>トップ画像（ヒーロー）</h2>
        <div className="grid2">
          <div>
            <p>PC用</p>
            {cfg.hero.desktopImage ? <img src={cfg.hero.desktopImage} className="preview" /> : <div className="placeholder">未設定</div>}
            <input type="file" accept="image/*" ref={heroPCRef} />
          </div>
          <div>
            <p>スマホ用</p>
            {cfg.hero.mobileImage ? <img src={cfg.hero.mobileImage} className="preview" /> : <div className="placeholder">未設定</div>}
            <input type="file" accept="image/*" ref={heroSPRef} />
          </div>
        </div>
      </section>

      {/* 背景 */}
      <section className="card">
        <h2>背景画像</h2>
        <div className="grid2">
          <div>
            <p>PC用</p>
            {cfg.background.desktopImage ? <img src={cfg.background.desktopImage} className="preview" /> : <div className="placeholder">未設定</div>}
            <input type="file" accept="image/*" ref={bgPCRef} />
          </div>
          <div>
            <p>スマホ用</p>
            {cfg.background.mobileImage ? <img src={cfg.background.mobileImage} className="preview" /> : <div className="placeholder">未設定</div>}
            <input type="file" accept="image/*" ref={bgSPRef} />
          </div>
        </div>
      </section>

      {/* SNS */}
      <section className="card">
        <h2>SNSリンク</h2>
        <div className="grid2">
          {['instagram','x','line','tiktok','youtube'].map(k=>(
            <label key={k} style={{ display:'grid', gap:6 }}>
              {k==='x' ? 'X（Twitter）' : k.charAt(0).toUpperCase()+k.slice(1)}
              <input
                type="text"
                placeholder={`https://${k}.com/...`}
                value={cfg.socials[k] || ''}
                onChange={(e)=>setCfg(v=>({ ...v, socials: { ...v.socials, [k]: e.target.value } }))}
              />
            </label>
          ))}
        </div>
      </section>

      {/* Google Map */}
      <section className="card">
        <h2>Googleマップ</h2>
        <label style={{ display:'grid', gap:6, marginBottom:12 }}>
          埋め込みURL（iframe の src）
          <input
            type="text"
            placeholder="https://www.google.com/maps/embed?pb=..."
            value={cfg.map.embedSrc || ''}
            onChange={(e)=>setCfg(v=>({ ...v, map: { ...v.map, embedSrc: e.target.value } }))}
          />
        </label>
        <label style={{ display:'grid', gap:6 }}>
          住所（任意）
          <input
            type="text"
            placeholder="東京都〇〇区…"
            value={cfg.map.address || ''}
            onChange={(e)=>setCfg(v=>({ ...v, map: { ...v.map, address: e.target.value } }))}
          />
        </label>
      </section>

      <div style={{ textAlign:'right', marginTop: 16 }}>
        <button onClick={onSave} disabled={saving}>{saving ? '保存中…' : '保存'}</button>
      </div>
    </main>
  );
}
