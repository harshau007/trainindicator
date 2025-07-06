"use client";
import {
  Drawer,
  DrawerContent,
  DrawerHeader,
  DrawerTitle,
} from "@/components/ui/drawer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Search, TrainFront, ArrowRight, X, RadioTower } from "lucide-react";
import type { Train, Station } from "@/lib/types";

interface TrainInfoSheetProps {
  trains: Train[];
  selectedTrain: Train | null;
  onSelectTrain: (train: Train | null) => void;
  isTracking: boolean;
  onStartTracking: () => void;
  onStopTracking: () => void;
  userLocation: { latitude: number; longitude: number } | null;
  searchQuery: string;
  onSearch: (query: string) => void;
  currentStation?: Station;
}

export function TrainInfoSheet({
  trains,
  selectedTrain,
  onSelectTrain,
  isTracking,
  onStartTracking,
  onStopTracking,
  userLocation,
  searchQuery,
  onSearch,
  currentStation,
}: TrainInfoSheetProps) {
  const renderContent = () => {
    if (isTracking && selectedTrain) {
      return (
        <LiveTrackingView
          train={selectedTrain}
          onStopTracking={onStopTracking}
          currentStation={currentStation}
        />
      );
    }
    if (selectedTrain) {
      return (
        <TrainDetailsView
          train={selectedTrain}
          onStartTracking={onStartTracking}
          onBack={() => onSelectTrain(null)}
        />
      );
    }
    return (
      <SearchView
        trains={trains}
        onSelectTrain={onSelectTrain}
        searchQuery={searchQuery}
        onSearch={onSearch}
      />
    );
  };

  return (
    <Drawer open={true} modal={false}>
      <DrawerContent className="h-[60vh] md:h-[40vh] lg:w-1/3 lg:h-full lg:right-0 lg:top-0 lg:rounded-l-lg lg:rounded-r-none">
        <div className="mx-auto w-full max-w-md lg:max-w-full h-full">
          {renderContent()}
        </div>
      </DrawerContent>
    </Drawer>
  );
}

function SearchView({
  trains,
  onSelectTrain,
  searchQuery,
  onSearch,
}: {
  trains: Train[];
  onSelectTrain: (train: Train) => void;
  searchQuery: string;
  onSearch: (query: string) => void;
}) {
  return (
    <>
      <DrawerHeader>
        <DrawerTitle>Track a Train</DrawerTitle>
      </DrawerHeader>
      <div className="p-4 pb-0">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search by train name or number..."
            className="pl-10"
            value={searchQuery}
            onChange={(e) => onSearch(e.target.value)}
          />
        </div>
      </div>
      <ScrollArea className="flex-1 p-4">
        <div className="space-y-2">
          {trains.map((train) => (
            <button
              key={train.id}
              onClick={() => onSelectTrain(train)}
              className="w-full text-left p-3 rounded-lg hover:bg-muted flex items-center gap-4"
            >
              <div className="p-2 bg-muted rounded-md">
                <TrainFront className="h-5 w-5" />
              </div>
              <div>
                <p className="font-semibold">{train.name}</p>
                <p className="text-sm text-muted-foreground">
                  {train.from} to {train.to}
                </p>
              </div>
            </button>
          ))}
        </div>
      </ScrollArea>
    </>
  );
}

function TrainDetailsView({
  train,
  onStartTracking,
  onBack,
}: {
  train: Train;
  onStartTracking: () => void;
  onBack: () => void;
}) {
  return (
    <div className="flex flex-col h-full">
      <DrawerHeader className="flex items-center justify-between">
        <DrawerTitle>{train.name}</DrawerTitle>
        <Button variant="ghost" size="icon" onClick={onBack}>
          <X className="h-4 w-4" />
        </Button>
      </DrawerHeader>
      <div className="p-4">
        <div className="flex items-center justify-between p-3 bg-muted rounded-lg">
          <div className="text-center">
            <p className="text-sm text-muted-foreground">From</p>
            <p className="font-bold text-lg">{train.from}</p>
          </div>
          <ArrowRight className="h-5 w-5 text-muted-foreground" />
          <div className="text-center">
            <p className="text-sm text-muted-foreground">To</p>
            <p className="font-bold text-lg">{train.to}</p>
          </div>
        </div>
      </div>
      <ScrollArea className="flex-1 px-4">
        <h3 className="font-semibold mb-2">Schedule</h3>
        <div className="space-y-4">
          {train.schedule.map((stop, index) => (
            <div key={stop.id} className="flex items-center gap-4">
              <div className="flex flex-col items-center">
                <div className="h-3 w-3 rounded-full bg-primary" />
                {index < train.schedule.length - 1 && (
                  <div className="w-0.5 h-8 bg-primary/50" />
                )}
              </div>
              <div>
                <p className="font-medium">{stop.name}</p>
                <p className="text-sm text-muted-foreground">
                  Arrival: {stop.arrivalTime}
                </p>
              </div>
            </div>
          ))}
        </div>
      </ScrollArea>
      <div className="p-4 border-t">
        <Button className="w-full" onClick={onStartTracking}>
          <RadioTower className="mr-2 h-4 w-4" /> Start Live Tracking
        </Button>
      </div>
    </div>
  );
}

function LiveTrackingView({
  train,
  onStopTracking,
  currentStation,
}: {
  train: Train;
  onStopTracking: () => void;
  currentStation?: Station;
}) {
  const nextStation =
    train.schedule[
      train.schedule.findIndex((s) => s.id === currentStation?.id) + 1
    ];

  return (
    <div className="flex flex-col h-full">
      <DrawerHeader>
        <DrawerTitle>Live Tracking: {train.name}</DrawerTitle>
      </DrawerHeader>
      <div className="flex-1 p-4 space-y-4">
        <div className="p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg text-center">
          <p className="text-sm text-blue-600 dark:text-blue-300">
            Currently at
          </p>
          <p className="font-bold text-xl text-blue-800 dark:text-blue-100">
            {currentStation?.name || "In Transit"}
          </p>
        </div>
        {nextStation && (
          <div className="p-4 bg-muted rounded-lg">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Next Stop</p>
                <p className="font-semibold">{nextStation.name}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Est. Arrival</p>
                <p className="font-semibold">{nextStation.arrivalTime}</p>
              </div>
            </div>
          </div>
        )}
        <div className="text-center text-sm text-muted-foreground flex items-center justify-center gap-2">
          <div className="relative flex h-3 w-3">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-3 w-3 bg-green-500"></span>
          </div>
          Your location is being shared
        </div>
      </div>
      <div className="p-4 border-t">
        <Button
          variant="destructive"
          className="w-full"
          onClick={onStopTracking}
        >
          Stop Tracking
        </Button>
      </div>
    </div>
  );
}
