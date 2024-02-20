import mongoose, { Schema, Document, Types } from "mongoose";


export interface Category extends Document {
    _id: Types.ObjectId;
    category: string;
}

const categorySchema: Schema = new mongoose.Schema(
  {
    category: {
      type: String,
      required: true,
    }
  },
  { timestamps: true,collection:"category" }
);

const Category = mongoose.model<Category>("Category", categorySchema);

export default Category;


