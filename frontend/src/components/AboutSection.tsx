import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Building2, Users, Award, ArrowRight } from "lucide-react";

export const AboutSection = () => {
  return (
    <section className="py-24 ">
      <div className="container mx-auto px-4 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          {/* Left Content */}
          <div className="space-y-6">
            <div className="inline-block">
              <span className="text-primary font-semibold text-sm uppercase tracking-wider">About Us</span>
            </div>
            <h2 className="text-4xl md:text-5xl font-bold leading-tight">
              Building Excellence Since 2009
            </h2>
            <p className="text-lg text-muted-foreground leading-relaxed">
              One2Z Solutions is a leading construction and interior design firm with over 15 years of experience in transforming spaces and bringing visions to life.
            </p>
            <p className="text-muted-foreground leading-relaxed">
              Founded by <span className="text-foreground font-semibold">MD MAHFOOJ ALAM</span>, we have successfully completed over 500 projects, serving 350+ satisfied clients with a remarkable 98% success rate. Our commitment to quality, innovation, and customer satisfaction sets us apart in the industry.
            </p>
            
            <div className="space-y-4 pt-4">
              <div className="flex items-start gap-3">
                <div className="w-2 h-2 rounded-full bg-primary mt-2"></div>
                <div>
                  <h4 className="font-semibold mb-1">Expert Team</h4>
                  <p className="text-sm text-muted-foreground">Highly skilled professionals with years of industry experience</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <div className="w-2 h-2 rounded-full bg-primary mt-2"></div>
                <div>
                  <h4 className="font-semibold mb-1">Quality Assurance</h4>
                  <p className="text-sm text-muted-foreground">Premium materials and meticulous attention to detail</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <div className="w-2 h-2 rounded-full bg-primary mt-2"></div>
                <div>
                  <h4 className="font-semibold mb-1">Customer First</h4>
                  <p className="text-sm text-muted-foreground">Your satisfaction is our top priority</p>
                </div>
              </div>
            </div>

            <div className="pt-4">
              <Button size="lg" asChild>
                <Link to="/about">
                  Read More About Us
                  <ArrowRight className="ml-2 w-5 h-5" />
                </Link>
              </Button>
            </div>
          </div>

          {/* Right Stats Cards */}
          <div className="grid grid-cols-2 gap-6">
            <Card className="bg-card hover:shadow-lg transition-shadow">
              <CardContent className="pt-6">
                <Building2 className="w-12 h-12 text-primary mb-4" />
                <h3 className="text-4xl font-bold mb-2">500+</h3>
                <p className="text-sm text-muted-foreground">Projects Completed</p>
              </CardContent>
            </Card>
            
            <Card className="bg-card hover:shadow-lg transition-shadow">
              <CardContent className="pt-6">
                <Users className="w-12 h-12 text-primary mb-4" />
                <h3 className="text-4xl font-bold mb-2">350+</h3>
                <p className="text-sm text-muted-foreground">Happy Clients</p>
              </CardContent>
            </Card>
            
            <Card className="bg-card hover:shadow-lg transition-shadow">
              <CardContent className="pt-6">
                <Award className="w-12 h-12 text-primary mb-4" />
                <h3 className="text-4xl font-bold mb-2">15+</h3>
                <p className="text-sm text-muted-foreground">Years Experience</p>
              </CardContent>
            </Card>
            
            <Card className="bg-card hover:shadow-lg transition-shadow">
              <CardContent className="pt-6">
                <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mb-4">
                  <span className="text-2xl font-bold text-primary">98%</span>
                </div>
                <h3 className="text-4xl font-bold mb-2">Success</h3>
                <p className="text-sm text-muted-foreground">Client Satisfaction</p>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </section>
  );
};
