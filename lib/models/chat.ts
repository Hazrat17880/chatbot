// lib/models/Chat.js
import mongoose from 'mongoose';

const MessageSchema = new mongoose.Schema({
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
  tokens: {
    type: Number,
    default: 0,
  },
});

const ChatSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',  // ✅ Links to User model
    required: true,
    index: true,   // ✅ Fast queries by user
  },
  title: {
    type: String,
    default: 'New Conversation',
    trim: true,
    maxlength: 100,
  },
  messages: [MessageSchema],  // ✅ Array of messages
  createdAt: {
    type: Date,
    default: Date.now,
  },
  updatedAt: {
    type: Date,
    default: Date.now,
  },
  model: {
    type: String,
    default: 'gpt-3.5-turbo',
    enum: ['gpt-4', 'gpt-3.5-turbo', 'gpt-3.5-turbo-16k'],
  },
  isArchived: {
    type: Boolean,
    default: false,
  },
}, {
  timestamps: true, // ✅ Auto-manages createdAt & updatedAt
});

// ✅ Index for faster queries
ChatSchema.index({ userId: 1, updatedAt: -1 });

// ✅ Prevent model recompilation
const Chat = mongoose.models.Chat || mongoose.model('Chat', ChatSchema);
const Message = mongoose.models.Message || mongoose.model('Message', MessageSchema);

export { Chat, Message };