import mongoose from 'mongoose';

const chatMessageSchema = new mongoose.Schema(
  {
    conversationId: {
      type: String,
      required: true,
      index: true
    },
    threadId: {
      type: String,
      index: true,
      default: ''
    },
    senderName: {
      type: String,
      required: true,
      trim: true
    },
    senderEmail: {
      type: String,
      trim: true,
      default: ''
    },
    senderRole: {
      type: String,
      default: 'customer'
    },
    message: {
      type: String,
      required: true,
      trim: true
    },
    productContext: {
      id: String,
      name: String,
      price: Number,
      image: String,
      finish: String,
      category: String
    },
    isStaff: {
      type: Boolean,
      default: false
    },
    isRead: {
      type: Boolean,
      default: false
    }
  },
  {
    timestamps: true
  }
);

chatMessageSchema.index({ conversationId: 1, createdAt: 1 });
chatMessageSchema.index({ threadId: 1, createdAt: 1 });

const ChatMessage = mongoose.model('ChatMessage', chatMessageSchema);
export default ChatMessage;
