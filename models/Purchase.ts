// @/models/Purchase.ts
import mongoose, { Schema, Document, Model } from "mongoose";

export interface IPurchase extends Document {
  supplierId: mongoose.Types.ObjectId;
  namaMaterial: string;
  unit: string;
  hargaPerUnit: number;
  jumlah: number;
  totalHarga: number;
  createdAt: Date;
  updatedAt: Date;
}

const PurchaseSchema: Schema<IPurchase> = new Schema(
  {
    supplierId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Supplier",
      required: true,
    },
    namaMaterial: { type: String, required: true, trim: true },
    unit: { type: String, default: "m3" },
    hargaPerUnit: { type: Number, required: true },
    jumlah: { type: Number, required: true },
  },
  { timestamps: true, toJSON: { virtuals: true }, toObject: { virtuals: true } }
);

PurchaseSchema.virtual("totalHarga").get(function (this: IPurchase) {
  return this.hargaPerUnit * this.jumlah;
});

const Purchase: Model<IPurchase> =
  mongoose.models.Purchase ||
  mongoose.model<IPurchase>("Purchase", PurchaseSchema);

export default Purchase;
