import { ShieldCheck, BadgeCheck, CreditCard, MapPinned } from "lucide-react";
import type { ElementType } from "react";

export interface PartnerLogo {
  id: string;
  name: string;
}

export interface TrustFeature {
  id: string;
  title: string;
  description: string;
  icon: ElementType;
}

export interface TrustMetric {
  id: string;
  number: number;
  suffix: string;
  label: string;
}

export const partnerLogos: PartnerLogo[] = [
  { id: "p1", name: "Toyota" },
  { id: "p2", name: "Honda" },
  { id: "p3", name: "Suzuki" },
  { id: "p4", name: "KIA" },
  { id: "p5", name: "Hyundai" },
  { id: "p6", name: "MG" },
  { id: "p7", name: "Haval" },
  { id: "p8", name: "Changan" },
];

export const trustFeatures: TrustFeature[] = [
  {
    id: "tf1",
    title: "AI Verified Partners",
    description: "Every partner is rigorously vetted using AI to ensure quality and trust.",
    icon: ShieldCheck,
  },
  {
    id: "tf2",
    title: "Government Identity Verification",
    description: "All users undergo strict identity checks matching government records.",
    icon: BadgeCheck,
  },
  {
    id: "tf3",
    title: "Secure Payments",
    description: "End-to-end encrypted transactions for your peace of mind.",
    icon: CreditCard,
  },
  {
    id: "tf4",
    title: "GPS Enabled Fleet",
    description: "24/7 real-time tracking for ultimate security and monitoring.",
    icon: MapPinned,
  },
];

export const trustMetrics: TrustMetric[] = [
  { id: "tm1", number: 120, suffix: "+", label: "Verified Partners" },
  { id: "tm2", number: 500, suffix: "+", label: "Vehicles" },
  { id: "tm3", number: 15, suffix: "+", label: "Cities" },
  { id: "tm4", number: 25000, suffix: "+", label: "Bookings" },
];
