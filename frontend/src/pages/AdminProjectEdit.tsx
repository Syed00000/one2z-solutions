import { useState, useEffect, useRef } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { Building2, LogOut, ArrowLeft, Upload, X, Plus, Trash2 } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
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

const AdminProjectEdit = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    title: "",
    category: "Residential",
    description: "",
    location: "",
    area: "",
    budget: "",
    completion: "",
    clientName: "",
    clientCompany: "",
    coverImage: "",
  });
  const [galleryImages, setGalleryImages] = useState<string[]>([]);
  const [isDragging, setIsDragging] = useState(false);
  const [isCoverDragging, setIsCoverDragging] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const coverInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    // Load project from localStorage
    const projects = JSON.parse(localStorage.getItem("projects") || "[]");
    const project = projects.find((p: Project) => p.id === id);
    
    if (project) {
      setFormData({
        title: project.title,
        category: project.category,
        description: project.description,
        location: project.location || "",
        area: project.area || "",
        budget: project.budget || "",
        completion: project.completion || "",
        clientName: project.clientName || "",
        clientCompany: project.clientCompany || "",
        coverImage: project.coverImage || "",
      });
      setGalleryImages(project.images || []);
    } else {
      toast.error("Project not found");
      navigate("/admin/projects");
    }
  }, [id, navigate]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const projects = JSON.parse(localStorage.getItem("projects") || "[]");
    const updatedProjects = projects.map((p: Project) => 
      p.id === id 
        ? { ...p, ...formData, images: galleryImages }
        : p
    );
    
    localStorage.setItem("projects", JSON.stringify(updatedProjects));
    toast.success("Project updated successfully");
    navigate(`/admin/projects/${id}`);
  };

  // Gallery image handlers
  const addGalleryImage = () => {
    if (galleryImages.length < 10) {
      setGalleryImages([...galleryImages, ""]);
    } else {
      toast.error("Maximum 10 images allowed");
    }
  };

  const updateGalleryImage = (index: number, value: string) => {
    const updated = [...galleryImages];
    updated[index] = value;
    setGalleryImages(updated);
  };

  const removeGalleryImage = (index: number) => {
    const updated = galleryImages.filter((_, i) => i !== index);
    setGalleryImages(updated);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    
    const files = Array.from(e.dataTransfer.files);
    handleFiles(files);
  };

  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const files = Array.from(e.target.files);
      handleFiles(files);
    }
  };

  const handleFiles = (files: File[]) => {
    const remainingSlots = 10 - galleryImages.length;
    
    if (files.length > remainingSlots) {
      toast.error(`You can only add ${remainingSlots} more image(s)`);
      return;
    }

    files.forEach((file) => {
      if (!file.type.startsWith('image/')) {
        toast.error(`${file.name} is not an image file`);
        return;
      }

      const reader = new FileReader();
      reader.onload = (e) => {
        const result = e.target?.result as string;
        setGalleryImages(prev => [...prev, result]);
      };
      reader.readAsDataURL(file);
    });
  };

  // Cover image handlers
  const handleCoverDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsCoverDragging(true);
  };

  const handleCoverDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsCoverDragging(false);
  };

  const handleCoverDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsCoverDragging(false);
    
    const files = Array.from(e.dataTransfer.files);
    if (files.length > 0) {
      handleCoverFile(files[0]);
    }
  };

  const handleCoverFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      handleCoverFile(e.target.files[0]);
    }
  };

  const handleCoverFile = (file: File) => {
    if (!file.type.startsWith('image/')) {
      toast.error(`${file.name} is not an image file`);
      return;
    }

    const reader = new FileReader();
    reader.onload = (e) => {
      const result = e.target?.result as string;
      setFormData({...formData, coverImage: result});
      toast.success("Cover image uploaded");
    };
    reader.readAsDataURL(file);
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border bg-card sticky top-0 z-50">
        <div className="container mx-auto px-4 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-4">
              <Button variant="ghost" size="sm" onClick={() => navigate(`/admin/projects/${id}`)}>
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back
              </Button>
              <div className="flex items-center gap-2">
                <Building2 className="w-6 h-6 text-primary" />
                <span className="text-lg font-bold">Edit Project</span>
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
        <Card className="max-w-4xl mx-auto">
          <CardHeader>
            <CardTitle className="text-3xl">Edit Project</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="title" className="text-sm font-medium">Project Title *</Label>
                <Input
                  id="title"
                  value={formData.title}
                  onChange={(e) => setFormData({...formData, title: e.target.value})}
                  required
                  placeholder="Luxury Residential Complex"
                  className="mt-1.5"
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="category" className="text-sm font-medium">Category *</Label>
                <select
                  id="category"
                  value={formData.category}
                  onChange={(e) => setFormData({...formData, category: e.target.value})}
                  className="w-full h-10 px-3 rounded-md border border-input bg-background mt-1.5"
                  required
                >
                  <option value="Residential">Residential</option>
                  <option value="Commercial">Commercial</option>
                  <option value="Institutional">Institutional</option>
                </select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="description" className="text-sm font-medium">Description *</Label>
                <Textarea
                  id="description"
                  value={formData.description}
                  onChange={(e) => setFormData({...formData, description: e.target.value})}
                  required
                  rows={4}
                  placeholder="Detailed project description..."
                  className="mt-1.5"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="location" className="text-sm font-medium">Location</Label>
                  <Input
                    id="location"
                    value={formData.location}
                    onChange={(e) => setFormData({...formData, location: e.target.value})}
                    placeholder="Downtown District, City Center"
                    className="mt-1.5"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="area" className="text-sm font-medium">Area</Label>
                  <Input
                    id="area"
                    value={formData.area}
                    onChange={(e) => setFormData({...formData, area: e.target.value})}
                    placeholder="75,000 sq ft"
                    className="mt-1.5"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="budget" className="text-sm font-medium">Budget Range</Label>
                  <Input
                    id="budget"
                    value={formData.budget}
                    onChange={(e) => setFormData({...formData, budget: e.target.value})}
                    placeholder="$12M - $15M"
                    className="mt-1.5"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="completion" className="text-sm font-medium">Completion Date</Label>
                  <Input
                    id="completion"
                    value={formData.completion}
                    onChange={(e) => setFormData({...formData, completion: e.target.value})}
                    placeholder="December 2023"
                    className="mt-1.5"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="clientName" className="text-sm font-medium">Client Name</Label>
                  <Input
                    id="clientName"
                    value={formData.clientName}
                    onChange={(e) => setFormData({...formData, clientName: e.target.value})}
                    placeholder="Mr. Rajesh Sharma"
                    className="mt-1.5"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="clientCompany" className="text-sm font-medium">Client Company</Label>
                  <Input
                    id="clientCompany"
                    value={formData.clientCompany}
                    onChange={(e) => setFormData({...formData, clientCompany: e.target.value})}
                    placeholder="Sharma Builders & Developers"
                    className="mt-1.5"
                  />
                </div>
              </div>

              {/* Cover Image */}
              <div className="space-y-3 border-t pt-4">
                <div className="flex items-center justify-between">
                  <div>
                    <Label className="text-sm font-medium">Cover Image</Label>
                    <p className="text-xs text-muted-foreground mt-1">Main project cover image</p>
                  </div>
                  <Button 
                    type="button" 
                    size="sm" 
                    variant="outline"
                    onClick={() => coverInputRef.current?.click()}
                  >
                    <Upload className="w-4 h-4 mr-1" />
                    Upload
                  </Button>
                </div>

                <input
                  ref={coverInputRef}
                  type="file"
                  accept="image/*"
                  onChange={handleCoverFileInput}
                  className="hidden"
                />

                <div
                  onDragOver={handleCoverDragOver}
                  onDragLeave={handleCoverDragLeave}
                  onDrop={handleCoverDrop}
                  className={`border-2 border-dashed rounded-lg p-4 transition-colors ${
                    isCoverDragging 
                      ? 'border-primary bg-primary/5' 
                      : 'border-muted-foreground/25 hover:border-primary/50'
                  } cursor-pointer`}
                  onClick={() => coverInputRef.current?.click()}
                >
                  {formData.coverImage ? (
                    <div className="relative group">
                      <img 
                        src={formData.coverImage} 
                        alt="Cover" 
                        className="w-full h-48 object-cover rounded-lg"
                      />
                      <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity rounded-lg flex items-center justify-center">
                        <p className="text-white text-sm">Click or drag to change</p>
                      </div>
                      <Button
                        type="button"
                        size="sm"
                        variant="destructive"
                        className="absolute top-2 right-2 h-6 w-6 p-0"
                        onClick={(e) => {
                          e.stopPropagation();
                          setFormData({...formData, coverImage: ""});
                        }}
                      >
                        <X className="w-4 h-4" />
                      </Button>
                    </div>
                  ) : (
                    <div className="text-center py-8">
                      <Upload className="w-10 h-10 mx-auto mb-3 text-muted-foreground" />
                      <p className="text-sm font-medium mb-1">
                        {isCoverDragging ? 'Drop cover image here' : 'Drag & drop cover image'}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        or click to browse • PNG, JPG, WEBP
                      </p>
                    </div>
                  )}
                </div>
              </div>

              {/* Gallery Images */}
              <div className="space-y-3 border-t pt-4">
                <div className="flex items-center justify-between">
                  <div>
                    <Label className="text-sm font-medium">Project Gallery Images</Label>
                    <p className="text-xs text-muted-foreground mt-1">Drag & drop or click to upload (max 10 images)</p>
                  </div>
                  <div className="flex gap-2">
                    <Button 
                      type="button" 
                      size="sm" 
                      variant="outline"
                      onClick={() => fileInputRef.current?.click()}
                      disabled={galleryImages.length >= 10}
                    >
                      <Upload className="w-4 h-4 mr-1" />
                      Upload
                    </Button>
                    <Button 
                      type="button" 
                      size="sm" 
                      variant="outline"
                      onClick={addGalleryImage}
                      disabled={galleryImages.length >= 10}
                    >
                      <Plus className="w-4 h-4 mr-1" />
                      Add URL
                    </Button>
                  </div>
                </div>

                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  multiple
                  onChange={handleFileInput}
                  className="hidden"
                />
                
                <div
                  onDragOver={handleDragOver}
                  onDragLeave={handleDragLeave}
                  onDrop={handleDrop}
                  className={`border-2 border-dashed rounded-lg p-6 transition-colors ${
                    isDragging 
                      ? 'border-primary bg-primary/5' 
                      : 'border-muted-foreground/25 hover:border-primary/50'
                  } ${galleryImages.length >= 10 ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}`}
                  onClick={() => galleryImages.length < 10 && fileInputRef.current?.click()}
                >
                  <div className="text-center">
                    <Upload className="w-10 h-10 mx-auto mb-3 text-muted-foreground" />
                    <p className="text-sm font-medium mb-1">
                      {isDragging ? 'Drop images here' : 'Drag & drop images here'}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      or click to browse • PNG, JPG, WEBP up to 10MB
                    </p>
                  </div>
                </div>
                
                {galleryImages.length > 0 && (
                  <div className="grid grid-cols-2 gap-3 max-h-80 overflow-y-auto p-2">
                    {galleryImages.map((image, index) => (
                      <div key={index} className="relative group">
                        <div className="aspect-video rounded-lg overflow-hidden bg-muted border">
                          {image.startsWith('data:image') || image.startsWith('http') ? (
                            <img 
                              src={image} 
                              alt={`Gallery ${index + 1}`} 
                              className="w-full h-full object-cover"
                            />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center p-2">
                              <Input
                                value={image}
                                onChange={(e) => updateGalleryImage(index, e.target.value)}
                                placeholder={`Image ${index + 1} URL`}
                                className="text-xs h-8"
                              />
                            </div>
                          )}
                        </div>
                        <Button
                          type="button"
                          size="sm"
                          variant="destructive"
                          className="absolute top-2 right-2 h-6 w-6 p-0 opacity-0 group-hover:opacity-100 transition-opacity"
                          onClick={() => removeGalleryImage(index)}
                        >
                          <X className="w-4 h-4" />
                        </Button>
                        <div className="absolute bottom-2 left-2 bg-black/60 text-white text-xs px-2 py-1 rounded">
                          {index + 1}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
                
                <p className="text-xs text-muted-foreground text-center">
                  {galleryImages.length} / 10 images added
                </p>
              </div>

              <div className="flex gap-3 pt-4 border-t">
                <Button type="submit" className="flex-1">Update Project</Button>
                <Button type="button" variant="outline" onClick={() => navigate(`/admin/projects/${id}`)} className="flex-1">Cancel</Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </main>
    </div>
  );
};

export default AdminProjectEdit;
