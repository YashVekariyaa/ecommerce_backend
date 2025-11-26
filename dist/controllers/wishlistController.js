"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteWishlist = exports.getWishlist = exports.addWishlist = void 0;
const wishlist_1 = __importDefault(require("../model/wishlist"));
const addWishlist = async (req, res, next) => {
    try {
        const { productId } = req.body;
        // Check if the product is already in the cart
        let wishItem = await wishlist_1.default.findOne({ productId });
        if (wishItem) {
            return res.json({
                success: true,
                status: 200,
                message: "Item alredy exists in Wishliist!",
            });
        }
        else {
            wishItem = new wishlist_1.default({
                productId,
            });
        }
        const cartadd = await wishItem.save();
        if (cartadd) {
            return res.json({
                success: true,
                status: 200,
                message: "add wishlist successfully.",
            });
        }
    }
    catch (error) {
        return res.status(500).json({ message: "Internal Server Error" });
    }
};
exports.addWishlist = addWishlist;
const getWishlist = async (req, res, next) => {
    try {
        // Retrieve all cart items and populate the product details
        const wishItems = await wishlist_1.default.find().populate("productId");
        return res.json({ success: true, status: 200, data: wishItems });
    }
    catch (error) {
        console.error(error);
        return res.status(500).json({ message: "Internal Server Error" });
    }
};
exports.getWishlist = getWishlist;
const deleteWishlist = async (req, res, next) => {
    try {
        const { id } = req.params;
        // Check if the cart item exists
        const wishItem = await wishlist_1.default.findById(id);
        if (!wishItem) {
            return res.status(404).json({ message: "item not found" });
        }
        // Remove the cart item
        await wishItem.deleteOne();
        return res.json({
            success: true,
            status: 200,
            message: "Wishlist item deleted successfully.",
        });
    }
    catch (error) {
        console.error(error);
        return res.status(500).json({ message: "Internal Server Error" });
    }
};
exports.deleteWishlist = deleteWishlist;
