"use client";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import type { Train } from "@/lib/types";
import { AnimatePresence, motion } from "framer-motion";
import { ArrowRight, Bot, Clock, RadioTower, X } from "lucide-react";

interface TrainInfoCardProps {
  train: Train | null;
  isTracking: boolean;
  onStartTracking: () => void;
  onStopTracking: () => void;
  prediction: string | null;
  onClose: () => void;
}

export function TrainInfoCard({
  train,
  isTracking,
  onStartTracking,
  onStopTracking,
  prediction,
  onClose,
}: TrainInfoCardProps) {
  return (
    <AnimatePresence>
      {train && (
        <motion.div
          initial={{ y: 100, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: 100, opacity: 0 }}
          transition={{ type: "spring", stiffness: 300, damping: 30 }}
          className="absolute bottom-4 left-4 right-4 md:left-auto md:max-w-sm z-[1000] p-4 bg-background/80 backdrop-blur-sm border rounded-xl shadow-2xl"
        >
          <div className="flex justify-end">
            <Button variant="ghost" size="icon" onClick={onClose} className="absolute top-2 right-2">
              <X className="h-5 w-5" />
            </Button>
          </div>
          <AnimatePresence mode="wait">
            <motion.div
              key={isTracking ? "tracking" : "details"}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.2 }}
            >
              {isTracking ? (
                <LiveTrackingView
                  train={train}
                  onStopTracking={onStopTracking}
                  prediction={prediction}
                />
              ) : (
                <DetailsView train={train} onStartTracking={onStartTracking} isTracking={isTracking} onStopTracking={onStopTracking} />
              )}
            </motion.div>
          </AnimatePresence>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

const DetailsView = ({
  train,
  onStartTracking,
  isTracking,
  onStopTracking,
}: {
  train: Train;
  onStartTracking: () => void;
  isTracking: boolean;
  onStopTracking: () => void;
}) => (
  <div className="space-y-4">
    <div>
      <h2 className="text-xl font-bold">{train.name}</h2>
      <div className="flex items-center justify-between text-muted-foreground text-sm">
        <span>{train.from}</span>
        <ArrowRight className="h-4 w-4 mx-2" />
        <span>{train.to}</span>
      </div>
    </div>
    <Accordion type="single" collapsible className="w-full">
      <AccordionItem value="schedule">
        <AccordionTrigger>View Schedule</AccordionTrigger>
        <AccordionContent>
          <ScrollArea className="h-40">
            <div className="space-y-4 pr-4">
              {train.schedule.map((stop, index) => (
                <div key={stop.id} className="flex items-center gap-4">
                  <div className="flex flex-col items-center self-stretch">
                    <div className="h-3 w-3 rounded-full bg-primary" />
                    {index < train.schedule.length - 1 && (
                      <div className="w-0.5 flex-1 bg-primary/30" />
                    )}
                  </div>
                  <div className="flex justify-between w-full">
                    <p className="font-medium">{stop.name}</p>
                    <p className="text-sm text-muted-foreground flex items-center gap-1.5">
                      <Clock className="h-3 w-3" />
                      {stop.arrivalTime}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </ScrollArea>
        </AccordionContent>
      </AccordionItem>
    </Accordion>
    <Button className="w-full" onClick={onStartTracking}>
      <RadioTower className="mr-2 h-4 w-4" /> Start Live Tracking
    </Button>
    {isTracking && (
      <Button variant="destructive" className="w-full" onClick={onStopTracking}>
        <X className="mr-2 h-4 w-4" /> Stop Tracking
      </Button>
    )}
  </div>
);

const LiveTrackingView = ({
  train,
  onStopTracking,
  prediction,
}: {
  train: Train;
  onStopTracking: () => void;
  prediction: string | null;
}) => (
  <div className="space-y-4">
    <div className="flex items-center justify-between">
      <h2 className="text-xl font-bold">{train.name}</h2>
      <div className="flex items-center gap-2 px-3 py-1 bg-green-100 dark:bg-green-900/50 text-green-700 dark:text-green-300 rounded-full text-sm font-medium">
        <div className="relative flex h-3 w-3">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
          <span className="relative inline-flex rounded-full h-3 w-3 bg-green-500"></span>
        </div>
        Live
      </div>
    </div>
    <div className="p-4 bg-blue-50 dark:bg-blue-900/30 rounded-lg flex items-start gap-3">
      <Bot className="h-5 w-5 text-blue-500 flex-shrink-0 mt-1" />
      <div>
        <h4 className="font-semibold text-blue-800 dark:text-blue-200">
          AI Prediction
        </h4>
        <p className="text-sm text-blue-700 dark:text-blue-300">
          {prediction || "Fetching latest update..."}
        </p>
      </div>
    </div>
    <Button variant="destructive" className="w-full" onClick={onStopTracking}>
      <X className="mr-2 h-4 w-4" /> Stop Tracking
    </Button>
  </div>
);
