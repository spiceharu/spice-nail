// --- 冒頭の import に追加不要（React 周りは既存のままでOK） ---

// ログインフォーム（最上部に置くのが簡単）
function LoginView({ onOk }) {
  const onSubmit = async (e) => {
    e.preventDefault();
    const password = new FormData(e.currentTarget).get('password') + '';
    const res = await fetch('/api/login', {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify({ password })
    });
    const data = await res.json();
    if (data.ok) onOk();
    else alert('パスワードが違います');
  };
  return (
    <form onSubmit={onSubmit} style={{ maxWidth: 320, margin: '80px auto' }}>
      <h2>管理ログイン</h2>
      <input
        name="password"
        type="password"
        placeholder="パスワード"
        style={{ width: '100%', padding: 10, marginBottom: 12 }}
      />
      <button type="submit" style={{ width: '100%', padding: 10 }}>
        ログイン
      </button>
    </form>
  );
}

// 既存の Admin コンポーネントの先頭付近で、未ログインなら LoginView を表示
export default function Admin() {
  const [authed, setAuthed] = useState(false);

  if (!authed) return <LoginView onOk={() => setAuthed(true)} />;

  // ↓ ここから下は、あなたの既存の管理画面 UI（画像アップロード等）をそのまま表示
  return (
    <div style={{ padding: 20 }}>
      {/* 既存の管理画面UI */}
      <h1>管理画面</h1>
      {/* …以下略（あなたの既存コードをそのまま） */}
    </div>
  );
}
