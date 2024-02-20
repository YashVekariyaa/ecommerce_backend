import { Request, Response, NextFunction } from "express";
import Product from "../model/product";
import cart from "../model/cart";

export const addCart: any = async (req: Request,
  res: Response,
  next: NextFunction) => {

  try {

    const { productId, quantity } = req.body;
    // Check if the product is already in the cart
    let cartItem = await cart.findOne({ productId });

    if (cartItem) {
      // If it's in the cart, update the cart item's quantity
      cartItem.quantity += quantity;
      await cartItem.save();
    } else {
      cartItem = new cart({
        productId, quantity
      });
    }

    const cartadd = await cartItem.save();

    // Update the product quantity
    const product = await Product.findById(productId);

    if (product) {
      product.quantity -= quantity; // Decrement the product quantity
      await product.save();
    }

    res.json({ success: true, status: 200, message: "cart add successfully." });


  } catch (error) {
    res.status(500).json({ message: 'Internal Server Error' });
  }

}

export const deleteCart: any = async (req: Request,
  res: Response,
  next: NextFunction) => {

  try {
    const { id } = req.params;

    // Check if the cart item exists
    const cartItem = await cart.findById(id);

    if (!cartItem) {
      return res.status(404).json({ message: 'Cart item not found' });
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

    res.json({ success: true, status: 200, message: 'Cart item deleted successfully.' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
};


export const getCart: any = async (req: Request,
  res: Response,
  next: NextFunction) => {
  try {
    // Retrieve all cart items and populate the product details
    const cartItems = await cart.find().populate("productId");

    res.json({ success: true, status: 200, data: cartItems });

  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
}