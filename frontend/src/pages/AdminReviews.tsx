import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Building2, LogOut, Star, ArrowLeft, Trash2, Eye, EyeOff, CheckCircle, XCircle } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
import { api } from "@/services/api";
import { useAuth } from "@/contexts/AuthContext";

interface Review {
  _id: string;
  id?: string;
  name: string;
  company?: string;
  rating: number;
  review: string;
  status: 'pending' | 'approved' | 'rejected';
  createdAt: string;
}

const AdminReviews = () => {
  const { logout } = useAuth();
  const [reviews, setReviews] = useState<Review[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    loadReviews();
  }, []);

  const loadReviews = async () => {
    try {
      console.log('⭐ Loading reviews from backend...');
      const response = await api.reviews.getAll();
      
      if (response.success) {
        console.log('✅ Reviews loaded:', response.data);
        setReviews((response.data as Review[]) || []);
      } else {
        console.error('❌ Failed to load reviews:', response);
        toast.error("Failed to load reviews");
      }
    } catch (error) {
      console.error('❌ Error loading reviews:', error);
      toast.error("Error loading reviews");
    } finally {
      setIsLoading(false);
    }
  };

  const handleLogout = async () => {
    try {
      await logout();
      navigate('/admin/login');
    } catch (error) {
      toast.error("Logout failed");
    }
  };

  const updateReviewStatus = async (id: string, status: string) => {
    try {
      await api.reviews.updateStatus(id, status);
      setReviews(reviews.map(r => 
        (r._id || r.id) === id ? { ...r, status: status as any } : r
      ));
      toast.success(`Review ${status}`);
    } catch (error) {
      toast.error("Failed to update review status");
    }
  };

  const deleteReview = async (id: string) => {
    if (!confirm("Are you sure you want to delete this review?")) return;
    
    try {
      await api.reviews.delete(id);
      setReviews(reviews.filter(r => (r._id || r.id) !== id));
      toast.success("Review deleted successfully");
    } catch (error) {
      toast.error("Failed to delete review");
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
          <p>Loading reviews...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Admin Header */}
      <header className="border-b border-border bg-card sticky top-0 z-50">
        <div className="container mx-auto px-4 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-4">
              <Button variant="ghost" size="sm" onClick={() => navigate('/admin/dashboard')}>
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back
              </Button>
              <div className="flex items-center gap-2">
                <Building2 className="w-6 h-6 text-primary" />
                <div className="flex flex-col">
                  <span className="text-lg font-bold leading-tight">One2Z Solutions</span>
                  <span className="text-xs text-muted-foreground">Reviews Management</span>
                </div>
              </div>
            </div>
            <Button variant="ghost" size="sm" onClick={handleLogout}>
              <LogOut className="w-4 h-4 mr-2" />
              Logout
            </Button>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 lg:px-8 py-8">
        {/* Page Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold mb-2 flex items-center gap-3">
            <Star className="w-10 h-10 fill-red-500 text-red-500" />
            Reviews Management
          </h1>
          <p className="text-muted-foreground">Manage customer reviews and testimonials</p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-muted-foreground">Total Reviews</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">{reviews.length}</div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-muted-foreground">Pending</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-yellow-600">
                {reviews.filter(r => r.status === "pending").length}
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-muted-foreground">Approved</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-green-600">
                {reviews.filter(r => r.status === "approved").length}
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-muted-foreground">Disabled</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-red-600">
                {reviews.filter(r => r.status === "rejected").length}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Reviews List */}
        {reviews.length === 0 ? (
          <Card>
            <CardContent className="pt-12 pb-12 text-center">
              <Star className="w-16 h-16 fill-red-500/20 text-red-500/20 mx-auto mb-4" />
              <h3 className="text-xl font-semibold mb-2">No reviews yet</h3>
              <p className="text-muted-foreground">Reviews will appear here when customers submit them</p>
            </CardContent>
          </Card>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {reviews.map((review) => (
              <Card key={review._id || review.id} className="hover:shadow-lg transition-shadow">
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <h3 className="text-lg font-semibold">{review.name}</h3>
                        <Badge 
                          variant={
                            review.status === "approved" ? "default" : 
                            review.status === "rejected" ? "destructive" : 
                            "secondary"
                          }
                        >
                          {review.status}
                        </Badge>
                      </div>
                      {review.company && (
                        <p className="text-sm text-muted-foreground">{review.company}</p>
                      )}
                      <div className="flex gap-1 mt-2">
                        {[...Array(review.rating)].map((_, i) => (
                          <Star key={i} className="w-4 h-4 fill-red-500 text-red-500" />
                        ))}
                      </div>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div>
                      <p className="text-sm text-foreground leading-relaxed">{review.review}</p>
                    </div>
                    <div className="text-xs text-muted-foreground">
                      Submitted on {formatDate(review.createdAt)}
                    </div>
                    <div className="flex gap-2 pt-2 border-t">
                      {review.status === "pending" && (
                        <>
                          <Button 
                            size="sm" 
                            onClick={() => updateReviewStatus(review._id || review.id!, "approved")}
                            className="flex-1"
                          >
                            <CheckCircle className="w-4 h-4 mr-1" />
                            Approve
                          </Button>
                          <Button 
                            size="sm" 
                            variant="destructive"
                            onClick={() => updateReviewStatus(review._id || review.id!, "rejected")}
                            className="flex-1"
                          >
                            <XCircle className="w-4 h-4 mr-1" />
                            Reject
                          </Button>
                        </>
                      )}
                      {review.status === "approved" && (
                        <Button 
                          size="sm" 
                          variant="outline"
                          onClick={() => updateReviewStatus(review._id || review.id!, "rejected")}
                          className="flex-1"
                        >
                          <EyeOff className="w-4 h-4 mr-1" />
                          Disable
                        </Button>
                      )}
                      {review.status === "rejected" && (
                        <Button 
                          size="sm" 
                          variant="outline"
                          onClick={() => updateReviewStatus(review._id || review.id!, "approved")}
                          className="flex-1"
                        >
                          <Eye className="w-4 h-4 mr-1" />
                          Enable
                        </Button>
                      )}
                      <Button 
                        size="sm" 
                        variant="outline"
                        onClick={() => deleteReview(review._id || review.id!)}
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </main>
    </div>
  );
};

export default AdminReviews;
