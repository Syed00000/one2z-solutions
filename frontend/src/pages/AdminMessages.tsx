import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Building2, LogOut, ArrowLeft, Mail, Trash2, Eye, CheckCircle, Clock, AlertCircle, MessageSquare } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { api } from "@/services/api";
import { useAuth } from "@/contexts/AuthContext";

interface Message {
  _id: string;
  name: string;
  email: string;
  phone?: string;
  message: string;
  status: 'unread' | 'read' | 'replied' | 'archived';
  priority: 'low' | 'medium' | 'high';
  notes?: string;
  readAt?: string;
  repliedAt?: string;
  createdAt: string;
}

const AdminMessages = () => {
  const { logout } = useAuth();
  const navigate = useNavigate();
  const [messages, setMessages] = useState<Message[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedMessage, setSelectedMessage] = useState<Message | null>(null);
  const [isViewDialogOpen, setIsViewDialogOpen] = useState(false);
  const [notes, setNotes] = useState("");

  useEffect(() => {
    loadMessages();
  }, []);

  const loadMessages = async () => {
    try {
      console.log('📧 Loading messages from backend...');
      const response = await api.messages.getAll();
      
      if (response.success) {
        console.log('✅ Messages loaded:', response.data);
        setMessages((response.data as Message[]) || []);
      } else {
        console.error('❌ Failed to load messages:', response);
        toast.error("Failed to load messages");
      }
    } catch (error) {
      console.error('❌ Error loading messages:', error);
      toast.error("Error loading messages");
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

  const deleteMessage = async (id: string) => {
    if (!confirm("Are you sure you want to delete this message?")) return;
    
    try {
      await api.messages.delete(id);
      setMessages(messages.filter(m => m._id !== id));
      toast.success("Message deleted successfully");
    } catch (error) {
      toast.error("Failed to delete message");
    }
  };

  const updateMessageStatus = async (id: string, status: string) => {
    try {
      await api.messages.updateStatus(id, status);
      setMessages(messages.map(m => 
        m._id === id ? { ...m, status: status as any } : m
      ));
      toast.success(`Message marked as ${status}`);
    } catch (error) {
      toast.error("Failed to update message ");
    }
  };

  const updateMessagePriority = async (id: string, priority: string) => {
    try {
      await api.messages.updatePriority(id, priority);
      setMessages(messages.map(m => 
        m._id === id ? { ...m, priority: priority as any } : m
      ));
      toast.success(`Priority updated to ${priority}`);
    } catch (error) {
      toast.error("Failed to update priority");
    }
  };

  const addNotes = async (id: string, notes: string) => {
    try {
      await api.messages.addNotes(id, notes);
      setMessages(messages.map(m => 
        m._id === id ? { ...m, notes } : m
      ));
      toast.success("Notes added successfully");
      setNotes("");
    } catch (error) {
      toast.error("Failed to add notes");
    }
  };

  const viewMessage = (message: Message) => {
    setSelectedMessage(message);
    setNotes(message.notes || "");
    setIsViewDialogOpen(true);
    
    // Mark as read if unread
    if (message.status === 'unread') {
      updateMessageStatus(message._id, 'read');
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

  const getStatusBadge = (status: string) => {
    const variants = {
      unread: "destructive",
      read: "secondary", 
      replied: "default",
      archived: "outline"
    };
    return <Badge variant={variants[status as keyof typeof variants] as any}>{status}</Badge>;
  };

  const getPriorityBadge = (priority: string) => {
    const variants = {
      low: "outline",
      medium: "secondary",
      high: "destructive"
    };
    return <Badge variant={variants[priority as keyof typeof variants] as any}>{priority}</Badge>;
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
          <p>Loading messages...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Admin Header */}
      <header className="border-b border-border bg-card">
        <div className="container mx-auto px-4 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-4">
              <Button variant="ghost" size="sm" asChild>
                <Link to="/admin/dashboard">
                  <ArrowLeft className="w-4 h-4 mr-2" />
                  Back to Dashboard
                </Link>
              </Button>
              <div className="flex items-center gap-2">
                <Building2 className="w-6 h-6 text-primary" />
                <div className="flex flex-col">
                  <span className="text-lg font-bold leading-tight">One2Z Solutions</span>
                  <span className="text-xs text-muted-foreground">Messages Management</span>
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
        <div className="mb-8">
          <h1 className="text-4xl font-bold mb-2">Messages</h1>
          <p className="text-muted-foreground">Manage customer inquiries and contact messages</p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
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
              <CardTitle className="text-sm font-medium text-muted-foreground">Unread</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-red-600">
                {messages.filter(m => m.status === 'unread').length}
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-muted-foreground">Replied</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-green-600">
                {messages.filter(m => m.status === 'replied').length}
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-muted-foreground">High Priority</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-orange-600">
                {messages.filter(m => m.priority === 'high').length}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Messages List */}
        <Card>
          <CardHeader>
            <CardTitle>All Messages</CardTitle>
          </CardHeader>
          <CardContent>
            {messages.length === 0 ? (
              <div className="text-center py-8">
                <MessageSquare className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                <p className="text-muted-foreground">No messages found</p>
                <p className="text-sm text-muted-foreground mt-2">
                  Messages from the contact form will appear here
                </p>
              </div>
            ) : (
              <div className="space-y-4">
                {messages.map((message) => (
                  <div key={message._id} className="border border-border rounded-lg p-4  transition-colors bg-card">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
                          <h3 className="font-semibold">{message.name}</h3>
                          {getStatusBadge(message.status)}
                          {getPriorityBadge(message.priority)}
                        </div>
                        <p className="text-sm text-muted-foreground mb-1">{message.email}</p>
                        {message.phone && (
                          <p className="text-sm text-muted-foreground mb-2">{message.phone}</p>
                        )}
                        <p className="text-sm line-clamp-2 mb-2">{message.message}</p>
                        <p className="text-xs text-muted-foreground">
                          {formatDate(message.createdAt)}
                        </p>
                      </div>
                      
                      <div className="flex items-center gap-2 ml-4">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => viewMessage(message)}
                        >
                          <Eye className="w-4 h-4 mr-1" />
                          View
                        </Button>
                        
                        {message.status === 'unread' && (
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => updateMessageStatus(message._id, 'read')}
                          >
                            <CheckCircle className="w-4 h-4 mr-1" />
                            Mark Read
                          </Button>
                        )}
                        
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => deleteMessage(message._id)}
                        >
                          <Trash2 className="w-4 h-4 mr-1" />
                          Delete
                        </Button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        {/* View Message Dialog */}
        <Dialog open={isViewDialogOpen} onOpenChange={setIsViewDialogOpen}>
          <DialogContent className="max-w-2xl bg-background border-border">
            <DialogHeader>
              <DialogTitle>Message Details</DialogTitle>
              <DialogDescription>View and manage message</DialogDescription>
            </DialogHeader>
            
            {selectedMessage && (
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label className="text-sm font-medium">Name</Label>
                    <p className="text-sm">{selectedMessage.name}</p>
                  </div>
                  <div>
                    <Label className="text-sm font-medium">Email</Label>
                    <p className="text-sm">{selectedMessage.email}</p>
                  </div>
                </div>
                
                {selectedMessage.phone && (
                  <div>
                    <Label className="text-sm font-medium">Phone</Label>
                    <p className="text-sm">{selectedMessage.phone}</p>
                  </div>
                )}
                
                <div>
                  <Label className="text-sm font-medium">Message</Label>
                  <p className="text-sm p-3  rounded-md">{selectedMessage.message}</p>
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label className="text-sm font-medium">Status</Label>
                    <div className="mt-1">
                      <select
                        value={selectedMessage.status}
                        onChange={(e) => updateMessageStatus(selectedMessage._id, e.target.value)}
                        className="w-full px-3 py-2 border border-input bg-background rounded-md text-foreground [&>option]:bg-background [&>option]:text-foreground"
                      >
                        <option value="unread" className="bg-background text-foreground">Unread</option>
                        <option value="read" className="bg-background text-foreground">Read</option>
                        <option value="replied" className="bg-background text-foreground">Replied</option>
                        <option value="archived" className="bg-background text-foreground">Archived</option>
                      </select>
                    </div>
                  </div>
                  
                  <div>
                    <Label className="text-sm font-medium">Priority</Label>
                    <div className="mt-1">
                      <select
                        value={selectedMessage.priority}
                        onChange={(e) => updateMessagePriority(selectedMessage._id, e.target.value)}
                        className="w-full px-3 py-2 border border-input bg-background rounded-md text-foreground [&>option]:bg-background [&>option]:text-foreground"
                      >
                        <option value="low" className="bg-background text-foreground">Low</option>
                        <option value="medium" className="bg-background text-foreground">Medium</option>
                        <option value="high" className="bg-background text-foreground">High</option>
                      </select>
                    </div>
                  </div>
                </div>
                
                <div>
                  <Label className="text-sm font-medium">Admin Notes</Label>
                  <Textarea
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                    placeholder="Add internal notes about this message..."
                    className="mt-1"
                  />
                  <Button
                    onClick={() => addNotes(selectedMessage._id, notes)}
                    className="mt-2"
                    disabled={!notes.trim()}
                  >
                    Save Notes
                  </Button>
                </div>
                
                <div className="text-xs text-muted-foreground">
                  <p>Received: {formatDate(selectedMessage.createdAt)}</p>
                  {selectedMessage.readAt && (
                    <p>Read: {formatDate(selectedMessage.readAt)}</p>
                  )}
                  {selectedMessage.repliedAt && (
                    <p>Replied: {formatDate(selectedMessage.repliedAt)}</p>
                  )}
                </div>
              </div>
            )}
          </DialogContent>
        </Dialog>
      </main>
    </div>
  );
};

export default AdminMessages;
