import type { Station, Train } from "./types";
import { stations } from "./stations";

// Helper to get station by id and add arrivalTime
function getStationWithTime(id: string, arrivalTime: string) {
  const base = stations.find((s) => s.id === id);
  if (!base) throw new Error(`Station ${id} not found`);
  return { ...base, arrivalTime };
}

// Add routePoints to each train for more realistic map plotting
function makeRoutePoints(schedule: Station[]) {
  // For now, just interpolate a few points between each pair of stations
  const points = [];
  for (let i = 0; i < schedule.length - 1; i++) {
    const a = schedule[i];
    const b = schedule[i + 1];
    points.push({ latitude: a.latitude, longitude: a.longitude });
    // Add 2 interpolated points between each station for a smoother curve
    points.push({
      latitude: a.latitude + (b.latitude - a.latitude) / 3,
      longitude: a.longitude + (b.longitude - a.longitude) / 3,
    });
    points.push({
      latitude: a.latitude + 2 * (b.latitude - a.latitude) / 3,
      longitude: a.longitude + 2 * (b.longitude - a.longitude) / 3,
    });
  }
  // Add the last station
  points.push({ latitude: schedule[schedule.length - 1].latitude, longitude: schedule[schedule.length - 1].longitude });
  return points;
}

// Add a new mock train from Dadar to Borivali
const dadarToBorivaliSchedule: Station[] = [
  {
    id: "DDR",
    name: "Dadar",
    latitude: 19.0183,
    longitude: 72.8446,
    arrivalTime: "10:00",
  },
  {
    id: "BA",
    name: "Bandra",
    latitude: 19.0544,
    longitude: 72.8402,
    arrivalTime: "10:15",
  },
  {
    id: "ADH",
    name: "Andheri",
    latitude: 19.1197,
    longitude: 72.8468,
    arrivalTime: "10:35",
  },
  {
    id: "BVI",
    name: "Borivali",
    latitude: 19.2290,
    longitude: 72.8570,
    arrivalTime: "11:00",
  },
];

const dadarToBorivaliTrain: Train = {
  id: "DDR-BVI-1001",
  name: "Dadar - Borivali Slow",
  from: "Dadar",
  to: "Borivali",
  schedule: [
    getStationWithTime("DDR", "8:48"),
    getStationWithTime("MRU", "8:50"),
    getStationWithTime("MM", "8:55"),
    getStationWithTime("BA", "8:57"),
    getStationWithTime("KHAR", "9:00"),
    getStationWithTime("STC", "9:02"),
    getStationWithTime("VLP", "9:05"),
    getStationWithTime("ADH", "9:10"),
    getStationWithTime("JOS", "9:13"),
    getStationWithTime("RMR", "9:16"),
    getStationWithTime("GMN", "9:18"),
    getStationWithTime("MDD", "9:22"),
    getStationWithTime("KDN", "9:25"),
    getStationWithTime("BVI", "9:33"),
  ],
  routePoints: makeRoutePoints(dadarToBorivaliSchedule),
};

