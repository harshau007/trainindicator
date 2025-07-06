"use client";

import { TrainList } from "@/components/train-list";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { stations } from "@/lib/stations";
import type { LatLng, Train } from "@/lib/types";
import { MapPin, Play, Search, Square, TrainFront, X } from "lucide-react";
import dynamic from "next/dynamic";
import * as React from "react";
import { MOCK_ROUTES } from "@/lib/data";
import { TrainInfoCard } from "@/components/train-info-card";

const MapView = dynamic(() => import("@/components/map-view"), {
  ssr: false,
  loading: () => <div className="h-full w-full bg-muted animate-pulse" />,
});

interface TrainTrackerProps {
  trains: Train[];
}

export default function TrainTracker({ trains }: TrainTrackerProps) {
  // Station-based functionality
  const [selectedStationId, setSelectedStationId] = React.useState<
    string | null
  >(null);
  const [isTrainListOpen, setIsTrainListOpen] = React.useState(false);

  // Train selection and tracking
  const [selectedTrain, setSelectedTrain] = React.useState<Train | null>(null);
  const [isTracking, setIsTracking] = React.useState(false);
  const [userPosition, setUserPosition] = React.useState<LatLng | null>(null);
  const [liveTrainPosition, setLiveTrainPosition] =
    React.useState<LatLng | null>(null);

  const watchId = React.useRef<number | null>(null);

  const handleTrainSelection = (train: Train) => {
    setSelectedTrain(train);
    setIsTrainListOpen(false);
    // Stop any existing tracking
    if (isTracking) {
      handleStopTracking();
    }
    // Start tracking immediately when a train is selected
    handleStartTracking();
  };

  const handleStartTracking = () => {
    if (!selectedTrain) return;

    if (navigator.geolocation) {
      setIsTracking(true);
      watchId.current = navigator.geolocation.watchPosition(
        (position) => {
          const newPos: LatLng = [
            position.coords.latitude,
            position.coords.longitude,
          ];
          setUserPosition(newPos);
          setLiveTrainPosition(newPos);
        },
        (error) => {
          console.error("Geolocation Error:", error);
          alert(
            "Could not access your location. Please enable location services."
          );
          setIsTracking(false);
        },
        { enableHighAccuracy: true, timeout: 10000, maximumAge: 0 }
      );
    } else {
      alert("Geolocation is not supported by this browser.");
    }
  };

  const handleStopTracking = () => {
    setIsTracking(false);
    if (watchId.current) {
      navigator.geolocation.clearWatch(watchId.current);
    }
    setLiveTrainPosition(null);
  };

  const handleClearSelection = () => {
    setSelectedTrain(null);
    handleStopTracking();
  };

  const selectedStationName = React.useMemo(() => {
    if (!selectedStationId) return null;
    const station = stations.find((s) => s.id === selectedStationId);
    return station?.name || null;
  }, [selectedStationId]);

  // Get route for selected train
  const trainRoute = React.useMemo(() => {
    if (!selectedTrain) return undefined;
    return MOCK_ROUTES[selectedTrain.id] || selectedTrain.schedule;
  }, [selectedTrain]);

  // Get train position
  const trainPosition = React.useMemo(() => {
    if (liveTrainPosition) return liveTrainPosition;
    if (!trainRoute || trainRoute.length === 0) return null;
    return [trainRoute[0].latitude, trainRoute[0].longitude] as LatLng;
  }, [trainRoute, liveTrainPosition]);

  // Calculate map center
  const mapCenter = React.useMemo(() => {
    if (liveTrainPosition) return liveTrainPosition;
    if (userPosition) return userPosition;
    if (trainPosition) return trainPosition;
    return [19.076, 72.8777] as LatLng; // Default Mumbai center
  }, [liveTrainPosition, userPosition, trainPosition]);

  return (
    <div className="h-[100dvh] w-screen bg-background relative font-sans overflow-hidden">
      <MapView
        center={mapCenter}
        trainRoute={trainRoute}
        trainPosition={trainPosition}
        userPosition={userPosition}
        onStationClick={(stationId: string) => {
          setSelectedStationId(stationId);
          setIsTrainListOpen(true);
        }}
        isLive={isTracking}
      />

      {/* Floating Search Stations Button */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 z-[1000]">
        <Button
          size="lg"
          className="shadow-2xl"
          onClick={() => setIsTrainListOpen(true)}
        >
          <MapPin className="mr-2 h-5 w-5" />
          Search Stations
        </Button>
      </div>

      {/* Selected Train Info Card */}
      {selectedTrain && (
        <TrainInfoCard
          train={selectedTrain}
          isTracking={isTracking}
          onStartTracking={handleStartTracking}
          onStopTracking={handleStopTracking}
          prediction={null}
          onClose={handleClearSelection}
        />
      )}

      {/* Train List Sheet */}
      <TrainList
        isOpen={isTrainListOpen}
        onOpenChange={setIsTrainListOpen}
        stationId={selectedStationId}
        stationName={selectedStationName}
        trains={trains}
        onSelectTrain={(train) => {
          setSelectedTrain(train);
          setIsTrainListOpen(false);
        }}
        setSelectedStationId={setSelectedStationId}
      />
    </div>
  );
}
