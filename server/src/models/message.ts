import mongoose from "mongoose";

const MessageSchema = new mongoose.Schema(
  {
    message: {
      type: String,
      required: true
    },
    senderId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true
    },
    receiverId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true
    }
  }
)

export default mongoose.model('Message', MessageSchema);