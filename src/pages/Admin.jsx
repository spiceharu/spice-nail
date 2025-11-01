// src/pages/Admin.jsx
import React, { useEffect, useState } from "react";

const STORAGE_KEY = "spice-nail-site-v4";
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

// パス読み込み/保存
function loadPassword() {
  if (typeof window === "undefined") return DEFAULT_PASSWORD;
  return localStorage.getItem(PW_KEY) || DEFAULT_PASSWORD;
}
function savePassword(pw) {
  localStorage.setItem(PW_KEY, pw);
}

// ファイル→Base64
function fileToDataUrl(file) {
  return new Promise((resolve, reject) => {
    const rd = new FileReader();
    rd.onload = () => resolve(rd.result);
    rd.onerror = reject;
    rd.readAsDataURL(file);
  });
}

// アップロードボックス
function UploadBox({ id, label, hint, value, onFile, height = 180 }) {
  const [dragOver, setDragOver] = useState(false);

  const handleDrop = async (e) => {
    e.preventDefault();
    setDragOver(false);
    const f = e.dataTransfer.files?.[0];
    if (!f) return;
    const dataUrl = await fileToDataUrl(f);
    onFile(dataUrl);
  };

  const handleChange = async (e) => {
    const f = e.target.files?.[0];
    if (!f) return;
    const dataUrl = await fileToDataUrl(f);
    onFile(dataUrl);
  };

  return (
    <div style={{ marginBottom: 14 }}>
      <p style={{ marginBottom: 4, fontWeight: 600 }}>{label}</p>
      {hint ? <p style={{ margin: 0, marginBottom: 6, fontSize: 12, color: "#888" }}>{hint}</p> : null}
      <div
        onDragOver={(e) => {
          e.preventDefault();
          setDragOver(true);
        }}
        onDragLeave={() => setDragOver(false)}
        onDrop={handleDrop}
        onClick={() => {
          const input = document.getElementById(id);
          if (input) input.click();
        }}
        style={{
          border: dragOver ? "2px solid #111" : "2px dashed #ccc",
          background: "#fafafa",
          borderRadius: 12,
          padding: 14,
          textAlign: "center",
          cursor: "pointer"
        }}
      >
        <p style={{ margin: 0, fontSize: 13, color: "#666" }}>
          ファイルを選択 or ドラッグ＆ドロップ
        </p>
        <input
          id={id}
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
            height,
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
  const [tab, setTab] = useState("images");
  const [importText, setImportText] = useState("");

  // 初期ロード
  useEffect(() => {
    const d = loadData();
    setSite(
      d || {
        heroPc: "",
        heroSp: "",
        bgPc: "",
        bgSp: "",
        banners: [],
        sns: [],
        map: { src: "", address: "" }
      }
    );
  }, []);

  // ログイン
  function handleLogin(e) {
    e.preventDefault();
    const realPw = loadPassword();
    if (pwInput === realPw) {
      setLoggedIn(true);
    } else {
      alert("パスワードが違います");
    }
  }

  // 保存
  function handleSave() {
    setSaving(true);
    saveData(site);
    setTimeout(() => {
      setSaving(false);
      alert("保存しました（このブラウザに保存）");
    }, 200);
  }

  // SNS操作
  function addSNS() {
    setSite((prev) => ({
      ...prev,
      sns: [...(prev.sns || []), { name: "", url: "" }]
    }));
  }
  function updateSNS(idx, field, value) {
    setSite((prev) => {
      const next = [...(prev.sns || [])];
      next[idx] = { ...next[idx], [field]: value };
      return { ...prev, sns: next };
    });
  }
  function deleteSNS(idx) {
    setSite((prev) => {
      const next = [...(prev.sns || [])];
      next.splice(idx, 1);
      return { ...prev, sns: next };
    });
  }

  // バナー操作
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
    alert("パスワードを変更しました。次回から新パスワードでログインしてください。");
  }

  // 設定をコピー（エクスポート）
  function handleExport() {
    const json = JSON.stringify(site, null, 2);
    navigator.clipboard?.writeText(json).catch(() => {});
    setImportText(json);
    alert("設定をコピーしました。スマホに送って貼り付けてください。");
  }

  // 設定を貼り付けて保存（インポート）
  function handleImport() {
    if (!importText.trim()) {
      alert("貼り付ける設定がありません");
      return;
    }
    try {
      const obj = JSON.parse(importText);
      setSite(obj);
      saveData(obj);
      alert("設定を読み込みました！");
    } catch (e) {
      alert("JSONの形式が違います");
    }
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
        <button
          className="button"
          style={{ background: tab === "settings" ? "#111" : "#ccc" }}
          onClick={() => setTab("settings")}
        >
          その他
        </button>
      </div>

      {/* 画像タブ */}
      {tab === "images" && (
        <>
          <div className="card">
            <h2>トップ画像（PC）</h2>
            <UploadBox
              id="hero-pc"
              label="PCトップ画像"
              hint="推奨サイズ：1800 × 800px / 横長"
              value={site.heroPc}
              onFile={(dataUrl) => setSite({ ...site, heroPc: dataUrl })}
              height={220}
            />
          </div>
          <div className="card">
            <h2>トップ画像（スマホ）</h2>
            <UploadBox
              id="hero-sp"
              label="スマホトップ画像"
              hint="推奨サイズ：1000 × 1000px / 正方形～少し縦長"
              value={site.heroSp}
              onFile={(dataUrl) => setSite({ ...site, heroSp: dataUrl })}
              height={220}
            />
          </div>
          <div className="card">
            <h2>背景画像（PC）</h2>
            <UploadBox
              id="bg-pc"
              label="PC背景画像"
              hint="推奨サイズ：1920 × 1080px / 大きめ横長"
              value={site.bgPc}
              onFile={(dataUrl) => setSite({ ...site, bgPc: dataUrl })}
              height={140}
            />
          </div>
          <div className="card">
            <h2>背景画像（スマホ）</h2>
            <UploadBox
              id="bg-sp"
              label="スマホ背景画像"
              hint="推奨サイズ：1080 × 1920px / 縦長"
              value={site.bgSp}
              onFile={(dataUrl) => setSite({ ...site, bgSp: dataUrl })}
              height={140}
            />
          </div>
          <div className="card">
            <h2>スライドバナー（横長3:1）</h2>
            {(site.banners || []).map((b, i) => (
              <div key={i} style={{ marginBottom: 12 }}>
                <UploadBox
                  id={`banner-${i}`}
                  label={`バナー #${i + 1}`}
                  hint="推奨サイズ：1200 × 400px / 3:1"
                  value={b}
                  onFile={(dataUrl) => updateBanner(i, dataUrl)}
                  height={130}
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
        </>
      )}

      {/* SNSタブ */}
      {tab === "sns" && (
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
                style={{
                  flex: "0 0 140px",
                  padding: 8,
                  borderRadius: 8,
                  border: "1px solid #ddd"
                }}
              />
              <input
                value={s.url}
                onChange={(e) => updateSNS(i, "url", e.target.value)}
                placeholder="https://..."
                style={{
                  flex: 1,
                  padding: 8,
                  borderRadius: 8,
                  border: "1px solid #ddd"
                }}
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
      )}

      {/* マップタブ */}
      {tab === "map" && (
        <div className="card">
          <h2>Googleマップ</h2>
          <div className="input-row">
            <label>埋め込みURL（iframe のsrcだけ）</label>
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
      )}

      {/* その他タブ */}
      {tab === "settings" && (
        <div className="card">
          <h2>その他設定</h2>
          <p style={{ fontSize: 13, marginBottom: 12 }}>
            PCで作った設定をスマホにコピーするときは下の「設定をコピー」を押して、スマホの管理画面で貼り付けてください。
          </p>
          <div style={{ display: "flex", gap: 8, marginBottom: 12 }}>
            <button className="button" onClick={handleExport}>
              設定をコピー（エクスポート）
            </button>
            <button className="button" onClick={handleImport}>
              貼り付けて保存（インポート）
            </button>
          </div>
          <textarea
            value={importText}
            onChange={(e) => setImportText(e.target.value)}
            placeholder="ここにPCでコピーしたJSONを貼り付け"
            style={{
              width: "100%",
              minHeight: 140,
              borderRadius: 12,
              border: "1px solid #ddd",
              padding: 8,
              fontFamily: "monospace",
              fontSize: 12
            }}
          />
          <hr style={{ margin: "20px 0" }} />
          <p style={{ fontSize: 13, marginBottom: 12 }}>
            管理画面パスワードの変更
          </p>
          <button className="button" onClick={handleChangePassword}>
            パスワードを変更する
          </button>
        </div>
      )}

      <div style={{ textAlign: "right", marginBottom: 50, marginTop: 12 }}>
        <button className="button" onClick={handleSave} disabled={saving}>
          {saving ? "保存中..." : "保存する"}
        </button>
      </div>
    </div>
  );
}
