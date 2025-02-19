import { Request, Response, NextFunction } from "express";
import wishlist from "../model/wishlist";
import Product from "../model/product";

export const addWishlist: any = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { productId } = req.body;
    // Check if the product is already in the cart
    let wishItem = await wishlist.findOne({ productId });

    if (wishItem) {
      return res.json({
        success: true,
        status: 200,
        message: "Item alredy exists in Wishliist!",
      });
    } else {
      wishItem = new wishlist({
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
  } catch (error) {
    return res.status(500).json({ message: "Internal Server Error" });
  }
};

export const getWishlist: any = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    // Retrieve all cart items and populate the product details
    const wishItems = await wishlist.find().populate("productId");

    return res.json({ success: true, status: 200, data: wishItems });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Internal Server Error" });
  }
};

export const deleteWishlist: any = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { id } = req.params;

    // Check if the cart item exists
    const wishItem = await wishlist.findById(id);

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
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Internal Server Error" });
  }
};
