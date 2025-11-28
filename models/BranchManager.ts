// @/models/BranchManager.ts
import mongoose, { Document, Schema } from "mongoose";

export interface IBranchManager extends Document {
  nama: string;
  email: string;
  password: string;
  cabangId: mongoose.Types.ObjectId;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const BranchManagerSchema = new Schema<IBranchManager>(
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
    cabangId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Branch",
      required: true,
    },
    isActive: { type: Boolean, default: true },
  },
  { timestamps: true },
);

export default mongoose.models.BranchManager ||
  mongoose.model<IBranchManager>("BranchManager", BranchManagerSchema);
