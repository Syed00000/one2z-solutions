import { useState, useEffect } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { Building2, LogOut, ArrowLeft, Edit, Trash2, MapPin, Calendar, DollarSign, Ruler, User, Building } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";

interface Project {
  id: string;
  title: string;
  category: string;
  description: string;
  location: string;
  area: string;
  budget: string;
  completion: string;
  clientName: string;
  clientCompany: string;
  coverImage: string;
  images: string[];
  createdAt: string;
}

const AdminProjectDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [project, setProject] = useState<Project | null>(null);

  useEffect(() => {
    const projects = JSON.parse(localStorage.getItem("projects") || "[]");
    const foundProject = projects.find((p: Project) => p.id === id);
    if (foundProject) {
      setProject(foundProject);
    } else {
      toast.error("Project not found");
      navigate("/admin/projects");
    }
  }, [id, navigate]);

  const deleteProject = () => {
    if (!confirm("Are you sure you want to delete this project?")) return;
    
    const projects = JSON.parse(localStorage.getItem("projects") || "[]");
    const updatedProjects = projects.filter((p: Project) => p.id !== id);
    localStorage.setItem("projects", JSON.stringify(updatedProjects));
    toast.success("Project deleted");
    navigate("/admin/projects");
  };

  if (!project) {
    return <div className="min-h-screen flex items-center justify-center">Loading...</div>;
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border bg-card sticky top-0 z-50">
        <div className="container mx-auto px-4 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-4">
              <Button variant="ghost" size="sm" onClick={() => navigate('/admin/projects')}>
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back to Projects
              </Button>
              <div className="flex items-center gap-2">
                <Building2 className="w-6 h-6 text-primary" />
                <span className="text-lg font-bold">Project Details</span>
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
        <div className="max-w-6xl mx-auto">
          {/* Project Header */}
          <div className="mb-6">
            <div className="flex items-start justify-between mb-4">
              <div>
                <h1 className="text-4xl font-bold mb-2">{project.title}</h1>
                <Badge className="text-base px-3 py-1">{project.category}</Badge>
              </div>
              <div className="flex gap-2">
                <Button variant="outline" onClick={() => navigate(`/admin/projects/${project.id}/edit`)}>
                  <Edit className="w-4 h-4 mr-2" />
                  Edit
                </Button>
                <Button variant="destructive" onClick={deleteProject}>
                  <Trash2 className="w-4 h-4 mr-2" />
                  Delete
                </Button>
              </div>
            </div>
          </div>

          {/* Cover Image */}
          {project.coverImage && (
            <Card className="mb-6 overflow-hidden">
              <img 
                src={project.coverImage} 
                alt={project.title}
                className="w-full h-96 object-cover"
              />
            </Card>
          )}

          {/* Project Details Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
            <Card>
              <CardHeader>
                <CardTitle>Project Information</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {project.location && (
                  <div className="flex items-start gap-3">
                    <MapPin className="w-5 h-5 text-primary mt-0.5" />
                    <div>
                      <p className="text-sm text-muted-foreground">Location</p>
                      <p className="font-medium">{project.location}</p>
                    </div>
                  </div>
                )}
                {project.area && (
                  <div className="flex items-start gap-3">
                    <Ruler className="w-5 h-5 text-primary mt-0.5" />
                    <div>
                      <p className="text-sm text-muted-foreground">Area</p>
                      <p className="font-medium">{project.area}</p>
                    </div>
                  </div>
                )}
                {project.budget && (
                  <div className="flex items-start gap-3">
                    <DollarSign className="w-5 h-5 text-primary mt-0.5" />
                    <div>
                      <p className="text-sm text-muted-foreground">Budget Range</p>
                      <p className="font-medium">{project.budget}</p>
                    </div>
                  </div>
                )}
                {project.completion && (
                  <div className="flex items-start gap-3">
                    <Calendar className="w-5 h-5 text-primary mt-0.5" />
                    <div>
                      <p className="text-sm text-muted-foreground">Completion</p>
                      <p className="font-medium">{project.completion}</p>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Client Information</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {project.clientName && (
                  <div className="flex items-start gap-3">
                    <User className="w-5 h-5 text-primary mt-0.5" />
                    <div>
                      <p className="text-sm text-muted-foreground">Client Name</p>
                      <p className="font-medium">{project.clientName}</p>
                    </div>
                  </div>
                )}
                {project.clientCompany && (
                  <div className="flex items-start gap-3">
                    <Building className="w-5 h-5 text-primary mt-0.5" />
                    <div>
                      <p className="text-sm text-muted-foreground">Company</p>
                      <p className="font-medium">{project.clientCompany}</p>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Description */}
          <Card className="mb-6">
            <CardHeader>
              <CardTitle>Project Description</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-foreground leading-relaxed whitespace-pre-wrap">
                {project.description}
              </p>
            </CardContent>
          </Card>

          {/* Gallery */}
          {project.images && project.images.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle>Project Gallery ({project.images.length} images)</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                  {project.images.map((image, index) => (
                    <div key={index} className="aspect-video rounded-lg overflow-hidden bg-muted">
                      <img 
                        src={image} 
                        alt={`Gallery ${index + 1}`}
                        className="w-full h-full object-cover hover:scale-105 transition-transform cursor-pointer"
                      />
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </main>
    </div>
  );
};

export default AdminProjectDetail;
