// @/models/Otp.ts
import mongoose, { Schema, Document } from "mongoose";

export interface IOtp extends Document {
  email: string;
  code: string;
  expiresAt: Date;
  registrationData?: {
    nama: string;
    alamat: string;
    password: string;
  };
  createdAt: Date;
  updatedAt: Date;
}

const OtpSchema = new Schema<IOtp>(
  {
    email: { type: String, required: true },
    code: { type: String, required: true },
    expiresAt: { type: Date, required: true },
    registrationData: {
      nama: String,
      alamat: String,
      password: String,
    },
  },
  { timestamps: true },
);

export default mongoose.models.Otp || mongoose.model<IOtp>("Otp", OtpSchema);
