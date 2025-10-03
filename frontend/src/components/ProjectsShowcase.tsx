import { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowRight, FolderKanban } from "lucide-react";
import { api } from "@/services/api";

interface Project {
  _id?: string;
  id?: string;
  title: string;
  category: string;
  description: string;
  location: string;
  coverImage: string;
}

export const ProjectsShowcase = () => {
  const sectionRef = useRef<HTMLElement>(null);
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let isMounted = true;
    
    const loadProjects = async () => {
      try {
        setLoading(true);
        setError(null);
        
        // Get all published projects
        const response = await api.projects.getAll({ 
          status: 'published', 
          limit: 6
        });
        
        if (!isMounted) return;
        
        if (response.success && response.data) {
          const projectsData = Array.isArray(response.data) ? response.data : [];
          setProjects(projectsData);
        } else {
          setError('Failed to load projects');
          setProjects([]);
        }
      } catch (error: any) {
        if (isMounted) {
          setError(error.message || 'Failed to load projects');
          setProjects([]);
        }
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    };

    // Add a small delay to ensure API is ready
    const timer = setTimeout(loadProjects, 100);
    
    return () => {
      isMounted = false;
      clearTimeout(timer);
    };
  }, []);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const cards = entry.target.querySelectorAll('[data-animate]');
            cards.forEach((card, index) => {
              setTimeout(() => {
                card.classList.add('visible');
              }, index * 120);
            });
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.1 }
    );

    if (sectionRef.current) {
      observer.observe(sectionRef.current);
    }

    return () => observer.disconnect();
  }, []);

  return (
    <section ref={sectionRef} className="py-24 bg-card/50">
      <div className="container mx-auto px-4 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold mb-4">Featured Projects</h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Showcasing our commitment to excellence in construction
          </p>
        </div>

        {/* Always try to render projects if we have them */}
        {Array.isArray(projects) && projects.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
            {projects.map((project, index) => (
              <Card
                key={project._id || project.id}
                data-animate
                className="overflow-hidden bg-card hover:shadow-custom-lg transition-all duration-300 hover:-translate-y-1.5 cursor-pointer group"
              >
                <div className="relative h-64 overflow-hidden bg-muted">
                  {project.coverImage ? (
                    <img
                      src={project.coverImage}
                      alt={project.title}
                      className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center">
                      <FolderKanban className="w-16 h-16 text-muted-foreground" />
                    </div>
                  )}
                  <div className="absolute top-4 right-4">
                    <span className="px-3 py-1 rounded-full bg-primary/90 text-primary-foreground text-xs font-semibold">
                      {project.category}
                    </span>
                  </div>
                </div>
                <CardHeader>
                  <CardTitle className="text-xl">{project.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground line-clamp-2">{project.description}</p>
                </CardContent>
                <CardFooter>
                  <Button variant="link" className="text-primary p-0" asChild>
                    <Link to={`/projects/${project._id || project.id}`}>
                      View Details <ArrowRight className="ml-2 w-4 h-4" />
                    </Link>
                  </Button>
                </CardFooter>
              </Card>
            ))}
          </div>
        ) : loading ? (
          <div className="text-center py-16">
            <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-primary mx-auto mb-4"></div>
            <p className="text-muted-foreground">Loading projects...</p>
          </div>
        ) : error ? (
          <div className="text-center py-16">
            <FolderKanban className="w-16 h-16 text-red-500 mx-auto mb-4" />
            <p className="text-red-500 mb-2">Error loading projects</p>
            <p className="text-sm text-muted-foreground">{error}</p>
            <button 
              onClick={() => window.location.reload()} 
              className="mt-4 px-4 py-2 bg-primary text-primary-foreground rounded hover:bg-primary/90"
            >
              Retry
            </button>
          </div>
        ) : (
          <div className="text-center py-16">
            <FolderKanban className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
            <p className="text-muted-foreground">No projects available yet</p>
          </div>
        )}

        <div className="text-center">
          <Button size="lg" variant="outline" asChild>
            <Link to="/projects">
              View All Projects <ArrowRight className="ml-2 w-5 h-5" />
            </Link>
          </Button>
        </div>
      </div>
    </section>
  );
};
