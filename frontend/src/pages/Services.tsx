import { Layout } from "@/components/Layout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { Building2, Home, Palette, Wrench, CheckCircle2 } from "lucide-react";

const services = [
  {
    icon: Home,
    title: "Residential Construction",
    description:
      "From single-family homes to multi-unit residential complexes, we bring your vision to life with meticulous attention to detail and quality craftsmanship.",
    features: [
      "Custom home construction",
      "Apartment complexes",
      "Townhouses and condos",
      "Gated communities",
      "Sustainable housing solutions",
    ],
  },
  {
    icon: Building2,
    title: "Commercial Projects",
    description:
      "We specialize in commercial construction that meets business needs, from office buildings to retail spaces, ensuring functionality and aesthetic appeal.",
    features: [
      "Office buildings and towers",
      "Retail centers and malls",
      "Hotels and hospitality",
      "Industrial facilities",
      "Mixed-use developments",
    ],
  },
  {
    icon: Palette,
    title: "Interior Design",
    description:
      "Complete interior design solutions that transform spaces into stunning, functional environments. From concept to execution, we create interiors that reflect your style and enhance your lifestyle.",
    features: [
      "Residential interior design",
      "Commercial space planning",
      "Custom furniture design",
      "Lighting and decor selection",
      "3D visualization and renderings",
    ],
  },
  {
    icon: Wrench,
    title: "Renovations & Remodeling",
    description:
      "Transform existing spaces with our comprehensive renovation services, breathing new life into buildings while maintaining structural integrity.",
    features: [
      "Interior remodeling",
      "Exterior renovations",
      "Space optimization",
      "Historic preservation",
      "Energy efficiency upgrades",
    ],
  },
];

const Services = () => {
  return (
    <Layout>
      <div className="pt-20">
        {/* Page Header */}
        <section className="py-16 bg-gradient-hero">
          <div className="container mx-auto px-4 lg:px-8 text-center">
            <h1 className="text-5xl md:text-6xl font-bold mb-4">Our Services</h1>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Comprehensive construction solutions tailored to meet your unique requirements
            </p>
          </div>
        </section>

        {/* Services Grid */}
        <section className="py-16">
          <div className="container mx-auto px-4 lg:px-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-16">
              {services.map((service, index) => (
                <Card key={index} className="bg-card hover:shadow-custom-lg transition-shadow">
                  <CardHeader>
                    <div className="w-16 h-16 rounded-lg bg-gradient-accent flex items-center justify-center mb-4">
                      <service.icon className="w-8 h-8 text-primary-foreground" />
                    </div>
                    <CardTitle className="text-2xl">{service.title}</CardTitle>
                    <CardDescription className="text-base pt-2">{service.description}</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <ul className="space-y-2">
                      {service.features.map((feature, featureIndex) => (
                        <li key={featureIndex} className="flex items-center gap-2">
                          <CheckCircle2 className="w-4 h-4 text-primary flex-shrink-0" />
                          <span className="text-sm text-muted-foreground">{feature}</span>
                        </li>
                      ))}
                    </ul>
                  </CardContent>
                </Card>
              ))}
            </div>

            {/* CTA Section */}
            <div className="bg-gradient-accent rounded-2xl p-12 text-center text-primary-foreground">
              <h2 className="text-3xl md:text-4xl font-bold mb-4">Ready to Start Your Project?</h2>
              <p className="text-lg mb-8 max-w-2xl mx-auto opacity-90">
                Let's discuss your construction needs and bring your vision to life. Get a free consultation and estimate
                today.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button size="lg" variant="secondary" asChild>
                  <Link to="/contact">Get Free Estimate</Link>
                </Button>
                <Button size="lg" variant="outline" className="border-2 border-primary-foreground text-primary-foreground hover:bg-primary-foreground/10" asChild>
                  <Link to="/projects">View Our Work</Link>
                </Button>
              </div>
            </div>
          </div>
        </section>
      </div>
    </Layout>
  );
};

export default Services;
