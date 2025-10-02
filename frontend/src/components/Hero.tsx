import { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ArrowRight, Phone } from "lucide-react";
import heroImage from "@/assets/hero-construction.jpg";

export const Hero = () => {
  const heroRef = useRef<HTMLDivElement>(null);
  const [typewriterText, setTypewriterText] = useState("");
  const [currentWordIndex, setCurrentWordIndex] = useState(0);
  const [isDeleting, setIsDeleting] = useState(false);

  const words = ["Building Spaces", "Creating Dreams", "Designing Futures", "Constructing Excellence"];
  const staticText = "That Last";

  // Typewriter effect
  useEffect(() => {
    const typeSpeed = 100;
    const deleteSpeed = 50;
    const pauseTime = 2000;

    const type = () => {
      const currentWord = words[currentWordIndex];
      
      if (!isDeleting) {
        if (typewriterText.length < currentWord.length) {
          setTypewriterText(currentWord.slice(0, typewriterText.length + 1));
        } else {
          setTimeout(() => setIsDeleting(true), pauseTime);
          return;
        }
      } else {
        if (typewriterText.length > 0) {
          setTypewriterText(typewriterText.slice(0, -1));
        } else {
          setIsDeleting(false);
          setCurrentWordIndex((prev) => (prev + 1) % words.length);
          return;
        }
      }
    };

    const timer = setTimeout(type, isDeleting ? deleteSpeed : typeSpeed);
    return () => clearTimeout(timer);
  }, [typewriterText, isDeleting, currentWordIndex, words]);

  useEffect(() => {
    // Trigger animations immediately on mount
    const elements = heroRef.current?.querySelectorAll('[data-animate]');
    elements?.forEach((el, index) => {
      setTimeout(() => {
        el.classList.add('visible');
      }, index * 150);
    });
  }, []);

  return (
    <section
      ref={heroRef}
      className="relative min-h-screen flex items-center justify-center overflow-hidden bg-gradient-hero"
    >
      {/* Background Video with Overlay */}
      <div className="absolute inset-0 z-0">
        <video
          autoPlay
          muted
          loop
          playsInline
          className="w-full h-full object-cover opacity-50"
        >
          {/* Local video from public folder */}
          <source src="/video.mp4" type="video/mp4" />
          
          {/* Fallback image if video fails */}
          <img
            src={heroImage}
            alt="Modern construction and interior design"
            className="w-full h-full object-cover opacity-40"
          />
        </video>
        <div className="absolute inset-0 bg-gradient-to-b from-background/20 via-background/30 to-background/60"></div>
      </div>

      {/* Bottom Fade Effect */}
      <div className="absolute bottom-0 left-0 right-0 h-48 bg-gradient-to-t from-background via-background/90 via-20% to-transparent z-10 pointer-events-none" />

      {/* Content */}
      <div className="relative z-20 container mx-auto px-4 lg:px-8 pt-40 pb-32">
        <div className="max-w-4xl mx-auto text-center space-y-8">
          <h1
            data-animate
            className="text-5xl md:text-6xl lg:text-7xl font-bold leading-tight"
          >
            <span className="typewriter-container">
              {typewriterText}
              <span className="typewriter-cursor" style={{ color: 'red' }}>|</span>
            </span>
            <span className="block text-primary font-bold">
              {staticText}
            </span>
          </h1>

          <p
            data-animate
            className="text-xl md:text-2xl text-muted-foreground max-w-2xl mx-auto"
          >
            Complete construction & interior design solutions. From concept to completion, we bring your vision to life.
          </p>

          <div data-animate className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <Button
              size="lg"
              className="bg-gradient-accent shadow-accent text-lg px-8 py-6 transition-all duration-200 hover:scale-105 hover:-translate-y-0.5"
              asChild
            >
              <Link to="/contact">
                Get Free Estimate
                <ArrowRight className="ml-2 w-5 h-5" />
              </Link>
            </Button>
            <Button
              size="lg"
              variant="outline"
              className="border-2 text-lg px-8 py-6 transition-all duration-200 hover:scale-105 hover:-translate-y-0.5"
              asChild
            >
              <Link to="/book-meeting">
                <Phone className="mr-2 w-5 h-5" />
                Book a Meeting
              </Link>
            </Button>
          </div>

        </div>
      </div>
      
      <style>{`
        .typewriter-cursor {
          animation: blink 1s infinite;
          color: #3b82f6;
        }
        
        @keyframes blink {
          0%, 50% { opacity: 1; }
          51%, 100% { opacity: 0; }
        }
        
        .typewriter-container {
          min-height: 1.2em;
          display: inline-block;
        }
      `}</style>
    </section>
  );
};
