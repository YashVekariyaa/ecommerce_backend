import { Request, Response, NextFunction } from "express";
import Product from "../model/product";
import path from "path";
import fs from "fs";
import User from "../model/user";
import dotenv from "dotenv";
dotenv.config();

export const addProduct: any = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const {
    productname,
    category,
    subcategory,
    price,
    color,
    quantity,
    description,
  } = req.body;

  if (
    !productname ||
    !category ||
    !subcategory ||
    !price ||
    !color ||
    !quantity ||
    !description
  ) {
    res.json({ success: false, message: "Something is Empty" });
  } else {
    try {
      const addproduct = new Product({
        productname,
        category,
        subcategory,
        img: req?.file?.filename,
        price,
        color,
        quantity,
        description,
        galleryimg: req.files,
      });
      console.log("files", req.files);
      const create = await addproduct.save();
      if (create) {
        res.json({ success: true, message: "Product add successfully." });
      } else {
        res.json({ success: false, message: "something went wrong" });
      }
    } catch (err) {}
  }
};

export const deleteProduct: any = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { id } = req.params;
  const data = await Product.findByIdAndDelete({ _id: id });
  if (data) {
    return res.json({
      success: true,
      message: "product deleted successfully",
    });
  }
};

export const updateProduct: any = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { id } = req.params;
  const {
    productname,
    category,
    subcategory,
    price,
    color,
    quantity,
    description,
  } = req.body;
  const product: any = await Product.findOne({ _id: id });

  let updateData: any = {
    productname,
    category,
    subcategory,
    price,
    color,
    quantity,
    description,
  };

  if (req.file) {
    const productImage = req.file.filename;
    updateData.img = productImage;

    if (product.img) {
      const oldImagePath = path.join("./src/Upload/Products", product.img);
      fs.unlink(oldImagePath, (error) => {
        if (error) {
          console.error("Error deleting old image:", error);
        }
      });
    }
  }

  const data = await Product.findByIdAndUpdate(
    {
      _id: id,
    },
    {
      $set: updateData,
    },
    { new: true }
  );

  return res.json({
    success: true,
    data: data,
    message: "Product Updated successfully",
  });
};

export const getProducts: any = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const data = await Product.find();
  if (data) {
    const formattedData = data?.map((product: any) => {
      const imageUrl = "http://localhost:4000/img/" + product.img;
      return {
        _id: product._id,
        productname: product.productname,
        category: product.category,
        subcategory: product.subcategory,
        price: product.price,
        color: product.color,
        quantity: product.quantity,
        description: product.description,
        createdAt: product.createdAt,
        updatedAt: product.updatedAt,
        img: imageUrl,
      };
    });
    return res.json({
      success: true,
      status: 200,
      data: formattedData,
    });
  } else {
    return res.json({
      success: false,
      message: "no product found!",
    });
  }
};
