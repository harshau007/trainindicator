export type LatLng = [number, number];

export interface Station {
  id: string;
  name: string;
  arrivalTime: string;
  latitude: number;
  longitude: number;
}

export interface Train {
  id: string;
  name: string;
  from: string;
  to: string;
  schedule: Station[];
}
