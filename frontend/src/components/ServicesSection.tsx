import { useEffect, useRef } from "react";
import { Building2, Home, Palette, Wrench } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

const services = [
  {
    icon: Home,
    title: "Residential Construction",
    description: "Custom homes, apartments, and residential complexes built with attention to detail and quality.",
  },
  {
    icon: Building2,
    title: "Commercial Projects",
    description: "Office buildings, retail spaces, and commercial complexes designed for business success.",
  },
  {
    icon: Palette,
    title: "Interior Design",
    description: "Complete interior design solutions from concept to execution with custom furniture and decor.",
  },
  {
    icon: Wrench,
    title: "Renovations & Remodeling",
    description: "Transform existing spaces with our expert renovation and remodeling services.",
  },
];

export const ServicesSection = () => {
  const sectionRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const cards = entry.target.querySelectorAll('[data-animate]');
            cards.forEach((card, index) => {
              setTimeout(() => {
                card.classList.add('visible');
              }, index * 100);
            });
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.2 }
    );

    if (sectionRef.current) {
      observer.observe(sectionRef.current);
    }

    return () => observer.disconnect();
  }, []);

  return (
    <section ref={sectionRef} className="py-24">
      <div className="container mx-auto px-4 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold mb-4">Our Services</h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Comprehensive construction & interior design solutions for every need
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {services.map((service, index) => (
            <Card
              key={index}
              data-animate
              className="bg-card hover:shadow-custom-md transition-all duration-300 hover:-translate-y-2 cursor-pointer"
            >
              <CardHeader>
                <div className="w-14 h-14 rounded-lg bg-gradient-accent flex items-center justify-center mb-4">
                  <service.icon className="w-7 h-7 text-primary-foreground" />
                </div>
                <CardTitle className="text-xl">{service.title}</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription className="text-muted-foreground">{service.description}</CardDescription>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
};
