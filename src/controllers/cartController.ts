import { Request, Response, NextFunction } from "express";
import Product from "../model/product";
import cart from "../model/cart";

export const addCart: any = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { productId, quantity } = req.body;
    // Check if the product is already in the cart
    let cartItem = await cart.findOne({ productId });
    const product: any = await Product.findById(productId);

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
    } else {
      cartItem = new cart({
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
  } catch (error) {
    return res.status(500).json({ message: "Internal Server Error" });
  }
};

export const deleteCart: any = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { id } = req.params;

    // Check if the cart item exists
    const cartItem = await cart.findById(id);

    if (!cartItem) {
      return res.status(404).json({ message: "Cart item not found" });
    }

    const { productId, quantity } = cartItem;

    // Update the product quantity
    const product = await Product.findById(productId);

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
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Internal Server Error" });
  }
};

export const getCart: any = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    // Retrieve all cart items and populate the product details
    const cartItems = await cart.find().populate("productId");

    return res.json({ success: true, status: 200, data: cartItems });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Internal Server Error" });
  }
};

export const updateCart: any = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { cartItemId, quantity } = req.body;

    // Check if the cart item exists
    let cartItem = await cart.findById(cartItemId);
    if (!cartItem) {
      return res
        .status(404)
        .json({ status: 404, message: "Cart item not found." });
    }

    // Check if the product exists
    const product = await Product.findById(cartItem.productId);
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
  } catch (error) {
    return res.status(500).json({ message: "Internal Server Error" });
  }
};
