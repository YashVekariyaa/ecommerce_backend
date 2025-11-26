"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateCart = exports.getCart = exports.deleteCart = exports.addCart = void 0;
const product_1 = __importDefault(require("../model/product"));
const cart_1 = __importDefault(require("../model/cart"));
const addCart = async (req, res, next) => {
    try {
        const { productId, quantity } = req.body;
        // Check if the product is already in the cart
        let cartItem = await cart_1.default.findOne({ productId });
        const product = await product_1.default.findById(productId);
        if (!product) {
            return res.json({ status: 404, message: "product not found." });
        }
        if (quantity > product.quantity) {
            return res
                .status(400)
                .json({ status: 400, message: "Not enough stock available." });
        }
        if (cartItem) {
            // If it's in the cart, update the cart item's quantity
            if (cartItem.quantity + quantity > product.quantity) {
                return res
                    .status(400)
                    .json({
                    status: 400,
                    message: "Cart quantity cannot exceed available stock.",
                });
            }
            cartItem.quantity += quantity;
        }
        else {
            cartItem = new cart_1.default({
                productId,
                quantity,
            });
        }
        await cartItem.save();
        product.quantity -= quantity;
        await product.save();
        return res
            .status(200)
            .json({ success: true, status: 200, message: "cart add successfully." });
    }
    catch (error) {
        return res.status(500).json({ message: "Internal Server Error" });
    }
};
exports.addCart = addCart;
const deleteCart = async (req, res, next) => {
    try {
        const { id } = req.params;
        // Check if the cart item exists
        const cartItem = await cart_1.default.findById(id);
        if (!cartItem) {
            return res.status(404).json({ message: "Cart item not found" });
        }
        const { productId, quantity } = cartItem;
        // Update the product quantity
        const product = await product_1.default.findById(productId);
        if (product) {
            product.quantity += quantity; // Increment the product quantity
            await product.save();
        }
        // Remove the cart item
        await cartItem.deleteOne();
        return res.json({
            success: true,
            status: 200,
            message: "Cart item deleted successfully.",
        });
    }
    catch (error) {
        console.error(error);
        return res.status(500).json({ message: "Internal Server Error" });
    }
};
exports.deleteCart = deleteCart;
const getCart = async (req, res, next) => {
    try {
        // Retrieve all cart items and populate the product details
        const cartItems = await cart_1.default.find().populate("productId");
        return res.json({ success: true, status: 200, data: cartItems });
    }
    catch (error) {
        console.error(error);
        return res.status(500).json({ message: "Internal Server Error" });
    }
};
exports.getCart = getCart;
const updateCart = async (req, res, next) => {
    try {
        const { cartItemId, quantity } = req.body;
        // Check if the cart item exists
        let cartItem = await cart_1.default.findById(cartItemId);
        if (!cartItem) {
            return res
                .status(404)
                .json({ status: 404, message: "Cart item not found." });
        }
        // Check if the product exists
        const product = await product_1.default.findById(cartItem.productId);
        if (!product) {
            return res
                .status(404)
                .json({ status: 404, message: "Product not found." });
        }
        // Ensure the updated cart quantity does not exceed stock
        if (quantity > product.quantity) {
            return res
                .status(400)
                .json({ status: 400, message: "Not enough stock available." });
        }
        // Calculate the difference between old and new quantity
        const quantityDifference = quantity - cartItem.quantity;
        // If increasing quantity, check if enough stock is available
        if (quantityDifference > 0 && quantityDifference > product.quantity) {
            return res
                .status(400)
                .json({
                status: 400,
                message: "Cannot increase quantity beyond available stock.",
            });
        }
        // Update cart quantity
        cartItem.quantity = quantity;
        await cartItem.save();
        // Update product quantity
        product.quantity -= quantityDifference;
        await product.save();
        return res
            .status(200)
            .json({
            success: true,
            status: 200,
            message: "Cart updated successfully.",
        });
    }
    catch (error) {
        return res.status(500).json({ message: "Internal Server Error" });
    }
};
exports.updateCart = updateCart;
