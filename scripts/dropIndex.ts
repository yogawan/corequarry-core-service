// @/scripts/dropIndex.ts
import { mongoConnect } from "@/lib/mongoConnect";
import Product from "@/models/Product";

async function dropIndex() {
  await mongoConnect();
  try {
    await Product.collection.dropIndex("kodeSku_1");
    console.log("Dropped index kodeSku_1");
  } catch (err: any) {
    console.log("Index not found or error:", err.message);
  }
  process.exit(0);
}

dropIndex();