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

  useEffect(() => {
    const loadProjects = async () => {
      try {
        console.log('🏠 Loading featured projects for homepage...');
        
        // First try to get featured projects
        let response = await api.projects.getAll({ 
          status: 'published', 
          featured: 'true', 
          limit: 3 
        });
        
        console.log('🌟 Featured projects response:', response);
        
        if (response.success && response.data && (response.data as any[]).length > 0) {
          console.log(`✅ Found ${(response.data as any[]).length} featured projects`);
          setProjects((response.data as Project[]) || []);
        } else {
          console.log('⚠️ No featured projects found, loading all published projects...');
          // Fallback: get any published projects
          response = await api.projects.getAll({ 
            status: 'published', 
            limit: 3 
          });
          
          console.log('📊 Published projects response:', response);
          
          if (response.success) {
            const projects = (response.data as Project[]) || [];
            console.log(`✅ Loaded ${projects.length} published projects for homepage`);
            setProjects(projects);
          } else {
            console.log('❌ No published projects found, loading ANY projects...');
            // Last fallback: get any projects
            response = await api.projects.getAll({ limit: 3 });
            
            if (response.success) {
              const projects = (response.data as Project[]) || [];
              console.log(`🔄 Loaded ${projects.length} ANY projects for homepage`);
              setProjects(projects);
            }
          }
        }
      } catch (error) {
        console.error('❌ Error loading featured projects:', error);
        setProjects([]);
      }
    };

    loadProjects();
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

        {projects.length === 0 ? (
          <div className="text-center py-16">
            <FolderKanban className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
            <p className="text-muted-foreground">No projects available yet</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
            {projects.map((project) => (
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
