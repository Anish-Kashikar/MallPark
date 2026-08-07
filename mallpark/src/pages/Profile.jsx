import { useEffect, useState } from 'react';
import { useParkingStore } from '../store/parkingStore';

const fieldStyle = (bg, border, color) => ({ width: '100%', padding: '10px 12px', boxSizing: 'border-box', borderRadius: 8, border: `1px solid ${border}`, background: bg, color, fontSize: 13 });

export default function Profile() {
  const { theme, user, signIn, signOut, updateProfile, parkingHistory } = useParkingStore();
  const isDark = theme === 'dark';
  const text = isDark ? '#f4f4f5' : '#18181b'; const muted = isDark ? '#a1a1aa' : '#52525b';
  const border = isDark ? '#27272a' : '#e4e4e7'; const card = isDark ? '#18181b' : '#fff'; const input = isDark ? '#27272a' : '#f9f9f9';
  const [form, setForm] = useState(user || { name: '', email: '', phone: '', licensePlate: '' });
  const [saved, setSaved] = useState(false);
  useEffect(() => {
    if (user) setForm(user);
  }, [user]);
  const set = (key, value) => setForm({ ...form, [key]: value });
  const submit = (e) => {
    e.preventDefault();
    if (!form.name || !form.email) return;
    if (user) updateProfile(form);
    else signIn(form);
    setSaved(true);
  };

  return <div style={{ maxWidth: 850, margin: '0 auto' }}>
    <h1 style={{ color: text, fontSize: 24, marginBottom: 5 }}>Profile</h1>
    <p style={{ color: muted, fontSize: 14, marginBottom: 24 }}>{user ? 'Manage your parking details and history.' : 'Sign in locally to keep your parking details on this device.'}</p>
    <div className="page-two-column" style={{ display: 'grid', gridTemplateColumns: 'minmax(0, 1fr) minmax(0, 1fr)', gap: 20 }}>
      <form onSubmit={submit} style={{ background: card, border: `1px solid ${border}`, borderRadius: 14, padding: 22 }}>
        <p style={{ fontWeight: 700, color: text, marginBottom: 18 }}>{user ? 'Personal details' : 'Sign in'}</p>
        {['name', 'email', 'phone', 'licensePlate'].map((key) => <label key={key} style={{ display: 'block', fontSize: 12, fontWeight: 600, color: muted, marginBottom: 14 }}>{key === 'licensePlate' ? 'License plate' : key[0].toUpperCase() + key.slice(1)}
          <input required={key === 'name' || key === 'email'} type={key === 'email' ? 'email' : key === 'phone' ? 'tel' : 'text'} value={form[key]} onChange={(e) => set(key, key === 'licensePlate' ? e.target.value.toUpperCase() : e.target.value)} style={{ ...fieldStyle(input, border, text), marginTop: 5 }} placeholder={key === 'licensePlate' ? 'MH12AB1234' : ''} />
        </label>)}
        <button className="btn-yellow" type="submit" style={{ width: '100%' }}>{user ? 'Save profile' : 'Sign in'}</button>
        {saved && <p style={{ color: '#22c55e', fontSize: 12, textAlign: 'center', marginTop: 10 }}>Profile saved on this device.</p>}
        {user && <button type="button" onClick={() => signOut()} style={{ width: '100%', marginTop: 10, padding: 10, borderRadius: 8, border: `1px solid ${border}`, background: 'transparent', color: muted, cursor: 'pointer' }}>Sign out</button>}
      </form>
      <section style={{ background: card, border: `1px solid ${border}`, borderRadius: 14, padding: 22 }}>
        <p style={{ fontWeight: 700, color: text, marginBottom: 14 }}>Parking history</p>
        {parkingHistory.length === 0 ? <p style={{ color: muted, fontSize: 13 }}>Completed parking visits will appear here.</p> : <div style={{ display: 'grid', gap: 10 }}>{parkingHistory.map((entry) => <div key={`${entry.id}-${entry.completedAt}`} style={{ border: `1px solid ${border}`, borderRadius: 9, padding: 12 }}><b style={{ color: text, fontSize: 13 }}>{entry.slotId}</b><p style={{ color: muted, fontSize: 12, marginTop: 4 }}>{entry.vehicleType} · {entry.duration}hr</p><p style={{ color: muted, fontSize: 11, marginTop: 4 }}>{new Date(entry.completedAt).toLocaleString()}</p></div>)}</div>}
      </section>
    </div>
  </div>;
}
