// src/pages/Admin.jsx
import React, { useEffect, useState } from "react";

const STORAGE_KEY = "spice-nail-site-v3";
const PW_KEY = "spice-nail-admin-pass-v1";
const DEFAULT_PASSWORD = "5793";

// localStorage 読み込み
function loadData() {
  if (typeof window === "undefined") return null;
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return null;
    return JSON.parse(raw);
  } catch {
    return null;
  }
}

// localStorage 保存
function saveData(obj) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(obj));
}

// 管理パス読み込み
function loadPassword() {
  if (typeof window === "undefined") return DEFAULT_PASSWORD;
  const p = localStorage.getItem(PW_KEY);
  return p || DEFAULT_PASSWORD;
}

// 管理パス保存
function savePassword(pw) {
  localStorage.setItem(PW_KEY, pw);
}

// ファイルを base64 に変換
function fileToDataUrl(file) {
  return new Promise((resolve, reject) => {
    const rd = new FileReader();
    rd.onload = () => resolve(rd.result);
    rd.onerror = reject;
    rd.readAsDataURL(file);
  });
}

// ドロップエリアの共通コンポーネント
function UploadBox({ label, hint, value, onFile, previewHeight = 180 }) {
  const [dragOver, setDragOver] = useState(false);

  const handleDrop = async (e) => {
    e.preventDefault();
    setDragOver(false);
    const file = e.dataTransfer.files?.[0];
    if (!file) return;
    const dataUrl = await fileToDataUrl(file);
    onFile(dataUrl);
  };

  const handleChange = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const dataUrl = await fileToDataUrl(file);
    onFile(dataUrl);
  };

  return (
    <div style={{ marginBottom: 14 }}>
      <p style={{ marginBottom: 4, fontWeight: 600 }}>{label}</p>
      {hint ? (
        <p style={{ marginTop: 0, fontSize: 12, color: "#888" }}>{hint}</p>
      ) : null}
      <div
        onDragOver={(e) => {
          e.preventDefault();
          setDragOver(true);
        }}
        onDragLeave={() => setDragOver(false)}
        onDrop={handleDrop}
        style={{
          border: dragOver ? "2px solid #111" : "2px dashed #ccc",
          background: "#fafafa",
          borderRadius: 12,
          padding: 14,
          textAlign: "center",
          cursor: "pointer"
        }}
        onClick={() => {
          // 隠しinputをクリックする
          const el = document.getElementById(label + "_input");
          if (el) el.click();
        }}
      >
        <p style={{ margin: 0, fontSize: 13, color: "#666" }}>
          ファイルを選択 または ここにドラッグ＆ドロップ
        </p>
        <input
          id={label + "_input"}
          type="file"
          accept="image/*"
          onChange={handleChange}
          style={{ display: "none" }}
        />
      </div>
      {value ? (
        <img
          src={value}
          alt="preview"
          style={{
            width: "100%",
            maxWidth: 380,
            height: previewHeight,
            objectFit: "cover",
            borderRadius: 12,
            marginTop: 8,
            background: "#eee"
          }}
        />
      ) : null}
    </div>
  );
}

