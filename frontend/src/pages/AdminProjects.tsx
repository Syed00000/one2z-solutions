import { useState, useEffect, useRef } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Building2, LogOut, FolderKanban, Plus, Edit, Trash2, ArrowLeft, Eye, Upload, X } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { api } from "@/services/api";
import { useAuth } from "@/contexts/AuthContext";

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
  featured?: boolean;
  createdAt: string;
}

const AdminProjects = () => {
  const { logout } = useAuth();
  const [projects, setProjects] = useState<Project[]>([]);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isViewDialogOpen, setIsViewDialogOpen] = useState(false);
  const [viewProject, setViewProject] = useState<Project | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    title: "",
    category: "Interior",
    description: "",
    location: "",
    area: "",
    budget: "",
    completion: "",
    clientName: "",
    clientCompany: "",
    coverImage: "",
  });
  const [editFormData, setEditFormData] = useState({
    title: "",
    category: "Interior",
    description: "",
    location: "",
    area: "",
    budget: "",
    completion: "",
    clientName: "",
    clientCompany: "",
    coverImage: "",
    editingId: "",
  });
  const [galleryImages, setGalleryImages] = useState<string[]>([]);
  const [editGalleryImages, setEditGalleryImages] = useState<string[]>([]);
  const [isDragging, setIsDragging] = useState(false);
  const [isCoverDragging, setIsCoverDragging] = useState(false);
  const [isEditDragging, setIsEditDragging] = useState(false);
  const [isEditCoverDragging, setIsEditCoverDragging] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const coverInputRef = useRef<HTMLInputElement>(null);
  const editFileInputRef = useRef<HTMLInputElement>(null);
  const editCoverInputRef = useRef<HTMLInputElement>(null);
  const navigate = useNavigate();

  useEffect(() => {
    loadProjects();
  }, []);

  const loadProjects = async () => {
    try {
      const response = await api.projects.getAll();
      if (response.success) {
        setProjects((response.data as Project[]) || []);
      }
    } catch (error) {
      console.error('Error loading projects:', error);
      toast.error("Failed to load projects");
    }
  };

  // Create new project
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    
    try {
      const projectData = {
        ...formData,
        images: galleryImages.filter(img => img && img.trim() !== ''), // Remove empty strings
      };

      console.log('➕ Creating new project');
      const response = await api.projects.create(projectData);
      
      if (response.success) {
        toast.success("Project created successfully");
        setIsDialogOpen(false);
        setFormData({
          title: "",
          category: "Interior",
          description: "",
          location: "",
          area: "",
          budget: "",
          completion: "",
          clientName: "",
          clientCompany: "",
          coverImage: "",
        });
        setGalleryImages([]);
        
        // Reload projects from database
        await loadProjects();
      }
    } catch (error: any) {
      toast.error("Failed to create project", {
        description: error.message || "Please try again later.",
      });
    } finally {
      setIsLoading(false);
    }
  };

  // Update existing project
  const handleEditSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    
    try {
      const { editingId, ...projectData } = editFormData;
      const finalData = {
        ...projectData,
        images: editGalleryImages.filter(img => img && img.trim() !== ''), // Remove empty strings
      };

      console.log('✏️ Updating project:', editingId);
      console.log('📤 Update data being sent:', finalData);
      console.log('🖼️ Cover image:', finalData.coverImage ? 'Present' : 'Missing');
      const response = await api.projects.update(editingId, finalData);
      
      if (response.success) {
        toast.success("Project updated successfully");
        setIsEditDialogOpen(false);
        setEditFormData({
          title: "",
          category: "Interior",
          description: "",
          location: "",
          area: "",
          budget: "",
          completion: "",
          clientName: "",
          clientCompany: "",
          coverImage: "",
          editingId: "",
        });
        setEditGalleryImages([]);
        
        // Reload projects from database
        await loadProjects();
      }
    } catch (error: any) {
      toast.error("Failed to update project", {
        description: error.message || "Please try again later.",
      });
    } finally {
      setIsLoading(false);
    }
  };

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
    const currentImages = galleryImages.filter(img => img && img.trim() !== '');
    const remainingSlots = 10 - currentImages.length;
    
    if (files.length > remainingSlots) {
      toast.error(`You can only add ${remainingSlots} more image(s). Currently have ${currentImages.length}/10 images.`);
      return;
    }

    let processedCount = 0;
    const validFiles = files.filter(file => {
      if (!file.type.startsWith('image/')) {
        toast.error(`${file.name} is not an image file`);
        return false;
      }
      return true;
    });

    validFiles.forEach((file) => {
      const reader = new FileReader();
      reader.onload = (e) => {
        const result = e.target?.result as string;
        setGalleryImages(prev => [...prev, result]);
        
        processedCount++;
        if (processedCount === validFiles.length) {
          toast.success(`${validFiles.length} image(s) uploaded successfully`);
        }
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

  // Edit form drag and drop handlers for gallery images
  const handleEditDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsEditDragging(true);
  };

  const handleEditDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsEditDragging(false);
  };

  const handleEditDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsEditDragging(false);
    
    const files = Array.from(e.dataTransfer.files);
    if (files.length > 0) {
      handleEditFiles(files);
    }
  };

  const handleEditFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const files = Array.from(e.target.files);
      handleEditFiles(files);
    }
  };

  const handleEditFiles = (files: File[]) => {
    const currentImages = editGalleryImages.filter(img => img && img.trim() !== '');
    const remainingSlots = 10 - currentImages.length;
    
    if (files.length > remainingSlots) {
      toast.error(`You can only add ${remainingSlots} more image(s). Currently have ${currentImages.length}/10 images.`);
      return;
    }

    let processedCount = 0;
    const validFiles = files.filter(file => {
      if (!file.type.startsWith('image/')) {
        toast.error(`${file.name} is not an image file`);
        return false;
      }
      return true;
    });

    validFiles.forEach((file) => {
      const reader = new FileReader();
      reader.onload = (e) => {
        const result = e.target?.result as string;
        setEditGalleryImages(prev => {
          const newImages = [...prev, result];
          return newImages;
        });
        
        processedCount++;
        if (processedCount === validFiles.length) {
          toast.success(`${validFiles.length} image(s) uploaded successfully`);
        }
      };
      reader.readAsDataURL(file);
    });
  };

  // Edit form cover image handlers
  const handleEditCoverDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsEditCoverDragging(true);
  };

  const handleEditCoverDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsEditCoverDragging(false);
  };

  const handleEditCoverDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsEditCoverDragging(false);
    
    const files = Array.from(e.dataTransfer.files);
    if (files.length > 0) {
      handleEditCoverFile(files[0]);
    }
  };

  const handleEditCoverFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      handleEditCoverFile(e.target.files[0]);
    }
  };

  const handleEditCoverFile = (file: File) => {
    if (!file.type.startsWith('image/')) {
      toast.error(`${file.name} is not an image file`);
      return;
    }

    const reader = new FileReader();
    reader.onload = (e) => {
      const result = e.target?.result as string;
      setEditFormData({...editFormData, coverImage: result});
      toast.success("Cover image uploaded");
    };
    reader.readAsDataURL(file);
  };

  const handleViewProject = (project: Project) => {
    setViewProject(project);
    setIsViewDialogOpen(true);
  };

  const handleEditProject = (project: Project) => {
    // Pre-fill edit form with project data
    setEditFormData({
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
      editingId: project._id || project.id || "",
    });
    setEditGalleryImages(project.images || []);
    setIsEditDialogOpen(true);
  };

  const handleDeleteProject = async (id: string) => {
    if (!id) {
      toast.error("Invalid project ID");
      return;
    }

    const confirmDelete = window.confirm("Are you sure you want to delete this project? This action cannot be undone.");
    
    if (!confirmDelete) return;

    try {
      console.log('🗑️ Deleting project with ID:', id);
      const response = await api.projects.delete(id);
      
      if (response.success) {
        toast.success("Project deleted successfully");
        await loadProjects(); // Reload from database
      } else {
        toast.error("Failed to delete project");
      }
    } catch (error: any) {
      console.error('❌ Delete error:', error);
      toast.error("Failed to delete project", {
        description: error.message || "Please try again later.",
      });
    }
  };

  const handleLogout = async () => {
    try {
      await logout();
      navigate("/admin/login");
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
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
                  <span className="text-xs text-muted-foreground">Projects Management</span>
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
        {/* Page Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-4xl font-bold mb-2 flex items-center gap-3">
              <FolderKanban className="w-10 h-10 text-primary" />
              Projects Management
            </h1>
            <p className="text-muted-foreground">Create, edit, and manage construction projects</p>
          </div>
          
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button size="lg">
                <Plus className="w-5 h-5 mr-2" />
                Add New Project
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-4xl max-h-[95vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle>Create New Project</DialogTitle>
                <DialogDescription>Add a new construction project to your portfolio</DialogDescription>
              </DialogHeader>
              <form onSubmit={handleSubmit} className="space-y-6 mt-4">
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
                    <option value="Interior">Interior</option>
                    <option value="Construction">Construction</option>
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

                  {/* Cover Image Drag & Drop */}
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

                  <p className="text-xs text-muted-foreground">
                    Or paste URL: 
                    <Input
                      value={formData.coverImage.startsWith('data:') ? '' : formData.coverImage}
                      onChange={(e) => setFormData({...formData, coverImage: e.target.value})}
                      placeholder="https://example.com/image.jpg"
                      className="mt-1.5 text-xs"
                    />
                  </p>
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
                  
                  {/* Drag and Drop Zone */}
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
                  
                  {/* Image Preview Grid */}
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
                              <div className="w-full h-full flex items-center justify-center">
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
                  <Button type="submit" className="flex-1" disabled={isLoading}>
                    {isLoading ? "Creating..." : "Create Project"}
                  </Button>
                  <Button type="button" variant="outline" onClick={() => setIsDialogOpen(false)} className="flex-1">Cancel</Button>
                </div>
              </form>
            </DialogContent>
          </Dialog>

          {/* Edit Project Dialog */}
          <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
            <DialogContent className="max-w-4xl max-h-[95vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle>Edit Project</DialogTitle>
                <DialogDescription>Update project details</DialogDescription>
              </DialogHeader>
              <form onSubmit={handleEditSubmit} className="space-y-6 mt-4">
                <div className="space-y-2">
                  <Label htmlFor="edit-title" className="text-sm font-medium">Project Title *</Label>
                  <Input
                    id="edit-title"
                    value={editFormData.title}
                    onChange={(e) => setEditFormData({...editFormData, title: e.target.value})}
                    required
                    placeholder="Luxury Residential Complex"
                    className="bg-background"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="edit-category" className="text-sm font-medium">Category *</Label>
                  <select
                    id="edit-category"
                    value={editFormData.category}
                    onChange={(e) => setEditFormData({...editFormData, category: e.target.value})}
                    className="w-full px-3 py-2 border border-input bg-background rounded-md"
                    required
                  >
                    <option value="Interior">Interior</option>
                    <option value="Construction">Construction</option>
                  </select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="edit-description" className="text-sm font-medium">Description *</Label>
                  <Textarea
                    id="edit-description"
                    value={editFormData.description}
                    onChange={(e) => setEditFormData({...editFormData, description: e.target.value})}
                    required
                    placeholder="Detailed project description..."
                    className="bg-background min-h-[100px]"
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="edit-location" className="text-sm font-medium">Location</Label>
                    <Input
                      id="edit-location"
                      value={editFormData.location}
                      onChange={(e) => setEditFormData({...editFormData, location: e.target.value})}
                      placeholder="Sector 47, Gurgaon"
                      className="bg-background"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="edit-area" className="text-sm font-medium">Area</Label>
                    <Input
                      id="edit-area"
                      value={editFormData.area}
                      onChange={(e) => setEditFormData({...editFormData, area: e.target.value})}
                      placeholder="2500 sq ft"
                      className="bg-background"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="edit-budget" className="text-sm font-medium">Budget</Label>
                    <Input
                      id="edit-budget"
                      value={editFormData.budget}
                      onChange={(e) => setEditFormData({...editFormData, budget: e.target.value})}
                      placeholder="₹50 Lakhs"
                      className="bg-background"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="edit-completion" className="text-sm font-medium">Completion</Label>
                    <Input
                      id="edit-completion"
                      value={editFormData.completion}
                      onChange={(e) => setEditFormData({...editFormData, completion: e.target.value})}
                      placeholder="March 2024"
                      className="bg-background"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="edit-clientName" className="text-sm font-medium">Client Name</Label>
                    <Input
                      id="edit-clientName"
                      value={editFormData.clientName}
                      onChange={(e) => setEditFormData({...editFormData, clientName: e.target.value})}
                      placeholder="Mr. John Doe"
                      className="bg-background"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="edit-clientCompany" className="text-sm font-medium">Client Company</Label>
                    <Input
                      id="edit-clientCompany"
                      value={editFormData.clientCompany}
                      onChange={(e) => setEditFormData({...editFormData, clientCompany: e.target.value})}
                      placeholder="ABC Corp"
                      className="bg-background"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label className="text-sm font-medium">Cover Image *</Label>
                  <div className="space-y-2">
                    <Input
                      value={editFormData.coverImage}
                      onChange={(e) => setEditFormData({...editFormData, coverImage: e.target.value})}
                      placeholder="https://example.com/image.jpg or base64 data"
                      className="bg-background"
                    />
                    
                    {/* Drag and Drop Area for Cover Image */}
                    <div
                      className={`relative border-2 border-dashed rounded-lg p-6 text-center transition-colors ${
                        isEditCoverDragging
                          ? 'border-primary bg-primary/5'
                          : 'border-muted-foreground/25 hover:border-muted-foreground/50'
                      }`}
                      onDragOver={handleEditCoverDragOver}
                      onDragLeave={handleEditCoverDragLeave}
                      onDrop={handleEditCoverDrop}
                    >
                      <input
                        ref={editCoverInputRef}
                        type="file"
                        accept="image/*"
                        onChange={handleEditCoverFileInput}
                        className="hidden"
                      />
                      <Upload className="w-8 h-8 text-muted-foreground mx-auto mb-2" />
                      <p className="text-sm text-muted-foreground mb-2">
                        Drag and drop cover image here, or{' '}
                        <button
                          type="button"
                          onClick={() => editCoverInputRef.current?.click()}
                          className="text-primary hover:underline"
                        >
                          browse
                        </button>
                      </p>
                      <p className="text-xs text-muted-foreground">PNG, JPG, GIF up to 10MB</p>
                    </div>
                    
                    {editFormData.coverImage && (
                      <div className="relative w-full h-32 bg-muted rounded-md overflow-hidden">
                        <img 
                          src={editFormData.coverImage} 
                          alt="Cover preview" 
                          className="w-full h-full object-cover"
                          onError={(e) => {
                            e.currentTarget.style.display = 'none';
                          }}
                        />
                      </div>
                    )}
                  </div>
                </div>

                {/* Gallery Images */}
                <div className="space-y-2">
                  <Label className="text-sm font-medium">Gallery Images</Label>
                  <div className="space-y-2">
                    
                    {/* Drag and Drop Area for Gallery Images */}
                    <div
                      className={`relative border-2 border-dashed rounded-lg p-6 text-center transition-colors ${
                        isEditDragging
                          ? 'border-primary bg-primary/5'
                          : 'border-muted-foreground/25 hover:border-muted-foreground/50'
                      }`}
                      onDragOver={handleEditDragOver}
                      onDragLeave={handleEditDragLeave}
                      onDrop={handleEditDrop}
                    >
                      <input
                        ref={editFileInputRef}
                        type="file"
                        accept="image/*"
                        multiple
                        onChange={handleEditFileInput}
                        className="hidden"
                      />
                      <Upload className="w-8 h-8 text-muted-foreground mx-auto mb-2" />
                      <p className="text-sm text-muted-foreground mb-2">
                        Drag and drop gallery images here, or{' '}
                        <button
                          type="button"
                          onClick={() => editFileInputRef.current?.click()}
                          className="text-primary hover:underline"
                        >
                          browse
                        </button>
                      </p>
                      <p className="text-xs text-muted-foreground">PNG, JPG, GIF up to 10MB each (Max 10 images)</p>
                    </div>
                    
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => {
                        if (editGalleryImages.length < 10) {
                          setEditGalleryImages([...editGalleryImages, ""]);
                        } else {
                          toast.error("Maximum 10 images allowed");
                        }
                      }}
                      className="w-full"
                    >
                      <Plus className="w-4 h-4 mr-2" />
                      Add Gallery Image URL
                    </Button>
                    
                    {editGalleryImages.map((image, index) => (
                      <div key={index} className="flex gap-2">
                        <Input
                          value={image}
                          onChange={(e) => {
                            const updated = [...editGalleryImages];
                            updated[index] = e.target.value;
                            setEditGalleryImages(updated);
                          }}
                          placeholder={`Gallery image ${index + 1} URL`}
                          className="bg-background flex-1"
                        />
                        <Button
                          type="button"
                          variant="outline"
                          size="sm"
                          onClick={() => {
                            const updated = editGalleryImages.filter((_, i) => i !== index);
                            setEditGalleryImages(updated);
                          }}
                        >
                          <X className="w-4 h-4" />
                        </Button>
                      </div>
                    ))}
                    
                    {editGalleryImages.filter(img => img && img.trim() !== '').length > 0 && (
                      <div className="space-y-2">
                        <Label className="text-xs font-medium text-muted-foreground">Uploaded Images Preview</Label>
                        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
                          {editGalleryImages.filter(img => img && img.trim() !== '').map((image, index) => (
                            <div key={index} className="relative group">
                              <div className="relative h-24 bg-muted rounded-lg overflow-hidden border">
                                <img 
                                  src={image} 
                                  alt={`Gallery ${index + 1}`} 
                                  className="w-full h-full object-cover"
                                  onError={(e) => {
                                    e.currentTarget.style.display = 'none';
                                  }}
                                />
                                <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                                  <Button
                                    type="button"
                                    variant="destructive"
                                    size="sm"
                                    onClick={() => {
                                      const actualIndex = editGalleryImages.findIndex(img => img === image);
                                      if (actualIndex !== -1) {
                                        const updated = editGalleryImages.filter((_, i) => i !== actualIndex);
                                        setEditGalleryImages(updated);
                                      }
                                    }}
                                    className="h-8 w-8 p-0"
                                  >
                                    <X className="w-4 h-4" />
                                  </Button>
                                </div>
                              </div>
                              <p className="text-xs text-center text-muted-foreground mt-1">Image {index + 1}</p>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                    
                    <div className="flex items-center justify-between">
                      <p className="text-xs text-muted-foreground">
                        {editGalleryImages.filter(img => img && img.trim() !== '').length} / 10 images uploaded
                      </p>
                      {editGalleryImages.filter(img => img && img.trim() !== '').length > 0 && (
                        <Button
                          type="button"
                          variant="outline"
                          size="sm"
                          onClick={() => setEditGalleryImages([])}
                          className="text-xs"
                        >
                          Clear All
                        </Button>
                      )}
                    </div>
                  </div>
                </div>

                <div className="flex gap-3 pt-4 border-t">
                  <Button type="submit" className="flex-1" disabled={isLoading}>
                    {isLoading ? "Updating..." : "Update Project"}
                  </Button>
                  <Button type="button" variant="outline" onClick={() => setIsEditDialogOpen(false)} className="flex-1">Cancel</Button>
                </div>
              </form>
            </DialogContent>
          </Dialog>

          {/* View Project Dialog */}
          <Dialog open={isViewDialogOpen} onOpenChange={setIsViewDialogOpen}>
            <DialogContent className="max-w-4xl max-h-[95vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle>Project Details</DialogTitle>
                <DialogDescription>View complete project information</DialogDescription>
              </DialogHeader>
              
              {viewProject && (
                <div className="space-y-6 mt-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-4">
                      <div>
                        <Label className="text-sm font-medium text-muted-foreground">Project Title</Label>
                        <p className="text-lg font-semibold">{viewProject.title}</p>
                      </div>
                      
                      <div>
                        <Label className="text-sm font-medium text-muted-foreground">Category</Label>
                        <Badge variant="outline" className="ml-2">{viewProject.category}</Badge>
                      </div>
                      
                      <div>
                        <Label className="text-sm font-medium text-muted-foreground">Location</Label>
                        <p>{viewProject.location || 'Not specified'}</p>
                      </div>
                      
                      <div>
                        <Label className="text-sm font-medium text-muted-foreground">Area</Label>
                        <p>{viewProject.area || 'Not specified'}</p>
                      </div>
                      
                      <div>
                        <Label className="text-sm font-medium text-muted-foreground">Budget</Label>
                        <p>{viewProject.budget || 'Not specified'}</p>
                      </div>
                      
                      <div>
                        <Label className="text-sm font-medium text-muted-foreground">Completion</Label>
                        <p>{viewProject.completion || 'Not specified'}</p>
                      </div>
                    </div>
                    
                    <div className="space-y-4">
                      <div>
                        <Label className="text-sm font-medium text-muted-foreground">Client Name</Label>
                        <p>{viewProject.clientName || 'Not specified'}</p>
                      </div>
                      
                      <div>
                        <Label className="text-sm font-medium text-muted-foreground">Client Company</Label>
                        <p>{viewProject.clientCompany || 'Not specified'}</p>
                      </div>
                      
                      <div>
                        <Label className="text-sm font-medium text-muted-foreground">Status</Label>
                        <Badge variant={viewProject.featured ? "default" : "secondary"} className="ml-2">
                          {viewProject.featured ? 'Featured' : 'Regular'}
                        </Badge>
                      </div>
                      
                      <div>
                        <Label className="text-sm font-medium text-muted-foreground">Created</Label>
                        <p>{new Date(viewProject.createdAt).toLocaleDateString()}</p>
                      </div>
                    </div>
                  </div>
                  
                  <div>
                    <Label className="text-sm font-medium text-muted-foreground">Description</Label>
                    <p className="mt-2 text-foreground leading-relaxed">{viewProject.description}</p>
                  </div>
                  
                  {viewProject.coverImage && (
                    <div>
                      <Label className="text-sm font-medium text-muted-foreground">Cover Image</Label>
                      <div className="mt-2 relative h-64 bg-muted rounded-md overflow-hidden">
                        <img 
                          src={viewProject.coverImage} 
                          alt={viewProject.title}
                          className="w-full h-full object-cover"
                        />
                      </div>
                    </div>
                  )}
                  
                  {viewProject.images && viewProject.images.length > 0 && (
                    <div>
                      <Label className="text-sm font-medium text-muted-foreground">Gallery Images ({viewProject.images.length})</Label>
                      <div className="mt-2 grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                        {viewProject.images.map((image, index) => (
                          <div key={index} className="relative h-32 bg-muted rounded-md overflow-hidden">
                            <img 
                              src={image} 
                              alt={`Gallery ${index + 1}`}
                              className="w-full h-full object-cover"
                            />
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                  
                  <div className="flex gap-3 pt-4 border-t">
                    <Button 
                      variant="outline" 
                      onClick={() => {
                        setIsViewDialogOpen(false);
                        handleEditProject(viewProject);
                      }}
                      className="flex-1"
                    >
                      <Edit className="w-4 h-4 mr-2" />
                      Edit Project
                    </Button>
                    <Button 
                      variant="outline" 
                      onClick={() => setIsViewDialogOpen(false)}
                      className="flex-1"
                    >
                      Close
                    </Button>
                  </div>
                </div>
              )}
            </DialogContent>
          </Dialog>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-muted-foreground">Total Projects</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">{projects.length}</div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-muted-foreground">Interior</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">{projects.filter(p => p.category === "Interior").length}</div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-muted-foreground">Construction</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">{projects.filter(p => p.category === "Construction").length}</div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-muted-foreground">Featured</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">{projects.filter(p => p.featured).length}</div>
            </CardContent>
          </Card>
        </div>

        {/* Projects Grid */}
        {projects.length === 0 ? (
          <Card>
            <CardContent className="pt-12 pb-12 text-center">
              <FolderKanban className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-xl font-semibold mb-2">No projects yet</h3>
              <p className="text-muted-foreground mb-4">Create your first project to get started</p>
              <Button onClick={() => setIsDialogOpen(true)}>
                <Plus className="w-4 h-4 mr-2" />
                Add Project
              </Button>
            </CardContent>
          </Card>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {projects.map((project) => (
              <Card key={project._id || project.id} className="overflow-hidden hover:shadow-lg transition-shadow">
                <div className="relative h-48 bg-muted">
                  {project.coverImage ? (
                    <img src={project.coverImage} alt={project.title} className="w-full h-full object-cover" />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center">
                      <FolderKanban className="w-16 h-16 text-muted-foreground" />
                    </div>
                  )}
                  <Badge className="absolute top-4 right-4">{project.category}</Badge>
                </div>
                <CardHeader>
                  <CardTitle className="line-clamp-1">{project.title}</CardTitle>
                  <CardDescription className="line-clamp-2">{project.description}</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="flex gap-2">
                    <Button size="sm" variant="outline" className="flex-1" onClick={() => handleViewProject(project)}>
                      <Eye className="w-4 h-4 mr-1" />
                      View
                    </Button>
                    <Button size="sm" variant="outline" onClick={() => handleEditProject(project)}>
                      <Edit className="w-4 h-4" />
                    </Button>
                    <Button size="sm" variant="outline" onClick={() => handleDeleteProject(project._id || project.id || '')}>
                      <Trash2 className="w-4 h-4" />
                    </Button>
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

export default AdminProjects;
