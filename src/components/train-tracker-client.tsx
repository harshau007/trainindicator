"use client";

import { getLivePrediction } from "@/app/actions";
import { SearchDialog } from "@/components/search-dialog";
import { TrainInfoCard } from "@/components/train-info-card";
import { Button } from "@/components/ui/button";
import { MOCK_ROUTES } from "@/lib/data";
import type { LatLng, Train } from "@/lib/types";
import { Search } from "lucide-react";
import dynamic from "next/dynamic";
import * as React from "react";

const MapView = dynamic(() => import("@/components/map-view"), {
  ssr: false,
  loading: () => <div className="h-full w-full bg-muted animate-pulse" />,
});

interface TrainTrackerProps {
  trains: Train[];
}

export default function TrainTracker({ trains }: TrainTrackerProps) {
  const [selectedTrain, setSelectedTrain] = React.useState<Train | null>(null);
  const [isSearchOpen, setIsSearchOpen] = React.useState(false);
  const [liveTrainPosition, setLiveTrainPosition] =
    React.useState<LatLng | null>(null);
  const [userPosition, setUserPosition] = React.useState<LatLng | null>(null);
  const [isTracking, setIsTracking] = React.useState(false);
  const [prediction, setPrediction] = React.useState<string | null>(null);
  const watchId = React.useRef<number | null>(null);
  const predictionIntervalId = React.useRef<NodeJS.Timeout | null>(null);

  const handleSelectTrain = (train: Train | null) => {
    setSelectedTrain(train);
    setIsSearchOpen(false);
    if (isTracking) handleStopTracking();
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
    setPrediction(null);
    if (watchId.current) navigator.geolocation.clearWatch(watchId.current);
    if (predictionIntervalId.current)
      clearInterval(predictionIntervalId.current);
  };

  React.useEffect(() => {
    if (isTracking && userPosition) {
      const fetchPrediction = async () => {
        const newPrediction = await getLivePrediction({
          location: userPosition,
        });
        setPrediction(newPrediction);
      };
      fetchPrediction();
      predictionIntervalId.current = setInterval(fetchPrediction, 60000);
    }
    return () => {
      if (predictionIntervalId.current)
        clearInterval(predictionIntervalId.current);
    };
  }, [isTracking, userPosition]);

  const trainRoute = selectedTrain ? MOCK_ROUTES[selectedTrain.id] : undefined;
  const initialTrainPosition =
    trainRoute && trainRoute.length > 0
      ? ([trainRoute[0].latitude, trainRoute[0].longitude] as LatLng)
      : undefined;
  const mapCenter = liveTrainPosition ||
    userPosition ||
    initialTrainPosition || [19.076, 72.8777];

  return (
    <div className="h-[100dvh] w-screen bg-background relative font-sans overflow-hidden">
      <MapView
        key={selectedTrain?.id}
        center={mapCenter}
        trainRoute={trainRoute}
        trainPosition={liveTrainPosition || initialTrainPosition}
        userPosition={userPosition}
        isLive={isTracking}
      />

      <div className="absolute top-4 right-4 z-[1000]">
        <Button
          size="lg"
          className="shadow-2xl"
          onClick={() => setIsSearchOpen(true)}
        >
          <Search className="mr-2 h-5 w-5" />
          Search Trains
        </Button>
      </div>

      <SearchDialog
        isOpen={isSearchOpen}
        onOpenChange={setIsSearchOpen}
        trains={trains}
        onSelectTrain={handleSelectTrain}
      />

      <TrainInfoCard
        train={selectedTrain}
        isTracking={isTracking}
        onStartTracking={handleStartTracking}
        onStopTracking={handleStopTracking}
        prediction={prediction}
      />
    </div>
  );
}