export default function Admin() {
  const [loggedIn, setLoggedIn] = useState(false);
  const [pwInput, setPwInput] = useState("");
  const [site, setSite] = useState(null);
  const [saving, setSaving] = useState(false);

  // 初期読込
  useEffect(() => {
    const d = loadData();
    setSite(
      d || {
        heroPc: "",
        heroSp: "",
        bgImage: "",
        banners: [],
        sns: [],
        map: { src: "", address: "" }
      }
    );
  }, []);

  // ログイン処理
  function handleLogin(e) {
    e.preventDefault();
    const realPw = loadPassword();
    if (pwInput === realPw) {
      setLoggedIn(true);
    } else {
      alert("パスワードが違います");
    }
  }

  // 保存処理
  function handleSave() {
    setSaving(true);
    saveData(site);
    setTimeout(() => {
      setSaving(false);
      alert("保存しました（このブラウザに保存）");
    }, 200);
  }

  // SNS追加
  function addSNS() {
    setSite((prev) => ({
      ...prev,
      sns: [...(prev.sns || []), { name: "", url: "" }]
    }));
  }

  function updateSNS(index, field, value) {
    setSite((prev) => {
      const next = [...(prev.sns || [])];
      next[index] = { ...next[index], [field]: value };
      return { ...prev, sns: next };
    });
  }

  function deleteSNS(index) {
    setSite((prev) => {
      const next = [...(prev.sns || [])];
      next.splice(index, 1);
      return { ...prev, sns: next };
    });
  }

  // バナー追加（横長もドラッグで入れられるようにする）
  function addBanner() {
    setSite((prev) => ({
      ...prev,
      banners: [...(prev.banners || []), ""]
    }));
  }

  function updateBanner(i, value) {
    setSite((prev) => {
      const arr = [...(prev.banners || [])];
      arr[i] = value;
      return { ...prev, banners: arr };
    });
  }

  function deleteBanner(i) {
    setSite((prev) => {
      const arr = [...(prev.banners || [])];
      arr.splice(i, 1);
      return { ...prev, banners: arr };
    });
  }

  // パスワード変更
  function handleChangePassword() {
    const newPw = prompt("新しいパスワードを入力してください（空欄不可）");
    if (!newPw) return;
    savePassword(newPw);
    alert("パスワードを変更しました。次回からはそのパスワードでログインしてください。");
  }

  // 未ログイン画面
  if (!loggedIn) {
    return (
      <div className="login-box">
        <h2>管理画面ログイン</h2>
        <p style={{ fontSize: 12, color: "#888", marginBottom: 16 }}>
          初期パスワードは「5793」です
        </p>
        <form onSubmit={handleLogin}>
          <input
            type="password"
            value={pwInput}
            onChange={(e) => setPwInput(e.target.value)}
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

  if (!site) return <div className="app-shell">読み込み中…</div>;

  return (
    <div className="app-shell admin-wrap">
      <h1>管理画面</h1>

      {/* トップ画像 PC */}
      <div className="card">
        <h2>トップ画像（PC）</h2>
        <UploadBox
          label="hero-pc"
          hint="推奨サイズ：1800 × 800px / 横長"
          value={site.heroPc}
          onFile={(dataUrl) => setSite({ ...site, heroPc: dataUrl })}
          previewHeight={220}
        />
      </div>

      {/* トップ画像 SP */}
      <div className="card">
        <h2>トップ画像（スマホ）</h2>
        <UploadBox
          label="hero-sp"
          hint="推奨サイズ：1000 × 1000px / 正方形～縦長"
          value={site.heroSp}
          onFile={(dataUrl) => setSite({ ...site, heroSp: dataUrl })}
          previewHeight={220}
        />
      </div>

      {/* 背景画像 */}
      <div className="card">
        <h2>背景画像</h2>
        <UploadBox
          label="bg-image"
          hint="推奨サイズ：1920 × 1080px / 大きめの横長"
          value={site.bgImage}
          onFile={(dataUrl) => setSite({ ...site, bgImage: dataUrl })}
          previewHeight={140}
        />
      </div>

      {/* スライドバナー（横長） */}
      <div className="card">
        <h2>スライドバナー（横長の3:1くらい）</h2>
        {(site.banners || []).map((b, i) => (
          <div key={i} style={{ marginBottom: 12 }}>
            <UploadBox
              label={`banner-${i}`}
              hint="推奨サイズ：1200 × 400px / 3:1"
              value={b}
              onFile={(dataUrl) => updateBanner(i, dataUrl)}
              previewHeight={140}
            />
            <button
              type="button"
              className="button"
              onClick={() => deleteBanner(i)}
            >
              このバナーを削除
            </button>
          </div>
        ))}
        <button type="button" className="button" onClick={addBanner}>
          ＋ バナーを追加
        </button>
      </div>

      {/* SNS */}
      <div className="card">
        <h2>SNSリンク</h2>
        {(site.sns || []).map((s, i) => (
          <div
            key={i}
            style={{
              display: "flex",
              gap: 8,
              marginBottom: 8,
              alignItems: "center"
            }}
          >
            <input
              value={s.name}
              onChange={(e) => updateSNS(i, "name", e.target.value)}
              placeholder="例）Instagram"
              style={{ flex: "0 0 140px" }}
            />
            <input
              value={s.url}
              onChange={(e) => updateSNS(i, "url", e.target.value)}
              placeholder="https://..."
              style={{ flex: 1 }}
            />
            <button
              type="button"
              className="button"
              onClick={() => deleteSNS(i)}
            >
              削除
            </button>
          </div>
        ))}
        <button type="button" className="button" onClick={addSNS}>
          ＋ SNSを追加
        </button>
      </div>

      {/* Googleマップ */}
      <div className="card">
        <h2>Googleマップ</h2>
        <div className="input-row">
          <label>埋め込みURL（iframeのsrcだけ）</label>
          <input
            value={site.map?.src || ""}
            onChange={(e) =>
              setSite({
                ...site,
                map: { ...(site.map || {}), src: e.target.value }
              })
            }
            placeholder="https://www.google.com/maps/embed?..."
          />
        </div>
        <div className="input-row">
          <label>住所テキスト</label>
          <input
            value={site.map?.address || ""}
            onChange={(e) =>
              setSite({
                ...site,
                map: { ...(site.map || {}), address: e.target.value }
              })
            }
            placeholder="千葉県〇〇市…"
          />
        </div>
      </div>

      {/* パスワード変更 */}
      <div className="card">
        <h2>管理画面パスワード</h2>
        <p style={{ fontSize: 13, marginBottom: 12 }}>
          今開いているブラウザに保存されます。別のPCでは初期パスワード（5793）になることがあります。
        </p>
        <button className="button" onClick={handleChangePassword}>
          パスワードを変更する
        </button>
      </div>

      <div style={{ textAlign: "right", marginBottom: 50 }}>
        <button className="button" onClick={handleSave} disabled={saving}>
          {saving ? "保存中..." : "保存する"}
        </button>
      </div>
    </div>
  );
}
