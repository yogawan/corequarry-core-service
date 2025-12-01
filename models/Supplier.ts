// @/models/Supplier.ts
import mongoose, { Schema, Document, Model } from "mongoose";

export interface ISupplier extends Document {
  namaPerusahaan: string;
  email?: string;
  kontak?: string;
  alamatPerusahaan?: string;
  materialYangDiSupply?: string[];
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const SupplierSchema: Schema<ISupplier> = new Schema(
  {
    namaPerusahaan: { type: String, required: true, trim: true },
    email: { type: String, trim: true, lowercase: true },
    kontak: { type: String, trim: true },
    alamatPerusahaan: { type: String, trim: true },
    materialYangDiSupply: { type: [String], default: [] },
    isActive: { type: Boolean, default: true },
  },
  { timestamps: true },
);

const Supplier: Model<ISupplier> =
  mongoose.models.Supplier ||
  mongoose.model<ISupplier>("Supplier", SupplierSchema);

export default Supplier;