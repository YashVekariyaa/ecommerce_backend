import mongoose, { Schema, Document, Types } from "mongoose";

export interface ContactUs extends Document {
  _id: Types.ObjectId;
  name: string;
  mobile: number;
  email: string;
  message: string;
}

const contactSchema: Schema = new mongoose.Schema(
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
    message: {
      type: String,
      required: false,
    }
  },
  { timestamps: true,collection:"contactus" }
);

const Contact = mongoose.model<ContactUs>("Contact", contactSchema);

export default Contact;
