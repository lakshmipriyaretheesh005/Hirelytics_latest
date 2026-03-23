import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";
import { useScrollReveal } from "@/hooks/use-scroll-reveal";
import { Link } from "react-router-dom";

const CTASection = () => {
  const { ref, isVisible } = useScrollReveal();

  return (
    <section className="py-24 lg:py-32" ref={ref}>
      <div className="container mx-auto section-padding">
        <div
          className={`max-w-3xl mx-auto text-center rounded-3xl bg-card border border-border p-12 sm:p-16 shadow-lg ${
            isVisible ? "animate-fade-up" : "opacity-0"
          }`}
        >
          <h2 className="font-display font-bold text-3xl sm:text-4xl tracking-tight text-foreground mb-4">
            Ready to ace your placements?
          </h2>
          <p className="text-muted-foreground text-lg mb-8 max-w-xl mx-auto">
            Join hundreds of MITS students already preparing smarter with Hirelytics.
          </p>
          <div className="flex items-center justify-center">
            <Button variant="hero" size="xl" asChild>
              <Link to="/signup">
              Create your account
              <ArrowRight className="w-5 h-5 ml-1" />
              </Link>
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default CTASection;
