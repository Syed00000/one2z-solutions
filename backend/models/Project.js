import mongoose from 'mongoose';

const projectSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, 'Project title is required'],
    trim: true,
    maxlength: [200, 'Title cannot exceed 200 characters']
  },
  category: {
    type: String,
    required: [true, 'Category is required'],
    enum: ['Interior', 'Construction'],
    default: 'Interior'
  },
  description: {
    type: String,
    required: [true, 'Description is required'],
    trim: true,
    maxlength: [2000, 'Description cannot exceed 2000 characters']
  },
  location: {
    type: String,
    trim: true,
    maxlength: [200, 'Location cannot exceed 200 characters']
  },
  area: {
    type: String,
    trim: true,
    maxlength: [100, 'Area cannot exceed 100 characters']
  },
  budget: {
    type: String,
    trim: true,
    maxlength: [100, 'Budget cannot exceed 100 characters']
  },
  completion: {
    type: String,
    trim: true,
    maxlength: [100, 'Completion date cannot exceed 100 characters']
  },
  clientName: {
    type: String,
    trim: true,
    maxlength: [100, 'Client name cannot exceed 100 characters']
  },
  clientCompany: {
    type: String,
    trim: true,
    maxlength: [200, 'Client company cannot exceed 200 characters']
  },
  coverImage: {
    type: String,
    required: function() {
      // Only require coverImage for new documents, not updates
      return this.isNew;
    }
  },
  images: [{
    type: String,
    validate: {
      validator: function(v) {
        // Skip validation for empty strings
        if (!v || v.trim() === '') return true;
        // Check max length
        return this.images.filter(img => img && img.trim() !== '').length <= 10;
      },
      message: 'Maximum 10 non-empty images allowed'
    }
  }],
  status: {
    type: String,
    enum: ['draft', 'published', 'archived'],
    default: 'published'
  },
  featured: {
    type: Boolean,
    default: false
  },
  views: {
    type: Number,
    default: 0
  },
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  }
}, {
  timestamps: true
});

// Index for better search performance
projectSchema.index({ title: 'text', description: 'text', category: 1 });
projectSchema.index({ status: 1, featured: -1, createdAt: -1 });

export default mongoose.model('Project', projectSchema);
