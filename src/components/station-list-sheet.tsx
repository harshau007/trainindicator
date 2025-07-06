"use client";
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { ScrollArea } from "@/components/ui/scroll-area";
import { stations } from "@/lib/stations";
import { MapPin } from "lucide-react";
import * as React from "react";

interface StationListSheetProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  onSelectStation: (stationId: string) => void;
}

export function StationListSheet({ isOpen, onOpenChange, onSelectStation }: StationListSheetProps) {
  return (
    <Sheet open={isOpen} onOpenChange={onOpenChange}>
      <SheetContent side="bottom" className="h-[70vh]">
        <SheetHeader className="mb-4">
          <SheetTitle>Select a Station</SheetTitle>
        </SheetHeader>
        <ScrollArea className="h-full pr-4">
          <div className="space-y-2">
            {stations.map((station) => (
              <button
                key={station.id}
                onClick={() => onSelectStation(station.id)}
                className="w-full text-left p-4 rounded-lg hover:bg-muted flex items-center gap-4 transition-colors"
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
      </SheetContent>
    </Sheet>
  );
} 