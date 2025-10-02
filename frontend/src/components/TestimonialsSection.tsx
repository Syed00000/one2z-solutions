import { useEffect, useRef, useState } from "react";
import { Quote, Star } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { api } from "@/services/api";

interface Review {
  _id: string;
  id?: string;
  name: string;
  company?: string;
  rating: number;
  review: string;
  status: string;
  createdAt: string;
}

export const TestimonialsSection = () => {
  const sectionRef = useRef<HTMLElement>(null);
  const [testimonials, setTestimonials] = useState<Review[]>([]);

  useEffect(() => {
    const loadTestimonials = async () => {
      try {
        console.log('⭐ Loading approved reviews for homepage...');
        // Get featured/approved reviews from database
        const response = await api.reviews.getFeatured(6);
        if (response.success) {
          console.log(`✅ Loaded ${response.data?.length || 0} approved reviews`);
          setTestimonials((response.data as Review[]) || []);
        } else {
          console.log('⚠️ No approved reviews found');
          setTestimonials([]);
        }
      } catch (error) {
        console.error('❌ Error loading testimonials:', error);
        // Fallback to empty array - no localStorage
        setTestimonials([]);
      }
    };

    loadTestimonials();
  }, []);

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
      { threshold: 0.1 }
    );

    if (sectionRef.current) {
      observer.observe(sectionRef.current);
    }

    return () => observer.disconnect();
  }, [testimonials]);

  return (
    <section ref={sectionRef} className="py-24 overflow-hidden">
      <div className="container mx-auto px-4 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold mb-4">What Our Clients Say</h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Don't just take our word for it - hear from our satisfied clients
          </p>
        </div>

        {testimonials.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-muted-foreground">No reviews yet. Be the first to share your experience!</p>
          </div>
        ) : (
          <div className="relative -mx-4 md:-mx-8">
            {/* Left Fade */}
            <div className="absolute left-0 top-0 bottom-0 w-16 md:w-24 z-10 bg-gradient-to-r from-background via-background/100 to-transparent pointer-events-none" />
            
            {/* Right Fade */}
            <div className="absolute right-0 top-0 bottom-0 w-16 md:w-24 z-10 bg-gradient-to-l from-background via-background/100 to-transparent pointer-events-none" />
            
            <div 
              className="flex gap-8 animate-scroll hover:pause-animation px-4 md:px-8"
              style={{
                animation: 'scroll 30s linear infinite',
              }}
            >
              {/* Duplicate testimonials for seamless loop */}
              {[...testimonials, ...testimonials].map((testimonial, index) => (
                <Card
                  key={`${testimonial._id || testimonial.id}-${index}`}
                  data-animate
                  className="bg-card hover:shadow-custom-md transition-shadow flex-shrink-0 w-[350px]"
                >
                  <CardContent className="pt-6">
                    <div className="flex justify-between items-start mb-4">
                      <Quote className="w-10 h-10 text-primary/30" />
                      <div className="flex gap-1">
                        {[...Array(testimonial.rating)].map((_, i) => (
                          <Star key={i} className="w-4 h-4 fill-red-500 text-red-500" />
                        ))}
                      </div>
                    </div>
                    <p className="text-foreground mb-6 leading-relaxed line-clamp-4">{testimonial.review}</p>
                    <div>
                      <div className="font-semibold text-foreground">{testimonial.name}</div>
                      {testimonial.company && (
                        <div className="text-sm text-muted-foreground">{testimonial.company}</div>
                      )}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        )}
      </div>
      
      <style>{`
        @keyframes scroll {
          0% {
            transform: translateX(0);
          }
          100% {
            transform: translateX(-50%);
          }
        }
        
        .animate-scroll {
          animation: scroll 30s linear infinite;
        }
        
        .animate-scroll:hover {
          animation-play-state: paused;
        }
      `}</style>
    </section>
  );
};
