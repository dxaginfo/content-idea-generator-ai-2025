const mongoose = require('mongoose');

const ideaSchema = mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: 'User',
    },
    content: {
      title: {
        type: String,
        required: [true, 'Please add a title'],
        trim: true,
      },
      description: {
        type: String,
        required: [true, 'Please add a description'],
      },
      contentType: {
        type: String,
        enum: ['blog', 'video', 'social'],
        default: 'blog',
      },
      keywords: {
        type: [String],
        default: [],
      },
      targetAudience: {
        type: String,
        default: 'General audience',
      },
      estimatedEngagement: {
        type: String,
        enum: ['high', 'medium', 'low'],
        default: 'medium',
      },
    },
    isSaved: {
      type: Boolean,
      default: false,
    },
    isScheduled: {
      type: Boolean,
      default: false,
    },
    scheduledDate: {
      type: Date,
      default: null,
    },
    notes: {
      type: String,
      default: '',
    },
    status: {
      type: String,
      enum: ['draft', 'in-progress', 'published'],
      default: 'draft',
    },
  },
  {
    timestamps: true,
  }
);

// Create index for faster queries
ideaSchema.index({ userId: 1, createdAt: -1 });
ideaSchema.index({ userId: 1, isSaved: 1 });
ideaSchema.index({ userId: 1, isScheduled: 1 });

module.exports = mongoose.model('Idea', ideaSchema);