import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Layout } from "@/components/Layout";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowRight, FolderKanban } from "lucide-react";
import { api } from "@/services/api";
import { toast } from "sonner";

interface Project {
  _id?: string;
  id?: string;
  title: string;
  category: string;
  description: string;
  location: string;
  coverImage: string;
}

const Projects = () => {
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [allProjects, setAllProjects] = useState<Project[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadProjects = async () => {
      try {
        const response = await api.projects.getAll({ status: 'published' });
        console.log('API Response:', response);
        
        if (response.success) {
          const projects = (response.data as Project[]) || [];
          console.log(`Loaded ${projects.length} projects:`, projects);
          
          // Debug: Check project structure
          if (projects.length > 0) {
            console.log('First project structure:', projects[0]);
            console.log('Project ID field:', projects[0]._id || projects[0].id);
          }
          
          setAllProjects(projects);
        } else {
          console.log('API response not successful:', response);
        }
      } catch (error) {
        toast.error("Failed to load projects");
      } finally {
        setIsLoading(false);
      }
    };

    loadProjects();
  }, []);

  const categories = ["All", "Interior", "Construction"];
  
  const filteredProjects = selectedCategory === "All"
    ? allProjects
    : allProjects.filter((project) => project.category === selectedCategory);

  if (isLoading) {
    return (
      <Layout>
        <div className="min-h-screen flex items-center justify-center">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
            <p>Loading projects...</p>
          </div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="pt-20">
        {/* Page Header */}
        <section className="py-16 bg-gradient-hero">
          <div className="container mx-auto px-4 lg:px-8 text-center">
            <h1 className="text-5xl md:text-6xl font-bold mb-4">Our Projects</h1>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Explore our portfolio of interior design and construction projects
            </p>
          </div>
        </section>

        {/* Category Filter */}
        <section className="py-8 border-b border-border">
          <div className="container mx-auto px-4 lg:px-8">
            <div className="flex flex-wrap justify-center gap-4">
              {categories.map((category) => (
                <Button
                  key={category}
                  variant={selectedCategory === category ? "default" : "outline"}
                  onClick={() => setSelectedCategory(category)}
                  className={selectedCategory === category ? "bg-gradient-accent" : ""}
                >
                  {category}
                </Button>
              ))}
            </div>
          </div>
        </section>

        {/* Projects Grid */}
        <section className="py-16">
          <div className="container mx-auto px-4 lg:px-8">
            {filteredProjects.length === 0 ? (
              <div className="text-center py-16">
                <FolderKanban className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
                <h3 className="text-xl font-semibold mb-2">No projects found</h3>
                <p className="text-muted-foreground">No projects in this category yet</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {filteredProjects.map((project) => (
                  <Card
                    key={project.id || project._id}
                    className="overflow-hidden bg-card hover:shadow-custom-lg transition-all duration-300 group"
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
                      {project.location && (
                        <p className="text-sm text-muted-foreground">{project.location}</p>
                      )}
                    </CardHeader>
                    <CardContent>
                      <p className="text-muted-foreground line-clamp-3">{project.description}</p>
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
          </div>
        </section>
      </div>
    </Layout>
  );
};

export default Projects;
