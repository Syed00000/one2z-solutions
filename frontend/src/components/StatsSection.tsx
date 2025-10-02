import { useEffect, useRef, useState } from "react";

export const StatsSection = () => {
  const statsRef = useRef<HTMLDivElement>(null);
  const [isAnimating, setIsAnimating] = useState(false);

  useEffect(() => {
    // Intersection Observer for stats counting animation
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting && !isAnimating) {
            setIsAnimating(true);
            animateCounters();
          } else if (!entry.isIntersecting) {
            // Reset counters when out of view
            setIsAnimating(false);
            resetCounters();
          }
        });
      },
      { threshold: 0.5 }
    );

    if (statsRef.current) {
      observer.observe(statsRef.current);
    }

    return () => observer.disconnect();
  }, [isAnimating]);

  const resetCounters = () => {
    const counters = ['counter-1', 'counter-2', 'counter-3', 'counter-4'];
    const suffixes = ['+', '+', '+', '%'];
    
    counters.forEach((id, index) => {
      const element = document.getElementById(id);
      if (element) {
        element.textContent = '0' + suffixes[index];
      }
    });
  };

  const animateCounters = () => {
    const counters = [
      { id: 'counter-1', target: 15, suffix: '+', duration: 2000 },
      { id: 'counter-2', target: 500, suffix: '+', duration: 2000 },
      { id: 'counter-3', target: 350, suffix: '+', duration: 2000 },
      { id: 'counter-4', target: 98, suffix: '%', duration: 2000 },
    ];

    counters.forEach((counter) => {
      const element = document.getElementById(counter.id);
      if (!element) return;

      const increment = counter.target / (counter.duration / 16);
      let current = 0;

      const updateCounter = () => {
        current += increment;
        if (current < counter.target) {
          element.textContent = Math.floor(current) + counter.suffix;
          requestAnimationFrame(updateCounter);
        } else {
          element.textContent = counter.target + counter.suffix;
        }
      };

      updateCounter();
    });
  };

  return (
    <section className="py-16 bg-background">
      <div className="container mx-auto px-4 lg:px-8">
        <div ref={statsRef} className="grid grid-cols-2 md:grid-cols-4 gap-6 md:gap-8 max-w-4xl mx-auto">
          <div className="space-y-2 text-center">
            <div id="counter-1" className="text-4xl md:text-5xl font-bold text-primary">0+</div>
            <div className="text-sm text-muted-foreground">Years Experience</div>
          </div>
          <div className="space-y-2 text-center">
            <div id="counter-2" className="text-4xl md:text-5xl font-bold text-primary">0+</div>
            <div className="text-sm text-muted-foreground">Projects Completed</div>
          </div>
          <div className="space-y-2 text-center">
            <div id="counter-3" className="text-4xl md:text-5xl font-bold text-primary">0+</div>
            <div className="text-sm text-muted-foreground">Happy Clients</div>
          </div>
          <div className="space-y-2 text-center">
            <div id="counter-4" className="text-4xl md:text-5xl font-bold text-primary">0%</div>
            <div className="text-sm text-muted-foreground">Success Rate</div>
          </div>
        </div>
      </div>
    </section>
  );
};
