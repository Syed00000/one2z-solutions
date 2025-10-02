import { useState } from "react";
import { Star, ChevronDown, ChevronUp } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { toast } from "sonner";
import { api } from "@/services/api";

export const AddReview = () => {
  const [formData, setFormData] = useState({
    name: "",
    company: "",
    rating: 5,
    review: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isOpen, setIsOpen] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      // Clean form data - remove empty company field if not provided
      const cleanFormData = {
        name: formData.name,
        rating: formData.rating,
        review: formData.review,
        ...(formData.company.trim() && { company: formData.company })
      };
      
      console.log('⭐ Sending review data:', cleanFormData);
      const response = await api.reviews.create(cleanFormData);
      
      if (response.success) {
        toast.success("Review submitted successfully!", {
          description: "Your review will be published after admin approval.",
        });
        
        // Reset form
        setFormData({ name: "", company: "", rating: 5, review: "" });
        setIsOpen(false); // Close form after submission
      }
    } catch (error: any) {
      toast.error("Failed to submit review", {
        description: error.message || "Please try again later.",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleRatingClick = (rating: number) => {
    setFormData({ ...formData, rating });
  };

  return (
    <section className="py-24 bg-gradient-hero">
      <div className="container mx-auto px-4 lg:px-8">
        <div className="max-w-2xl mx-auto">
          <Card className="bg-card">
            <CardHeader 
              className="cursor-pointer hover:bg-muted/10 transition-colors"
              onClick={() => setIsOpen(!isOpen)}
            >
              <div className="flex items-center justify-between">
                <div className="flex-1">
                  <CardTitle className="text-3xl">Share Your Experience</CardTitle>
                  <p className="text-muted-foreground mt-2">
                    We'd love to hear about your experience working with us
                  </p>
                </div>
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  className="ml-4"
                >
                  {isOpen ? (
                    <ChevronUp className="w-6 h-6" />
                  ) : (
                    <ChevronDown className="w-6 h-6" />
                  )}
                </Button>
              </div>
            </CardHeader>
            
            {isOpen && (
              <CardContent className="animate-in slide-in-from-top-2 duration-300">
                <form onSubmit={handleSubmit} className="space-y-6">
                <div className="space-y-2">
                  <label htmlFor="name" className="text-sm font-medium">
                    Your Name *
                  </label>
                  <Input
                    id="name"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    required
                    placeholder="John Doe"
                  />
                </div>

                <div className="space-y-2">
                  <label htmlFor="company" className="text-sm font-medium">
                    Company/Organization
                  </label>
                  <Input
                    id="company"
                    value={formData.company}
                    onChange={(e) => setFormData({ ...formData, company: e.target.value })}
                    placeholder="ABC Corporation (Optional)"
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium">Rating *</label>
                  <div className="flex gap-2">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <button
                        key={star}
                        type="button"
                        onClick={() => handleRatingClick(star)}
                        className="transition-transform hover:scale-110"
                      >
                        <Star
                          className={`w-8 h-8 ${
                            star <= formData.rating
                              ? "fill-red-500 text-red-500"
                              : "text-gray-300"
                          }`}
                        />
                      </button>
                    ))}
                  </div>
                </div>

                <div className="space-y-2">
                  <label htmlFor="review" className="text-sm font-medium">
                    Your Review *
                  </label>
                  <Textarea
                    id="review"
                    value={formData.review}
                    onChange={(e) => setFormData({ ...formData, review: e.target.value })}
                    required
                    rows={5}
                    placeholder="Tell us about your experience..."
                  />
                </div>

                <Button
                  type="submit"
                  className="w-full"
                  size="lg"
                  disabled={isSubmitting}
                >
                  {isSubmitting ? "Submitting..." : "Submit Review"}
                </Button>
              </form>
              </CardContent>
            )}
          </Card>
        </div>
      </div>
    </section>
  );
};
