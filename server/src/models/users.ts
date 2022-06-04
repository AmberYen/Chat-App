import mongoose = require("mongoose");

export interface DBUser extends mongoose.Document {
  id: string;
  name: string;
  email: string;
}

const UserSchema = new mongoose.Schema<DBUser>(
  {
    email: {
      type: String,
      required: true
    },
    name: {
      type: String,
      required: true
    }
  },
  {
    timestamps: true,
  }
);

export default mongoose.model<DBUser>('User', UserSchema);