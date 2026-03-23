import { useScrollReveal } from "@/hooks/use-scroll-reveal";
import { Star } from "lucide-react";

const testimonials = [
  {
    name: "Arun Krishnan",
    batch: "CSE '24",
    company: "Infosys",
    text: "Hirelytics helped me understand exactly what Infosys looks for. The mock tests and company-specific prep made all the difference.",
    rating: 5,
  },
  {
    name: "Sneha Mathew",
    batch: "ECE '23",
    company: "TCS",
    text: "The AI resume analyzer gave me feedback I wouldn't have found on my own. I restructured my resume and got shortlisted in the first round.",
    rating: 5,
  },
  {
    name: "Rahul Dev",
    batch: "IT '24",
    company: "EY",
    text: "Being able to see company selection processes and previous student experiences was incredibly valuable. Felt prepared walking into every round.",
    rating: 4,
  },
];

const TestimonialsSection = () => {
  const { ref, isVisible } = useScrollReveal();

  return (
    <section id="testimonials" className="py-24 lg:py-32" ref={ref}>
      <div className="container mx-auto section-padding">
        <div className={`text-center max-w-2xl mx-auto mb-16 ${isVisible ? "animate-fade-up" : "opacity-0"}`}>
          <p className="text-sm font-semibold text-primary tracking-wide uppercase mb-3">Student voices</p>
          <h2 className="font-display font-bold text-3xl sm:text-4xl tracking-tight text-foreground mb-4">
            Hear from placed students
          </h2>
          <p className="text-muted-foreground text-lg">
            Real stories from MITS students who cracked their dream placements.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-6 max-w-5xl mx-auto">
          {testimonials.map((t, i) => (
            <div
              key={t.name}
              className={`p-6 rounded-2xl border border-border bg-card shadow-sm hover:shadow-md transition-shadow duration-300 flex flex-col ${
                isVisible ? `animate-fade-up stagger-${i + 1}` : "opacity-0"
              }`}
            >
              <div className="flex gap-0.5 mb-4">
                {Array.from({ length: 5 }).map((_, s) => (
                  <Star
                    key={s}
                    className={`w-4 h-4 ${s < t.rating ? "fill-primary text-primary" : "fill-muted text-muted"}`}
                  />
                ))}
              </div>
              <p className="text-foreground text-sm leading-relaxed flex-1 mb-5">"{t.text}"</p>
              <div className="border-t border-border pt-4">
                <p className="font-semibold text-sm text-foreground">{t.name}</p>
                <p className="text-xs text-muted-foreground">{t.batch} · Placed at {t.company}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default TestimonialsSection;
