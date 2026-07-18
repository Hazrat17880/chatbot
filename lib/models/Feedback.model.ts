import mongoose, { Schema, Document, Model } from 'mongoose';

export interface IFeedback extends Document {
  userId: mongoose.Types.ObjectId;
  messageId: string;
  feedback: 'like' | 'dislike';
  sessionId: string;
  comment?: string;
  metadata?: {
    model?: string;
    timestamp?: Date;
  };
}

const FeedbackSchema = new Schema<IFeedback>(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    messageId: {
      type: String,
      required: true,
    },
    feedback: {
      type: String,
      enum: ['like', 'dislike'],
      required: true,
    },
    sessionId: {
      type: String,
      default: 'default',
    },
    comment: {
      type: String,
      maxlength: 500,
    },
    metadata: {
      model: String,
      timestamp: Date,
    },
  },
  {
    timestamps: true,
  }
);

export const Feedback: Model<IFeedback> = mongoose.models.Feedback || mongoose.model<IFeedback>('Feedback', FeedbackSchema);