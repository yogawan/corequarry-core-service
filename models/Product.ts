// @/models/Product.ts
import mongoose, { Document, Model } from "mongoose";

export interface IProduk extends Document {
  cabangId: mongoose.Types.ObjectId;
  nama: string;
  kodeSku: string;
  deskripsi?: string;
  satuan: string;
  hargaJual: number;
  aktif: boolean;
  createdAt?: Date;
  updatedAt?: Date;
}

const ProdukSchema = new mongoose.Schema<IProduk>(
  {
    cabangId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Branch",
      required: true,
    },
    nama: { type: String, required: true },
    kodeSku: { type: String, required: true },
    deskripsi: { type: String },
    satuan: { type: String, default: "M³" },
    hargaJual: { type: Number, default: 0 },
    aktif: { type: Boolean, default: true },
  },
  { timestamps: true },
);

ProdukSchema.index({ cabangId: 1, kodeSku: 1 }, { unique: true });

const Product: Model<IProduk> =
  mongoose.models.Product || mongoose.model<IProduk>("Product", ProdukSchema);

export default Product;
