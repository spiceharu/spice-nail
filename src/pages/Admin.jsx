// src/pages/Admin.jsx
import React, { useEffect, useState } from "react";

const STORAGE_KEY = "spice-nail-site-v3";
const PW_KEY = "spice-nail-admin-pass-v1";
// 初期パスワード（ここで決め打ちできる。あとで管理画面から変えられるようにしてる）
const DEFAULT_PASSWORD = "5793";

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

function saveData(obj) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(obj));
}

function loadPassword() {
  if (typeof window === "undefined") return DEFAULT_PASSWORD;
  const p = localStorage.getItem(PW_KEY);
  return p || DEFAULT_PASSWORD;
}

function savePassword(pw) {
  localStorage.setItem(PW_KEY, pw);
}

export default function Admin() {
  const [loggedIn, setLoggedIn] = useState(false);
  const [pwInput, setPwInput] = useState("");
  const [site, setSite] = useState(null);
  const [saving, setSaving] = useState(false);

  // 最初にデータ読む
  useEffect(() => {
    const d = loadData();
    setSite(
      d || {
        heroPc: "",
        heroSp: "",
        bgImage: "",
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
      alert("保存しました（ブラウザに保存）");
    }, 300);
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

  // パスワード変更
  function handleChangePassword() {
    const newPw = prompt("新しいパスワードを入力してください（空欄は不可）");
    if (!newPw) return;
    savePassword(newPw);
    alert("パスワードを変更しました");
  }

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

  if (!site) return <div className="app-shell">読み込み中...</div>;

  return (
    <div className="app-shell admin-wrap">
      <h1>管理画面</h1>

      {/* トップ画像 */}
      <div className="card">
        <h2>トップ画像（PC）</h2>
        <div className="input-row">
          <label>画像URL（例：https://.../hero-desktop.png）</label>
          <input
            value={site.heroPc || ""}
            onChange={(e) => setSite({ ...site, heroPc: e.target.value })}
            placeholder="PC用トップ画像URL"
          />
        </div>
        {site.heroPc ? (
          <img src={site.heroPc} alt="pc" className="preview-img" />
        ) : null}
      </div>

      <div className="card">
        <h2>トップ画像（スマホ）</h2>
        <div className="input-row">
          <label>画像URL（例：https://.../hero-mobile.png）</label>
          <input
            value={site.heroSp || ""}
            onChange={(e) => setSite({ ...site, heroSp: e.target.value })}
            placeholder="スマホ用トップ画像URL"
          />
        </div>
        {site.heroSp ? (
          <img src={site.heroSp} alt="sp" className="preview-img" />
        ) : null}
      </div>

      {/* 背景画像 */}
      <div className="card">
        <h2>背景画像</h2>
        <div className="input-row">
          <label>画像URL（省略可）</label>
          <input
            value={site.bgImage || ""}
            onChange={(e) => setSite({ ...site, bgImage: e.target.value })}
            placeholder="背景にしたい画像のURL"
          />
        </div>
        <div
          className="bg-preview"
          style={{ backgroundImage: site.bgImage ? `url(${site.bgImage})` : "" }}
        ></div>
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

      {/* マップ */}
      <div className="card">
        <h2>Googleマップ</h2>
        <div className="input-row">
          <label>埋め込みURL（iframeのsrcだけ）</label>
          <input
            value={site.map?.src || ""}
            onChange={(e) =>
              setSite({ ...site, map: { ...(site.map || {}), src: e.target.value } })
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
            placeholder="千葉県〇〇市..."
          />
        </div>
      </div>

      {/* パスワード */}
      <div className="card">
        <h2>管理画面パスワード</h2>
        <p style={{ fontSize: 13, marginBottom: 12 }}>
          今ログインしているブラウザにだけ保存されます。別のPCではまた初期パスワードになります。
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
