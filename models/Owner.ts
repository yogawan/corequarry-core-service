// @/models/Owner.ts
import mongoose, { Document, Schema } from "mongoose";

export interface IOwner extends Document {
  nama: string;
  email: string;
  password: string;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const OwnerSchema = new Schema<IOwner>(
  {
    nama: { type: String, required: true, trim: true },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },
    password: { type: String, required: true },
    isActive: { type: Boolean, default: true },
  },
  { timestamps: true },
);

export default mongoose.models.Owner ||
  mongoose.model<IOwner>("Owner", OwnerSchema);
