import { Layout } from "@/components/Layout";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Building2, Users, Award, Target, Heart, Lightbulb, CheckCircle, ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";

const About = () => {
  return (
    <Layout>
      <div className="pt-20">
        {/* Hero Section */}
        <section className="py-24 bg-gradient-hero">
          <div className="container mx-auto px-4 lg:px-8">
            <div className="max-w-4xl mx-auto text-center">
              <h1 className="text-5xl md:text-6xl font-bold mb-6">About One2Z Solutions</h1>
              <p className="text-xl text-muted-foreground leading-relaxed">
                Building dreams into reality with over 15 years of excellence in construction and interior design
              </p>
            </div>
          </div>
        </section>

        {/* Company Story */}
        <section className="py-24">
          <div className="container mx-auto px-4 lg:px-8">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
              <div>
                <h2 className="text-4xl font-bold mb-6">Our Story</h2>
                <div className="space-y-4 text-muted-foreground leading-relaxed">
                  <p>
                    Founded with a vision to transform spaces and create lasting impressions, One2Z Solutions has been at the forefront of construction and interior design excellence for over 15 years.
                  </p>
                  <p>
                    What started as a small team of passionate professionals has grown into a leading construction and interior design firm, completing over 500 projects and serving 350+ satisfied clients.
                  </p>
                  <p>
                    Our commitment to quality, innovation, and customer satisfaction has earned us a 98% success rate and numerous industry accolades.
                  </p>
                </div>
                <div className="mt-8">
                  <Button size="lg" asChild>
                    <Link to="/contact">
                      Start Your Project
                      <ArrowRight className="ml-2 w-5 h-5" />
                    </Link>
                  </Button>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-6">
                <Card className="bg-card hover:shadow-lg transition-shadow">
                  <CardContent className="pt-6">
                    <Building2 className="w-12 h-12 text-primary mb-4" />
                    <h3 className="text-3xl font-bold mb-2">500+</h3>
                    <p className="text-sm text-muted-foreground">Projects Completed</p>
                  </CardContent>
                </Card>
                <Card className="bg-card hover:shadow-lg transition-shadow">
                  <CardContent className="pt-6">
                    <Users className="w-12 h-12 text-primary mb-4" />
                    <h3 className="text-3xl font-bold mb-2">350+</h3>
                    <p className="text-sm text-muted-foreground">Happy Clients</p>
                  </CardContent>
                </Card>
                <Card className="bg-card hover:shadow-lg transition-shadow">
                  <CardContent className="pt-6">
                    <Award className="w-12 h-12 text-primary mb-4" />
                    <h3 className="text-3xl font-bold mb-2">15+</h3>
                    <p className="text-sm text-muted-foreground">Years Experience</p>
                  </CardContent>
                </Card>
                <Card className="bg-card hover:shadow-lg transition-shadow">
                  <CardContent className="pt-6">
                    <Target className="w-12 h-12 text-primary mb-4" />
                    <h3 className="text-3xl font-bold mb-2">98%</h3>
                    <p className="text-sm text-muted-foreground">Success Rate</p>
                  </CardContent>
                </Card>
              </div>
            </div>
          </div>
        </section>

        {/* Mission & Vision */}
        <section className="py-24 ">
          <div className="container mx-auto px-4 lg:px-8">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <Card className="bg-card">
                <CardContent className="pt-6">
                  <Target className="w-12 h-12 text-primary mb-4" />
                  <h3 className="text-2xl font-bold mb-4">Our Mission</h3>
                  <p className="text-muted-foreground leading-relaxed">
                    To deliver exceptional construction and interior design solutions that exceed client expectations while maintaining the highest standards of quality and professionalism.
                  </p>
                </CardContent>
              </Card>
              <Card className="bg-card">
                <CardContent className="pt-6">
                  <Lightbulb className="w-12 h-12 text-primary mb-4" />
                  <h3 className="text-2xl font-bold mb-4">Our Vision</h3>
                  <p className="text-muted-foreground leading-relaxed">
                    To be the most trusted and innovative construction and interior design firm, known for transforming spaces and creating lasting value for our clients.
                  </p>
                </CardContent>
              </Card>
              <Card className="bg-card">
                <CardContent className="pt-6">
                  <Heart className="w-12 h-12 text-primary mb-4" />
                  <h3 className="text-2xl font-bold mb-4">Our Values</h3>
                  <p className="text-muted-foreground leading-relaxed">
                    Quality, integrity, innovation, and customer satisfaction are at the core of everything we do. We build relationships, not just structures.
                  </p>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>

        {/* Founder Section */}
        <section className="py-24">
          <div className="container mx-auto px-4 lg:px-8">
            <div className="max-w-4xl mx-auto">
              <div className="text-center mb-12">
                <h2 className="text-4xl font-bold mb-4">Meet Our Founder</h2>
                <p className="text-xl text-muted-foreground">
                  The visionary behind One2Z Solutions
                </p>
              </div>
              
              <Card className="bg-card">
                <CardContent className="pt-8">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    <div className="md:col-span-1 flex flex-col items-center text-center">
                      <div className="w-48 h-48 rounded-full bg-gradient-accent flex items-center justify-center mb-6">
                        <Building2 className="w-24 h-24 text-white" />
                      </div>
                      <h3 className="text-2xl font-bold mb-2"> MD MAHFOOJ ALAM</h3>
                      <p className="text-primary font-semibold mb-4">Director</p>
                      <div className="flex gap-2">
                        <Button variant="outline" size="sm" asChild>
                          <Link to="/contact">Contact</Link>
                        </Button>
                      </div>
                    </div>
                    
                    <div className="md:col-span-2 space-y-6">
                      <div>
                        <h4 className="text-xl font-semibold mb-3">About the Founder</h4>
                        <p className="text-muted-foreground leading-relaxed">
                        MD MAHFOOJ ALAM is the visionary Director of One2Z Solutions. With over 15 years of experience in the construction and interior design industry, he has led the company to become one of the most trusted names in the field.
                        </p>
                      </div>
                      
                      <div>
                        <h4 className="text-xl font-semibold mb-3">Expertise & Leadership</h4>
                        <p className="text-muted-foreground leading-relaxed">
                          Under his leadership, One2Z Solutions has completed over 500 projects ranging from residential homes to large-scale commercial developments. His commitment to quality and innovation has set new standards in the industry.
                        </p>
                      </div>
                      
                      <div>
                        <h4 className="text-xl font-semibold mb-3">Philosophy</h4>
                        <p className="text-muted-foreground leading-relaxed">
                          "We don't just build structures; we create spaces where memories are made and dreams come true. Every project is a testament to our commitment to excellence and our clients' vision."
                        </p>
                      </div>

                      <div className="pt-4">
                        <h4 className="text-lg font-semibold mb-3">Key Achievements</h4>
                        <div className="space-y-2">
                          <div className="flex items-start gap-2">
                            <CheckCircle className="w-5 h-5 text-primary mt-0.5 flex-shrink-0" />
                            <span className="text-muted-foreground">Successfully delivered 500+ projects with 98% client satisfaction</span>
                          </div>
                          <div className="flex items-start gap-2">
                            <CheckCircle className="w-5 h-5 text-primary mt-0.5 flex-shrink-0" />
                            <span className="text-muted-foreground">Built a team of 50+ skilled professionals</span>
                          </div>
                          <div className="flex items-start gap-2">
                            <CheckCircle className="w-5 h-5 text-primary mt-0.5 flex-shrink-0" />
                            <span className="text-muted-foreground">Pioneered innovative construction techniques in the region</span>
                          </div>
                          <div className="flex items-start gap-2">
                            <CheckCircle className="w-5 h-5 text-primary mt-0.5 flex-shrink-0" />
                            <span className="text-muted-foreground">Recognized industry leader in sustainable construction</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>

        {/* Why Choose Us */}
        <section className="py-24 bg-gradient-hero">
          <div className="container mx-auto px-4 lg:px-8">
            <div className="text-center mb-16">
              <h2 className="text-4xl font-bold mb-4">Why Choose One2Z Solutions?</h2>
              <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
                We bring expertise, dedication, and innovation to every project
              </p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {[
                {
                  title: "Expert Team",
                  description: "Highly skilled professionals with years of industry experience"
                },
                {
                  title: "Quality Materials",
                  description: "We use only the finest materials for lasting results"
                },
                {
                  title: "On-Time Delivery",
                  description: "Committed to completing projects within agreed timelines"
                },
                {
                  title: "Competitive Pricing",
                  description: "Best value for money without compromising on quality"
                },
                {
                  title: "Customer Support",
                  description: "Dedicated support team available throughout your project"
                },
                {
                  title: "Warranty & Service",
                  description: "Comprehensive warranty and after-sales service"
                }
              ].map((feature, index) => (
                <Card key={index} className="bg-card hover:shadow-lg transition-shadow">
                  <CardContent className="pt-6">
                    <CheckCircle className="w-10 h-10 text-primary mb-4" />
                    <h3 className="text-xl font-bold mb-3">{feature.title}</h3>
                    <p className="text-muted-foreground">{feature.description}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-24">
          <div className="container mx-auto px-4 lg:px-8">
            <Card className="bg-gradient-accent text-white">
              <CardContent className="py-16 text-center">
                <h2 className="text-4xl font-bold mb-4">Ready to Start Your Project?</h2>
                <p className="text-xl mb-8 opacity-90">
                  Let's bring your vision to life together
                </p>
                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                  <Button size="lg" variant="secondary" asChild>
                    <Link to="/contact">Get Free Quote</Link>
                  </Button>
                  <Button size="lg" variant="outline" className="bg-transparent border-white text-white hover:bg-white hover:text-primary" asChild>
                    <Link to="/book-meeting">Schedule Meeting</Link>
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </section>
      </div>
    </Layout>
  );
};

export default About;
