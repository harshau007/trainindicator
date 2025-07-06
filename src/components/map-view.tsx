"use client";

import type { LatLng, Station } from "@/lib/types";
import L from "leaflet";
import * as React from "react";
import {
  MapContainer,
  Marker,
  Polyline,
  TileLayer,
  Tooltip,
  useMap,
} from "react-leaflet";

const createStyledIcon = (svgPath: string, style: string, isLive = false) => {
  const livePulse = isLive
    ? `<div class="absolute top-0 left-0 w-full h-full bg-primary rounded-full animate-ping opacity-75"></div>`
    : "";
  const html = `<div class="relative flex items-center justify-center w-full h-full">${livePulse}<div class="${style} relative"><svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="currentColor" stroke="currentColor" strokeWidth="0">${svgPath}</svg></div></div>`;
  return L.divIcon({
    html: html,
    className: "bg-transparent border-0",
    iconSize: [36, 36],
    iconAnchor: [18, 36],
  });
};

const trainFrontPath =
  '<path d="M10 20h4"/><path d="M5 11h14"/><path d="M18 11a4 4 0 0 0-4-4h-4a4 4 0 0 0-4 4v8h16z"/><path d="M18 5a2 2 0 0 0-2-2h-8a2 2 0 0 0-2 2v3h12z"/>';
const userPath =
  '<path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/>';

const stationIcon = L.divIcon({
  html: `<div class="h-3 w-3 rounded-full bg-background border-2 border-primary cursor-pointer hover:bg-primary/20 transition-colors"></div>`,
  className: "bg-transparent border-0",
  iconSize: [12, 12],
  iconAnchor: [6, 6],
});

function MapController({ center, zoom }: { center: LatLng; zoom: number }) {
  const map = useMap();
  React.useEffect(() => {
    map.setView(center, zoom);
  }, [center, zoom, map]);
  return null;
}

// Component to handle station marker clicks
function StationMarker({
  station,
  onStationClick,
}: {
  station: Station;
  onStationClick: (stationId: string) => void;
}) {
  const markerRef = React.useRef<L.Marker>(null);

  React.useEffect(() => {
    const marker = markerRef.current;
    if (marker) {
      marker.on("click", () => {
        onStationClick(station.id);
      });
    }

    return () => {
      if (marker) {
        marker.off("click");
      }
    };
  }, [station.id, onStationClick]);

  return (
    <Marker
      ref={markerRef}
      position={[station.latitude, station.longitude]}
      icon={stationIcon}
    >
      <Tooltip direction="top" offset={[0, -5]}>
        {station.name}
      </Tooltip>
    </Marker>
  );
}

interface MapViewProps {
  center: LatLng;
  trainRoute?: Station[];
  trainPosition?: LatLng | null;
  userPosition?: LatLng | null;
  isLive: boolean;
  onStationClick: (stationId: string) => void;
}

export default function MapView({
  center,
  trainRoute,
  trainPosition,
  userPosition,
  isLive,
  onStationClick,
}: MapViewProps) {
  // Use routePoints if present for more realistic curves
  let routePositions: LatLng[] | undefined = undefined;
  if (trainRoute && Array.isArray(trainRoute) && trainRoute.length > 0 && (trainRoute as any)[0].routePoints) {
    // If trainRoute is actually a routePoints array
    routePositions = (trainRoute as any).map((pt: any) => [pt.latitude, pt.longitude] as LatLng);
  } else if (trainRoute) {
    routePositions = trainRoute.map((s) => [s.latitude, s.longitude] as LatLng);
  }

  const trainIcon = React.useMemo(
    () =>
      createStyledIcon(
        trainFrontPath,
        "p-2 bg-primary text-primary-foreground rounded-full shadow-lg border-2 border-background",
        isLive
      ),
    [isLive]
  );

  const userIcon = React.useMemo(
    () =>
      createStyledIcon(
        userPath,
        "p-2 bg-green-500 text-white rounded-full shadow-lg border-2 border-background"
      ),
    []
  );

  return (
    <MapContainer
      center={center}
      zoom={13}
      className="h-full w-full z-0"
      zoomControl={false}
      attributionControl={false}
    >
      <MapController center={center} zoom={13} />
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />

      {routePositions && (
        <Polyline
          positions={routePositions}
          color="var(--primary)"
          weight={5}
          opacity={0.7}
        />
      )}

      {trainRoute?.map((station) => (
        <StationMarker
          key={station.id}
          station={station}
          onStationClick={onStationClick}
        />
      ))}

      {trainPosition && (
        <Marker position={trainPosition} icon={trainIcon} zIndexOffset={1000} />
      )}
      {userPosition && (
        <Marker position={userPosition} icon={userIcon} zIndexOffset={900} />
      )}
    </MapContainer>
  );
}
