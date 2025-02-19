import mongoose from "mongoose";

const orderSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  items: [
    {
      productId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Product",
        required: true,
      },
      quantity: { type: Number, required: true },
      price: { type: Number, required: true },
    },
  ],
  totalAmount: { type: Number, required: true },
  paymentInfo: {
    orderId: { type: String, required: true },
    paymentId: { type: String },
    signature: { type: String },
    status: {
      type: String,
      enum: ["Pending", "Paid", "Failed"],
      default: "Pending",
    },
  },
  orderStatus: {
    type: String,
    enum: ["Processing", "Shipped", "Delivered", "Cancelled"],
    default: "Processing",
  },
  shippingAddress: { type: String, required: true },
  createdAt: { type: Date, default: Date.now },
});

const Order = mongoose.model("Order", orderSchema);

export default Order;
