import fortunerImg from "../../../assets/images/cars/Fortuner.jpeg";
import civicImg from "../../../assets/images/cars/Civic.jpeg";
import sportageImg from "../../../assets/images/cars/KiaSportage.jpeg";
import pradoImg from "../../../assets/images/cars/Prado.jpeg";

export interface Car {
  id: string;
  name: string;
  price: number;
  rating: number;
  location: string;
  fuel: string;
  transmission: string;
  seats: number;
  image: string;
  aiVerified: boolean;
}

export const featuredCars: Car[] = [
  {
    id: "car-001",
    name: "Toyota Prado TX",
    price: 35000,
    rating: 4.9,
    location: "DHA Phase 6, Lahore",
    fuel: "Petrol",
    transmission: "Auto",
    seats: 7,
    image: pradoImg,
    aiVerified: true,
  },
  {
    id: "car-002",
    name: "Mercedes C200",
    price: 45000,
    rating: 5.0,
    location: "Clifton, Karachi",
    fuel: "Petrol",
    transmission: "Auto",
    seats: 5,
    image: "https://images.unsplash.com/photo-1618843479313-40f8afb4b4d8?auto=format&fit=crop&q=80&w=1000",
    aiVerified: true,
  },
  {
    id: "car-003",
    name: "Toyota Fortuner Legender",
    price: 30000,
    rating: 4.8,
    location: "F-11 Markaz, Islamabad",
    fuel: "Diesel",
    transmission: "Auto",
    seats: 7,
    image: fortunerImg,
    aiVerified: true,
  },
  {
    id: "car-004",
    name: "Honda Civic RS",
    price: 18000,
    rating: 4.7,
    location: "Gulberg, Lahore",
    fuel: "Petrol",
    transmission: "Auto",
    seats: 5,
    image: civicImg,
    aiVerified: true,
  },
  {
    id: "car-005",
    name: "KIA Sportage AWD",
    price: 15000,
    rating: 4.6,
    location: "Johar Town, Lahore",
    fuel: "Petrol",
    transmission: "Auto",
    seats: 5,
    image: sportageImg,
    aiVerified: true,
  },
  {
    id: "car-006",
    name: "Hyundai Elantra",
    price: 14000,
    rating: 4.5,
    location: "Bahria Town, Rawalpindi",
    fuel: "Petrol",
    transmission: "Auto",
    seats: 5,
    image: "https://images.unsplash.com/photo-1590362891991-f776e747a588?auto=format&fit=crop&q=80&w=1000",
    aiVerified: true,
  },
];
