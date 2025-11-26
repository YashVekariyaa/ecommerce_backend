"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateOrderStatus = exports.cancelOrder = exports.getOrderDetails = exports.getUserOrders = exports.placeOrder = void 0;
const order_1 = __importDefault(require("../model/order"));
const product_1 = __importDefault(require("../model/product"));
// Place Order
const placeOrder = async (req, res, next) => {
    try {
        const { items, totalAmount, shippingAddress } = req.body;
        const userId = req.user._id;
        if (!items || items.length === 0) {
            return res.status(400).json({ message: "Cart is empty!" });
        }
        // Check stock availability
        for (const item of items) {
            const product = await product_1.default.findById(item.productId);
            if (!product) {
                return res.status(404).json({ message: `Product with ID ${item.productId} not found` });
            }
            if (item.quantity > product.quantity) {
                return res.status(400).json({
                    message: `Insufficient stock for ${product.productname}. Available: ${product.quantity}, Requested: ${item.quantity}`
                });
            }
        }
        // Convert productId to product ObjectId reference
        const formattedItems = items.map((item) => ({
            productId: item.productId,
            quantity: item.quantity,
            price: item.price
        }));
        const order = new order_1.default({
            user: userId,
            items: formattedItems,
            totalAmount,
            shippingAddress,
            paymentStatus: "Pending",
            orderStatus: "Processing",
        });
        await order.save();
        // Deduct stock after order confirmation
        for (const item of items) {
            const product = await product_1.default.findById(item.productId);
            // Check stock again before updating
            if (!product || item.quantity > product.quantity) {
                return res.status(400).json({
                    message: `Stock changed for ${product?.productname || 'Product'}. Available: ${product?.quantity || 0}, Requested: ${item.quantity}`
                });
            }
            await product_1.default.findByIdAndUpdate(item.productId, {
                $inc: { quantity: -item.quantity }
            });
        }
        return res.status(201).json({ success: true, message: "Order placed successfully!", order });
    }
    catch (error) {
        return res.status(500).json({ message: "Error placing order", error });
    }
};
exports.placeOrder = placeOrder;
// Get User Orders
const getUserOrders = async (req, res, next) => {
    try {
        const orders = await order_1.default.find({ user: req.user._id }).populate("items.productId");
        return res.json({ success: true, orders });
    }
    catch (error) {
        return res.status(500).json({ message: "Error fetching orders", error });
    }
};
exports.getUserOrders = getUserOrders;
// Get Order Details
const getOrderDetails = async (req, res, next) => {
    try {
        const order = await order_1.default.findById(req.params.id).populate("items.productId");
        if (!order)
            return res.status(404).json({ message: "Order not found" });
        return res.json({ success: true, order });
    }
    catch (error) {
        return res.status(500).json({ message: "Error fetching order", error });
    }
};
exports.getOrderDetails = getOrderDetails;
// Cancel Order (Only if Processing)
const cancelOrder = async (req, res, next) => {
    try {
        const { id } = req.params;
        const userId = req.user._id; // Get user from token
        // Find order
        const order = await order_1.default.findById(id);
        if (!order) {
            return res.status(404).json({ message: "Order not found" });
        }
        // Ensure the order belongs to the user or is an admin action
        if (order.user.toString() !== userId) {
            return res.status(403).json({ message: "Not authorized to cancel this order" });
        }
        // Prevent cancellation if already delivered or cancelled
        if (order.orderStatus === "Cancelled") {
            return res.status(400).json({ message: "Order is already cancelled" });
        }
        if (order.orderStatus === "Delivered") {
            return res.status(400).json({ message: "Cannot cancel a delivered order" });
        }
        // **Update order status**
        order.orderStatus = "Cancelled";
        await order.save();
        // **Restore stock (Increase quantity)**
        for (const item of order.items) {
            await product_1.default.findByIdAndUpdate(item.productId, {
                $inc: { stock: item.quantity } // Add quantity back to stock
            });
        }
        res.status(200).json({ success: true, message: "Order cancelled successfully" });
    }
    catch (error) {
        res.status(500).json({ message: "Error cancelling order", error });
    }
};
exports.cancelOrder = cancelOrder;
// Update Order Status(Admin Only)
const updateOrderStatus = async (req, res, next) => {
    try {
        const { orderStatus } = req.body;
        const order = await order_1.default.findById(req.params.id);
        if (!order)
            return res.status(404).json({ message: "Order not found" });
        order.orderStatus = orderStatus;
        await order.save();
        return res.status(200).json({ success: true, message: "Order status updated!", order });
    }
    catch (error) {
        return res.status(500).json({ message: "Error updating order status", error });
    }
};
exports.updateOrderStatus = updateOrderStatus;
