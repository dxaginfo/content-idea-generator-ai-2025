import mongoose, { Document, Schema } from 'mongoose';

export interface IdeaContent {
  title: string;
  description: string;
  contentType: 'blog' | 'video' | 'social';
  keywords: string[];
  targetAudience?: string;
  estimatedEngagement?: string;
}

export interface IIdea extends Document {
  content: IdeaContent;
  userId: mongoose.Types.ObjectId;
  isSaved: boolean;
  isScheduled?: boolean;
  scheduledDate?: Date;
  createdAt: Date;
  updatedAt: Date;
}

const IdeaSchema: Schema = new Schema(
  {
    content: {
      title: {
        type: String,
        required: [true, 'Title is required'],
        trim: true,
      },
      description: {
        type: String,
        required: [true, 'Description is required'],
        trim: true,
      },
      contentType: {
        type: String,
        enum: ['blog', 'video', 'social'],
        required: [true, 'Content type is required'],
      },
      keywords: [
        {
          type: String,
          trim: true,
        },
      ],
      targetAudience: {
        type: String,
        trim: true,
      },
      estimatedEngagement: {
        type: String,
        trim: true,
      },
    },
    userId: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'User ID is required'],
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
    },
  },
  { timestamps: true }
);

export default mongoose.model<IIdea>('Idea', IdeaSchema);
