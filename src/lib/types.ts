export type LatLng = [number, number];

export interface Station {
  id: string;
  name: string;
  arrivalTime?: string;
  latitude: number;
  longitude: number;
}

export interface Train {
  id: string;
  name: string;
  from: string;
  to: string;
  schedule: Station[];
  routePoints?: { latitude: number; longitude: number }[];
}

// Utility function to calculate departure time (arrival + 2 minutes)
export function getDepartureTime(arrivalTime: string): string {
  const [hours, minutes] = arrivalTime.split(":").map(Number);
  const totalMinutes = hours * 60 + minutes + 2;
  const newHours = Math.floor(totalMinutes / 60) % 24;
  const newMinutes = totalMinutes % 60;
  return `${newHours.toString().padStart(2, "0")}:${newMinutes
    .toString()
    .padStart(2, "0")}`;
}

// Utility function to filter trains by station and current time
export function getTrainsFromStation(
  trains: Train[],
  stationId: string,
  currentTime?: string
): Train[] {
  const now = currentTime || new Date().toTimeString().slice(0, 5);

  return trains.filter((train) => {
    const stationInSchedule = train.schedule.find(
      (station) => station.id === stationId
    );
    if (!stationInSchedule || !stationInSchedule.arrivalTime) return false;

    const departureTime = getDepartureTime(stationInSchedule.arrivalTime);
    return departureTime >= now;
  });
}

// Utility function to get all trains that stop at a station (regardless of time)
export function getAllTrainsFromStation(trains: Train[], stationId: string): Train[] {
  return trains.filter((train) =>
    train.schedule.some((station) => station.id === stationId)
  );
}
