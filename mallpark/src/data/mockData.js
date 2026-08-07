function randomItem(arr) {
  return arr[Math.floor(Math.random() * arr.length)];
}

function generatePlate() {
  const letters = 'ABCDEFGHJKLMNPQRSTUVWXYZ';
  const L = () => letters[Math.floor(Math.random() * letters.length)];
  const N = (n) => String(Math.floor(Math.random() * (10 ** n - 10 ** (n - 1)) + 10 ** (n - 1)));
  if (Math.random() < 0.92) return `MH12${L()}${L()}${N(4)}`;
  const others = ['MH14', 'MH20', 'MH43', 'DL04', 'KA03', 'GJ01', 'RJ14'];
  return `${randomItem(others)}${L()}${L()}${N(4)}`;
}

function generateSlots(floorCode, totalSlots) {
  const ROWS = 'ABCDEFGHIJ'.split('');
  const cols = 10;
  const rowCount = totalSlots / cols;
  const slots = [];
  const maxDisabledSlots = Math.max(1, Math.floor(totalSlots * 0.04));
  let disabledCount = 0;

  for (let r = 0; r < rowCount; r++) {
    const rowLetter = ROWS[r];
    const pairIndex = Math.floor(r / 2);
    const pairPosition = r % 2 === 0 ? 'top' : 'bottom';

    for (let c = 1; c <= cols; c++) {
      const slotNum = r * cols + c;
      const id = `${floorCode}-${String(slotNum).padStart(2, '0')}`;
      const rand = Math.random();

      let status;
      if (rand < 0.36) status = 'available';
      else if (rand < 0.62) status = 'occupied';
      else if (rand < 0.72) status = 'reserved';
      else if (rand < 0.80) status = 'ev';
      else if (rand < 0.97 || disabledCount >= maxDisabledSlots) status = 'vip';
      else {
        status = 'disabled';
        disabledCount += 1;
      }

      let type;
      if (status === 'ev') type = 'ev';
      else if (status === 'vip') type = 'vip';
      else if (status === 'disabled') type = 'disabled';
      else type = randomItem(['car', 'car', 'car', 'suv', 'bike', 'compact']);

      const vehicleMap = {
        car: 'Car', suv: 'SUV', bike: 'Bike', compact: 'Compact Car',
        ev: 'Electric Vehicle', vip: 'VIP / Luxury', disabled: 'Disabled',
      };

      const hasVehicle = status === 'occupied' || status === 'reserved' || status === 'vip';
      const wDist = Math.floor(Math.random() * 180) + 20;

      slots.push({
        id,
        number: id,
        floor: floorCode,
        row: rowLetter,
        col: c,
        slotNum,
        pairIndex,
        pairPosition,
        type,
        status,
        vehicleType: vehicleMap[type] || 'Car',
        plate: hasVehicle ? generatePlate() : null,
        distanceToWestGate: wDist,
        distanceToEastGate: Math.floor(Math.random() * 180) + 20,
        distanceToElevator: Math.floor(Math.random() * 100) + 10,
        nearestExit: `Exit ${randomItem(['West', 'East', 'North'])}`,
        walkingTime: Math.floor(Math.random() * 5) + 1,
        fee: type === 'vip' ? 80 : type === 'ev' ? 60 : type === 'bike' ? 20 : 40,
        lastUpdated: new Date(Date.now() - Math.random() * 600000).toISOString(),
      });
    }
  }
  return slots;
}

export const floors = [
  { id: 'B',  label: 'Basement',    shortLabel: 'B',  totalSlots: 80 },
  { id: 'G',  label: 'Ground Floor',shortLabel: 'G',  totalSlots: 80 },
  { id: 'F1', label: 'Floor 1',     shortLabel: 'F1', totalSlots: 60 },
  { id: 'F2', label: 'Floor 2',     shortLabel: 'F2', totalSlots: 60 },
  { id: 'F3', label: 'Floor 3',     shortLabel: 'F3', totalSlots: 60 },
];

export const parkingData = {
  B:  generateSlots('B',  80),
  G:  generateSlots('G',  80),
  F1: generateSlots('F1', 60),
  F2: generateSlots('F2', 60),
  F3: generateSlots('F3', 60),
};

export const gateLocations = {
  westGate: {
    label: 'West Gate', shortLabel: 'W',
    description: 'Main entrance — near Basement & Ground',
    nearestFloors: ['B', 'G', 'F3'],
  },
  eastGate: {
    label: 'East Gate', shortLabel: 'E',
    description: 'Secondary entrance — near Floor 1 & 2',
    nearestFloors: ['F1', 'F2', 'F3'],
  },
};

