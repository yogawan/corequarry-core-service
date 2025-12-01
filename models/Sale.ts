// @/models/Sale.ts
import mongoose, { Document, Schema } from "mongoose";
import Product from "./Product";

export interface ISale extends Document {
  customerId: mongoose.Types.ObjectId;
  productId: mongoose.Types.ObjectId;
  jumlah: number;
  hargaSatuan: number;
  totalHarga: number;
  // catatan?: string;
  createdAt?: Date;
  updatedAt?: Date;
}

const SaleSchema = new Schema<ISale>(
  {
    customerId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Customer",
      required: true,
    },
    productId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Product",
      required: true,
    },
    jumlah: { type: Number, required: true, default: 0 },

    // Akan diisi otomatis dari hargaJual produk
    hargaSatuan: { type: Number, default: 0 },

    totalHarga: { type: Number, default: 0 },

    // catatan: { type: String, default: "" },
  },
  { timestamps: true },
);

// 🔥 Pre-save: ambil harga jual dari Product & hitung total
SaleSchema.pre("save", async function (next) {
  try {
    const produk = await Product.findById(this.productId);

    if (!produk) {
      throw new Error("Produk tidak ditemukan");
    }

    // Ambil harga jual dari Product
    this.hargaSatuan = produk.hargaJual;

    // Hitung total harga
    this.totalHarga = this.jumlah * this.hargaSatuan;

    next();
  } catch (err) {
    next(err as Error);
  }
});

// Optional index
SaleSchema.index({ customerId: 1, productId: 1 });

export default mongoose.models.Sale ||
  mongoose.model<ISale>("Sale", SaleSchema);
