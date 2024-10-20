import mongoose from "mongoose";

const UserSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  email: {
    type: String,
    required: true,
    unique: true
  },
  password: {
    type: String,
    required: true
  },
  avatar: {
    type: String,
    default: 'avatar.jpg'
  },
  role: {
    type: String,
    default: "USER"
  },
  isActive: {
    type: Boolean,
    default: true
  }
}, { timestamps: true });

export interface IUser extends mongoose.Document {
  name: string;
  email: string;
  password: string;
  avatar?: string;
  role: string;
  isActive: boolean;
}

export default mongoose.model<IUser>("User", UserSchema);