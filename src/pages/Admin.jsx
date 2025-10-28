// /src/pages/Admin.jsx
import { useEffect, useRef, useState } from "react";
import { fetchConfigSafe, saveConfigSafe, DEFAULT_SITE } from "../lib/siteConfig";

async function checkAuth() {
  const r = await fetch("/api/me");
  const j = await r.json();
  return !!j.authed;
}
async function login(password) {
  const r = await fetch("/api/login", {
    method: "POST",
    headers: { "Content-Type":"application/json" },
    body: JSON.stringify({ password })
  });
  return r.ok;
}
async function logout() {
  await fetch("/api/logout",{ method:"POST" });
  location.reload();
}

async function upload(file) {
  const fd = new FormData();
  fd.append("file", file);
  const up = await fetch("/api/upload", { method: "POST", body: fd });
  const j = await up.json();
  if (!up.ok) throw new Error(j.error || "upload failed");
  return j.url;
}

export default function Admin() {
  const [authed, setAuthed] = useState(false);
  const [pw, setPw] = useState("");

  const [cfg, setCfg] = useState(DEFAULT_SITE);
  const [saving, setSaving] = useState(false);

  // 画像（トップPC/スマホ/背景）
  const [prevPc, setPrevPc] = useState("");
  const [prevSp, setPrevSp] = useState("");
  const [prevBg, setPrevBg] = useState("");
  const filePc = useRef(null);
  const fileSp = useRef(null);
  const fileBg = useRef(null);
  const [selPc, setSelPc] = useState(null);
  const [selSp, setSelSp] = useState(null);
  const [selBg, setSelBg] = useState(null);

  // SNS
  const [sns, setSns] = useState(DEFAULT_SITE.socials);

  // MAP
  const [map, setMap] = useState(DEFAULT_SITE.map);

  // sections
  const [sections, setSections] = useState(DEFAULT_SITE.sectionsOrder);

  useEffect(() => {
    (async () => {
      const ok = await checkAuth();
      setAuthed(ok);
      if (ok) {
        const c = await fetchConfigSafe();
        setCfg(c);
        setPrevPc(c.hero?.desktopImage || "");
        setPrevSp(c.hero?.mobileImage || "");
        setPrevBg(c.backgroundImage || "");
        setSns(c.socials || DEFAULT_SITE.socials);
        setMap(c.map || DEFAULT_SITE.map);
        setSections(c.sectionsOrder || DEFAULT_SITE.sectionsOrder);
      }
    })();
  }, []);

  if (!authed) {
    return (
      <main>
        <div className="card">
          <h2>管理画面ログイン</h2>
          <input className="input" type="password" placeholder="パスワード" value={pw} onChange={e=>setPw(e.target.value)} />
          <div style={{marginTop:12}}>
            <button className="btn" onClick={async ()=>{
              const ok = await login(pw);
              if (ok) location.reload();
              else alert("パスワードが違います");
            }}>ログイン</button>
          </div>
        </div>
      </main>
    );
  }

  function allowDrop(e){ e.preventDefault(); }
  function onPick(ref){ ref.current?.click(); }
  const onSel = (setterFile, setterPrev) => (e)=>{
    const f = e.target.files?.[0];
    if (!f) return;
    setterFile(f);
    setterPrev(URL.createObjectURL(f));
  };
  const onDrop = (setterFile, setterPrev) => (e)=>{
    e.preventDefault();
    const f = e.dataTransfer.files?.[0];
    if (!f) return;
    setterFile(f);
    setterPrev(URL.createObjectURL(f));
  };

  function moveSection(idx, dir) {
    setSections((arr)=>{
      const a = [...arr];
      const ni = idx + dir;
      if (ni<0 || ni>=a.length) return a;
      [a[idx], a[ni]] = [a[ni], a[idx]];
      return a;
    });
  }

  async function saveAll() {
    try {
      setSaving(true);
      let desktop = cfg.hero.desktopImage;
      let mobile  = cfg.hero.mobileImage;
      let bg      = cfg.backgroundImage || "";

      if (selPc) desktop = await upload(selPc);
      if (selSp) mobile  = await upload(selSp);
      if (selBg) bg      = await upload(selBg);

      const next = {
        ...cfg,
        backgroundImage: bg,
        hero: { desktopImage: desktop, mobileImage: mobile },
        socials: sns,
        map,
        sectionsOrder: sections
      };
      await saveConfigSafe(next);
      alert("保存しました！");
    } catch(e) {
      console.error(e);
      alert("保存に失敗しました。");
    } finally {
      setSaving(false);
    }
  }

  return (
    <main>
      <div className="card" style={{display:"flex", justifyContent:"space-between", alignItems:"center"}}>
        <div style={{fontSize:20, fontWeight:700}}>管理画面</div>
        <button className="btn" onClick={logout}>ログアウト</button>
      </div>

      {/* 背景画像 */}
      <section className="card">
        <h2>背景画像</h2>
        <div
          className="pill"
          onClick={()=>onPick(fileBg)}
          onDragOver={allowDrop}
          onDrop={onDrop(setSelBg, setPrevBg)}
          title="クリック または ドラッグ＆ドロップ"
        >
          背景画像を選択
        </div>
        <input ref={fileBg} type="file" accept="image/*" hidden onChange={onSel(setSelBg, setPrevBg)} />
        {prevBg && <img src={prevBg} className="thumb" alt="bg" />}
        <div className="small" style={{marginTop:6}}>ページ全体の背景に敷かれます</div>
      </section>

      {/* トップ画像（PC/スマホ） */}
      <section className="card">
        <h2>トップ画像（PC / スマホ）</h2>
        <div className="row">
          <div className="col">
            <div className="pill" onClick={()=>onPick(filePc)} onDragOver={allowDrop} onDrop={onDrop(setSelPc, setPrevPc)}>
              画像を選択（PC）
            </div>
            <input ref={filePc} type="file" accept="image/*" hidden onChange={onSel(setSelPc, setPrevPc)} />
            {prevPc && <img src={prevPc} className="thumb" alt="pc" />}
          </div>
          <div className="col">
            <div className="pill" onClick={()=>onPick(fileSp)} onDragOver={allowDrop} onDrop={onDrop(setSelSp, setPrevSp)}>
              画像を選択（スマホ）
            </div>
            <input ref={fileSp} type="file" accept="image/*" hidden onChange={onSel(setSelSp, setPrevSp)} />
            {prevSp && <img src={prevSp} className="thumb" alt="sp" />}
          </div>
        </div>
      </section>

      {/* SNS */}
      <section className="card">
        <h2>SNS 埋め込み</h2>
        <div className="row">
          {[
            {k:"youtube", ph:"https://www.youtube.com/watch?v=...（または /embed/...）"},
            {k:"tiktok", ph:"https://www.tiktok.com/@user/video/..."},
            {k:"instagram", ph:"https://www.instagram.com/p/xxxx/"},
            {k:"x", ph:"https://twitter.com/user/status/xxxx"}
          ].map(({k, ph})=>(
            <div key={k} className="col">
              <label className="small">{k.toUpperCase()} のURL</label>
              <input
                className="input"
                placeholder={ph}
                value={sns[k] || ""}
                onChange={(e)=>setSns(p=>({...p, [k]: e.target.value}))}
              />
            </div>
          ))}
        </div>
        <div className="small" style={{marginTop:6}}>
          ※ YouTubeは動画URL（watch?v=...）推奨。TikTok/Instagram/Xは公開URLを貼ってください。
        </div>
      </section>

      {/* マップ */}
      <section className="card">
        <h2>Googleマップ</h2>
        <div className="row">
          <div className="col">
            <label className="small">店名</label>
            <input className="input" value={map.placeName} onChange={(e)=>setMap(p=>({...p, placeName:e.target.value}))}/>
          </div>
          <div className="col">
            <label className="small">住所</label>
            <input className="input" value={map.address} onChange={(e)=>setMap(p=>({...p, address:e.target.value}))}/>
          </div>
        </div>
        <label className="small" style={{marginTop:8, display:"block"}}>埋め込みURL（Googleマップの「地図を埋め込む」の src）</label>
        <input className="input" placeholder="https://www.google.com/maps/embed?..." value={map.embedSrc} onChange={(e)=>setMap(p=>({...p, embedSrc:e.target.value}))}/>
      </section>

      {/* 表示順 */}
      <section className="card">
        <h2>表示順</h2>
        <ul className="sort">
          {sections.map((s,i)=>(
            <li key={s}>
              <span>{s}</span>
              <span>
                <button className="btn" style={{marginRight:8}} onClick={()=>moveSection(i,-1)}>↑</button>
                <button className="btn" onClick={()=>moveSection(i,+1)}>↓</button>
              </span>
            </li>
          ))}
        </ul>
        <div className="small">（hero / sns / reservation / map）</div>
      </section>

      {/* 予約一覧（最新10件） */}
      <section className="card">
        <h2>予約一覧（最新）</h2>
        <button className="btn" onClick={async ()=>{
          const r = await fetch("/api/bookings");
          const j = await r.json();
          const rows = (j.rows||[]).slice().reverse().slice(0,10);
          alert(rows.length ? rows.map(x=>`${x.date} ${x.time} / ${x.name} / ${x.contact}`).join("\\n") : "予約はまだありません。");
        }}>読み込み</button>
        <div className="small" style={{marginTop:6}}>※ 今は簡易表示です。承認/却下などは次段で追加可能。</div>
      </section>

      {/* 保存ボタン */}
      <div className="card" style={{display:"flex", gap:12}}>
        <button className="btn" onClick={saveAll} disabled={saving}>
          {saving ? "保存中…" : "すべて保存"}
        </button>
        <a className="btn" href="/" style={{background:"#374151"}}>サイトを確認</a>
      </div>
    </main>
  );
}
