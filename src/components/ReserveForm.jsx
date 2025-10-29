// src/components/ReserveForm.jsx
import { useState } from 'react';

export default function ReserveForm() {
  const [sending, setSending] = useState(false);
  const [done, setDone] = useState(false);
  const [err, setErr] = useState('');

  const onSubmit = async (e) => {
    e.preventDefault();
    setSending(true);
    setDone(false);
    setErr('');

    const fd = new FormData(e.currentTarget);
    const payload = {
      name: fd.get('name') + '',
      contact: fd.get('contact') + '',
      date: fd.get('date') + '',
      menu: fd.get('menu') + '',
      note: fd.get('note') + '',
    };

    try {
      const res = await fetch('/api/reserve', {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify(payload),
      });
      const json = await res.json();
      if (json.ok) setDone(true);
      else setErr(json.error || 'ERROR');
    } catch (e2) {
      setErr('NETWORK');
    } finally {
      setSending(false);
    }
  };

  if (done) {
    return <p style={{ padding: 12 }}>送信しました。ご連絡をお待ちください。</p>;
  }

  return (
    <form onSubmit={onSubmit} style={{ display: 'grid', gap: 8 }}>
      <input name="name" placeholder="お名前" required />
      <input name="contact" placeholder="連絡先（電話/メール/DMなど）" required />
      <input name="date" type="datetime-local" placeholder="希望日時" required />
      <input name="menu" placeholder="メニュー（任意）" />
      <textarea name="note" placeholder="ご要望など（任意）" rows={4} />
      {err && <p style={{ color: 'crimson' }}>エラー: {err}</p>}
      <button type="submit" disabled={sending}>
        {sending ? '送信中…' : '予約リクエストを送信'}
      </button>
    </form>
  );
}
