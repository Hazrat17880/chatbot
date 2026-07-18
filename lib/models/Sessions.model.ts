import mongoose, { Schema, Document, Model } from 'mongoose';

export interface IMessage {
  role: 'user' | 'assistant' | 'system';
  content: string;
  timestamp: Date;
  feedback?: 'like' | 'dislike';
}

export interface ISession extends Document {
  userId?: mongoose.Types.ObjectId;
  sessionId: string;
  messages: IMessage[];
  metadata?: {
    model?: string;
    temperature?: number;
    totalTokens?: number;
  };
  expiresAt: Date;
}

const SessionSchema = new Schema<ISession>(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
    },
    sessionId: {
      type: String,
      required: true,
      unique: true,
    },
    messages: [
      {
        role: {
          type: String,
          enum: ['user', 'assistant', 'system'],
          required: true,
        },
        content: {
          type: String,
          required: true,
        },
        timestamp: {
          type: Date,
          default: Date.now,
        },
        feedback: {
          type: String,
          enum: ['like', 'dislike'],
        },
      },
    ],
    metadata: {
      model: String,
      temperature: Number,
      totalTokens: Number,
    },
    expiresAt: {
      type: Date,
      default: () => new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
    },
  },
  {
    timestamps: true,
  }
);

SessionSchema.index({ expiresAt: 1 }, { expireAfterSeconds: 0 });

export const Session: Model<ISession> = mongoose.models.Session || mongoose.model<ISession>('Session', SessionSchema);