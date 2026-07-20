export interface TelemetryData {
  lat: number;
  lng: number;
  speed: number;
  engineStatus: "ON" | "OFF" | "IDLE";
  fuelPercentage: number;
  batteryPercentage: number;
  distanceTravelled: number;
  etaMins: number;
  routeHistory: [number, number][];
}

// In the future, this file will contain the actual API calls or WebSocket setup
// For now, it exposes the types and any global configuration.