export const MOCK_TRAINS: Train[] = [
  dadarToBorivaliTrain,
  {
    id: "WR-F-01",
    name: "Churchgate Fast",
    from: "Virar",
    to: "Churchgate",
    schedule: [
      getStationWithTime("VR", "08:00"),
      getStationWithTime("BSR", "08:10"),
      getStationWithTime("BVI", "08:25"),
      getStationWithTime("ADH", "08:38"),
      getStationWithTime("BA", "08:48"),
      getStationWithTime("DDR", "08:55"),
      getStationWithTime("CCG", "09:10"),
    ],
  },
  {
    id: "WR-S-01",
    name: "Churchgate Slow",
    from: "Borivali",
    to: "Churchgate",
    schedule: [
      getStationWithTime("BVI", "07:31"),
      getStationWithTime("KDN", "07:35"),
      getStationWithTime("MDD", "07:38"),
      getStationWithTime("GMN", "07:42"),
      getStationWithTime("RMR", "07:45"),
      getStationWithTime("JOS", "07:49"),
      getStationWithTime("ADH", "07:54"),
      getStationWithTime("VLP", "07:58"),
      getStationWithTime("STC", "08:01"),
      getStationWithTime("KHAR", "08:04"),
      getStationWithTime("BA", "08:07"),
      getStationWithTime("MM", "08:09"),
      getStationWithTime("MRU", "08:13"),
      getStationWithTime("DDR", "08:15"),
      getStationWithTime("PR", "08:18"),
      getStationWithTime("LPR", "08:21"),
      getStationWithTime("MX", "08:24"),
      getStationWithTime("GTR", "08:28"),
      getStationWithTime("CYR", "08:31"),
      getStationWithTime("MEL", "08:33"),
      getStationWithTime("CCG", "08:36"),
    ],
  },

  // 3. Central Line - SLOW LOCAL (NEW ADDITION)
  {
    id: "CR-S-01",
    name: "Kalyan Slow",
    from: "CSMT",
    to: "Kalyan",
    schedule: [
      getStationWithTime("CSMT", "09:00"),
      getStationWithTime("MSD", "09:03"),
      getStationWithTime("SND", "09:05"),
      getStationWithTime("BY", "09:09"),
      getStationWithTime("CHG", "09:11"),
      getStationWithTime("CRD", "09:13"),
      getStationWithTime("PR", "09:16"),
      getStationWithTime("DR", "09:19"),
      getStationWithTime("MTN", "09:22"),
      getStationWithTime("SIN", "09:25"),
      getStationWithTime("CLA", "09:30"),
      getStationWithTime("VVH", "09:33"),
      getStationWithTime("GC", "09:36"),
      getStationWithTime("VK", "09:40"),
      getStationWithTime("KJRD", "09:43"),
      getStationWithTime("BND", "09:46"),
      getStationWithTime("NHU", "09:49"),
      getStationWithTime("MLD", "09:52"),
      getStationWithTime("TNA", "09:56"),
      getStationWithTime("KLVA", "10:01"),
      getStationWithTime("MBQ", "10:06"),
      getStationWithTime("DIVA", "10:09"),
      getStationWithTime("KOPR", "10:14"),
      getStationWithTime("DOM", "10:16"),
      getStationWithTime("THK", "10:19"),
      getStationWithTime("KYN", "10:24"),
    ],
  },

  // 4. Harbour Line - Goregaon to CSMT (NEW ADDITION)
  {
    id: "HR-S-02",
    name: "Goregaon Slow",
    from: "Goregaon",
    to: "CSMT",
    schedule: [
      getStationWithTime("GMN", "11:00"),
      getStationWithTime("RMR", "11:03"),
      getStationWithTime("JOS", "11:07"),
      getStationWithTime("ADH", "11:12"),
      getStationWithTime("VLP", "11:16"),
      getStationWithTime("STC", "11:19"),
      getStationWithTime("KHAR", "11:22"),
      getStationWithTime("BA", "11:25"),
      getStationWithTime("KCE", "11:32"),
      getStationWithTime("VDL", "11:37"),
      getStationWithTime("SVE", "11:41"),
      getStationWithTime("CTGN", "11:44"),
      getStationWithTime("RRD", "11:46"),
      getStationWithTime("DKRD", "11:48"),
      getStationWithTime("SND", "11:51"),
      getStationWithTime("MSD", "11:54"),
      getStationWithTime("CSMT", "11:57"),
    ],
  },

  // 5. Trans-Harbour Line - Thane to Panvel (Sequence Verified)
  {
    id: "TH-S-01",
    name: "Panvel Slow",
    from: "Thane",
    to: "Panvel",
    schedule: [
      getStationWithTime("TNA", "10:00"),
      getStationWithTime("DIGH", "10:06"),
      getStationWithTime("ARLI", "10:09"),
      getStationWithTime("RBLE", "10:12"),
      getStationWithTime("GNSL", "10:15"),
      getStationWithTime("KPHN", "10:19"),
      getStationWithTime("TRBE", "10:23"),
      getStationWithTime("SNPD", "10:27"),
      getStationWithTime("VSH", "10:30"),
      getStationWithTime("NEU", "10:38"),
      getStationWithTime("SWDV", "10:41"),
      getStationWithTime("BEPR", "10:44"),
      getStationWithTime("KHAG", "10:48"),
      getStationWithTime("MANR", "10:51"),
      getStationWithTime("KNDS", "10:54"),
      getStationWithTime("PNVL", "10:59"),
    ],
  },

  // 6. Uran Line - Nerul to Uran (NEW ADDITION)
  {
    id: "UL-S-01",
    name: "Uran Slow",
    from: "Nerul",
    to: "Uran",
    schedule: [
      getStationWithTime("NEU", "12:00"),
      getStationWithTime("SWDV", "12:03"),
      getStationWithTime("BEPR", "12:07"),
      getStationWithTime("BMDR", "12:15"),
      getStationWithTime("KRDI", "12:18"),
      getStationWithTime("GVN", "12:22"),
      getStationWithTime("RNJD", "12:26"),
      getStationWithTime("NHV", "12:30"),
      getStationWithTime("DRNI", "12:34"),
      getStationWithTime("URAN", "12:38"),
    ],
  },
  // Add more mock trains for uncovered stations
  ...[
    getStationWithTime && [
      {
        id: "WR-VR-LOCAL-01",
        name: "Virar Slow",
        from: "Virar",
        to: "Borivali",
        schedule: [
          getStationWithTime("VR", "10:00"),
          getStationWithTime("NSP", "10:05"),
          getStationWithTime("BSR", "10:15"),
          getStationWithTime("BVI", "10:35"),
        ],
      },
      {
        id: "WR-BSR-LOCAL-01",
        name: "Vasai Road Shuttle",
        from: "Vasai Road",
        to: "Borivali",
        schedule: [
          getStationWithTime("BSR", "11:00"),
          getStationWithTime("BVI", "11:25"),
        ],
      },
      {
        id: "CR-TNA-LOCAL-01",
        name: "Thane Fast",
        from: "Thane",
        to: "CSMT",
        schedule: [
          getStationWithTime("TNA", "09:00"),
          getStationWithTime("CSMT", "09:45"),
        ],
      },
      {
        id: "HR-VSH-LOCAL-01",
        name: "Vashi Slow",
        from: "Vashi",
        to: "Panvel",
        schedule: [
          getStationWithTime("VSH", "12:00"),
          getStationWithTime("PNVL", "12:30"),
        ],
      },
      {
        id: "UL-NEU-LOCAL-01",
        name: "Nerul-Uran",
        from: "Nerul",
        to: "Uran",
        schedule: [
          getStationWithTime("NEU", "13:00"),
          getStationWithTime("URAN", "13:45"),
        ],
      },
    ]
  ].flat().filter(Boolean).map(train => ({
    ...train,
    routePoints: makeRoutePoints(train.schedule),
  })),
];

export const MOCK_ROUTES: Record<string, Station[]> = {
  "WR-F-01": MOCK_TRAINS[0].schedule,
  "WR-S-01": MOCK_TRAINS[1].schedule,
  "CR-S-01": MOCK_TRAINS[2].schedule,
  "HR-S-02": MOCK_TRAINS[3].schedule,
  "TH-S-01": MOCK_TRAINS[4].schedule,
  "UL-S-01": MOCK_TRAINS[5].schedule,
};