export const evChargers = [
  { id: 'EV01', location: 'Basement - Zone A', speed: 'Fast (50kW)',   status: 'available', waitTime: 0  },
  { id: 'EV02', location: 'Basement - Zone B', speed: 'Fast (50kW)',   status: 'occupied',  waitTime: 18 },
  { id: 'EV03', location: 'Ground - Zone C',   speed: 'Normal (22kW)', status: 'available', waitTime: 0  },
  { id: 'EV04', location: 'Ground - Zone D',   speed: 'Normal (22kW)', status: 'occupied',  waitTime: 25 },
  { id: 'EV05', location: 'Floor 1 - Zone A',  speed: 'Fast (50kW)',   status: 'available', waitTime: 0  },
  { id: 'EV06', location: 'Floor 1 - Zone B',  speed: 'Normal (22kW)', status: 'occupied',  waitTime: 12 },
  { id: 'EV07', location: 'Floor 2 - Zone A',  speed: 'Fast (50kW)',   status: 'available', waitTime: 0  },
  { id: 'EV08', location: 'Floor 3 - Zone A',  speed: 'Normal (22kW)', status: 'occupied',  waitTime: 30 },
];

export const analyticsData = {
  hourly: [
    { hour: '6am', occupancy: 10 }, { hour: '7am', occupancy: 22 },
    { hour: '8am', occupancy: 38 }, { hour: '9am', occupancy: 55 },
    { hour: '10am', occupancy: 70 },{ hour: '11am', occupancy: 82 },
    { hour: '12pm', occupancy: 90 },{ hour: '1pm', occupancy: 88 },
    { hour: '2pm', occupancy: 78 }, { hour: '3pm', occupancy: 75 },
    { hour: '4pm', occupancy: 80 }, { hour: '5pm', occupancy: 92 },
    { hour: '6pm', occupancy: 95 }, { hour: '7pm', occupancy: 88 },
    { hour: '8pm', occupancy: 72 }, { hour: '9pm', occupancy: 55 },
    { hour: '10pm', occupancy: 30 },
  ],
  weekly: [
    { day: 'Mon', visitors: 820 }, { day: 'Tue', visitors: 760 },
    { day: 'Wed', visitors: 880 }, { day: 'Thu', visitors: 910 },
    { day: 'Fri', visitors: 1050 },{ day: 'Sat', visitors: 1380 },
    { day: 'Sun', visitors: 1290 },
  ],
  vehicleTypes: [
    { name: 'Car', value: 54 }, { name: 'SUV', value: 20 },
    { name: 'Bike', value: 12 },{ name: 'EV', value: 9 },
    { name: 'Other', value: 5 },
  ],
  floorUsage: [
    { floor: 'Basement', used: 72 }, { floor: 'Ground', used: 88 },
    { floor: 'Floor 1', used: 65 },  { floor: 'Floor 2', used: 55 },
    { floor: 'Floor 3', used: 40 },
  ],
  parkingHistory: [
    { date: 'Mon', visitors: 320, avgDuration: 2.1 },
    { date: 'Tue', visitors: 290, avgDuration: 1.8 },
    { date: 'Wed', visitors: 410, avgDuration: 2.4 },
    { date: 'Thu', visitors: 380, avgDuration: 2.2 },
    { date: 'Fri', visitors: 520, avgDuration: 2.9 },
    { date: 'Sat', visitors: 680, avgDuration: 3.5 },
    { date: 'Sun', visitors: 610, avgDuration: 3.1 },
  ],
};

export const notifications = [
  { id: 1, type: 'available', message: 'Slot G-14 is now available',      time: '2m ago',  read: false },
  { id: 2, type: 'reserved',  message: 'Slot F1-03 has been reserved',    time: '8m ago',  read: false },
  { id: 3, type: 'warning',   message: 'Ground Floor is 90% full',        time: '15m ago', read: true  },
  { id: 4, type: 'ev',        message: 'EV Charger EV05 is now free',     time: '22m ago', read: true  },
  { id: 5, type: 'info',      message: 'Parking fee updated for weekends', time: '1h ago',  read: true  },
];

export const feeRules = {
  base: { car: 40, bike: 20, suv: 60, ev: 50, vip: 80 },
  tax: 0.18,
  evExtra: 30,
  vipSurcharge: 40,
  weekendMultiplier: 1.2,
  coupons: { MALL10: 10, FIRST20: 20, EV15: 15 },
};
