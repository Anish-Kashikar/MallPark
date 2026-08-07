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
      light:  { bg: '#97BC62', border: 'white', text: '#162105', dot: '#10B981' },
    },
    occupied: {
      dark:  { bg: '#BD4444', border: '', text: '#FECDD3', dot: '#E11D48' },
      light:  { bg: '#E73F1E', border: 'white', text: '#FECDD3', dot: '#E11D48' },
    },
    reserved: {
      dark:  { bg: '#e09f3e', border: '', text: '#fefeff', dot: '#6366F1' },
      light:  { bg: '#FFBF00', border: 'white', text: '#fefeff', dot: '#6366F1' },
    },
    ev: {
      dark:  { bg: '#AACDDC', border: '', text: '#00568b', dot: '#06B6D4' },
      light:  { bg: '#AACDDC', border: 'white', text: '#00568b', dot: '#06B6D4' },
    },
    vip: {
      dark:  { bg: '#6D4AFF', border: '', text: '#f0ebeb', dot: '#D97706' },
      light:  { bg: '#6D4AFF', border: 'white', text: '#f0ebeb', dot: '#D97706' },
    },
    disabled: {
      dark:  { bg: '#293241', border: '', text: '#94A3B8', dot: '#64748B' },
      light:  { bg: '#293241', border: 'white', text: '#94A3B8', dot: '#64748B' },
    },
  },

  // Surface / layout tokens — page bg, cards, text, borders, map colors.
  surface: {
    light: {
      // Light concrete-forecourt wash for the page itself — neutral warm
      // grey, like daylight concrete rather than a tinted UI grey.
      bg:          'radial-gradient(120% 140% at 15% 0%, #f4f4f2 0%, #eceeec 45%, #e3e5e3 100%)',
      cardBg:      'linear-gradient(180deg, #ffffff 0%, #fbfbfa 100%)',
      panelBg:     'linear-gradient(180deg, #ffffff 0%, #faf9f7 100%)',
      border:      '#dcdcdc',
      text:        '#2B2D42',
      muted:       '#7a7c92',
      inputBg:     '#f0f0ee',
      // Real daylight-asphalt look: mid-grey tarmac with faint mottling/
      // sheen (like aggregate catching the light) instead of a flat tint.
      asphalt:
        'radial-gradient(circle at 20% 25%, rgba(255,255,255,0.30) 0%, rgba(255,255,255,0) 34%),' +
        'radial-gradient(circle at 75% 65%, rgba(255,255,255,0.18) 0%, rgba(255,255,255,0) 30%),' +
        'radial-gradient(circle at 45% 88%, rgba(0,0,0,0.10) 0%, rgba(0,0,0,0) 40%),' +
        'linear-gradient(160deg, #9a9c9e 0%, #8c8e91 45%, #7d7f83 100%)',
      pairGapBg:   'linear-gradient(180deg, #d6d7d5 0%, #c9cbc9 100%)',
      // Painted white curb/median line between bay pairs.
      pairGapLine: '#f4f4f2',
      // Driving lane: darker tarmac than the bays, like a well-used
      // through-lane, with a subtle center sheen.
      roadBg:
        'linear-gradient(180deg, #58595c 0%, #6a6c70 50%, #58595c 100%)',
      rowLabel:    '#e8e8e6',
      hairline:    '#f0f0ee',
      divider:     'rgba(0,0,0,0.08)',
      // Road-paint yellow for dashed lane lines and route markers —
      // the classic parking-lot lane-marking color.
      dashLine:    '#F4C430',
      isoShadow:   '#9a9b9e',
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