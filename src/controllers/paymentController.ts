import { Request, Response, NextFunction } from "express";
import Razorpay from "razorpay";
import crypto from "crypto";
import Product from "../model/product";
import Order from "../model/order";

const razorpay = new Razorpay({
  key_id: "rzp_test_bQ0uziKKUphI6R",
  key_secret: "MWSRrp0RPg7dtfuha1RsbXKS",
});

export const createPayment: any = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { totalPrice } = req.body;

    // Create Razorpay order
    const options = {
      amount: totalPrice * 100, // Convert to paise
      currency: "INR",
      receipt: crypto.randomBytes(10).toString("hex"),
    };

    const order = await razorpay.orders.create(options);

    res.json({ success: true, order });
  } catch (error) {
    res.status(500).json({ message: "Error creating payment order", error });
  }
};

export const verifyPaymentAndCreateOrder = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const {
      razorpay_order_id,
      razorpay_payment_id,
      razorpay_signature,
      userId,
      items,
      totalPrice,
    } = req.body;

    // **Verify payment signature**
    const sign = razorpay_order_id + "|" + razorpay_payment_id;
    const expectedSign = crypto
      .createHmac("sha256", process.env.KEY_SECRET || "")
      .update(sign.toString())
      .digest("hex");

    if (razorpay_signature !== expectedSign) {
      return res.status(400).json({ message: "Invalid payment signature" });
    }

    // ✅ **Step 3: Deduct Stock After Payment Success**
    for (const item of items) {
      const product = await Product.findById(item.productId);
      if (!product)
        return res.status(404).json({ message: "Product not found" });

      if (product.quantity < item.quantity) {
        return res
          .status(400)
          .json({ message: `Not enough stock for ${product.productname}` });
      }

      await Product.findByIdAndUpdate(item.productId, {
        $inc: { quantity: -item.quantity },
      });
    }

    // ✅ **Step 4: Create Order in Database**
    const newOrder = await Order.create({
      user: userId,
      items: items.map((item: any) => ({
        product: item.productId,
        quantity: item.quantity,
        price: item.price,
      })),
      totalAmount: totalPrice,
      paymentStatus: "Paid",
      paymentId: razorpay_payment_id,
      orderStatus: "Processing",
    });

    res
      .status(201)
      .json({ message: "Payment verified & Order placed", order: newOrder });
  } catch (error) {
    res.status(500).json({ message: "Error verifying payment", error });
  }
};
