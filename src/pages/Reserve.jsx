// /src/pages/Reserve.jsx
import { useState } from "react";

function todayStr(offsetDays = 0) {
  const d = new Date();
  d.setDate(d.getDate() + offsetDays);
  return d.toISOString().slice(0,10);
}

const TIMES = [
  "10:00","11:00","12:00","13:00","14:00","15:00","16:00","17:00","18:00"
];

export default function Reserve() {
  const [date, setDate] = useState(todayStr(1));
  const [time, setTime] = useState(TIMES[0]);
  const [name, setName] = useState("");
  const [contact, setContact] = useState("");
  const [note, setNote] = useState("");
  const [sending, setSending] = useState(false);
  const [done, setDone] = useState(false);

  async function submit() {
    if (!name || !contact) return alert("お名前と連絡先は必須です。");
    setSending(true);
    try {
      const r = await fetch("/api/book", {
        method: "POST",
        headers: { "Content-Type":"application/json" },
        body: JSON.stringify({ date, time, name, contact, note })
      });
      const j = await r.json();
      if (!r.ok) throw new Error(j.error || "failed");
      setDone(true);
    } catch(e) {
      alert("送信に失敗しました。もう一度お試しください。");
    } finally {
      setSending(false);
    }
  }

  if (done) {
    return (
      <main>
        <div className="card">
          <h2>送信完了</h2>
          <p>ご予約ありがとうございます。内容を確認次第ご連絡いたします。</p>
          <a className="btn" href="/">トップへ戻る</a>
        </div>
      </main>
    );
  }

  return (
    <main>
      <div className="card">
        <h2>予約フォーム</h2>
        <div className="row">
          <div className="col">
            <label className="small">日付</label>
            <input className="input" type="date" value={date} onChange={e=>setDate(e.target.value)} />
          </div>
          <div className="col">
            <label className="small">時間</label>
            <select className="input" value={time} onChange={e=>setTime(e.target.value)}>
              {TIMES.map(t => <option key={t} value={t}>{t}</option>)}
            </select>
          </div>
        </div>
        <label className="small">お名前</label>
        <input className="input" value={name} onChange={e=>setName(e.target.value)} />

        <label className="small">連絡先（電話 or メール or LINE）</label>
        <input className="input" value={contact} onChange={e=>setContact(e.target.value)} />

        <label className="small">ご要望（任意）</label>
        <textarea className="input" rows="4" value={note} onChange={e=>setNote(e.target.value)} />

        <div style={{ marginTop: 12 }}>
          <button className="btn" onClick={submit} disabled={sending}>
            {sending ? "送信中…" : "予約を送信"}
          </button>
        </div>
      </div>
    </main>
  );
}
