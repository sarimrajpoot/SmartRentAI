import { useState, useEffect, useRef } from "react";
import type { TelemetryData } from "../services/telemetry";

// Simulated base route in Sydney
const BASE_ROUTE: [number, number][] = [
  [-33.8688, 151.2093],
  [-33.8695, 151.2085],
  [-33.8705, 151.2075],
  [-33.8715, 151.2065],
  [-33.8725, 151.2055],
  [-33.8735, 151.2045],
  [-33.8745, 151.2040],
  [-33.8755, 151.2045],
  [-33.8765, 151.2055],
  [-33.8775, 151.2065],
];

export function useTelemetry(vehicleId: string | undefined) {
  const [telemetry, setTelemetry] = useState<TelemetryData | null>(null);
  const routeIndex = useRef(0);
  const dataRef = useRef<TelemetryData>({
    lat: BASE_ROUTE[0][0],
    lng: BASE_ROUTE[0][1],
    speed: 0,
    engineStatus: "IDLE",
    fuelPercentage: 85.5,
    batteryPercentage: 99.2,
    distanceTravelled: 12.4,
    etaMins: 45,
    routeHistory: [BASE_ROUTE[0]],
  });

  useEffect(() => {
    if (!vehicleId) return;

    // Simulate connection delay
    const initialTimer = setTimeout(() => {
      setTelemetry({ ...dataRef.current });
    }, 1000);

    const interval = setInterval(() => {
      // Simulate moving along the route
      routeIndex.current = (routeIndex.current + 1) % BASE_ROUTE.length;
      const nextPoint = BASE_ROUTE[routeIndex.current];
      
      const current = dataRef.current;
      
      // Interpolate between current and next point for smoother tracking
      const newLat = current.lat + (nextPoint[0] - current.lat) * 0.5;
      const newLng = current.lng + (nextPoint[1] - current.lng) * 0.5;
      
      // Randomize speed
      const isMoving = routeIndex.current > 0;
      const newSpeed = isMoving ? Math.floor(Math.random() * 20) + 40 : 0; // 40-60 km/h
      
      // Decrease ETA slowly
      const newEta = Math.max(0, current.etaMins - (Math.random() > 0.8 ? 1 : 0));
      
      // Decrease fuel/battery slowly
      const newFuel = Math.max(0, current.fuelPercentage - 0.05);
      const newBattery = Math.max(0, current.batteryPercentage - 0.01);
      
      // Increase distance
      const newDistance = current.distanceTravelled + (newSpeed / 3600) * 2; // Roughly correct for 2s

      const newHistory = [...current.routeHistory, [newLat, newLng] as [number, number]].slice(-50);

      dataRef.current = {
        lat: newLat,
        lng: newLng,
        speed: newSpeed,
        engineStatus: newSpeed > 0 ? "ON" : "IDLE",
        fuelPercentage: newFuel,
        batteryPercentage: newBattery,
        distanceTravelled: newDistance,
        etaMins: newEta,
        routeHistory: newHistory,
      };

      setTelemetry({ ...dataRef.current });
    }, 2000);

    return () => {
      clearTimeout(initialTimer);
      clearInterval(interval);
    };
  }, [vehicleId]);

  return telemetry;
}
