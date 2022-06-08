import mongoose = require("mongoose");

export interface DBUser extends mongoose.Document {
  id: string;
  name: string;
  email: string;
}

const UserSchema = new mongoose.Schema<DBUser>(
  {
    name: {
      type: String,
      required: true
    },
    email: {
      type: String,
      required: true,
      index: { unique: true }
    }
  },
  {
    timestamps: true,
  }
);

export default mongoose.model<DBUser>('User', UserSchema);