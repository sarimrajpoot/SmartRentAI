import {
  ShieldCheck,
  MapPinned,
  ShieldAlert,
  Brain,
  BarChart3,
  Sparkles,
} from "lucide-react";
import type { ElementType } from "react";

export interface AIFeature {
  id: number;
  title: string;
  description: string;
  badge: string;
  icon: ElementType;
}

export const aiFeatures: AIFeature[] = [
  {
    id: 1,
    title: "AI Driver Verification",
    description:
      "Verify drivers through AI-assisted identity checks to reduce fake bookings and improve trust.",
    badge: "AI Powered",
    icon: ShieldCheck,
  },
  {
    id: 2,
    title: "Live GPS Tracking",
    description:
      "Monitor vehicle locations in real time with secure GPS tracking.",
    badge: "Live",
    icon: MapPinned,
  },
  {
    id: 3,
    title: "Theft Detection",
    description:
      "Receive instant alerts when suspicious activity or unauthorized movement is detected.",
    badge: "24/7 Monitoring",
    icon: ShieldAlert,
  },
  {
    id: 4,
    title: "Driver Monitoring",
    description:
      "Detect drowsiness, distraction and unsafe driving using computer vision.",
    badge: "Vision AI",
    icon: Brain,
  },
  {
    id: 5,
    title: "Business Analytics",
    description:
      "Analyze bookings, fleet performance and revenue with intelligent dashboards.",
    badge: "Insights",
    icon: BarChart3,
  },
  {
    id: 6,
    title: "Smart Booking",
    description:
      "Compare prices, receive recommendations and book instantly using AI.",
    badge: "Recommended",
    icon: Sparkles,
  },
];
