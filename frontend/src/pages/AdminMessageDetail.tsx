import { useState, useEffect } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { Building2, LogOut, ArrowLeft, Mail, Phone, Clock, CheckCircle, Trash2, User } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";

interface Message {
  id: string;
  name: string;
  email: string;
  phone?: string;
  message: string;
  status: string;
  createdAt: string;
}

const AdminMessageDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [message, setMessage] = useState<Message | null>(null);

  useEffect(() => {
    const messages = JSON.parse(localStorage.getItem("messages") || "[]");
    const foundMessage = messages.find((m: Message) => m.id === id);
    
    if (foundMessage) {
      setMessage(foundMessage);
      // Auto mark as read when viewing
      if (foundMessage.status === "unread") {
        markAsRead(foundMessage.id);
      }
    } else {
      toast.error("Message not found");
      navigate("/admin/messages");
    }
  }, [id, navigate]);

  const markAsRead = (messageId: string) => {
    const messages = JSON.parse(localStorage.getItem("messages") || "[]");
    const updatedMessages = messages.map((m: Message) => 
      m.id === messageId ? { ...m, status: "read" } : m
    );
    localStorage.setItem("messages", JSON.stringify(updatedMessages));
    if (message) {
      setMessage({ ...message, status: "read" });
    }
  };

  const deleteMessage = () => {
    if (!confirm("Are you sure you want to delete this message?")) return;
    
    const messages = JSON.parse(localStorage.getItem("messages") || "[]");
    const updatedMessages = messages.filter((m: Message) => m.id !== id);
    localStorage.setItem("messages", JSON.stringify(updatedMessages));
    toast.success("Message deleted");
    navigate("/admin/messages");
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

  if (!message) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p>Loading...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border bg-card sticky top-0 z-50">
        <div className="container mx-auto px-4 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-4">
              <Button variant="ghost" size="sm" onClick={() => navigate('/admin/messages')}>
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back to Messages
              </Button>
              <div className="flex items-center gap-2">
                <Building2 className="w-6 h-6 text-primary" />
                <span className="text-lg font-bold">Message Details</span>
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
        <div className="max-w-4xl mx-auto">
          {/* Message Header */}
          <div className="mb-6">
            <div className="flex items-start justify-between mb-4">
              <div>
                <h1 className="text-4xl font-bold mb-2">Message from {message.name}</h1>
                <Badge variant={message.status === "read" ? "secondary" : "default"} className="text-base px-3 py-1">
                  {message.status}
                </Badge>
              </div>
              <div className="flex gap-2">
                {message.status === "unread" && (
                  <Button variant="outline" onClick={() => markAsRead(message.id)}>
                    <CheckCircle className="w-4 h-4 mr-2" />
                    Mark as Read
                  </Button>
                )}
                <Button variant="destructive" onClick={deleteMessage}>
                  <Trash2 className="w-4 h-4 mr-2" />
                  Delete
                </Button>
              </div>
            </div>
          </div>

          {/* Contact Information */}
          <Card className="mb-6">
            <CardHeader>
              <CardTitle>Contact Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center gap-3 p-4 rounded-lg border">
                <User className="w-5 h-5 text-primary" />
                <div>
                  <p className="text-sm text-muted-foreground">Name</p>
                  <p className="font-medium text-lg">{message.name}</p>
                </div>
              </div>
              
              <div className="flex items-center gap-3 p-4 rounded-lg border">
                <Mail className="w-5 h-5 text-primary" />
                <div>
                  <p className="text-sm text-muted-foreground">Email</p>
                  <a href={`mailto:${message.email}`} className="font-medium text-lg text-primary hover:underline">
                    {message.email}
                  </a>
                </div>
              </div>
              
              {message.phone && (
                <div className="flex items-center gap-3 p-4 rounded-lg border">
                  <Phone className="w-5 h-5 text-primary" />
                  <div>
                    <p className="text-sm text-muted-foreground">Phone</p>
                    <a href={`tel:${message.phone}`} className="font-medium text-lg text-primary hover:underline">
                      {message.phone}
                    </a>
                  </div>
                </div>
              )}
              
              <div className="flex items-center gap-3 p-4 rounded-lg border">
                <Clock className="w-5 h-5 text-primary" />
                <div>
                  <p className="text-sm text-muted-foreground">Received On</p>
                  <p className="font-medium">{formatDate(message.createdAt)}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Message Content */}
          <Card className="mb-6">
            <CardHeader>
              <CardTitle>Message</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="bg-muted/30 p-6 rounded-lg">
                <p className="text-foreground leading-relaxed whitespace-pre-wrap text-lg">
                  {message.message}
                </p>
              </div>
            </CardContent>
          </Card>

          {/* Quick Actions */}
          <Card>
            <CardHeader>
              <CardTitle>Quick Actions</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex flex-wrap gap-3">
                <Button variant="default" asChild>
                  <a href={`mailto:${message.email}`}>
                    <Mail className="w-4 h-4 mr-2" />
                    Reply via Email
                  </a>
                </Button>
                {message.phone && (
                  <Button variant="outline" asChild>
                    <a href={`tel:${message.phone}`}>
                      <Phone className="w-4 h-4 mr-2" />
                      Call
                    </a>
                  </Button>
                )}
                <Button variant="outline" onClick={() => navigate('/admin/messages')}>
                  <ArrowLeft className="w-4 h-4 mr-2" />
                  Back to All Messages
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
};

export default AdminMessageDetail;
