import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Building2, LogOut, Calendar, Mail, Phone, Clock, CheckCircle, XCircle, Trash2, ArrowLeft, Eye } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
import { api } from "@/services/api";
import { useAuth } from "@/contexts/AuthContext";

interface Meeting {
  _id: string;
  id?: string;
  name: string;
  email: string;
  phone: string;
  date: string;
  time: string;
  purpose: string;
  status: 'pending' | 'confirmed' | 'completed' | 'cancelled';
  notes?: string;
  createdAt: string;
}

const AdminMeetingsList = () => {
  const { logout } = useAuth();
  const [meetings, setMeetings] = useState<Meeting[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    loadMeetings();
  }, []);

  const loadMeetings = async () => {
    try {
      console.log('📅 Loading meetings from backend...');
      const response = await api.meetings.getAll();
      
      if (response.success) {
        console.log('✅ Meetings loaded:', response.data);
        setMeetings((response.data as Meeting[]) || []);
      } else {
        console.error('❌ Failed to load meetings:', response);
        toast.error("Failed to load meetings");
      }
    } catch (error) {
      console.error('❌ Error loading meetings:', error);
      toast.error("Error loading meetings");
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

  const deleteMeeting = async (id: string) => {
    if (!confirm("Are you sure you want to delete this meeting?")) return;
    
    try {
      await api.meetings.delete(id);
      setMeetings(meetings.filter(m => (m._id || m.id) !== id));
      toast.success("Meeting deleted successfully");
    } catch (error) {
      toast.error("Failed to delete meeting");
    }
  };

  const updateMeetingStatus = async (id: string, status: string) => {
    try {
      await api.meetings.updateStatus(id, status);
      setMeetings(meetings.map(m => 
        (m._id || m.id) === id ? { ...m, status: status as any } : m
      ));
      toast.success(`Meeting ${status}`);
    } catch (error) {
      toast.error("Failed to update meeting status");
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
          <p>Loading meetings...</p>
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
                  <span className="text-xs text-muted-foreground">Meetings Management</span>
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
            <Calendar className="w-10 h-10 text-primary" />
            Meetings Management
          </h1>
          <p className="text-muted-foreground">View and manage all scheduled client meetings</p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-muted-foreground">Total Meetings</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">{meetings.length}</div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-muted-foreground">Pending</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-yellow-600">
                {meetings.filter(m => m.status === "pending").length}
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-muted-foreground">Confirmed</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-green-600">
                {meetings.filter(m => m.status === "confirmed").length}
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-muted-foreground">Cancelled</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-red-600">
                {meetings.filter(m => m.status === "cancelled").length}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Meetings List */}
        {meetings.length === 0 ? (
          <Card>
            <CardContent className="pt-12 pb-12 text-center">
              <Calendar className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-xl font-semibold mb-2">No meetings scheduled</h3>
              <p className="text-muted-foreground">Meetings will appear here when clients schedule them</p>
            </CardContent>
          </Card>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {meetings.map((meeting) => (
              <Card key={meeting._id || meeting.id} className="hover:shadow-lg transition-shadow">
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <CardTitle className="text-lg">{meeting.name}</CardTitle>
                      <div className="text-sm text-muted-foreground">
                        <div className="flex flex-col gap-1 mt-2">
                          <span className="flex items-center gap-2">
                            <Mail className="w-4 h-4" />
                            {meeting.email}
                          </span>
                          <span className="flex items-center gap-2">
                            <Phone className="w-4 h-4" />
                            {meeting.phone}
                          </span>
                          <span className="flex items-center gap-2">
                            <Calendar className="w-4 h-4" />
                            {meeting.date} at {meeting.time}
                          </span>
                        </div>
                      </div>
                    </div>
                    <Badge 
                      variant={meeting.status === "confirmed" ? "default" : meeting.status === "cancelled" ? "destructive" : "secondary"}
                    >
                      {meeting.status}
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div>
                      <div className="text-sm font-semibold mb-2">Purpose of Meeting:</div>
                      <div className="text-sm text-foreground p-3 rounded-md border">
                        {meeting.purpose}
                      </div>
                    </div>
                    <div className="flex items-center gap-2 text-xs text-muted-foreground">
                      <Clock className="w-3 h-3" />
                      Requested on {formatDate(meeting.createdAt)}
                    </div>
                    <div className="flex gap-2">
                      <Button 
                        size="sm" 
                        variant="outline"
                        className="flex-1"
                        onClick={() => navigate(`/admin/meetings/${meeting._id || meeting.id}`)}
                      >
                        <Eye className="w-4 h-4 mr-1" />
                        View Details
                      </Button>
                      {meeting.status === "pending" && (
                        <>
                          <Button 
                            size="sm" 
                            onClick={() => updateMeetingStatus(meeting._id || meeting.id, "confirmed")}
                          >
                            <CheckCircle className="w-4 h-4" />
                          </Button>
                          <Button 
                            size="sm" 
                            variant="destructive"
                            onClick={() => updateMeetingStatus(meeting._id || meeting.id, "cancelled")}
                          >
                            <XCircle className="w-4 h-4" />
                          </Button>
                        </>
                      )}
                      <Button 
                        size="sm" 
                        variant="outline"
                        onClick={() => deleteMeeting(meeting._id || meeting.id)}
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

export default AdminMeetingsList;
