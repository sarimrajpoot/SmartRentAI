export interface Testimonial {
  id: string;
  name: string;
  city: string;
  avatar: string;
  rating: number;
  review: string;
  vehicle: string;
}

export const testimonials: Testimonial[] = [
  {
    id: "t1",
    name: "Ahmed Raza",
    city: "Lahore",
    avatar: "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&q=80&w=200",
    rating: 5,
    review: "SmartRent AI completely changed how I rent cars. The AI verification was seamless, and I felt completely secure knowing my rental was tracked. Best experience in Pakistan!",
    vehicle: "Toyota Fortuner",
  },
  {
    id: "t2",
    name: "Sarah Ali",
    city: "Karachi",
    avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&q=80&w=200",
    rating: 5,
    review: "I rented a Civic for a family trip. The price comparison feature saved me thousands, and the car was delivered in pristine condition exactly as shown in the app.",
    vehicle: "Honda Civic RS",
  },
  {
    id: "t3",
    name: "Usman Tariq",
    city: "Islamabad",
    avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=200",
    rating: 5,
    review: "As a rental partner, this platform is a game-changer. The AI driver monitoring and live GPS tracking have reduced our insurance claims by 40%. Highly recommended.",
    vehicle: "Showroom Owner",
  },
  {
    id: "t4",
    name: "Fatima Khan",
    city: "Rawalpindi",
    avatar: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?auto=format&fit=crop&q=80&w=200",
    rating: 5,
    review: "I needed a reliable car for a business meeting. Booked a Prado instantly, and the entire process was transparent with no hidden fees. The mobile app is super intuitive.",
    vehicle: "Toyota Prado TX",
  },
  {
    id: "t5",
    name: "Zain Malik",
    city: "Faisalabad",
    avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&q=80&w=200",
    rating: 5,
    review: "The theft detection feature actually works! We got an alert when a renter took the car outside the agreed city limits. SmartRent AI is the future of vehicle rentals.",
    vehicle: "Fleet Manager",
  },
  {
    id: "t6",
    name: "Hassan Qureshi",
    city: "Multan",
    avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&q=80&w=200",
    rating: 5,
    review: "Beautiful UI, instant bookings, and top-tier cars. I love that every showroom is verified. I won't rent from anywhere else now.",
    vehicle: "KIA Sportage",
  },
];
