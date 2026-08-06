import { useState, useMemo, useEffect, useRef, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useParkingStore } from '../store/parkingStore';
import { floors, gateLocations } from '../data/mockData';
import { THEME, getSlotStyle, getSurface } from '../theme';
import {
  MdClose, MdBookmark, MdFavorite, MdFavoriteBorder,
  MdDirectionsWalk, MdElevator, MdMyLocation, MdSort,
  MdNavigation, MdMap, MdDirectionsCar,
  MdCarCrash, MdSearch,
} from 'react-icons/md';
import toast from 'react-hot-toast';
import ParkingTicketModal from '../components/ParkingTicketModal';

const SL_W = 66;
const SL_H = 84;
const SLOT_GAP = 12;
const ROAD_H = 48;
const PAIR_GAP = 24;
const ENTRANCE_H = 62;
const ROW_LBL = 28;
const PAIR_H = SL_H + ROAD_H + SL_H + PAIR_GAP;
const GRID_COLS = 10;
const GRID_W = ROW_LBL + GRID_COLS * SL_W + (GRID_COLS - 1) * SLOT_GAP;

function SlotBay({ slot, isSelected, isParked, isNavTarget, isDark, onClick }) {
  const s = getSlotStyle(slot.status, isDark);
  const { teal, gold } = THEME.brand;
  const accent = isSelected || isParked ? gold : isNavTarget ? teal : s.border;

  return (
    <motion.button
      whileHover={{ scale: 1.045, zIndex: 5 }}
      whileTap={{ scale: 0.97 }}
      onClick={() => onClick(slot)}
      title={`Parking space ${slot.id}`}
      style={{
        width: SL_W,
        height: SL_H,
        boxSizing: 'border-box',
        background: isParked ? `${gold}33` : s.bg,
        border: `2px solid ${accent}`,
        borderRadius: 3,
        cursor: slot.status === 'disabled' ? 'default' : 'pointer',
        display: 'flex', flexDirection: 'column',
        alignItems: 'center', justifyContent: 'space-between',
        padding: '9px 5px 7px',
        boxShadow: isParked ? `0 0 0 3px ${gold}33, 0 5px 10px #00000035` : `0 3px 6px #00000026`,
        position: 'relative',
        flexShrink: 0,
        transition: 'box-shadow 0.2s, border-color 0.2s',
        outline: 'none',
      }}
    >
      <span style={{ position: 'absolute', top: 6, left: 5, right: 5, borderTop: `1px solid ${s.border}88` }} />
      <span style={{ position: 'absolute', bottom: 5, left: 12, right: 12, height: 4, borderRadius: 4, background: isDark ? '#8b9099' : '#d6d9dd', opacity: 0.7 }} />

      {isParked && (
        <span style={{ position: 'absolute', top: 3, right: 3, fontSize: 8, background: gold, color: THEME.brand.navy, borderRadius: 3, padding: '1px 3px', fontWeight: 800, lineHeight: 1 }}>P</span>
      )}

      <span style={{
        fontSize: 8.5, fontWeight: 800, color: isParked ? gold : s.text,
        lineHeight: 1, letterSpacing: 0.3, textAlign: 'center',
        fontFamily: 'Inter, monospace', userSelect: 'none',
      }}>
        {slot.id}
      </span>

      <span style={{ width: 7, height: 7, borderRadius: '50%', background: isParked ? gold : s.dot, flexShrink: 0 }} />
    </motion.button>
  );
}

function RoadStrip({ isDark, rowA, rowB }) {
  const t = getSurface(isDark);
  return (
    <div style={{
      width: GRID_W - ROW_LBL, height: ROAD_H, background: t.roadBg,
      display: 'flex', alignItems: 'center',
      position: 'relative', marginLeft: ROW_LBL,
    }}>
      <div style={{
        position: 'absolute', top: '50%', left: 0, right: 0,
        transform: 'translateY(-50%)',
        borderTop: `2px dashed ${t.dashLine}`,
      }} />
      <span style={{
        position: 'absolute', left: 6, fontSize: 9, fontWeight: 600,
        color: t.dashLine,
        letterSpacing: 1, userSelect: 'none',
      }}>
        {rowA}→{rowB}
      </span>
    </div>
  );
}

