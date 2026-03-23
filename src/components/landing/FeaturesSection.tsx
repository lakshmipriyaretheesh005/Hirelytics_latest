import { useScrollReveal } from "@/hooks/use-scroll-reveal";
import { BarChart3, BookOpen, BrainCircuit, Building2, ClipboardCheck, FileText } from "lucide-react";

const features = [
  {
    icon: <Building2 className="w-6 h-6" />,
    title: "Company Insights",
    description: "Detailed profiles with packages, eligibility, selection process, and student experiences for every recruiting company.",
  },
  {
    icon: <BrainCircuit className="w-6 h-6" />,
    title: "AI Resume Predictor",
    description: "Upload your resume and get an AI-powered score with actionable feedback to improve your chances.",
  },
  {
    icon: <BookOpen className="w-6 h-6" />,
    title: "Preparation Hub",
    description: "Company-specific aptitude, coding, and interview questions organized by difficulty level.",
  },
  {
    icon: <ClipboardCheck className="w-6 h-6" />,
    title: "Mock Tests",
    description: "Take company-wise mock tests, track your scores, and measure improvement over time.",
  },
  {
    icon: <BarChart3 className="w-6 h-6" />,
    title: "Progress Dashboard",
    description: "Visualize your preparation journey with charts tracking aptitude, coding, and interview readiness.",
  },
  {
    icon: <FileText className="w-6 h-6" />,
    title: "Drive Tracker",
    description: "Stay updated on active placement drives with round dates, status updates, and eligibility checks.",
  },
];

const FeaturesSection = () => {
  const { ref, isVisible } = useScrollReveal();

  return (
    <section id="features" className="py-24 lg:py-32 bg-card" ref={ref}>
      <div className="container mx-auto section-padding">
        <div className={`text-center max-w-2xl mx-auto mb-16 ${isVisible ? "animate-fade-up" : "opacity-0"}`}>
          <p className="text-sm font-semibold text-primary tracking-wide uppercase mb-3">Everything you need</p>
          <h2 className="font-display font-bold text-3xl sm:text-4xl tracking-tight text-foreground mb-4">
            One platform, complete preparation
          </h2>
          <p className="text-muted-foreground text-lg">
            From company research to mock tests — Hirelytics covers every step of your placement journey.
          </p>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((feature, i) => (
            <div
              key={feature.title}
              className={`group p-6 rounded-2xl border border-border bg-background hover:shadow-lg transition-all duration-300 hover:-translate-y-1 ${
                isVisible ? `animate-fade-up stagger-${i + 1}` : "opacity-0"
              }`}
            >
              <div className="w-12 h-12 rounded-xl bg-primary/10 text-primary flex items-center justify-center mb-4 group-hover:bg-primary group-hover:text-primary-foreground transition-colors duration-300">
                {feature.icon}
              </div>
              <h3 className="font-display font-semibold text-lg text-foreground mb-2">{feature.title}</h3>
              <p className="text-muted-foreground text-sm leading-relaxed">{feature.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default FeaturesSection;
