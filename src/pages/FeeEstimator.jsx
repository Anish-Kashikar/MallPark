import { useState } from 'react';
import { motion } from 'framer-motion';
import { useParkingStore } from '../store/parkingStore';
import { feeRules } from '../data/mockData';

export default function FeeEstimator() {
  const { theme } = useParkingStore();
  const isDark = theme === 'dark';

  const [form, setForm] = useState({
    vehicleType: 'car',
    duration: 2,
    isVIP: false,
    isEV: false,
    isWeekend: false,
    coupon: '',
  });
  const [result, setResult] = useState(null);
  const [couponError, setCouponError] = useState('');

  const text = isDark ? '#f4f4f5' : '#18181b';
  const muted = isDark ? '#71717a' : '#52525b';
  const border = isDark ? '#27272a' : '#e4e4e7';
  const cardBg = isDark ? '#18181b' : '#fff';
  const inputBg = isDark ? '#27272a' : '#f9f9f9';

  const calculate = () => {
    setCouponError('');
    let base = feeRules.base[form.vehicleType] || 40;
    let subtotal = base * form.duration;

    if (form.isEV) subtotal += feeRules.evExtra * form.duration;
    if (form.isVIP) subtotal += feeRules.vipSurcharge;
    if (form.isWeekend) subtotal = subtotal * feeRules.weekendMultiplier;

    const couponCode = form.coupon.trim().toUpperCase();
    let discount = 0;
    if (couponCode) {
      if (feeRules.coupons[couponCode]) {
        discount = (subtotal * feeRules.coupons[couponCode]) / 100;
      } else {
        setCouponError('Invalid coupon code');
      }
    }

    const taxable = subtotal - discount;
    const tax = taxable * feeRules.tax;
    const total = taxable + tax;

    setResult({ base: subtotal, discount, tax, total, coupon: couponCode && feeRules.coupons[couponCode] ? `${feeRules.coupons[couponCode]}% off` : null });
  };

  return (
    <div style={{ maxWidth: 600, margin: '0 auto' }}>
      <div style={{ marginBottom: 28 }}>
        <h1 style={{ fontSize: 24, fontWeight: 800, color: text, marginBottom: 4 }}>Fee Estimator</h1>
        <p style={{ fontSize: 14, color: muted }}>Calculate your parking cost before you arrive</p>
      </div>

      <div style={{ background: cardBg, border: `1px solid ${border}`, borderRadius: 14, padding: '28px' }}>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16, marginBottom: 16 }}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 5 }}>
            <label style={{ fontSize: 12, fontWeight: 600, color: muted }}>Vehicle Type</label>
            <select
              value={form.vehicleType}
              onChange={(e) => setForm({ ...form, vehicleType: e.target.value })}
              style={{ background: inputBg, border: `1px solid ${border}`, borderRadius: 8, padding: '9px 12px', color: text, fontSize: 13, outline: 'none' }}
            >
              <option value="car">Car — ₹{feeRules.base.car}/hr</option>
              <option value="bike">Bike — ₹{feeRules.base.bike}/hr</option>
              <option value="suv">SUV — ₹{feeRules.base.suv}/hr</option>
              <option value="ev">Electric Vehicle — ₹{feeRules.base.ev}/hr</option>
              <option value="vip">VIP — ₹{feeRules.base.vip}/hr</option>
            </select>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: 5 }}>
            <label style={{ fontSize: 12, fontWeight: 600, color: muted }}>Duration (hours): {form.duration}</label>
            <input
              type="range" min="1" max="12" value={form.duration}
              onChange={(e) => setForm({ ...form, duration: parseInt(e.target.value) })}
              style={{ accentColor: '#facc15', marginTop: 6 }}
            />
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 10, color: muted }}>
              <span>1hr</span><span>12hr</span>
            </div>
          </div>
        </div>

        <div style={{ display: 'flex', gap: 12, marginBottom: 16, flexWrap: 'wrap' }}>
          {[
            { key: 'isVIP', label: 'VIP Slot (+₹40)' },
            { key: 'isEV', label: 'EV Charging (+₹30/hr)' },
            { key: 'isWeekend', label: 'Weekend Rate (×1.2)' },
          ].map((opt) => (
            <label key={opt.key} style={{ display: 'flex', alignItems: 'center', gap: 7, cursor: 'pointer', fontSize: 13, color: text }}>
              <input
                type="checkbox"
                checked={form[opt.key]}
                onChange={(e) => setForm({ ...form, [opt.key]: e.target.checked })}
                style={{ accentColor: '#facc15', width: 15, height: 15 }}
              />
              {opt.label}
            </label>
          ))}
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 5, marginBottom: 20 }}>
          <label style={{ fontSize: 12, fontWeight: 600, color: muted }}>Coupon Code</label>
          <div style={{ display: 'flex', gap: 8 }}>
            <input
              value={form.coupon}
              onChange={(e) => { setForm({ ...form, coupon: e.target.value }); setCouponError(''); }}
              placeholder="e.g. MALL10, FIRST20"
              style={{ flex: 1, background: inputBg, border: `1px solid ${border}`, borderRadius: 8, padding: '9px 12px', color: text, fontSize: 13, outline: 'none', fontFamily: 'Inter, sans-serif' }}
            />
          </div>
          {couponError && <p style={{ fontSize: 12, color: '#dc2626' }}>{couponError}</p>}
          <p style={{ fontSize: 11, color: muted }}>Try: MALL10, FIRST20, EV15</p>
        </div>

        <button onClick={calculate} className="btn-yellow" style={{ width: '100%', marginBottom: 20 }}>
          Calculate Fee
        </button>

        {result && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            style={{ border: `1px solid rgba(250,204,21,0.4)`, borderRadius: 10, padding: '16px 18px', background: isDark ? '#27272a' : '#fefce8' }}
          >
            <p style={{ fontWeight: 700, fontSize: 14, color: text, marginBottom: 12 }}>Estimate Breakdown</p>
            {[
              { label: 'Base Amount', value: `₹${result.base.toFixed(2)}` },
              ...(result.coupon ? [{ label: `Coupon (${result.coupon})`, value: `-₹${result.discount.toFixed(2)}`, color: '#22c55e' }] : []),
              { label: 'GST (18%)', value: `₹${result.tax.toFixed(2)}` },
            ].map((row) => (
              <div key={row.label} style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8 }}>
                <span style={{ fontSize: 13, color: muted }}>{row.label}</span>
                <span style={{ fontSize: 13, color: row.color || text }}>{row.value}</span>
              </div>
            ))}
            <div style={{ borderTop: `1px solid ${border}`, paddingTop: 10, marginTop: 4, display: 'flex', justifyContent: 'space-between' }}>
              <span style={{ fontWeight: 700, color: text }}>Total</span>
              <span style={{ fontWeight: 800, fontSize: 20, color: '#facc15' }}>₹{result.total.toFixed(2)}</span>
            </div>
          </motion.div>
        )}
      </div>
    </div>
  );
}
