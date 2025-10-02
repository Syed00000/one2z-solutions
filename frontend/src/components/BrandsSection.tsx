import { useEffect, useRef } from "react";

export const BrandsSection = () => {
  const sectionRef = useRef<HTMLDivElement>(null);

  // Brand logos with names
  const brands = [
    { 
      name: "Asian Paints", 
      
      logo: "https://static.vecteezy.com/system/resources/previews/021/671/857/large_2x/asian-paints-logo-free-png.png"
    },
    { 
      name: "UltraTech Cement", 
      color: "#0066B3",
      logo: "https://mir-s3-cdn-cf.behance.net/projects/404/120bb8162835811.Y3JvcCwxOTk5LDE1NjQsMCw3OQ.png"
    },
    { 
      name: "Tata Steel", 
      color: "#004B87",
      logo: "https://companieslogo.com/img/orig/TATASTLLP.NS_BIG-eed2c57e.png?t=1604670432"
    },
    { 
      name: "Havells", 
      color: "#ED1C24",
      logo: "https://logos-world.net/wp-content/uploads/2023/03/Havells-Logo.png"
    },
    { 
      name: "Kajaria Tiles", 
      color: "#C41E3A",
      logo: "https://vectorseek.com/wp-content/uploads/2023/09/Kajaria-Tiles-Logo-Vector.svg-.png"
    },
    { 
      name: "Supreme Pipes", 
      color: "#0066B3",
      logo: "https://www.pngkey.com/png/full/12-120066_supreme-logo-png-supreme-pvc-pipes-logo.png"
    },
    { 
      name: "Jaquar", 
      
      logo: "https://images.seeklogo.com/logo-png/50/2/jaquar-logo-png_seeklogo-501132.png"
    },
    { 
      name: "Hindware", 
      color: "#E31E24",
      logo: "https://th.bing.com/th/id/R.89f3552616970bc7717f3729043c6032?rik=Qws2vZ7AzaD1PQ&riu=http%3a%2f%2flavishpremierindia.com%2fwp-content%2fuploads%2f2018%2f11%2fjaguar-bathroom-fittings-500x500.jpg&ehk=3ZC9E4esvdASLqfZMc5bz0UE33u4QJVAi9O8bNdQJxU%3d&risl=&pid=ImgRaw&r=0"
    },
    { 
      name: "Berger Paints", 
      color: "#0066B3",
      logo: "https://etstengineering.com/assets/static/f2a1d27d828dd25c6d92c139bf021010ab5a41dab32bb4ebb96e4711b7f185b3.6ef341c.c764a95104cf75edebe801e95af0efcc.png"
    },
    { 
      name: "Pidilite", 
      color: "#E31E24",
      logo: "https://static.vecteezy.com/system/resources/previews/024/039/087/large_2x/pidilite-logo-transparent-free-png.png"
    },
    { 
      name: "Anchor Electricals", 
      color: "#E31E24",
      logo: "https://cdn.freelogovectors.net/wp-content/uploads/2023/09/anchor_electricals-logo-panasonic-freelogovectors.net_.png"
    },
  ];

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const cards = entry.target.querySelectorAll('[data-brand-animate]');
            cards.forEach((card, index) => {
              // Remove animation class first
              card.classList.remove('brand-visible');
              // Force reflow
              void card.getBoundingClientRect();
              // Add animation class with delay
              setTimeout(() => {
                card.classList.add('brand-visible');
              }, index * 100);
            });
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
    <section ref={sectionRef} className="py-24 overflow-hidden">
      <div className="container mx-auto px-4 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold mb-4">Brands That Build Trust</h2>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto leading-relaxed">
            We use only the most trusted and high-quality brands to ensure long-lasting strength and stunning finishes — because your dream space deserves nothing less.
          </p>
        </div>

        {/* Desktop Grid Scroll View */}
        <div className="hidden md:block relative">
          <div className="h-[600px] overflow-hidden relative">
            {/* Top fade overlay */}
            <div className="absolute top-0 left-0 right-0 h-32 bg-gradient-to-b from-background to-transparent z-10 pointer-events-none"></div>
            
            {/* Bottom fade overlay */}
            <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-background to-transparent z-10 pointer-events-none"></div>
            
            <div 
              className="animate-scroll-vertical-grid"
              style={{
                animation: 'scroll-vertical-grid 40s linear infinite',
              }}
            >
              {/* Triple brands for seamless loop */}
              <div className="grid grid-cols-3 lg:grid-cols-4 gap-6">
                {[...brands, ...brands, ...brands].map((brand, index) => (
                  <div
                    key={`${brand.name}-${index}`}
                    className="bg-card rounded-lg border border-border flex items-center justify-center p-8 hover:shadow-lg transition-all group h-32"
                  >
                    <div className="text-center w-full">
                      <img 
                        src={brand.logo}
                        alt={brand.name}
                        className="h-16 w-auto mx-auto object-contain"
                        onError={(e) => {
                          // Fallback to text if image fails
                          const target = e.target as HTMLImageElement;
                          target.style.display = 'none';
                          const fallback = document.createElement('div');
                          fallback.className = 'text-xl font-bold tracking-tight';
                          fallback.style.color = brand.color || '#000000';
                          fallback.textContent = brand.name;
                          target.parentNode?.appendChild(fallback);
                        }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Mobile Horizontal Scroll */}
        <div className="md:hidden relative">
          <div 
            className="flex gap-6 items-center animate-scroll-brands"
            style={{
              animation: 'scroll-brands 40s linear infinite',
            }}
          >
            {/* Duplicate brands for seamless loop */}
            {[...brands, ...brands, ...brands].map((brand, index) => (
              <div
                key={`${brand.name}-${index}`}
                className="flex-shrink-0 w-48 h-32 bg-card rounded-lg border border-border flex items-center justify-center p-6 hover:shadow-lg transition-shadow group"
              >
                <div className="text-center w-full">
                  <img 
                    src={brand.logo}
                    alt={brand.name}
                    className="h-12 w-auto mx-auto object-contain"
                    onError={(e) => {
                      // Fallback to text if image fails
                      const target = e.target as HTMLImageElement;
                      target.style.display = 'none';
                      const fallback = document.createElement('div');
                      fallback.className = 'text-lg font-bold tracking-tight';
                      fallback.style.color = brand.color || '#000000';
                      fallback.textContent = brand.name;
                      target.parentNode?.appendChild(fallback);
                    }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Trust Indicators */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mt-16 max-w-4xl mx-auto">
          <div className="text-center">
            <div className="text-3xl font-bold text-primary mb-2">100%</div>
            <p className="text-sm text-muted-foreground">Genuine Products</p>
          </div>
          <div className="text-center">
            <div className="text-3xl font-bold text-primary mb-2">ISI</div>
            <p className="text-sm text-muted-foreground">Certified Materials</p>
          </div>
          <div className="text-center">
            <div className="text-3xl font-bold text-primary mb-2">5+</div>
            <p className="text-sm text-muted-foreground">Year Warranty</p>
          </div>
          <div className="text-center">
            <div className="text-3xl font-bold text-primary mb-2">24/7</div>
            <p className="text-sm text-muted-foreground">Support</p>
          </div>
        </div>
      </div>
      
      <style>{`
        @keyframes scroll-brands {
          0% {
            transform: translateX(0);
          }
          100% {
            transform: translateX(-33.333%);
          }
        }
        
        @keyframes scroll-vertical {
          0% {
            transform: translateY(0);
          }
          100% {
            transform: translateY(-33.333%);
          }
        }
        
        @keyframes scroll-vertical-grid {
          0% {
            transform: translateY(0);
          }
          100% {
            transform: translateY(-33.333%);
          }
        }
        
        @keyframes fadeInUp {
          from {
            opacity: 0;
            transform: translateY(30px) scale(0.95);
          }
          to {
            opacity: 1;
            transform: translateY(0) scale(1);
          }
        }
        
        .animate-scroll-brands {
          animation: scroll-brands 40s linear infinite;
        }
        
        .animate-scroll-brands:hover {
          animation-play-state: paused;
        }
        
        .animate-scroll-vertical {
          animation: scroll-vertical 30s linear infinite;
        }
        
        .animate-scroll-vertical:hover {
          animation-play-state: paused;
        }
        
        .animate-scroll-vertical-grid {
          animation: scroll-vertical-grid 40s linear infinite;
        }
        
        .animate-scroll-vertical-grid:hover {
          animation-play-state: paused;
        }
        
        .brand-card {
          opacity: 0;
          transform: translateY(30px) scale(0.95);
        }
        
        .brand-card.brand-visible {
          animation: fadeInUp 0.6s ease-out forwards;
        }
      `}</style>
    </section>
  );
};
