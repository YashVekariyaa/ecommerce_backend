import mongoose, { Schema, Document, Types } from "mongoose";

export interface IAdmin extends Document {
  _id: Types.ObjectId;
  name: string;
  mobile: number;
  email: string;
  password: string;
  profile_Image: string;
}

const adminSchema: Schema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: false,
    },
    mobile: {
      type: Number,
      required: false,
    },
    email: {
      type: String,
      required: false,
    },
    password: {
      type: String,
      required: false,
    },
    profile_Image: {
      type: String,
      required: false,
    },
  },
  { timestamps: true,collection:"admin" }
);

const Admin = mongoose.model<IAdmin>("Admin", adminSchema);

export default Admin;
