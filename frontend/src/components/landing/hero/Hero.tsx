import HeroContent from "./HeroContent";
import HeroImage from "./HeroImage";
import ScrollIndicator from "./ScrollIndicator";

export default function Hero() {
  return (
    <section id="home" className="relative overflow-hidden min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-blue-950">

      {/* Background Glow */}
      <div className="absolute top-0 left-0 w-96 h-96 bg-blue-600/20 rounded-full blur-3xl" />
      <div className="absolute bottom-0 right-0 w-96 h-96 bg-cyan-500/20 rounded-full blur-3xl" />
      <div className="relative max-w-7xl mx-auto px-6 min-h-screen flex items-center">

        <div className="grid lg:grid-cols-2 gap-16 items-center w-full">

          <HeroContent />

          <HeroImage />

        </div>

      </div>
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(59,130,246,0.18),transparent_70%)]" />
      <ScrollIndicator />

    </section>
  );
}