function BayGrid({ rowPairs, selectedSlot, parkedSlot, navTarget, isDark, onSlotClick }) {
  const t = getSurface(isDark);

  return (
    <div style={{
      background: t.asphalt, borderRadius: 10, overflow: 'hidden',
      paddingBottom: 12, paddingRight: 0,
    }}>
      <div style={{
        width: GRID_W, height: ENTRANCE_H, background: t.roadBg,
        borderBottom: `2px dashed ${t.dashLine}`,
        display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 10,
        marginBottom: 0, boxSizing: 'border-box',
      }}>
        <motion.div animate={{ y: [0, -3, 0] }} transition={{ repeat: Infinity, duration: 1.4 }}>
          <span style={{ fontSize: 16 }}>🅿️</span>
        </motion.div>
        <span style={{ fontSize: 12, fontWeight: 700, color: '#fff', letterSpacing: 1.5 }}>ENTRANCE</span>
        <div style={{ width: 1, height: 20, background: 'rgba(255,255,255,0.2)' }} />
        <span style={{ fontSize: 10, color: 'rgba(255,255,255,0.65)' }}>↓ Drive in from Left &amp; Right</span>
      </div>

      {rowPairs.map((pair, pairIdx) => {
        const [topRow, bottomRow] = pair;
        return (
          <div key={pairIdx}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 0 }}>
              <span style={{
                width: ROW_LBL, fontSize: 10, fontWeight: 700, textAlign: 'center',
                color: t.rowLabel, flexShrink: 0,
              }}>{topRow[0]?.row}</span>
              <div style={{ display: 'flex', gap: SLOT_GAP }}>
                {topRow.map((slot) => (
                  <SlotBay
                    key={slot.id}
                    slot={slot}
                    isSelected={selectedSlot?.id === slot.id}
                    isParked={parkedSlot?.id === slot.id}
                    isNavTarget={navTarget?.id === slot.id}
                    isDark={isDark}
                    onClick={onSlotClick}
                  />
                ))}
              </div>
            </div>

            <RoadStrip isDark={isDark} rowA={topRow[0]?.row} rowB={bottomRow[0]?.row} />

            <div style={{ display: 'flex', alignItems: 'center', gap: 0 }}>
              <span style={{
                width: ROW_LBL, fontSize: 10, fontWeight: 700, textAlign: 'center',
                color: t.rowLabel, flexShrink: 0,
              }}>{bottomRow[0]?.row}</span>
              <div style={{ display: 'flex', gap: SLOT_GAP }}>
                {bottomRow.map((slot) => (
                  <SlotBay
                    key={slot.id}
                    slot={slot}
                    isSelected={selectedSlot?.id === slot.id}
                    isParked={parkedSlot?.id === slot.id}
                    isNavTarget={navTarget?.id === slot.id}
                    isDark={isDark}
                    onClick={onSlotClick}
                  />
                ))}
              </div>
            </div>

            {pairIdx < rowPairs.length - 1 && (
              <div style={{ height: PAIR_GAP, background: t.pairGapBg, display: 'flex', alignItems: 'center', paddingLeft: ROW_LBL + 6 }}>
                <div style={{ width: '100%', borderTop: `1px solid ${t.pairGapLine}` }} />
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}

function NavPathOverlay({ targetSlot, totalPairs, isDark }) {
  const pathRef = useRef(null);
  const [ready, setReady] = useState(false);
  const { teal, gold } = THEME.brand;

  // The route is constrained to the side aisle, drive aisle, and bay gaps.
  // It never crosses the painted area of a parking space.
  const entranceX = ROW_LBL / 2;
  const roadCenterY = ENTRANCE_H + targetSlot.pairIndex * PAIR_H + SL_H + ROAD_H / 2;
  const slotLeft = ROW_LBL + (targetSlot.col - 1) * (SL_W + SLOT_GAP);
  const bayGapX = targetSlot.col === GRID_COLS
    ? slotLeft - SLOT_GAP / 2
    : slotLeft + SL_W + SLOT_GAP / 2;
  const bayEdgeY = targetSlot.pairPosition === 'top'
    ? ENTRANCE_H + targetSlot.pairIndex * PAIR_H + SL_H + 3
    : ENTRANCE_H + targetSlot.pairIndex * PAIR_H + SL_H + ROAD_H - 3;

  const totalH = ENTRANCE_H + totalPairs * PAIR_H;
  const totalW = GRID_W;

  const pathD = `M ${entranceX} ${ENTRANCE_H / 2} L ${entranceX} ${roadCenterY} L ${bayGapX} ${roadCenterY} L ${bayGapX} ${bayEdgeY}`;

  useEffect(() => {
    setReady(false);
    const t = setTimeout(() => setReady(true), 100);
    return () => clearTimeout(t);
  }, [targetSlot.id]);

  useEffect(() => {
    if (ready && pathRef.current) {
      const len = pathRef.current.getTotalLength();
      pathRef.current.style.strokeDasharray = len;
      pathRef.current.style.strokeDashoffset = len;
      pathRef.current.style.transition = 'stroke-dashoffset 1.4s ease-in-out';
      requestAnimationFrame(() => {
        if (pathRef.current) pathRef.current.style.strokeDashoffset = '0';
      });
    }
  }, [ready]);

  return (
    <svg
      width={totalW}
      height={totalH}
      style={{ position: 'absolute', top: 0, left: 0, pointerEvents: 'none', overflow: 'visible' }}
    >
      <path
        ref={pathRef}
        d={pathD}
        fill="none"
        stroke={teal}
        strokeWidth={3}
        strokeLinecap="round"
        strokeLinejoin="round"
        opacity={0.85}
      />
      <motion.circle
        cx={bayGapX}
        cy={bayEdgeY}
        r={7}
        fill="none"
        stroke={teal}
        strokeWidth={2.5}
        animate={{ r: [6, 10, 6], opacity: [1, 0.4, 1] }}
        transition={{ repeat: Infinity, duration: 1.2 }}
      />
      <circle cx={bayGapX} cy={bayEdgeY} r={3} fill={teal} />
      <circle cx={entranceX} cy={ENTRANCE_H / 2} r={5} fill={gold} />
      <text x={entranceX + 8} y={ENTRANCE_H / 2 - 9} fontSize={9} fill={gold} fontWeight="bold" fontFamily="Inter, sans-serif">START</text>
    </svg>
  );
}

function NavigationSteps({ slot, floor, isDark }) {
  const t = getSurface(isDark);
  const { teal } = THEME.brand;
  const floorInfo = floors.find((f) => f.id === slot.floor);
  const isGround = slot.floor === 'G';
  const isBasement = slot.floor === 'B';
  const steps = [
    { label: isGround ? 'Enter from West Gate / East Gate' : isBasement ? 'Take the Basement Ramp' : 'Enter from Main Gate', sub: 'Ground level access', icon: '🚪' },
    ...(!isGround ? [{ label: isBasement ? 'Follow Basement signs' : `Take elevator to ${floorInfo?.label}`, sub: isBasement ? 'Level B1' : `Level ${floor}`, icon: '🛗' }] : []),
    { label: `Proceed to Row ${slot.row}`, sub: `Main corridor — follow Row ${slot.row} signage`, icon: '➡️' },
    { label: `Your slot: ${slot.id}`, sub: `${slot.pairPosition === 'top' ? 'Right side' : 'Left side'} of the road lane`, icon: '🅿️' },
  ];

  const [step, setStep] = useState(-1);
  useEffect(() => {
    setStep(-1);
    let i = 0;
    const id = setInterval(() => { setStep(i); i++; if (i >= steps.length) clearInterval(id); }, 600);
    return () => clearInterval(id);
  }, [slot.id]);

  return (
    <div style={{
      background: t.panelBg,
      border: `1px solid ${t.border}`, borderRadius: 12, padding: '14px 16px',
    }}>
      <p style={{ fontSize: 12, fontWeight: 700, color: teal, marginBottom: 12, display: 'flex', alignItems: 'center', gap: 6 }}>
        <MdNavigation size={14} /> Navigation Path
      </p>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 0 }}>
        {steps.map((s, i) => (
          <div key={i} style={{ display: 'flex', gap: 10 }}>
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
              <motion.div
                initial={{ scale: 0, opacity: 0 }}
                animate={step >= i ? { scale: 1, opacity: 1 } : { scale: 0, opacity: 0 }}
                transition={{ type: 'spring', stiffness: 400, damping: 25 }}
                style={{
                  width: 28, height: 28, borderRadius: '50%',
                  background: step >= i ? (i === steps.length - 1 ? teal : isDark ? '#1b2338' : '#f0f8ff') : 'transparent',
                  border: `2px solid ${step >= i ? teal : t.border}`,
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  fontSize: 13, flexShrink: 0,
                }}
              >
                {step >= i ? s.icon : ''}
              </motion.div>
              {i < steps.length - 1 && (
                <motion.div
                  animate={{ height: step > i ? 28 : 0 }}
                  style={{ width: 2, background: teal, borderRadius: 1, overflow: 'hidden', minHeight: 0 }}
                  transition={{ duration: 0.3, delay: 0.2 }}
                />
              )}
            </div>
            <motion.div
              initial={{ x: -10, opacity: 0 }}
              animate={step >= i ? { x: 0, opacity: 1 } : { x: -10, opacity: 0 }}
              style={{ paddingBottom: i < steps.length - 1 ? 14 : 0, paddingTop: 4 }}
            >
              <p style={{ fontSize: 12, fontWeight: 600, color: t.text }}>{s.label}</p>
              <p style={{ fontSize: 10, color: t.muted, marginTop: 1 }}>{s.sub}</p>
            </motion.div>
          </div>
        ))}
      </div>
    </div>
  );
}

function IsometricView({ floorsData, activeFloor, isDark }) {
  const t = getSurface(isDark);
  const { teal, red, gold } = THEME.brand;

  const occupancyColor = (slots) => {
    const pct = slots.filter((s) => s.status !== 'available' && s.status !== 'disabled').length / slots.length;
    if (pct > 0.85) return red;
    if (pct > 0.55) return '#f59e0b';
    return teal;
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: '100%', gap: 0 }}>
      <p style={{ fontSize: 11, color: t.isoMuted, marginBottom: 24, letterSpacing: 0.5 }}>3D Isometric View</p>
      <div style={{ perspective: 600, perspectiveOrigin: '50% 30%' }}>
        <div style={{ transform: 'rotateX(52deg) rotateZ(-42deg)', transformStyle: 'preserve-3d', position: 'relative' }}>
          {[...floors].reverse().map((floor, revIdx) => {
            const idx = floors.length - 1 - revIdx;
            const slotArr = floorsData[floor.id] || [];
            const color = occupancyColor(slotArr);
            const isActive = floor.id === activeFloor;
            const occ = Math.round(slotArr.filter((s) => s.status !== 'available' && s.status !== 'disabled').length / Math.max(slotArr.length, 1) * 100);

            return (
              <div key={floor.id} style={{
                width: 220, height: 90,
                background: `linear-gradient(135deg, ${color}55, ${color}22)`,
                border: `2px solid ${isActive ? gold : color}`,
                borderRadius: 6,
                position: 'relative',
                marginBottom: -30,
                boxShadow: `4px 4px 0 ${t.isoShadow}`,
                display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                padding: '0 16px',
              }}>
                <div>
                  <p style={{ fontSize: 10, fontWeight: 700, color: isActive ? gold : t.text }}>{floor.label}</p>
                  <p style={{ fontSize: 9, color: t.isoMuted, marginTop: 2 }}>{floor.totalSlots} slots</p>
                </div>
                <div style={{ textAlign: 'right' }}>
                  <p style={{ fontSize: 18, fontWeight: 800, color }}>{occ}%</p>
                  <p style={{ fontSize: 8, color: t.isoMuted }}>occupied</p>
                </div>
                {Array.from({ length: 8 }).map((_, ci) => (
                  <div key={ci} style={{
                    position: 'absolute', bottom: 4, left: 12 + ci * 24,
                    width: 16, height: 8, borderRadius: 2,
                    background: Math.random() > 0.4 ? color : 'rgba(255,255,255,0.1)',
                    opacity: 0.7,
                  }} />
                ))}
              </div>
            );
          })}
        </div>
      </div>
      <div style={{ marginTop: 40, display: 'flex', gap: 14, fontSize: 10, color: t.isoMuted }}>
        <span>● Teal = low occupancy</span>
        <span>● Amber = medium</span>
        <span>● Red = high</span>
      </div>
    </div>
  );
}

export default function ParkingMap() {
  const {
    slots, activeFloor, setActiveFloor, selectedSlot, selectSlot, clearSelectedSlot,
    reserveSlot, toggleFavorite, favorites, theme, notifications, addNotification,
    parkedSlot, setParkHere, clearParkedSlot, setNavigationTarget, navigationTarget, clearNavigationTarget,
    reservations,
  } = useParkingStore();

  const [search, setSearch] = useState('');
  const [filterStatus, setFilterStatus] = useState('');
  const [sortBy, setSortBy] = useState('default');
  const [viewMode, setViewMode] = useState('bay');
  const [showTicket, setShowTicket] = useState(false);
  const [lastReservation, setLastReservation] = useState(null);
  const [ticketSlot, setTicketSlot] = useState(null);
  const [vehiclePlate, setVehiclePlate] = useState('');
  const [navigating, setNavigating] = useState(false);
  const prevNotifsLen = useRef(notifications.length);
  const isDark = theme === 'dark';

  // All colors for this view now come from the theme in one place.
  const t = getSurface(isDark);
  const { teal, navy, red, gold } = THEME.brand;
  const bg      = t.bg;
  const cardBg  = t.cardBg;
  const border  = t.border;
  const text    = t.text;
  const muted   = t.muted;
  const inputBg = t.inputBg;

  useEffect(() => {
    if (notifications.length > prevNotifsLen.current) {
      const n = notifications[0];
      if (n && !n.read) {
        const icons = { available: '🟢', occupied: '🔴', reserved: '🔵', ev: '⚡', confirmed: '✅' };
        toast(`${icons[n.type] || '📍'} ${n.message}`, {
          duration: 3500,
          style: { fontSize: 13, fontFamily: 'Inter, sans-serif' },
        });
      }
    }
    prevNotifsLen.current = notifications.length;
  }, [notifications]);

  const rawSlots = useMemo(() => slots[activeFloor] || [], [slots, activeFloor]);
  const searchMatches = useMemo(() => {
    const query = search.trim().toLowerCase();
    if (!query) return [];
    return Object.values(slots).flat().filter((slot) => slot.id.toLowerCase().includes(query)).slice(0, 8);
  }, [slots, search]);

  const openSearchResult = (slot) => {
    setActiveFloor(slot.floor);
    selectSlot(slot);
    setSearch('');
    setViewMode('bay');
    clearNavigationTarget();
  };

  const rowPairs = useMemo(() => {
    let s = [...rawSlots];
    if (filterStatus) s = s.filter((sl) => sl.status === filterStatus);

    if (sortBy === 'westGate') s.sort((a, b) => a.distanceToWestGate - b.distanceToWestGate);
    else if (sortBy === 'eastGate') s.sort((a, b) => a.distanceToEastGate - b.distanceToEastGate);

    const pairs = {};
    s.forEach((sl) => {
      if (!pairs[sl.pairIndex]) pairs[sl.pairIndex] = { top: [], bottom: [] };
      pairs[sl.pairIndex][sl.pairPosition].push(sl);
    });

    return Object.values(pairs).filter((p) => p.top.length || p.bottom.length).map((p) => [p.top, p.bottom]);
  }, [rawSlots, filterStatus, sortBy]);

  const counts = useMemo(() => ({
    available: rawSlots.filter((x) => x.status === 'available').length,
    occupied:  rawSlots.filter((x) => x.status === 'occupied').length,
    reserved:  rawSlots.filter((x) => x.status === 'reserved').length,
  }), [rawSlots]);

  const activeFloorInfo = floors.find((f) => f.id === activeFloor);
  const nearGates = Object.entries(gateLocations).filter(([, g]) => g.nearestFloors.includes(activeFloor));

  const handleReserve = () => {
    if (!selectedSlot) return;
    const plate = vehiclePlate.trim() || `MH12${['A','B','C','D'][Math.floor(Math.random()*4)]}${['X','Y','Z','W'][Math.floor(Math.random()*4)]}${String(Math.floor(Math.random()*9000)+1000)}`;
    reserveSlot(selectedSlot.id, activeFloor, {
      vehicleType: selectedSlot.vehicleType,
      floor: activeFloor,
      arrivalTime: new Date().toISOString(),
      duration: 2,
      plate,
    });
    const res = {
      id: `RES-${Date.now()}`,
      slotId: selectedSlot.id,
      floor: activeFloor,
      vehicleType: selectedSlot.vehicleType,
      arrivalTime: new Date().toISOString(),
      duration: 2,
      plate,
      createdAt: new Date().toISOString(),
      status: 'confirmed',
    };
    setLastReservation(res);
    setTicketSlot({ ...selectedSlot });
    setShowTicket(true);
    setVehiclePlate('');
  };

  const handleNavigate = () => {
    if (!selectedSlot) return;
    setViewMode('navigate');
    setNavigating(true);
    setNavigationTarget(selectedSlot);
    toast(`🧭 Navigating to ${selectedSlot.id}`, { duration: 2500 });
  };

  const handleFindMyCar = (slot) => {
    if (!slot) return;
    setActiveFloor(slot.floor);
    setNavigationTarget(slot);
    setViewMode('navigate');
    setNavigating(true);
    toast(`🚗 Finding your car at ${slot.id}`, { duration: 2500 });
  };

  const handleParkHere = () => {
    if (!selectedSlot) return;
    setParkHere(selectedSlot);
    toast.success(`📍 Marked as parked at ${selectedSlot.id}`);
  };

  const slotCfg = (status) => {
    const s = getSlotStyle(status, isDark);
    const labels = { available: 'Available', occupied: 'Occupied', reserved: 'Reserved', ev: 'EV Charging', vip: 'VIP', disabled: 'Disabled' };
    return { bg: s.bg, border: s.border, text: s.text, dot: s.dot, label: labels[status] || labels.available };
  };

  const totalPairs = rowPairs.length;

  return (
    <div style={{ display: 'flex', gap: 12, height: 'calc(100vh - 100px)', fontFamily: 'Inter, sans-serif' }}>

      <div style={{ width: 148, flexShrink: 0, display: 'flex', flexDirection: 'column', gap: 3, overflowY: 'auto' }}>
        <p style={{ fontSize: 10, fontWeight: 700, color: muted, textTransform: 'uppercase', letterSpacing: 1.2, marginBottom: 4 }}>Floors</p>
        {floors.map((floor) => {
          const active = floor.id === activeFloor;
          return (
            <button
              key={floor.id}
              onClick={() => { setActiveFloor(floor.id); setSortBy('default'); setNavigating(false); clearNavigationTarget(); }}
              style={{
                padding: '8px 11px', borderRadius: 8,
                border: `1px solid ${active ? teal : border}`,
                background: active ? (isDark ? `${teal}26` : `${teal}1A`) : 'transparent',
                color: active ? teal : muted,
                fontWeight: active ? 700 : 500, fontSize: 12,
                cursor: 'pointer', textAlign: 'left', fontFamily: 'Inter, sans-serif',
                display: 'flex', justifyContent: 'space-between', alignItems: 'center',
              }}
            >
              <span>{floor.label}</span>
              <span style={{ fontSize: 10, opacity: 0.7 }}>{floor.totalSlots}</span>
            </button>
          );
        })}

        {parkedSlot && (
          <div style={{ marginTop: 8 }}>
            <button
              onClick={() => handleFindMyCar(parkedSlot)}
              style={{
                width: '100%', padding: '9px 10px', borderRadius: 8,
                border: `2px solid ${gold}`, background: `${gold}1F`,
                color: gold, fontWeight: 700, fontSize: 11,
                cursor: 'pointer', fontFamily: 'Inter, sans-serif',
                display: 'flex', alignItems: 'center', gap: 6,
              }}
            >
              <MdDirectionsCar size={14} /> Find My Car
            </button>
            <p style={{ fontSize: 9, color: muted, marginTop: 4, textAlign: 'center' }}>Parked at {parkedSlot.id}</p>
          </div>
        )}

        <div style={{ marginTop: 14, display: 'flex', flexDirection: 'column', gap: 3 }}>
          <p style={{ fontSize: 10, fontWeight: 700, color: muted, textTransform: 'uppercase', letterSpacing: 1.2, marginBottom: 2 }}>Sort by Gate</p>
          {[
            { key: 'default',  label: 'Default',   col: muted },
            { key: 'westGate', label: 'West Gate',  col: navy  },
            { key: 'eastGate', label: 'East Gate',  col: teal  },
          ].map((opt) => {
            const active = sortBy === opt.key;
            return (
              <button
                key={opt.key}
                onClick={() => { setSortBy(opt.key); clearSelectedSlot(); }}
                style={{
                  padding: '7px 10px', borderRadius: 7,
                  border: `1px solid ${active ? opt.col : border}`,
                  background: active ? `${opt.col}18` : 'transparent',
                  color: active ? opt.col : muted,
                  display: 'flex', alignItems: 'center', gap: 6,
                  cursor: 'pointer', fontSize: 11, fontWeight: active ? 700 : 500,
                  fontFamily: 'Inter, sans-serif',
                }}
              >
                <MdSort size={11} /> {opt.label}
                {active && opt.key !== 'default' && <span style={{ marginLeft: 'auto', fontSize: 8, background: opt.col, color: '#fff', borderRadius: 3, padding: '1px 4px' }}>ON</span>}
              </button>
            );
          })}
        </div>

        <div style={{ marginTop: 14, display: 'flex', flexDirection: 'column', gap: 5 }}>
          <p style={{ fontSize: 10, fontWeight: 700, color: muted, textTransform: 'uppercase', letterSpacing: 1.2, marginBottom: 2 }}>Legend</p>
          {[
            { label: 'Available', dot: getSlotStyle('available', isDark).dot },
            { label: 'Occupied',  dot: getSlotStyle('occupied', isDark).dot  },
            { label: 'Reserved',  dot: getSlotStyle('reserved', isDark).dot  },
            { label: 'EV',        dot: getSlotStyle('ev', isDark).dot        },
            { label: 'VIP',       dot: getSlotStyle('vip', isDark).dot       },
            { label: 'Disabled',  dot: getSlotStyle('disabled', isDark).dot  },
          ].map((item) => (
            <div key={item.label} style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
              <span style={{ width: 8, height: 8, borderRadius: 2, background: item.dot, flexShrink: 0 }} />
              <span style={{ fontSize: 11, color: muted }}>{item.label}</span>
            </div>
          ))}
        </div>
      </div>

      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 10, minWidth: 0 }}>
        <div style={{ display: 'flex', gap: 8, alignItems: 'center', flexWrap: 'wrap' }}>
          <div style={{ display: 'flex', gap: 1, background: isDark ? 'rgba(43,45,66,0.4)' : '#e8e8f4', borderRadius: 9, padding: 3 }}>
            {[
              { key: 'bay',      icon: MdMap,       label: 'Map View' },
              { key: 'navigate', icon: MdNavigation, label: 'Navigate' },
            ].map(({ key, icon: Icon, label }) => (
              <button
                key={key}
                onClick={() => setViewMode(key)}
                style={{
                  padding: '6px 12px', borderRadius: 7, border: 'none',
                  background: viewMode === key ? (isDark ? navy : '#ffffff') : 'transparent',
                  color: viewMode === key ? (key === 'navigate' ? teal : text) : muted,
                  fontWeight: viewMode === key ? 700 : 500, fontSize: 11,
                  cursor: 'pointer', fontFamily: 'Inter, sans-serif',
                  display: 'flex', alignItems: 'center', gap: 5,
                  boxShadow: viewMode === key ? '0 1px 4px rgba(0,0,0,0.2)' : 'none',
                }}
              >
                <Icon size={13} /> {label}
              </button>
            ))}
          </div>

          <div style={{ display: 'flex', gap: 5 }}>
            <div style={{ position: 'relative' }}>
              <MdSearch size={13} style={{ position: 'absolute', left: 8, top: '50%', transform: 'translateY(-50%)', color: muted }} />
              <input
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search any floor..."
                style={{
                  background: inputBg, border: `1px solid ${border}`, borderRadius: 7,
                  padding: '7px 10px 7px 26px', color: text, fontSize: 12, outline: 'none',
                  width: 130, fontFamily: 'Inter, sans-serif',
                }}
              />
              {search && (
                <div style={{ position: 'absolute', top: 'calc(100% + 4px)', left: 0, width: 220, zIndex: 20, background: cardBg, border: `1px solid ${border}`, borderRadius: 8, overflow: 'hidden', boxShadow: '0 8px 22px #00000025' }}>
                  {searchMatches.length ? searchMatches.map((slot) => (
                    <button key={slot.id} onClick={() => openSearchResult(slot)} style={{ width: '100%', padding: '9px 10px', border: 0, borderBottom: `1px solid ${t.hairline}`, background: 'transparent', color: text, textAlign: 'left', cursor: 'pointer', fontFamily: 'Inter, sans-serif' }}>
                      <strong>{slot.id}</strong><span style={{ marginLeft: 8, color: muted, fontSize: 11 }}>{floors.find((floor) => floor.id === slot.floor)?.label}</span>
                    </button>
                  )) : <p style={{ margin: 0, padding: 10, color: muted, fontSize: 11 }}>No spaces found on any floor.</p>}
                </div>
              )}
            </div>
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              style={{ background: inputBg, border: `1px solid ${border}`, borderRadius: 7, padding: '7px 8px', color: text, fontSize: 12, outline: 'none', cursor: 'pointer', fontFamily: 'Inter, sans-serif' }}
            >
              <option value="">All</option>
              <option value="available">Free</option>
              <option value="occupied">Taken</option>
              <option value="reserved">Reserved</option>
              <option value="ev">EV</option>
            </select>
            {(search || filterStatus) && (
              <button onClick={() => { setSearch(''); setFilterStatus(''); }} style={{ fontSize: 11, color: teal, background: 'transparent', border: 'none', cursor: 'pointer', fontFamily: 'Inter, sans-serif' }}>Clear</button>
            )}
          </div>

          <div style={{ marginLeft: 'auto', display: 'flex', gap: 12, fontSize: 11 }}>
            <span style={{ color: teal }}>● {counts.available} free</span>
            <span style={{ color: red  }}>● {counts.occupied} taken</span>
            <span style={{ color: '#4d9ac7' }}>● {counts.reserved} reserved</span>
            {nearGates.map(([key, gate]) => (
              <span key={key} style={{
                padding: '2px 8px', borderRadius: 10, fontSize: 10, fontWeight: 600,
                background: key === 'westGate' ? `${navy}22` : `${teal}18`,
                border: `1px solid ${key === 'westGate' ? navy : teal}55`,
                color: key === 'westGate' ? (isDark ? '#5aafd4' : navy) : teal,
                display: 'flex', alignItems: 'center', gap: 4,
              }}>
                <MdMyLocation size={9} /> {gate.label}
              </span>
            ))}
          </div>
        </div>

        <div style={{
          flex: 1, background: cardBg, border: `1px solid ${border}`,
          borderRadius: 12, overflow: 'auto', padding: '14px 16px',
          position: 'relative',
        }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
            <div>
              <p style={{ fontWeight: 700, fontSize: 14, color: text }}>{activeFloorInfo?.label}</p>
              <p style={{ fontSize: 11, color: muted, marginTop: 1 }}>
                {viewMode === 'navigate' && navigationTarget
                  ? `Navigating to ${navigationTarget.id} — Row ${navigationTarget.row}`
                  : `${activeFloorInfo?.totalSlots} slots · Rows A–${activeFloorInfo?.totalSlots === 80 ? 'H' : 'F'} · 10 per row`}
              </p>
            </div>
          </div>

          {viewMode === 'navigate' && navigationTarget && navigationTarget.floor === activeFloor ? (
            <div style={{ display: 'flex', gap: 14 }}>
              <div style={{ flex: 1, position: 'relative', overflowX: 'auto' }}>
                <BayGrid
                  rowPairs={rowPairs}
                  selectedSlot={selectedSlot}
                  parkedSlot={parkedSlot}
                  navTarget={navigationTarget}
                  isDark={isDark}
                  onSlotClick={selectSlot}
                />
                {navigationTarget && rowPairs.length > 0 && (
                  <div style={{ position: 'absolute', top: 0, left: 0, pointerEvents: 'none' }}>
                    <NavPathOverlay targetSlot={navigationTarget} totalPairs={totalPairs} isDark={isDark} />
                  </div>
                )}
              </div>
              <div style={{ width: 220, flexShrink: 0 }}>
                <NavigationSteps slot={navigationTarget} floor={activeFloor} isDark={isDark} />
                <button
                  onClick={() => { setViewMode('bay'); clearNavigationTarget(); setNavigating(false); }}
                  style={{ width: '100%', marginTop: 8, padding: '8px', borderRadius: 8, border: `1px solid ${border}`, background: 'transparent', color: muted, fontSize: 12, cursor: 'pointer', fontFamily: 'Inter, sans-serif' }}
                >
                  ✕ Exit Navigation
                </button>
              </div>
            </div>
          ) : (
            <div style={{ overflowX: 'auto' }}>
              <BayGrid
                rowPairs={rowPairs}
                selectedSlot={selectedSlot}
                parkedSlot={parkedSlot}
                navTarget={navigationTarget}
                isDark={isDark}
                onSlotClick={selectSlot}
              />
            </div>
          )}
        </div>
      </div>

      <AnimatePresence>
        {selectedSlot && (
          <motion.div
            key="detail"
            initial={{ x: 280, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            exit={{ x: 280, opacity: 0 }}
            transition={{ type: 'spring', stiffness: 320, damping: 32 }}
            style={{
              width: 252, flexShrink: 0, background: t.panelBg,
              border: `1px solid ${border}`, borderRadius: 12,
              padding: 16, overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: 10,
            }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
              <div>
                <p style={{ fontSize: 18, fontWeight: 900, color: text, letterSpacing: '-0.5px', fontFamily: 'Space Grotesk, Inter, sans-serif' }}>
                  {selectedSlot.id}
                </p>
                <span style={{
                  display: 'inline-flex', alignItems: 'center', gap: 5,
                  marginTop: 5, padding: '2px 9px', borderRadius: 20,
                  background: slotCfg(selectedSlot.status).bg,
                  border: `1px solid ${slotCfg(selectedSlot.status).border}40`,
                  fontSize: 10, fontWeight: 600, color: slotCfg(selectedSlot.status).text,
                }}>
                  <span style={{ width: 5, height: 5, borderRadius: '50%', background: slotCfg(selectedSlot.status).dot }} />
                  {slotCfg(selectedSlot.status).label}
                </span>
              </div>
              <button onClick={clearSelectedSlot} style={{ background: 'transparent', border: 'none', cursor: 'pointer', color: muted, padding: 2 }}>
                <MdClose size={18} />
              </button>
            </div>

            {selectedSlot.plate && (
              <div style={{
                background: isDark ? `${navy}4D` : '#f0f8ff',
                border: `1px solid ${navy}40`, borderRadius: 8, padding: '8px 12px',
                display: 'flex', alignItems: 'center', gap: 8,
              }}>
                <MdDirectionsCar size={14} style={{ color: isDark ? '#5aafd4' : navy }} />
                <span style={{ fontFamily: 'monospace', fontWeight: 700, fontSize: 12, color: isDark ? '#90c4e8' : navy, letterSpacing: 1 }}>
                  {selectedSlot.plate}
                </span>
              </div>
            )}

            <div style={{ display: 'flex', flexDirection: 'column' }}>
              {[
                { label: 'Type',         value: selectedSlot.vehicleType },
                { label: 'Floor',        value: floors.find((f) => f.id === selectedSlot.floor)?.label },
                { label: 'Row',          value: `Row ${selectedSlot.row}, Pair ${selectedSlot.pairIndex + 1}` },
                { label: '→ West Gate',  value: `${selectedSlot.distanceToWestGate}m`, color: isDark ? '#5aafd4' : navy },
                { label: '→ East Gate',  value: `${selectedSlot.distanceToEastGate}m`, color: teal },
                { label: '→ Elevator',   value: `${selectedSlot.distanceToElevator}m` },
                { label: 'Walk Time',    value: `~${selectedSlot.walkingTime} min` },
              ].map((row, i) => (
                <div key={i} style={{ display: 'flex', justifyContent: 'space-between', padding: '6px 0', borderBottom: `1px solid ${t.hairline}` }}>
                  <span style={{ fontSize: 11, color: muted }}>{row.label}</span>
                  <span style={{ fontSize: 12, fontWeight: 600, color: row.color || text }}>{row.value}</span>
                </div>
              ))}
            </div>

            <div style={{ padding: '10px 12px', borderRadius: 8, background: isDark ? `${teal}1A` : `${teal}0F`, border: `1px solid ${teal}40` }}>
              <p style={{ fontSize: 10, color: muted }}>Estimated Fee</p>
              <p style={{ fontSize: 22, fontWeight: 800, color: teal }}>₹{selectedSlot.fee}<span style={{ fontSize: 12, color: muted }}>/hr</span></p>
            </div>

            {selectedSlot.status === 'available' && (
              <div>
                <input
                  value={vehiclePlate}
                  onChange={(e) => setVehiclePlate(e.target.value.toUpperCase())}
                  placeholder="Vehicle No. (e.g. MH12AB1234)"
                  style={{
                    width: '100%', padding: '8px 10px', borderRadius: 8,
                    border: `1px solid ${border}`, background: inputBg,
                    color: text, fontSize: 12, outline: 'none', marginBottom: 8,
                    fontFamily: 'monospace', letterSpacing: 1,
                  }}
                />
                <button
                  onClick={handleReserve}
                  style={{
                    width: '100%', padding: '10px', borderRadius: 9, border: 'none',
                    background: teal, color: '#fff', fontWeight: 700, fontSize: 13,
                    cursor: 'pointer', fontFamily: 'Inter, sans-serif',
                    display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6,
                  }}
                >
                  <MdBookmark size={15} /> Reserve Slot
                </button>
              </div>
            )}

            {(selectedSlot.status === 'occupied' || selectedSlot.status === 'reserved') && (
              <button
                onClick={handleParkHere}
                style={{
                  width: '100%', padding: '9px', borderRadius: 9, border: `2px solid ${parkedSlot?.id === selectedSlot.id ? gold : border}`,
                  background: parkedSlot?.id === selectedSlot.id ? `${gold}1F` : 'transparent',
                  color: parkedSlot?.id === selectedSlot.id ? gold : muted,
                  fontWeight: 600, fontSize: 12, cursor: 'pointer', fontFamily: 'Inter, sans-serif',
                  display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6,
                }}
              >
                <MdCarCrash size={14} />
                {parkedSlot?.id === selectedSlot.id ? '✓ Parked Here' : 'I Parked Here'}
              </button>
            )}

            <div style={{ display: 'flex', gap: 6 }}>
              <button
                onClick={handleNavigate}
                style={{
                  flex: 1, padding: '8px', borderRadius: 8,
                  border: `1px solid ${teal}55`, background: isDark ? `${teal}14` : `${teal}0F`,
                  color: teal, fontWeight: 600, fontSize: 12, cursor: 'pointer',
                  fontFamily: 'Inter, sans-serif',
                  display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 4,
                }}
              >
                <MdNavigation size={13} /> Navigate
              </button>
              <button
                onClick={() => toggleFavorite(selectedSlot.id)}
                style={{
                  flex: 1, padding: '8px', borderRadius: 8,
                  border: `1px solid ${favorites.includes(selectedSlot.id) ? gold : border}`,
                  background: 'transparent',
                  color: favorites.includes(selectedSlot.id) ? gold : muted,
                  cursor: 'pointer', fontSize: 12, fontFamily: 'Inter, sans-serif',
                  display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 4,
                }}
              >
                {favorites.includes(selectedSlot.id) ? <MdFavorite size={13} /> : <MdFavoriteBorder size={13} />}
                Save
              </button>
            </div>

            <p style={{ fontSize: 9, color: isDark ? '#2a2c40' : '#d0d0e8' }}>Updated {new Date(selectedSlot.lastUpdated).toLocaleTimeString()}</p>
          </motion.div>
        )}
      </AnimatePresence>

      {showTicket && lastReservation && ticketSlot && (
        <ParkingTicketModal
          slot={ticketSlot}
          reservation={lastReservation}
          onClose={() => setShowTicket(false)}
          onFindMyCar={(s) => { setParkHere(s); handleFindMyCar(s); }}
          isDark={isDark}
        />
      )}
    </div>
  );
}