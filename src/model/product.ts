import mongoose, { Schema, Document, Types } from "mongoose";
import Review from "./review";
import reviewSchema from "./review";

export interface Products extends Document {
  _id: Types.ObjectId;
  productname: string;
  category: string;
  subcategory: string;
  img: string;
  galleryimg: string[];
  price: number;
  color: string;
  quantity: number;
  description: string;
  averageRating: number;
  reviews: {
    _id?: Types.ObjectId;
    userId: Types.ObjectId;
    rating: number;
    comment: string;
    createdAt: Date;
  }[];
}

const productSchema: Schema = new mongoose.Schema(
  {
    productname: {
      type: String,
      required: false,
    },
    category: {
      type: String,
      required: false,
    },
    subcategory: {
      type: String,
      required: false,
    },
    img: {
      type: String,
      required: false,
    },
    galleryimg: {
      type: [String],
      required: false,
    },
    price: {
      type: Number,
      required: false,
    },
    color: {
      type: String,
      required: false,
    },
    quantity: {
      type: Number,
      required: false,
    },
    description: {
      type: String,
      required: false,
    },
    averageRating: {
      type: Number,
      default: 0,
    },
    reviews: [reviewSchema],
  },
  { timestamps: true, collection: "product" }
);

const Product = mongoose.model<Products>("Product", productSchema);

export default Product;
