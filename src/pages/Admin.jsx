import { useEffect, useState } from "react";
import { DEFAULT_SITE, loadSite, saveSite } from "../lib/siteStore.js";

function Input({label,...p}){ return (<div style={{margin:"8px 0"}}><div style={{fontSize:12,color:"#6b7280"}}>{label}</div><input className="input" {...p}/></div>); }
function Textarea({label,...p}){ return (<div style={{margin:"8px 0"}}><div style={{fontSize:12,color:"#6b7280"}}>{label}</div><textarea className="textarea" rows={4} {...p}/></div>); }

function ImagesEditor({label,value,onChange,placeholder}){
  const [list,setList]=useState(value||[]);
  useEffect(()=>setList(value||[]),[value]);
  return (
    <div className="card" style={{margin:"8px 0"}}>
      <div style={{fontWeight:600,marginBottom:8}}>{label}</div>
      {list.map((v,i)=>(
        <div key={i} style={{display:"flex",gap:8,alignItems:"center",margin:"6px 0"}}>
          <input className="input" value={v} onChange={e=>{
            const n=[...list]; n[i]=e.target.value; setList(n); onChange(n);
          }} placeholder={placeholder||`画像URL ${i+1}`}/>
          <button className="dragBtn" onClick={()=>{const n=list.filter((_,idx)=>idx!==i); setList(n); onChange(n);}}>削除</button>
        </div>
      ))}
      <button className="dragBtn" onClick={()=>{const n=[...list,""]; setList(n); onChange(n);}}>＋ 追加</button>
    </div>
  );
}

export default function Admin(){
  const [site,setSite] = useState(loadSite());
  const [tab,setTab] = useState("hero");

  const save = ()=>{ saveSite(site); alert("保存しました（公開ページに反映）"); };

  const move = (i,dir)=>{
    const arr=[...(site.sectionsOrder||[])];
    const j=i+(dir==="up"?-1:1);
    if(j<0 || j>=arr.length) return;
    [arr[i],arr[j]]=[arr[j],arr[i]];
    setSite({...site, sectionsOrder:arr});
  };

  return (
    <div className="container">
      <h1 style={{margin:"16px 0"}}>管理 / Spice Nail</h1>

      <div className="tabs">
        {["hero","sns","map","order","reset"].map(k=>(
          <button key={k} className={`tab ${tab===k?"active":""}`} onClick={()=>setTab(k)}>
            {k==="hero"?"🖼 トップ画像":k==="sns"?"🌐 SNS":k==="map"?"📍 マップ":k==="order"?"↕ 表示順":"🧹 初期化"}
          </button>
        ))}
      </div>

      {tab==="hero" && (
        <div className="card">
          <div style={{fontWeight:600,marginBottom:8}}>トップ（画像/動画 + 横長バナー）</div>
          <Input label="PC用トップ画像URL" value={site.hero.desktopImage||""}
                 onChange={e=>setSite({...site, hero:{...site.hero, desktopImage:e.target.value}})} />
          <Input label="スマホ用トップ画像URL" value={site.hero.mobileImage||""}
                 onChange={e=>setSite({...site, hero:{...site.hero, mobileImage:e.target.value}})} />
          <Input label="動画URL（任意）" placeholder="mp4 / webm" value={site.hero.videoUrl||""}
                 onChange={e=>setSite({...site, hero:{...site.hero, videoUrl:e.target.value}})} />
          <ImagesEditor label="横長バナー（PC, 3:1）" value={site.hero.bannersDesktop||[]}
                        onChange={(v)=>setSite({...site, hero:{...site.hero, bannersDesktop:v}})} />
          <ImagesEditor label="横長バナー（スマホ, 3:1）" value={site.hero.bannersMobile||[]}
                        onChange={(v)=>setSite({...site, hero:{...site.hero, bannersMobile:v}})} />
          <Input label="スクロール速度（秒）" type="number" value={site.hero.scrollSpeed||6}
                 onChange={e=>setSite({...site, hero:{...site.hero, scrollSpeed:Number(e.target.value||6)}})} />
          <button className="button" onClick={save}>保存して公開</button>
        </div>
      )}

      {tab==="sns" && (
        <div className="card">
          <div style={{fontWeight:600,marginBottom:8}}>SNSリンク（URL貼り付け）</div>
          {["youtube","instagram","tiktok","x"].map(k=>(
            <Input key={k} label={k.toUpperCase()} value={site.socials?.[k]||""}
                   onChange={e=>setSite({...site, socials:{...(site.socials||{}), [k]:e.target.value}})} />
          ))}
          <button className="button" onClick={save}>保存して公開</button>
        </div>
      )}

      {tab==="map" && (
        <div className="card">
          <div style={{fontWeight:600,marginBottom:8}}>Googleマップ</div>
          <Input label="店舗名" value={site.map.placeName||""}
                 onChange={e=>setSite({...site, map:{...site.map, placeName:e.target.value}})} />
          <Input label="住所" value={site.map.address||""}
                 onChange={e=>setSite({...site, map:{...site.map, address:e.target.value}})} />
          <Textarea label="埋め込みURL（共有 → 地図を埋め込む → src を貼付）"
                    value={site.map.embedSrc||""}
                    onChange={e=>setSite({...site, map:{...site.map, embedSrc:e.target.value}})} />
          <button className="button" onClick={save}>保存して公開</button>
        </div>
      )}

      {tab==="order" && (
        <div className="card">
          <div style={{fontWeight:600,marginBottom:8}}>表示順設定（ドラッグ代替：上下ボタン）</div>
          <ul className="dragList" style={{listStyle:"none",padding:0}}>
            {(site.sectionsOrder||[]).map((s,i)=>(
              <li key={s}>
                <span className="pill" style={{minWidth:120,display:"inline-block",textAlign:"center"}}>{s}</span>
                <button className="dragBtn" onClick={()=>move(i,"up")}>↑</button>
                <button className="dragBtn" onClick={()=>move(i,"down")}>↓</button>
              </li>
            ))}
          </ul>
          <button className="button" onClick={save}>保存して公開</button>
        </div>
      )}

      {tab==="reset" && (
        <div className="card">
          <p>初期値に戻します。よければ「初期化する」を押してください。</p>
          <button className="button" onClick={()=>{saveSite(DEFAULT_SITE); setSite(DEFAULT_SITE); alert("初期化しました");}}>
            初期化する
          </button>
        </div>
      )}
    </div>
  );
}
