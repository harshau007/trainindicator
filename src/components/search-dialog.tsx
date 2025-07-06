"use client";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import type { Train } from "@/lib/types";
import { Search, TrainFront } from "lucide-react";
import * as React from "react";

interface SearchDialogProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  trains: Train[];
  onSelectTrain: (train: Train) => void;
}

export function SearchDialog({
  isOpen,
  onOpenChange,
  trains,
  onSelectTrain,
}: SearchDialogProps) {
  const [searchQuery, setSearchQuery] = React.useState("");

  const searchResults = searchQuery
    ? trains.filter(
        (train) =>
          train.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          train.id.toLowerCase().includes(searchQuery.toLowerCase())
      )
    : trains;

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Search for a Train</DialogTitle>
        </DialogHeader>
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search by train name or number..."
            className="pl-10"
            value={searchQuery}
            onChange={(e: any) => setSearchQuery(e.target.value)}
          />
        </div>
        <ScrollArea className="h-[50vh]">
          <div className="space-y-1 pr-4">
            {searchResults.map((train) => (
              <button
                key={train.id}
                onClick={() => onSelectTrain(train)}
                className="w-full text-left p-3 rounded-lg hover:bg-muted flex items-center gap-4 transition-colors"
              >
                <div className="p-3 bg-muted rounded-md">
                  <TrainFront className="h-5 w-5 text-secondary-foreground" />
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
      </DialogContent>
    </Dialog>
  );
}
