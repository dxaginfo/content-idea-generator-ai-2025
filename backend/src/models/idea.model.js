const mongoose = require('mongoose');

const IdeaSchema = new mongoose.Schema(
  {
    content: {
      title: {
        type: String,
        required: [true, 'Title is required'],
        trim: true,
        maxlength: [200, 'Title cannot be more than 200 characters']
      },
      description: {
        type: String,
        required: [true, 'Description is required'],
        trim: true
      },
      contentType: {
        type: String,
        enum: ['blog', 'video', 'social'],
        default: 'blog'
      },
      keywords: {
        type: [String],
        default: []
      },
      targetAudience: {
        type: String,
        trim: true
      },
      estimatedEngagement: {
        type: String,
        enum: ['high', 'medium', 'low', 'High', 'Medium', 'Low'],
        default: 'medium'
      }
    },
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true
    },
    isSaved: {
      type: Boolean,
      default: true
    },
    isScheduled: {
      type: Boolean,
      default: false
    },
    scheduledDate: {
      type: Date,
      default: null
    },
    status: {
      type: String,
      enum: ['draft', 'in progress', 'published', 'archived'],
      default: 'draft'
    },
    notes: {
      type: String,
      default: ''
    }
  },
  {
    timestamps: true
  }
);

// Add text index for search functionality
IdeaSchema.index({ 'content.title': 'text', 'content.description': 'text', 'content.keywords': 'text' });

// Virtual field for idea age
IdeaSchema.virtual('age').get(function() {
  return Math.floor((Date.now() - this.createdAt) / (1000 * 3600 * 24));
});

// Pre-save middleware to clean keywords
IdeaSchema.pre('save', function(next) {
  if (this.content.keywords && this.content.keywords.length > 0) {
    // Remove duplicates and empty strings
    this.content.keywords = [...new Set(this.content.keywords.filter(keyword => keyword.trim() !== ''))];
  }
  next();
});

module.exports = mongoose.model('Idea', IdeaSchema);