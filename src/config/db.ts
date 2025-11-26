import e from "express";
import mongoose, { connect } from "mongoose";

async function connects() {
  try {
    await mongoose.connect(process.env.MONGO_URL as string, {});
    console.log("Database connected successfully");
  } catch (error) {
    console.error("Error connecting to the database:", error);
  }
}

export default connects;
