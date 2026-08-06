// theme.js
// ─────────────────────────────────────────────────────────────
// SINGLE SOURCE OF TRUTH FOR ALL COLORS IN THE PARKING APP.
// Change a value here and it updates everywhere it's used —
// slot statuses, dark/light surfaces, and brand accents.
// ─────────────────────────────────────────────────────────────

export const THEME = {
  // Brand / accent colors used across buttons, links, highlights, gates, etc.
  brand: {
    teal: '#1FA9A6',   // primary accent — nav, available, links, CTAs
    navy: '#0B3C5D',   // secondary accent — west gate, entrance banner
    red:  '#E63946',   // alerts — occupied indicators, high-occupancy
    gold: '#FACC15',   // "parked here" / navigation target highlight
  },

  // Per-status colors (slot bays, badges, legend). Each has a light/dark pair.
  status: {
    available: {
      dark:  { bg: '#97BC62', border: '', text: '#162105', dot: '#10B981' },
      light:  { bg: '#97BC62', border: '', text: '#162105', dot: '#10B981' },
    },
    occupied: {
      dark:  { bg: '#BD4444', border: '', text: '#FECDD3', dot: '#E11D48' },
      light:  { bg: '#BD4444', border: '', text: '#FECDD3', dot: '#E11D48' },
    },
    reserved: {
      dark:  { bg: '#e09f3e', border: '', text: '#fefeff', dot: '#6366F1' },
      light:  { bg: '#e09f3e', border: '', text: '#fefeff', dot: '#6366F1' },
    },
    ev: {
      dark:  { bg: '#AACDDC', border: '', text: '#00568b', dot: '#06B6D4' },
      light:  { bg: '#AACDDC', border: '', text: '#00568b', dot: '#06B6D4' },
    },
    vip: {
      dark:  { bg: '#6D4AFF', border: '', text: '#f0ebeb', dot: '#D97706' },
      light:  { bg: '#6D4AFF', border: '', text: '#f0ebeb', dot: '#D97706' },
    },
    disabled: {
      dark:  { bg: '#293241', border: '#64748B', text: '#94A3B8', dot: '#64748B' },
      light:  { bg: '#293241', border: '#64748B', text: '#94A3B8', dot: '#64748B' },
    },
  },

  // Surface / layout tokens — page bg, cards, text, borders, map colors.
  surface: {
    light: {
      bg:          '#f0f0f8',
      cardBg:      '#ffffff',
      panelBg:     '#ffffff',
      border:      '#e0e0ee',
      text:        '#2B2D42',
      muted:       '#7a7c92',
      inputBg:     '#f0f0f8',
      asphalt:     '#e8e8f4',
      pairGapBg:   '#d4d4e8',
      pairGapLine: '#c8c8dc',
      roadBg:      '#d8d8e8',
      rowLabel:    '#b0b0cc',
      hairline:    '#f0f0f8',
      divider:     'rgba(0,0,0,0.08)',
      dashLine:    'rgba(11,60,93,0.4)',
      isoShadow:   '#b0b0cc',
      isoMuted:    '#9a9aac',
    },
    dark: {
      bg:          '#0d1017',
      cardBg:      '#1b1f2e',
      panelBg:     '#161929',
      border:      'rgba(43,45,66,0.7)',
      text:        '#F4F1DE',
      muted:       '#8a8ea8',
      inputBg:     'rgba(43,45,66,0.5)',
      asphalt:     '#12151e',
      pairGapBg:   '#0a0c12',
      pairGapLine: '#1a1c28',
      roadBg:      '#0e1018',
      rowLabel:    '#3a3c55',
      hairline:    'rgba(43,45,66,0.5)',
      divider:     'rgba(255,255,255,0.12)',
      dashLine:    'rgba(250,204,21,0.35)',
      isoShadow:   '#06080e',
      isoMuted:    '#6b6d85',
    },
  },
};

/** Get the light/dark palette object for a given slot status. */
export function getSlotStyle(status, isDark) {
  const cfg = THEME.status[status] || THEME.status.available;
  return isDark ? cfg.dark : cfg.light;
}

/** Get the full surface token set for the current mode. */
export function getSurface(isDark) {
  return isDark ? THEME.surface.dark : THEME.surface.light;
}