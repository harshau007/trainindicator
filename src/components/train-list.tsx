"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import type { Train } from "@/lib/types";
import { getDepartureTime, getAllTrainsFromStation } from "@/lib/types";
import { Clock, MapPin, TrainFront, X, ArrowRight, RadioTower } from "lucide-react";
import * as React from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { stations } from "@/lib/stations";
import { motion, AnimatePresence } from "framer-motion";

interface TrainListProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  stationId: string | null;
  stationName: string | null;
  trains: Train[];
  onSelectTrain: (train: Train) => void;
  setSelectedStationId: (id: string | null) => void;
}

interface TrainListItemProps {
  train: Train;
  stationId: string;
  onSelectTrain: (train: Train) => void;
}

function TrainListItem({
  train,
  stationId,
  onSelectTrain,
}: TrainListItemProps) {
  const stationInSchedule = train.schedule.find((s) => s.id === stationId);
  const departureTime = stationInSchedule?.arrivalTime
    ? getDepartureTime(stationInSchedule.arrivalTime)
    : "N/A";

  return (
    <div
      className="flex items-center justify-between p-4 border rounded-lg hover:bg-muted/50 transition-colors cursor-pointer"
      onClick={() => onSelectTrain(train)}
    >
      <div className="flex items-center gap-4">
        <div className="p-3 bg-primary/10 rounded-md">
          <TrainFront className="h-5 w-5 text-primary" />
        </div>
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-1">
            <h3 className="font-semibold text-sm">{train.name}</h3>
            <Badge variant="secondary" className="text-xs">
              {train.id}
            </Badge>
          </div>
          <div className="flex items-center gap-4 text-sm text-muted-foreground">
            <div className="flex items-center gap-1">
              <MapPin className="h-3 w-3" />
              <span>
                {train.from} → {train.to}
              </span>
            </div>
            <div className="flex items-center gap-1">
              <Clock className="h-3 w-3" />
              <span>{departureTime}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export function TrainList({
  isOpen,
  onOpenChange,
  stationId: initialStationId,
  stationName: initialStationName,
  trains,
  onSelectTrain,
  setSelectedStationId,
}: TrainListProps) {
  // Search and navigation state
  const [searchQuery, setSearchQuery] = React.useState("");
  const [selectedStationId, setSelectedStationIdState] = React.useState<string | null>(initialStationId || null);
  const [selectedStationName, setSelectedStationName] = React.useState<string | null>(initialStationName || null);

  // Sync local selectedStationId with prop
  React.useEffect(() => {
    setSelectedStationIdState(initialStationId || null);
    if (initialStationId) {
      const station = stations.find((s) => s.id === initialStationId);
      setSelectedStationName(station?.name || null);
    }
  }, [initialStationId]);
  // Only show stations search and trains for selected station

  // Search logic
  const filteredStations = React.useMemo(() => {
    if (!searchQuery.trim()) return stations;
    return stations.filter((station) =>
      station.name.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [searchQuery]);

  // Trains for selected station
  const availableTrains = React.useMemo(() => {
    if (!selectedStationId) return [];
    return getAllTrainsFromStation(trains, selectedStationId);
  }, [trains, selectedStationId]);

  // Navigation handlers
  const handleSelectStation = (stationId: string) => {
    setSelectedStationIdState(stationId);
    const station = stations.find((s) => s.id === stationId);
    setSelectedStationName(station?.name || null);
    setSearchQuery("");
  };

  const handleSelectTrain = (train: Train) => {
    onSelectTrain(train);
    onOpenChange(false);
  };

  const handleBack = () => {
    setSelectedStationIdState(null);
    setSelectedStationName(null);
    setSearchQuery("");
  };

  // Sheet content logic
  let content;
  if (selectedStationId) {
    // Show trains for selected station
    content = (
      <AnimatePresence mode="wait">
        <motion.div
          key="trains"
          initial={{ x: 100, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          exit={{ x: -100, opacity: 0 }}
          transition={{ duration: 0.2 }}
          className="h-full flex flex-col"
        >
          <SheetHeader className="mb-4">
            <div className="flex items-center gap-2">
              <Button variant="ghost" size="icon" onClick={handleBack}>
                <svg width="24" height="24" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M15 18l-6-6 6-6" /></svg>
              </Button>
              <div>
                <SheetTitle className="text-left">
                  Trains from {selectedStationName || "Station"}
                </SheetTitle>
                <div className="text-sm text-muted-foreground text-left mt-1">
                  {availableTrains.length} train
                  {availableTrains.length !== 1 ? "s" : ""} available
                </div>
              </div>
            </div>
          </SheetHeader>
          <ScrollArea className="h-full pr-4">
            <div className="space-y-3">
              {availableTrains.length === 0 ? (
                <div className="text-center py-8 text-muted-foreground">
                  <TrainFront className="h-12 w-12 mx-auto mb-4 opacity-50" />
                  <p>No trains available from this station</p>
                  <p className="text-sm">Try selecting a different station</p>
                </div>
              ) : (
                availableTrains.map((train) => (
                  <TrainListItem
                    key={train.id}
                    train={train}
                    stationId={selectedStationId!}
                    onSelectTrain={handleSelectTrain}
                  />
                ))
              )}
            </div>
          </ScrollArea>
        </motion.div>
      </AnimatePresence>
    );
  } else {
    // Search UI: search bar, station results
    content = (
      <AnimatePresence mode="wait">
        <motion.div
          key="stations"
          initial={{ x: -100, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          exit={{ x: 100, opacity: 0 }}
          transition={{ duration: 0.2 }}
          className="h-full flex flex-col"
        >
          <SheetHeader className="mb-2">
            <div className="mt-2">
              <Input
                placeholder="Search stations..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full"
              />
            </div>
          </SheetHeader>
          <ScrollArea className="h-full pr-4">
            <div className="space-y-2">
              {filteredStations.map((station) => (
                <button
                  key={station.id}
                  onClick={() => handleSelectStation(station.id)}
                  className="w-full text-left p-3 rounded-lg hover:bg-muted flex items-center gap-4 transition-colors"
                >
                  <div className="p-3 bg-muted rounded-md">
                    <MapPin className="h-5 w-5 text-secondary-foreground" />
                  </div>
                  <div>
                    <p className="font-semibold">{station.name}</p>
                    <p className="text-sm text-muted-foreground">Click to see available trains</p>
                  </div>
                </button>
              ))}
            </div>
          </ScrollArea>
        </motion.div>
      </AnimatePresence>
    );
  }

  return (
    <Sheet open={isOpen} onOpenChange={onOpenChange}>
      <SheetContent side="bottom" className="h-[80vh] sm:h-[70vh]">
        {content}
      </SheetContent>
    </Sheet>
  );
}
