import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Building2, LogOut, Calendar, Mail, Phone, Clock, CheckCircle, XCircle, Trash2, ArrowLeft, Eye } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { toast } from "sonner";

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

interface Message {
  id: string;
  name: string;
  email: string;
  phone?: string;
  message: string;
  status: string;
  createdAt: string;
}

const AdminMeetings = () => {
  const [meetings, setMeetings] = useState<Meeting[]>([]);
  const [messages, setMessages] = useState<Message[]>([]);
  const navigate = useNavigate();

  useEffect(() => {
    try {
      const loadedMeetings = JSON.parse(localStorage.getItem("meetings") || "[]");
      const loadedMessages = JSON.parse(localStorage.getItem("messages") || "[]");
      
      // Ensure arrays
      setMeetings(Array.isArray(loadedMeetings) ? loadedMeetings : []);
      setMessages(Array.isArray(loadedMessages) ? loadedMessages : []);
      
      console.log("Loaded messages:", loadedMessages);
    } catch (error) {
      console.error("Error loading data:", error);
      setMeetings([]);
      setMessages([]);
    }
  }, []);

  const deleteMeeting = (id: string) => {
    const updatedMeetings = meetings.filter(m => m.id !== id);
    setMeetings(updatedMeetings);
    localStorage.setItem("meetings", JSON.stringify(updatedMeetings));
    toast.success("Meeting deleted successfully");
  };

  const updateMeetingStatus = (id: string, status: string) => {
    const updatedMeetings = meetings.map(m => 
      m.id === id ? { ...m, status } : m
    );
    setMeetings(updatedMeetings);
    localStorage.setItem("meetings", JSON.stringify(updatedMeetings));
    toast.success(`Meeting ${status}`);
  };

  const deleteMessage = (id: string) => {
    const updatedMessages = messages.filter(m => m.id !== id);
    setMessages(updatedMessages);
    localStorage.setItem("messages", JSON.stringify(updatedMessages));
    toast.success("Message deleted successfully");
  };

  const markMessageAsRead = (id: string) => {
    const updatedMessages = messages.map(m => 
      m.id === id ? { ...m, status: "read" } : m
    );
    setMessages(updatedMessages);
    localStorage.setItem("messages", JSON.stringify(updatedMessages));
    toast.success("Message marked as read");
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

  const getStatusColor = (status: string) => {
    switch(status) {
      case "confirmed": return "bg-green-500";
      case "cancelled": return "bg-red-500";
      case "pending": return "bg-yellow-500";
      default: return "bg-gray-500";
    }
  };

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
                  <span className="text-xs text-muted-foreground">Messages Management</span>
                </div>
              </div>
            </div>
            <Button variant="ghost" size="sm" asChild>
              <Link to="/admin/login">
                <LogOut className="w-4 h-4 mr-2" />
                Logout
              </Link>
            </Button>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 lg:px-8 py-8">
        {/* Page Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold mb-2 flex items-center gap-3">
            <Mail className="w-10 h-10 text-primary" />
            Messages Management
          </h1>
          <p className="text-muted-foreground">View and manage all customer messages and inquiries</p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-muted-foreground">Total Messages</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">{messages.length}</div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-muted-foreground">Unread Messages</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-blue-600">
                {messages.filter(m => m.status === "unread").length}
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-muted-foreground">Read Messages</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-green-600">
                {messages.filter(m => m.status === "read").length}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Messages List */}
        {messages.length === 0 ? (
          <Card>
            <CardContent className="pt-12 pb-12 text-center">
              <Mail className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-xl font-semibold mb-2">No messages received</h3>
              <p className="text-muted-foreground">Messages will appear here when clients contact you</p>
            </CardContent>
          </Card>
        ) : (
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {messages.map((message) => (
                  <Card key={message.id} className="hover:shadow-lg transition-shadow">
                    <CardHeader>
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <CardTitle className="text-lg">{message.name}</CardTitle>
                          <div className="flex flex-col gap-1 mt-2">
                            <span className="flex items-center gap-2 text-sm text-muted-foreground">
                              <Mail className="w-4 h-4" />
                              {message.email}
                            </span>
                            {message.phone && (
                              <span className="flex items-center gap-2 text-sm text-muted-foreground">
                                <Phone className="w-4 h-4" />
                                {message.phone}
                              </span>
                            )}
                          </div>
                        </div>
                        <Badge variant={message.status === "read" ? "secondary" : "default"}>
                          {message.status}
                        </Badge>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-3">
                        <div>
                          <p className="text-sm font-semibold mb-2">Message:</p>
                          <p className="text-sm text-foreground">{message.message}</p>
                        </div>
                        <div className="flex items-center gap-2 text-xs text-muted-foreground">
                          <Clock className="w-3 h-3" />
                          Received on {formatDate(message.createdAt)}
                        </div>
                        <div className="flex gap-2 pt-2">
                          <Button 
                            size="sm" 
                            variant="outline"
                            className="flex-1"
                            onClick={() => navigate(`/admin/messages/${message.id}`)}
                          >
                            <Eye className="w-4 h-4 mr-1" />
                            View Message
                          </Button>
                          {message.status === "unread" && (
                            <Button 
                              size="sm" 
                              onClick={() => markMessageAsRead(message.id)}
                            >
                              <CheckCircle className="w-4 h-4" />
                            </Button>
                          )}
                          <Button 
                            size="sm" 
                            variant="outline"
                            onClick={() => deleteMessage(message.id)}
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

export default AdminMeetings;
