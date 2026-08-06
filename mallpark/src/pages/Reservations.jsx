import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useParkingStore } from '../store/parkingStore';
import { floors } from '../data/mockData';
import toast from 'react-hot-toast';
import { MdCheck } from 'react-icons/md';
import ParkingTicketModal from '../components/ParkingTicketModal';

export default function Reservations() {
  const { slots, theme, reservations, reserveSlot } = useParkingStore();
  const navigate = useNavigate();
  const isDark = theme === 'dark';

  const [form, setForm] = useState({
    floor: 'G',
    slot: '',
    vehicleType: 'Car',
    arrivalTime: '',
    duration: '1',
  });
  const [showModal, setShowModal] = useState(false);
  const [confirmed, setConfirmed] = useState(null);
  const [ticketReservation, setTicketReservation] = useState(null);
  const [ticketSlot, setTicketSlot] = useState(null);

  const text = isDark ? '#f4f4f5' : '#18181b';
  const muted = isDark ? '#71717a' : '#52525b';
  const border = isDark ? '#27272a' : '#e4e4e7';
  const cardBg = isDark ? '#18181b' : '#fff';
  const inputBg = isDark ? '#27272a' : '#f9f9f9';

  const availableSlots = (slots[form.floor] || []).filter((s) => ['available', 'vip', 'ev', 'disabled'].includes(s.status));

  const openTicket = (reservation) => {
    const slot = (slots[reservation.floor] || []).find((item) => item.id === reservation.slotId);
    if (!slot) return;
    setTicketSlot(slot);
    setTicketReservation(reservation);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!form.slot || !form.arrivalTime) {
      toast.error('Please fill all fields');
      return;
    }
    const slotObj = (slots[form.floor] || []).find((s) => s.id === form.slot);
    if (!slotObj) return;

    reserveSlot(form.slot, form.floor, {
      vehicleType: form.vehicleType,
      floor: form.floor,
      arrivalTime: form.arrivalTime,
      duration: parseInt(form.duration),
    });

    setConfirmed({
      number: slotObj.number,
      floor: floors.find((f) => f.id === form.floor)?.label,
      vehicleType: form.vehicleType,
      arrivalTime: form.arrivalTime,
      duration: form.duration,
      fee: slotObj.fee * parseInt(form.duration),
      id: `RES-${Date.now()}`,
    });
    setShowModal(true);
    setForm({ floor: 'G', slot: '', vehicleType: 'Car', arrivalTime: '', duration: '1' });
  };

  return (
    <div style={{ maxWidth: 900, margin: '0 auto' }}>
      <div style={{ marginBottom: 24 }}>
        <h1 style={{ fontSize: 24, fontWeight: 800, color: text, marginBottom: 4 }}>Reservations</h1>
        <p style={{ fontSize: 14, color: muted }}>Pre-book your parking slot before you arrive</p>
      </div>

      <div className="page-two-column" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20 }}>
        <div style={{ background: cardBg, border: `1px solid ${border}`, borderRadius: 14, padding: '24px' }}>
          <p style={{ fontWeight: 700, fontSize: 16, color: text, marginBottom: 20 }}>Book a Slot</p>
          <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
            {[
              {
                label: 'Floor',
                el: (
                  <select value={form.floor} onChange={(e) => setForm({ ...form, floor: e.target.value, slot: '' })} style={inputStyle(inputBg, border, text)}>
                    {floors.map((f) => <option key={f.id} value={f.id}>{f.label}</option>)}
                  </select>
                ),
              },
              {
                label: 'Bookable Slot',
                el: (
                  <select value={form.slot} onChange={(e) => setForm({ ...form, slot: e.target.value })} style={inputStyle(inputBg, border, text)}>
                    <option value="">Select a slot</option>
                    {availableSlots.map((s) => <option key={s.id} value={s.id}>{s.number} — {s.vehicleType}</option>)}
                  </select>
                ),
              },
              {
                label: 'Vehicle Type',
                el: (
                  <select value={form.vehicleType} onChange={(e) => setForm({ ...form, vehicleType: e.target.value })} style={inputStyle(inputBg, border, text)}>
                    {['Car', 'Bike', 'SUV', 'Electric Vehicle'].map((v) => <option key={v}>{v}</option>)}
                  </select>
                ),
              },
              {
                label: 'Arrival Time',
                el: (
                  <input type="datetime-local" value={form.arrivalTime} onChange={(e) => setForm({ ...form, arrivalTime: e.target.value })} style={inputStyle(inputBg, border, text)} />
                ),
              },
              {
                label: 'Duration (hours)',
                el: (
                  <select value={form.duration} onChange={(e) => setForm({ ...form, duration: e.target.value })} style={inputStyle(inputBg, border, text)}>
                    {[1, 2, 3, 4, 6, 8].map((h) => <option key={h} value={h}>{h} hr{h > 1 ? 's' : ''}</option>)}
                  </select>
                ),
              },
            ].map((field) => (
              <div key={field.label} style={{ display: 'flex', flexDirection: 'column', gap: 5 }}>
                <label style={{ fontSize: 12, fontWeight: 600, color: muted }}>{field.label}</label>
                {field.el}
              </div>
            ))}

            {form.slot && (
              <div style={{ padding: '10px 14px', background: isDark ? '#27272a' : '#fefce8', borderRadius: 8, border: '1px solid rgba(250,204,21,0.3)' }}>
                <p style={{ fontSize: 12, color: muted }}>Estimated Total</p>
                <p style={{ fontSize: 20, fontWeight: 800, color: '#facc15' }}>
                  ₹{((slots[form.floor] || []).find((s) => s.id === form.slot)?.fee || 0) * parseInt(form.duration)}
                </p>
              </div>
            )}

            <button type="submit" className="btn-yellow" style={{ marginTop: 4 }}>
              Reserve Parking
            </button>
          </form>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
          <p style={{ fontWeight: 700, fontSize: 15, color: text }}>Your Reservations ({reservations.length})</p>
          {reservations.length === 0 ? (
            <div style={{ background: cardBg, border: `1px solid ${border}`, borderRadius: 14, padding: '40px', textAlign: 'center' }}>
              <p style={{ fontSize: 14, color: muted }}>No reservations yet</p>
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 10, maxHeight: 500, overflowY: 'auto' }}>
              {reservations.map((r) => (
                <button key={r.id} onClick={() => openTicket(r)} title="Open parking ticket" style={{ background: cardBg, border: `1px solid ${border}`, borderRadius: 10, padding: '14px 16px', cursor: 'pointer', textAlign: 'left', width: '100%', fontFamily: 'Inter, sans-serif' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 6 }}>
                    <span style={{ fontWeight: 700, fontSize: 14, color: text }}>{r.slotId}</span>
                    <span style={{ fontSize: 11, padding: '2px 8px', borderRadius: 10, background: '#16a34a', color: '#fff' }}>Confirmed</span>
                  </div>
                  <p style={{ fontSize: 12, color: muted }}>{r.vehicleType} · {r.duration}hr · ₹{(r.duration * 40)}</p>
                  <p style={{ fontSize: 11, color: muted, marginTop: 4 }}>{new Date(r.createdAt).toLocaleString()}</p>
                </button>
              ))}
            </div>
          )}
        </div>
      </div>

      <AnimatePresence>
        {showModal && confirmed && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.6)', zIndex: 100, display: 'flex', alignItems: 'center', justifyContent: 'center' }}
            onClick={() => setShowModal(false)}
          >
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.8, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
              style={{ background: cardBg, border: `2px solid #facc15`, borderRadius: 18, padding: '34px', maxWidth: 360, width: '90%', textAlign: 'center' }}
            >
              <div style={{ width: 56, height: 56, borderRadius: '50%', background: '#22c55e', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 16px' }}>
                <MdCheck size={28} style={{ color: '#fff' }} />
              </div>
              <p style={{ fontWeight: 800, fontSize: 20, color: text, marginBottom: 6 }}>Reservation Confirmed!</p>
              <p style={{ fontSize: 13, color: muted, marginBottom: 20 }}>Slot <strong>{confirmed.number}</strong> on {confirmed.floor}</p>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 8, textAlign: 'left', marginBottom: 22 }}>
                {[
                  ['Booking ID', confirmed.id],
                  ['Vehicle', confirmed.vehicleType],
                  ['Duration', `${confirmed.duration} hr`],
                  ['Total Fee', `₹${confirmed.fee}`],
                ].map(([k, v]) => (
                  <div key={k} style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <span style={{ fontSize: 13, color: muted }}>{k}</span>
                    <span style={{ fontSize: 13, fontWeight: 600, color: text }}>{v}</span>
                  </div>
                ))}
              </div>
              <button onClick={() => setShowModal(false)} className="btn-yellow" style={{ width: '100%' }}>Done</button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {ticketSlot && ticketReservation && (
        <ParkingTicketModal
          slot={ticketSlot}
          reservation={ticketReservation}
          isDark={isDark}
          onClose={() => { setTicketSlot(null); setTicketReservation(null); }}
          onFindMyCar={() => navigate(`/map?find=${encodeURIComponent(ticketSlot.id)}`)}
        />
      )}
    </div>
  );
}

function inputStyle(bg, border, color) {
  return {
    background: bg, border: `1px solid ${border}`, borderRadius: 8,
    padding: '9px 12px', color, fontSize: 13, outline: 'none', width: '100%',
    fontFamily: 'Inter, sans-serif',
  };
}
