import mongoose, { Document, Schema, Types } from "mongoose";

export interface Review extends Document {
  _id?: Types.ObjectId;
  userId: Types.ObjectId;
  rating: number;
  comment: string;
  createdAt: Date;
}

const reviewSchema: Schema = new mongoose.Schema(
  {
    _id: { type: mongoose.Schema.Types.ObjectId, auto: true },
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    rating: { type: Number, required: true, min: 1, max: 5 },
    comment: { type: String, required: true },
  },
  { timestamps: true }
);

export default reviewSchema;
