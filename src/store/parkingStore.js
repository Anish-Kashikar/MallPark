import { create } from 'zustand';
import { parkingData, notifications as initialNotifications } from '../data/mockData';

const deepClone = (obj) => JSON.parse(JSON.stringify(obj));

export const useParkingStore = create((set, get) => ({
  theme: 'dark',
  slots: deepClone(parkingData),
  activeFloor: 'G',
  selectedSlot: null,
  notifications: deepClone(initialNotifications),
  reservations: [],
  favorites: [],
  animationsEnabled: true,
  notificationsEnabled: true,
  parkedSlot: null,
  parkedAt: null,
  navigationTarget: null,

  toggleTheme: () => set((s) => {
    const next = s.theme === 'dark' ? 'light' : 'dark';
    document.body.className = next;
    return { theme: next };
  }),

  setActiveFloor: (floor) => set({ activeFloor: floor, selectedSlot: null }),

  selectSlot: (slot) => set({ selectedSlot: slot }),

  clearSelectedSlot: () => set({ selectedSlot: null }),

  setParkHere: (slot) => set({
    parkedSlot: { ...slot },
    parkedAt: new Date().toISOString(),
  }),

  clearParkedSlot: () => set({ parkedSlot: null, parkedAt: null }),

  setNavigationTarget: (slot) => set({ navigationTarget: slot }),
  clearNavigationTarget: () => set({ navigationTarget: null }),

  reserveSlot: (slotId, floor, details) => set((s) => {
    const slots = deepClone(s.slots);
    const idx = slots[floor]?.findIndex((sl) => sl.id === slotId);
    if (idx > -1) {
      slots[floor][idx].status = 'reserved';
      slots[floor][idx].lastUpdated = new Date().toISOString();
      if (details.plate) slots[floor][idx].plate = details.plate;
    }

    const reservation = {
      id: `RES-${Date.now()}`,
      slotId,
      floor,
      ...details,
      createdAt: new Date().toISOString(),
      status: 'confirmed',
    };

    const notif = {
      id: Date.now(),
      type: 'reserved',
      message: `Slot ${slotId} has been reserved`,
      time: 'just now',
      read: false,
    };

    return {
      slots,
      reservations: [reservation, ...s.reservations],
      notifications: [notif, ...s.notifications],
      selectedSlot: null,
    };
  }),

  toggleFavorite: (slotId) => set((s) => ({
    favorites: s.favorites.includes(slotId)
      ? s.favorites.filter((f) => f !== slotId)
      : [...s.favorites, slotId],
  })),

  markAllRead: () => set((s) => ({
    notifications: s.notifications.map((n) => ({ ...n, read: true })),
  })),

  addNotification: (notif) => set((s) => ({
    notifications: [notif, ...s.notifications].slice(0, 40),
  })),

  simulateLiveUpdate: () => {
    const { slots, addNotification, notificationsEnabled } = get();
    const floorKeys = Object.keys(slots);
    const floor = floorKeys[Math.floor(Math.random() * floorKeys.length)];
    const floorSlots = slots[floor];
    const idx = Math.floor(Math.random() * floorSlots.length);
    const slot = floorSlots[idx];

    if (!slot || slot.status === 'vip' || slot.status === 'disabled') return;

    const newSlots = deepClone(slots);
    const cur = newSlots[floor][idx].status;
    let next;
    if (cur === 'available') next = Math.random() > 0.4 ? 'occupied' : 'reserved';
    else if (cur === 'occupied') next = 'available';
    else next = Math.random() > 0.5 ? 'occupied' : 'available';

    newSlots[floor][idx].status = next;
    newSlots[floor][idx].lastUpdated = new Date().toISOString();
    set({ slots: newSlots });

    if (notificationsEnabled) {
      const msgs = {
        available: `Slot ${slot.number} is now available`,
        occupied:  `Slot ${slot.number} is now occupied`,
        reserved:  `Slot ${slot.number} has been reserved`,
      };
      addNotification({ id: Date.now(), type: next, message: msgs[next], time: 'just now', read: false });
    }
  },

  toggleAnimations: () => set((s) => ({ animationsEnabled: !s.animationsEnabled })),
  toggleNotifications: () => set((s) => ({ notificationsEnabled: !s.notificationsEnabled })),
}));
