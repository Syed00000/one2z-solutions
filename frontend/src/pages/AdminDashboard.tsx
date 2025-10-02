import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Building2, LogOut, Calendar, Mail, FolderOpen, Star, Users, TrendingUp, Eye, MessageSquare, Key, Settings, ThumbsUp } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { toast } from "sonner";
import { useAuth } from "@/contexts/AuthContext";
import { api } from "@/services/api";

interface Meeting {
  id: string;
  name: string;
  email: string;
  phone: string;
  date: string;
  time: string;
  purpose: string;
  status: string;
  createdAt: string;
}

interface ContactMessage {
  id: string;
  name: string;
  email: string;
  phone: string;
  message: string;
  status: string;
  createdAt: string;
}

const AdminDashboard = () => {
  const { logout, user } = useAuth();
  const navigate = useNavigate();
  const [meetings, setMeetings] = useState<Meeting[]>([]);
  const [messages, setMessages] = useState<ContactMessage[]>([]);
  const [reviews, setReviews] = useState<{status: string}[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadData = async () => {
      try {
        // Load data from API
        const [meetingsRes, messagesRes, reviewsRes] = await Promise.all([
          api.meetings.getAll({ limit: 5 }),
          api.messages.getAll({ limit: 5 }),
          api.reviews.getAll({ limit: 5 })
        ]);

        if (meetingsRes.success) setMeetings((meetingsRes.data as Meeting[]) || []);
        if (messagesRes.success) setMessages((messagesRes.data as ContactMessage[]) || []);
        if (reviewsRes.success) setReviews((reviewsRes.data as {status: string}[]) || []);
      } catch (error) {
        console.error('Error loading dashboard data:', error);
        toast.error("Failed to load dashboard data");
        // No localStorage fallback - everything from database now
      } finally {
        setIsLoading(false);
      }
    };

    loadData();
  }, []);

  const handleLogout = async () => {
    try {
      await logout();
      toast.success("Logged out successfully");
      navigate("/admin/login");
    } catch (error) {
      console.error('Logout error:', error);
      toast.error("Error logging out");
    }
  };

  const deleteMeeting = async (id: string) => {
    try {
      await api.meetings.delete(id);
      const updatedMeetings = meetings.filter(m => m.id !== id);
      setMeetings(updatedMeetings);
      toast.success("Meeting deleted successfully");
    } catch (error) {
      toast.error("Failed to delete meeting");
    }
  };

  const updateMeetingStatus = async (id: string, status: string) => {
    try {
      await api.meetings.updateStatus(id, status);
      const updatedMeetings = meetings.map(m => 
        m.id === id ? { ...m, status } : m
      );
      setMeetings(updatedMeetings);
      toast.success(`Meeting ${status}`);
    } catch (error) {
      toast.error("Failed to update meeting status");
    }
  };

  const deleteMessage = async (id: string) => {
    try {
      await api.messages.delete(id);
      const updatedMessages = messages.filter(m => m.id !== id);
      setMessages(updatedMessages);
      toast.success("Message deleted successfully");
    } catch (error) {
      toast.error("Failed to delete message");
    }
  };

  const markMessageAsRead = async (id: string) => {
    try {
      await api.messages.updateStatus(id, "read");
      const updatedMessages = messages.map(m => 
        m.id === id ? { ...m, status: "read" } : m
      );
      setMessages(updatedMessages);
      toast.success("Message marked as read");
    } catch (error) {
      toast.error("Failed to update message status");
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

  return (
    <div className="min-h-screen bg-background">
      {/* Admin Header */}
      <header className="border-b border-border bg-card">
        <div className="container mx-auto px-4 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-2">
              <Building2 className="w-6 h-6 text-primary" />
              <div className="flex flex-col">
                <span className="text-lg font-bold leading-tight">One2Z Solutions</span>
                <span className="text-xs text-muted-foreground">Admin Panel</span>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Button variant="ghost" size="sm" asChild>
                <Link to="/admin/password-reset" className="flex items-center">
                  <Key className="w-4 h-4 mr-1" />
                  <span>Reset</span>
                </Link>
              </Button>
              <Button variant="ghost" size="sm" onClick={handleLogout}>
                <LogOut className="w-4 h-4 mr-2" />
                Logout
              </Button>
            </div>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-4xl font-bold mb-2">Dashboard</h1>
          <p className="text-muted-foreground">Welcome back! Here's an overview of your construction and interior design business.</p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card className="bg-card">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-muted-foreground">Scheduled Meetings</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">{meetings.length}</div>
              <p className="text-xs text-muted-foreground mt-1">
                {meetings.filter(m => m.status === "pending").length} pending
              </p>
            </CardContent>
          </Card>

          <Card className="bg-card">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-muted-foreground">Contact Messages</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">{messages.length}</div>
              <p className="text-xs text-muted-foreground mt-1">
                {messages.filter(m => m.status === "unread").length} unread
              </p>
            </CardContent>
          </Card>

          <Card className="bg-card">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-muted-foreground">Confirmed Meetings</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">
                {meetings.filter(m => m.status === "confirmed").length}
              </div>
              <p className="text-xs text-muted-foreground mt-1">This month</p>
            </CardContent>
          </Card>

          <Card className="bg-card">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-muted-foreground">Total Inquiries</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">{meetings.length + messages.length}</div>
              <p className="text-xs text-muted-foreground mt-1">All time</p>
            </CardContent>
          </Card>

          <Card className="bg-card">
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <CardTitle className="text-sm font-medium text-muted-foreground">Customer Reviews</CardTitle>
                <ThumbsUp className="w-4 h-4 text-amber-500" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">{reviews.length}</div>
              <p className="text-xs text-muted-foreground mt-1">
                {reviews.filter((r: any) => r.status === 'approved').length} approved
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Quick Actions */}
        <div className="mb-8">
          <h2 className="text-2xl font-bold mb-4">Quick Actions</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <Card className="bg-card hover:shadow-custom-md transition-shadow cursor-pointer">
              <CardHeader>
                <FolderOpen className="w-8 h-8 text-primary mb-2" />
                <CardTitle>Manage Projects</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground mb-4">
                  Create, edit, and manage construction projects
                </p>
                <Button variant="outline" size="sm" className="w-full" asChild>
                  <Link to="/admin/projects">Go to Projects</Link>
                </Button>
              </CardContent>
            </Card>

            <Card className="bg-card hover:shadow-custom-md transition-shadow cursor-pointer">
              <CardHeader>
                <Mail className="w-8 h-8 text-primary mb-2" />
                <CardTitle>Messages</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground mb-4">View and manage customer messages</p>
                <Button variant="outline" size="sm" className="w-full" asChild>
                  <Link to="/admin/messages">Go to Messages</Link>
                </Button>
              </CardContent>
            </Card>

            <Card className="bg-card hover:shadow-custom-md transition-shadow cursor-pointer">
              <CardHeader>
                <Calendar className="w-8 h-8 text-primary mb-2" />
                <CardTitle>Meetings</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground mb-4">Schedule and manage client meetings</p>
                <Button variant="outline" size="sm" className="w-full" asChild>
                  <Link to="/admin/meetings-list">Go to Meetings</Link>
                </Button>
              </CardContent>
            </Card>

            <Card className="bg-card hover:shadow-custom-md transition-shadow cursor-pointer">
              <CardHeader>
                <Star className="w-8 h-8 text-primary mb-2" />
                <CardTitle>Reviews</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground mb-4">Manage customer reviews and testimonials</p>
                <Button variant="outline" size="sm" className="w-full" asChild>
                  <Link to="/admin/reviews">Go to Reviews</Link>
                </Button>
              </CardContent>
            </Card>

          </div>
        </div>
      </main>
    </div>
  );
};

export default AdminDashboard;
