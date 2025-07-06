"use server";

import type { LatLng } from "@/lib/types";

const mockPredictions = [
  "Heavy passenger traffic reported ahead; expect a 5-7 minute delay at the next station.",
  "Clear signals ahead. You are currently running on time.",
  "Minor signal issue reported near Dadar. A brief, 2-minute hold is possible.",
  "Weather conditions are clear. The journey is expected to be smooth.",
  "This line is experiencing higher than usual crowds today.",
];

// This action simulates getting a prediction based on location and other factors.
export async function getLivePrediction(data: {
  location: LatLng;
}): Promise<string> {
  // In a real app, you would use the location, call a weather API,
  // and then send all data to your AI model.
  console.log("Fetching prediction for location:", data.location);

  // Simulate network delay
  await new Promise((res) => setTimeout(res, 750));

  // Return a random mock prediction
  return mockPredictions[Math.floor(Math.random() * mockPredictions.length)];
}
