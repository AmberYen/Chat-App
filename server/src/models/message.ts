import mongoose from "mongoose";

const MessageSchema = new mongoose.Schema(
  {
    message: {
      type: String,
      required: true
    },
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true
    },
  }
)

export default mongoose.model('Message', MessageSchema);