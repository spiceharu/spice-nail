// src/pages/Admin.jsx
import { useState, useEffect, useRef } from 'react';

function LoginView({ onOk }) {
  const [pw, setPw] = useState('');

  const onSubmit = async (e) => {
    e.preventDefault();
    const res = await fetch('/api/login', {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify({ password: pw }),
    });
    const data = await res.json();
    if (data.ok) {
      sessionStorage.setItem('spice_admin_authed', '1');
      onOk();
    } else {
      alert('パスワードが違います');
    }
  };

  return (
    <form onSubmit={onSubmit} style={{ maxWidth: 320, margin: '80px auto' }}>
      <h2>管理ログイン</h2>
      <input
        name="password"
        type="password"
        value={pw}
        onChange={(e) => setPw(e.target.value)}
        placeholder="パスワード"
        style={{ width: '100%', padding: 10, marginBottom: 12 }}
      />
      <button type="submit" style={{ width: '100%', padding: 10 }}>
        ログイン
      </button>
    </form>
  );
}

export default function Admin() {
  const [authed, setAuthed] = useState(false);
  const [preview, setPreview] = useState('');
  const inputRef = useRef(null);

  // リロードしてもログイン維持（簡易）
  useEffect(() => {
    if (sessionStorage.getItem('spice_admin_authed') === '1') {
      setAuthed(true);
    }
  }, []);

  if (!authed) return <LoginView onOk={() => setAuthed(true)} />;

  // ここから下は、必要最低限の画像アップロード例（ヒーロー画像）
  const onSelectFile = (e) => {
    const f = e.target.files?.[0];
    if (!f) return;
    setPreview(URL.createObjectURL(f));
  };

  const onSave = async () => {
    try {
      const file = inputRef.current?.files?.[0];
      // 画像を使わない運用も想定し、プレビューだけでも保存扱いに
      alert(file ? '（ダミー）保存しました' : '（ダミー）保存しました（画像未選択）');
    } catch (err) {
      console.error(err);
      alert('保存に失敗しました');
    }
  };

  return (
    <div style={{ padding: 20, maxWidth: 720, margin: '0 auto' }}>
      <h1>管理画面</h1>

      <section style={{ marginTop: 24 }}>
        <h2>トップ画像（ヒーロー）</h2>
        <input
          type="file"
          accept="image/*"
          ref={inputRef}
          onChange={onSelectFile}
          style={{ display: 'block', marginBottom: 12 }}
        />
        {preview && (
          <img
            src={preview}
            alt="preview"
            style={{ width: '100%', maxHeight: 320, objectFit: 'cover', borderRadius: 12 }}
          />
        )}
        <button onClick={onSave} style={{ marginTop: 12 }}>
          保存
        </button>
      </section>
    </div>
  );
}
