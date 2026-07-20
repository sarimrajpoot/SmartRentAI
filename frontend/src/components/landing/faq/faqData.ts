export interface FAQItem {
  id: string;
  question: string;
  answer: string;
}

export const faqs: FAQItem[] = [
  {
    id: "faq1",
    question: "How does SmartRent AI work?",
    answer: "SmartRent AI connects you with verified rental partners across Pakistan. You simply browse the fleet, compare prices, and book instantly. Our platform uses AI to ensure secure bookings and live tracking during your rental period.",
  },
  {
    id: "faq2",
    question: "How is AI used?",
    answer: "We use Artificial Intelligence for driver verification, fraud detection, and in-cabin monitoring. Our AI analyzes driver behavior in real-time to detect fatigue, distraction, and potential risks, ensuring a safer journey.",
  },
  {
    id: "faq3",
    question: "How are drivers verified?",
    answer: "During registration, drivers upload their government-issued ID and a live selfie. Our vision AI instantly matches the face to the ID and checks against national records to ensure the driver is authentic and licensed.",
  },
  {
    id: "faq4",
    question: "How does GPS tracking work?",
    answer: "Every vehicle in our premium fleet is equipped with a secure GPS module. Both the driver and the rental partner can view the live location of the vehicle through the SmartRent AI dashboard or mobile app.",
  },
  {
    id: "faq5",
    question: "How do rental companies join?",
    answer: "Rental companies can click 'Become a Partner' and submit their business details. Our team manually verifies the showroom's credibility before onboarding them to the platform to ensure high quality.",
  },
  {
    id: "faq6",
    question: "Can I cancel bookings?",
    answer: "Yes, you can cancel your booking directly from the mobile app or web dashboard. Cancellation policies vary slightly depending on the partner, but we guarantee transparency and instant refunds for eligible cancellations.",
  },
];
