import mongoose, { connect } from "mongoose";

async function connects() {
  try {
    await mongoose.connect("mongodb://127.0.0.1/ecom-ts", {
    });
    console.log("Database connected successfully");
  } catch (error) {
    console.error("Error connecting to the database:", error);
  }
}

export default connects;
