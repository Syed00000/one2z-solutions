import { useState, useEffect } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { Building2, LogOut, Calendar, Mail, Phone, Clock, CheckCircle, XCircle, Trash2, ArrowLeft, Edit } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
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

const AdminMeetingDetail = () => {
  const { logout } = useAuth();
  const { id } = useParams();
  const navigate = useNavigate();
  const [meeting, setMeeting] = useState<Meeting | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadMeeting();
  }, [id]);

  const loadMeeting = async () => {
    try {
      console.log('📅 Loading meeting details:', id);
      const response = await api.meetings.getById(id!);
      
      if (response.success) {
        console.log('✅ Meeting loaded:', response.data);
        setMeeting(response.data as Meeting);
      } else {
        console.error('❌ Meeting not found');
        toast.error("Meeting not found");
        navigate("/admin/meetings-list");
      }
    } catch (error) {
      console.error('❌ Error loading meeting:', error);
      toast.error("Error loading meeting");
      navigate("/admin/meetings-list");
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

  const updateStatus = async (status: string) => {
    if (!meeting) return;
    
    try {
      await api.meetings.updateStatus(meeting._id || meeting.id!, status);
      setMeeting({ ...meeting, status: status as any });
      toast.success(`Meeting ${status}`);
    } catch (error) {
      toast.error("Failed to update meeting status");
    }
  };

  const deleteMeeting = async () => {
    if (!meeting) return;
    if (!confirm("Are you sure you want to delete this meeting?")) return;
    
    try {
      await api.meetings.delete(meeting._id || meeting.id!);
      toast.success("Meeting deleted");
      navigate("/admin/meetings-list");
    } catch (error) {
      toast.error("Failed to delete meeting");
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
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
          <p>Loading meeting details...</p>
        </div>
      </div>
    );
  }

  if (!meeting) {
    return <div className="min-h-screen flex items-center justify-center">Meeting not found</div>;
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border bg-card sticky top-0 z-50">
        <div className="container mx-auto px-4 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-4">
              <Button variant="ghost" size="sm" onClick={() => navigate('/admin/meetings-list')}>
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back to Meetings
              </Button>
              <div className="flex items-center gap-2">
                <Building2 className="w-6 h-6 text-primary" />
                <span className="text-lg font-bold">Meeting Details</span>
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
        <div className="max-w-4xl mx-auto">
          {/* Meeting Header */}
          <div className="mb-6">
            <div className="flex items-start justify-between mb-4">
              <div>
                <h1 className="text-4xl font-bold mb-2">{meeting.name}</h1>
                <p className="text-muted-foreground">Meeting scheduled for {meeting.date} at {meeting.time}</p>
              </div>
              <Badge 
                variant={meeting.status === "confirmed" ? "default" : meeting.status === "cancelled" ? "destructive" : "secondary"}
                className="text-lg px-4 py-2"
              >
                {meeting.status}
              </Badge>
            </div>
          </div>

          {/* Contact Information */}
          <Card className="mb-6">
            <CardHeader>
              <CardTitle>Contact Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="flex items-center gap-3 p-4  rounded-lg">
                  <Mail className="w-5 h-5 text-primary" />
                  <div>
                    <p className="text-sm text-muted-foreground">Email</p>
                    <p className="font-medium">{meeting.email}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3 p-4  rounded-lg">
                  <Phone className="w-5 h-5 text-primary" />
                  <div>
                    <p className="text-sm text-muted-foreground">Phone</p>
                    <p className="font-medium">{meeting.phone}</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Meeting Details */}
          <Card className="mb-6">
            <CardHeader>
              <CardTitle>Meeting Details</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center gap-3 p-4  rounded-lg">
                <Calendar className="w-5 h-5 text-primary" />
                <div>
                  <p className="text-sm text-muted">Scheduled Date & Time</p>
                  <p className="font-medium text-lg">{meeting.date} at {meeting.time}</p>
                </div>
              </div>
              <div className="flex items-center gap-3 p-4  rounded-lg">
                <Clock className="w-5 h-5 text-primary" />
                <div>
                  <p className="text-sm text-muted-foreground">Request Submitted</p>
                  <p className="font-medium">{formatDate(meeting.createdAt)}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Purpose */}
          <div className="mb-6">
            <h3 className="text-lg font-semibold mb-3">Purpose of Meeting:</h3>
            <p className="text-muted-foreground leading-relaxed whitespace-pre-wrap">
              {meeting.purpose}
            </p>
          </div>

          {/* Actions */}
          <Card>
            <CardHeader>
              <CardTitle>Actions</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex flex-wrap gap-3">
                {meeting.status === "pending" && (
                  <>
                    <Button onClick={() => updateStatus("confirmed")} className="flex-1">
                      <CheckCircle className="w-4 h-4 mr-2" />
                      Confirm Meeting
                    </Button>
                    <Button onClick={() => updateStatus("cancelled")} variant="destructive" className="flex-1">
                      <XCircle className="w-4 h-4 mr-2" />
                      Cancel Meeting
                    </Button>
                  </>
                )}
                {meeting.status === "confirmed" && (
                  <Button onClick={() => updateStatus("cancelled")} variant="destructive" className="flex-1">
                    <XCircle className="w-4 h-4 mr-2" />
                    Cancel Meeting
                  </Button>
                )}
                {meeting.status === "cancelled" && (
                  <Button onClick={() => updateStatus("confirmed")} className="flex-1">
                    <CheckCircle className="w-4 h-4 mr-2" />
                    Reconfirm Meeting
                  </Button>
                )}
                <Button onClick={deleteMeeting} variant="outline" className="flex-1">
                  <Trash2 className="w-4 h-4 mr-2" />
                  Delete Meeting
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
};

export default AdminMeetingDetail;
