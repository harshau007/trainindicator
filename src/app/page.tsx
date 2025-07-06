import TrainTracker from "@/components/train-tracker-client";
import { MOCK_TRAINS } from "@/lib/data";

export default function Home() {
  return <TrainTracker trains={MOCK_TRAINS} />;
}
