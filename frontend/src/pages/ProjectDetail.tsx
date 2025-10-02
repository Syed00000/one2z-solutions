import { useParams, Link, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import { Layout } from "@/components/Layout";
import { Button } from "@/components/ui/button";
import { ArrowLeft, MapPin, Calendar, Building, DollarSign, X, FolderKanban } from "lucide-react";
import { api } from "@/services/api";
import { toast } from "sonner";

interface Project {
  _id?: string;
  id?: string;
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
}

const ProjectDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [project, setProject] = useState<Project | null>(null);

  useEffect(() => {
    const loadProject = async () => {
      if (!id) {
        navigate("/projects");
        return;
      }

      try {
        console.log('🔄 Loading project details for ID:', id);
        const response = await api.projects.getById(id);
        console.log('📊 Project API Response:', response);
        
        if (response.success && response.data) {
          setProject(response.data as Project);
          console.log('✅ Project loaded:', response.data);
        } else {
          console.log('❌ Project not found');
          toast.error("Project not found");
          navigate("/projects");
        }
      } catch (error) {
        console.error('❌ Error loading project:', error);
        toast.error("Failed to load project details");
        navigate("/projects");
      }
    };

    loadProject();
  }, [id, navigate]);

  if (!project) {
    return (
      <Layout>
        <div className="min-h-screen flex items-center justify-center">
          <div className="text-center">
            <FolderKanban className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
            <p className="text-muted-foreground">Loading project...</p>
          </div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="pt-20">
        {/* Back Button */}
        <section className="py-6 border-b border-border">
          <div className="container mx-auto px-4 lg:px-8">
            <Button variant="ghost" asChild>
              <Link to="/projects">
                <ArrowLeft className="mr-2 w-4 h-4" />
                Back to Projects
              </Link>
            </Button>
          </div>
        </section>

        {/* Hero Image */}
        <section className="relative h-[60vh] overflow-hidden bg-muted">
          {project.coverImage ? (
            <img src={project.coverImage} alt={project.title} className="w-full h-full object-cover" />
          ) : (
            <div className="w-full h-full flex items-center justify-center">
              <FolderKanban className="w-24 h-24 text-muted-foreground" />
            </div>
          )}
          <div className="absolute inset-0 bg-gradient-to-t from-background via-background/60 to-transparent"></div>
          <div className="absolute bottom-0 left-0 right-0 container mx-auto px-4 lg:px-8 pb-12">
            <span className="inline-block px-4 py-2 rounded-full bg-primary/90 text-primary-foreground text-sm font-semibold mb-4">
              {project.category}
            </span>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold">{project.title}</h1>
          </div>
        </section>

        {/* Project Details */}
        <section className="py-16">
          <div className="container mx-auto px-4 lg:px-8">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
              {/* Main Content */}
              <div className="lg:col-span-2 space-y-8">
                <div>
                  <h2 className="text-3xl font-bold mb-4">Project Overview</h2>
                  <p className="text-muted-foreground leading-relaxed text-lg">{project.description}</p>
                </div>

                {/* Image Gallery */}
                {project.images && project.images.length > 0 && (
                  <div>
                    <h3 className="text-2xl font-bold mb-4">Project Gallery ({project.images.length} images)</h3>
                    <div className="grid grid-cols-2 gap-4">
                      {project.images.map((image, index) => (
                        <div
                          key={index}
                          className="relative group cursor-pointer overflow-hidden rounded-lg bg-muted"
                          onClick={() => setSelectedImage(image)}
                        >
                          <img
                            src={image}
                            alt={`Gallery ${index + 1}`}
                            className="w-full h-64 object-cover transition-transform duration-300 group-hover:scale-110"
                          />
                          <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                            <span className="text-white font-semibold">View Image</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              {/* Sidebar */}
              <div className="space-y-6">
                <div className="bg-card border border-border rounded-lg p-6 space-y-6">
                  <h3 className="text-xl font-bold">Project Details</h3>

                  <div className="space-y-4">
                    {project.location && (
                      <div className="flex items-start gap-3">
                        <MapPin className="w-5 h-5 text-primary mt-0.5 flex-shrink-0" />
                        <div>
                          <div className="font-semibold text-sm text-muted-foreground">Location</div>
                          <div className="text-foreground">{project.location}</div>
                        </div>
                      </div>
                    )}

                    {project.completion && (
                      <div className="flex items-start gap-3">
                        <Calendar className="w-5 h-5 text-primary mt-0.5 flex-shrink-0" />
                        <div>
                          <div className="font-semibold text-sm text-muted-foreground">Completion</div>
                          <div className="text-foreground">{project.completion}</div>
                        </div>
                      </div>
                    )}

                    {project.area && (
                      <div className="flex items-start gap-3">
                        <Building className="w-5 h-5 text-primary mt-0.5 flex-shrink-0" />
                        <div>
                          <div className="font-semibold text-sm text-muted-foreground">Area</div>
                          <div className="text-foreground">{project.area}</div>
                        </div>
                      </div>
                    )}

                    {project.budget && (
                      <div className="flex items-start gap-3">
                        <DollarSign className="w-5 h-5 text-primary mt-0.5 flex-shrink-0" />
                        <div>
                          <div className="font-semibold text-sm text-muted-foreground">Budget Range</div>
                          <div className="text-foreground">{project.budget}</div>
                        </div>
                      </div>
                    )}

                    {(project.clientName || project.clientCompany) && (
                      <div className="border-t border-border pt-4">
                        <div className="font-semibold text-sm text-muted-foreground mb-2">Client</div>
                        {project.clientName && (
                          <div className="text-foreground font-medium">{project.clientName}</div>
                        )}
                        {project.clientCompany && (
                          <div className="text-sm text-muted-foreground">{project.clientCompany}</div>
                        )}
                      </div>
                    )}
                  </div>
                </div>

                <div className="bg-gradient-accent rounded-lg p-6 text-primary-foreground">
                  <h3 className="text-xl font-bold mb-3">Interested in a similar project?</h3>
                  <p className="mb-4 text-sm">Get in touch with us to discuss your construction and interior design needs.</p>
                  <Button variant="secondary" size="lg" className="w-full" asChild>
                    <Link to="/contact">Contact Us</Link>
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Lightbox Modal */}
        {selectedImage && (
          <div
            className="fixed inset-0 z-50 bg-black/90 flex items-center justify-center p-4"
            onClick={() => setSelectedImage(null)}
          >
            <button
              className="absolute top-4 right-4 text-white hover:text-gray-300"
              onClick={() => setSelectedImage(null)}
            >
              <X className="w-8 h-8" />
            </button>
            <img
              src={selectedImage}
              alt="Project"
              className="max-w-full max-h-full object-contain"
              onClick={(e) => e.stopPropagation()}
            />
          </div>
        )}
      </div>
    </Layout>
  );
};

export default ProjectDetail;
