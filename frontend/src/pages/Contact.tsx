import { useState } from "react";
import { Layout } from "@/components/Layout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Mail, Phone, MapPin, CheckCircle2 } from "lucide-react";
import { toast } from "sonner";
import { api } from "@/services/api";

const Contact = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    message: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      // Clean form data - remove empty phone field if not provided
      const cleanFormData = {
        ...formData,
        phone: formData.phone.trim() || undefined
      };
      
      console.log('📧 Sending message data:', cleanFormData);
      const response = await api.messages.create(cleanFormData);
      
      if (response.success) {
        setIsSubmitted(true);
        toast.success("Message sent successfully!", {
          description: "We'll get back to you within 24 hours.",
        });
        
        setFormData({ name: "", email: "", phone: "", message: "" });
        
        // Reset success message after 5 seconds
        setTimeout(() => {
          setIsSubmitted(false);
        }, 5000);
      }
    } catch (error: any) {
      toast.error("Failed to send message", {
        description: error.message || "Please try again later.",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  return (
    <Layout>
      <div className="pt-20">
        {/* Page Header */}
        <section className="py-16 bg-gradient-hero">
          <div className="container mx-auto px-4 lg:px-8 text-center">
            <h1 className="text-5xl md:text-6xl font-bold mb-4">Contact Us</h1>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Get in touch with our team to discuss your construction project
            </p>
          </div>
        </section>

        <section className="py-16">
          <div className="container mx-auto px-4 lg:px-8">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
              {/* Contact Information */}
              <div className="space-y-6">
                <Card className="bg-card">
                  <CardHeader>
                    <div className="w-12 h-12 rounded-lg bg-gradient-accent flex items-center justify-center mb-2">
                      <Phone className="w-6 h-6 text-primary-foreground" />
                    </div>
                    <CardTitle>Phone</CardTitle>
                    <CardDescription>Mon-Fri 9AM-6PM</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <a href="tel:+15551234567" className="text-foreground hover:text-primary transition-colors">
                      +1 (555) 123-4567
                    </a>
                  </CardContent>
                </Card>

                <Card className="bg-card">
                  <CardHeader>
                    <div className="w-12 h-12 rounded-lg bg-gradient-accent flex items-center justify-center mb-2">
                      <Mail className="w-6 h-6 text-primary-foreground" />
                    </div>
                    <CardTitle>Email</CardTitle>
                    <CardDescription>We'll respond within 24h</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <a href="mailto:info@buildpro.com" className="text-foreground hover:text-primary transition-colors">
                      info@buildpro.com
                    </a>
                  </CardContent>
                </Card>

                <Card className="bg-card">
                  <CardHeader>
                    <div className="w-12 h-12 rounded-lg bg-gradient-accent flex items-center justify-center mb-2">
                      <MapPin className="w-6 h-6 text-primary-foreground" />
                    </div>
                    <CardTitle>Office</CardTitle>
                    <CardDescription>Visit us</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <address className="text-foreground not-italic">
                      123 Construction Ave
                      <br />
                      Building City, BC 12345
                    </address>
                  </CardContent>
                </Card>
              </div>

              {/* Contact Form */}
              <div className="lg:col-span-2">
                <Card className="bg-card">
                  <CardHeader>
                    <CardTitle className="text-2xl">Send us a message</CardTitle>
                    <CardDescription>
                      Fill out the form below and we'll get back to you as soon as possible
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <form onSubmit={handleSubmit} className="space-y-6">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-2">
                          <label htmlFor="name" className="text-sm font-medium">
                            Name *
                          </label>
                          <Input
                            id="name"
                            name="name"
                            value={formData.name}
                            onChange={handleChange}
                            required
                            placeholder="Your name"
                            className="bg-background"
                          />
                        </div>
                        <div className="space-y-2">
                          <label htmlFor="email" className="text-sm font-medium">
                            Email *
                          </label>
                          <Input
                            id="email"
                            name="email"
                            type="email"
                            value={formData.email}
                            onChange={handleChange}
                            required
                            placeholder="your@email.com"
                            className="bg-background"
                          />
                        </div>
                      </div>

                      <div className="space-y-2">
                        <label htmlFor="phone" className="text-sm font-medium">
                          Phone Number
                        </label>
                        <Input
                          id="phone"
                          name="phone"
                          type="tel"
                          value={formData.phone}
                          onChange={handleChange}
                          placeholder="+1 (555) 000-0000"
                          className="bg-background"
                        />
                      </div>

                      <div className="space-y-2">
                        <label htmlFor="message" className="text-sm font-medium">
                          Message *
                        </label>
                        <Textarea
                          id="message"
                          name="message"
                          value={formData.message}
                          onChange={handleChange}
                          required
                          placeholder="Tell us about your project..."
                          rows={6}
                          className="bg-background resize-none"
                        />
                      </div>

                      {isSubmitted && (
                        <div className="flex items-center gap-2 p-4 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg mb-4">
                          <CheckCircle2 className="w-5 h-5 text-green-600 dark:text-green-400" />
                          <p className="text-sm text-green-700 dark:text-green-300">
                            Message sent successfully! We'll contact you soon.
                          </p>
                        </div>
                      )}

                      <Button 
                        type="submit" 
                        size="lg" 
                        className="w-full bg-gradient-accent shadow-accent"
                        disabled={isSubmitting}
                      >
                        {isSubmitting ? (
                          <>
                            <span className="animate-spin mr-2">⏳</span>
                            Sending...
                          </>
                        ) : (
                          "Send Message"
                        )}
                      </Button>
                    </form>
                  </CardContent>
                </Card>
              </div>
            </div>
          </div>
        </section>
      </div>
    </Layout>
  );
};

export default Contact;
