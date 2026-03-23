import { Button } from "@/components/ui/button";
import { ArrowRight, BarChart3, BookOpen, BriefcaseBusiness } from "lucide-react";
import heroPattern from "@/assets/hero-pattern.jpg";
import { Link } from "react-router-dom";

const HeroSection = () => {
  return (
    <section className="relative min-h-[90vh] flex items-center overflow-hidden pt-16">
      {/* Background */}
      <div className="absolute inset-0 z-0">
        <img
          src={heroPattern}
          alt=""
          className="w-full h-full object-cover opacity-20"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-background/60 via-background/90 to-background" />
      </div>

      <div className="container mx-auto section-padding relative z-10">
        <div className="max-w-3xl mx-auto text-center">
          {/* Badge */}
          <div className="animate-fade-up inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-primary/10 text-primary text-sm font-medium mb-8">
            <GradCap />
            <span>MITS Placement Preparation Platform</span>
          </div>

          {/* Heading */}
          <h1 className="animate-fade-up stagger-1 font-display font-bold text-4xl sm:text-5xl lg:text-6xl tracking-tight leading-[1.08] text-foreground mb-6">
            Your path to placement success starts here
          </h1>

          {/* Subtext */}
          <p className="animate-fade-up stagger-2 text-lg sm:text-xl text-muted-foreground max-w-2xl mx-auto mb-10 leading-relaxed">
            Prepare smarter with AI-powered insights, mock tests, company-specific resources, and real-time drive tracking — built for MITS students.
          </p>

          {/* CTAs */}
          <div className="animate-fade-up stagger-3 flex items-center justify-center mb-16">
            <Button variant="hero" size="xl" asChild>
              <Link to="/signup">
              Get started free
              <ArrowRight className="w-5 h-5 ml-1" />
              </Link>
            </Button>
          </div>

          {/* Quick stats */}
          <div className="animate-fade-up stagger-4 grid grid-cols-3 gap-6 max-w-lg mx-auto">
            <QuickStat icon={<BriefcaseBusiness className="w-5 h-5" />} value="120+" label="Companies" />
            <QuickStat icon={<BarChart3 className="w-5 h-5" />} value="87%" label="Placed" />
            <QuickStat icon={<BookOpen className="w-5 h-5" />} value="500+" label="Resources" />
          </div>
        </div>
      </div>
    </section>
  );
};

const GradCap = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M22 10v6M2 10l10-5 10 5-10 5z" />
    <path d="M6 12v5c3 3 9 3 12 0v-5" />
  </svg>
);

const QuickStat = ({ icon, value, label }: { icon: React.ReactNode; value: string; label: string }) => (
  <div className="flex flex-col items-center gap-1">
    <div className="text-primary mb-1">{icon}</div>
    <span className="font-display font-bold text-2xl tabular-nums text-foreground">{value}</span>
    <span className="text-xs text-muted-foreground">{label}</span>
  </div>
);

export default HeroSection;
