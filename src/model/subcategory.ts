import mongoose, { Schema, Document, Types } from "mongoose";

export interface SubCategory extends Document {
  _id: Types.ObjectId;
  category: string;
  subcategory: string;
}

const subCategorySchema: Schema = new mongoose.Schema(
  {
    category: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Category",
      required: true,
    },
    subcategory: {
      type: String,
      required: true,
    },
  },
  { timestamps: true, collection: "subcategory" }
);

const Subcategory = mongoose.model<SubCategory>(
  "Subcategory",
  subCategorySchema
);

export default Subcategory;
