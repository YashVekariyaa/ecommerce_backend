"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.verifyPaymentAndCreateOrder = exports.createPayment = void 0;
const razorpay_1 = __importDefault(require("razorpay"));
const crypto_1 = __importDefault(require("crypto"));
const product_1 = __importDefault(require("../model/product"));
const order_1 = __importDefault(require("../model/order"));
const razorpay = new razorpay_1.default({
    key_id: "rzp_test_bQ0uziKKUphI6R",
    key_secret: "MWSRrp0RPg7dtfuha1RsbXKS",
});
const createPayment = async (req, res, next) => {
    try {
        const { totalPrice } = req.body;
        // Create Razorpay order
        const options = {
            amount: totalPrice * 100, // Convert to paise
            currency: "INR",
            receipt: crypto_1.default.randomBytes(10).toString("hex"),
        };
        const order = await razorpay.orders.create(options);
        res.json({ success: true, order });
    }
    catch (error) {
        res.status(500).json({ message: "Error creating payment order", error });
    }
};
exports.createPayment = createPayment;
const verifyPaymentAndCreateOrder = async (req, res, next) => {
    try {
        const { razorpay_order_id, razorpay_payment_id, razorpay_signature, userId, items, totalPrice, } = req.body;
        // **Verify payment signature**
        const sign = razorpay_order_id + "|" + razorpay_payment_id;
        const expectedSign = crypto_1.default
            .createHmac("sha256", process.env.KEY_SECRET || "")
            .update(sign.toString())
            .digest("hex");
        if (razorpay_signature !== expectedSign) {
            return res.status(400).json({ message: "Invalid payment signature" });
        }
        // ✅ **Step 3: Deduct Stock After Payment Success**
        for (const item of items) {
            const product = await product_1.default.findById(item.productId);
            if (!product)
                return res.status(404).json({ message: "Product not found" });
            if (product.quantity < item.quantity) {
                return res
                    .status(400)
                    .json({ message: `Not enough stock for ${product.productname}` });
            }
            await product_1.default.findByIdAndUpdate(item.productId, {
                $inc: { quantity: -item.quantity },
            });
        }
        // ✅ **Step 4: Create Order in Database**
        const newOrder = await order_1.default.create({
            user: userId,
            items: items.map((item) => ({
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
    }
    catch (error) {
        res.status(500).json({ message: "Error verifying payment", error });
    }
};
exports.verifyPaymentAndCreateOrder = verifyPaymentAndCreateOrder;
