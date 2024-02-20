import { Request, Response, NextFunction } from "express";
import Product from "../model/product";
import path from "path";
import fs from "fs"
import User from "../model/user";


export const addProduct: any = async (req: Request,
    res: Response,
    next: NextFunction) => {
    const { productname, category, subcategory, price, color, quantity, description } = req.body;

    if (!productname || !category || !subcategory || !price || !color || !quantity || !description) {
        res.json({ success: false, message: "Something is Empty" });
    } else {
        try {
            const addproduct = new Product({
                productname, category, subcategory, img: req?.file?.filename, price, color, quantity, description
            });
            const create = await addproduct.save();
            if (create) {
                res.json({ success: true, message: "Product add successfully." });
            } else {
                res.json({ success: false, message: "something went wrong" });
            }
        }
        catch (err) {

        }
    }
}

export const deleteProduct: any = async (req: Request,
    res: Response,
    next: NextFunction) => {
    const { id } = req.params;
    const data = await Product.findByIdAndDelete({ _id: id })
    if (data) {
        return res.json({
            success: true,
            message: "product deleted successfully",
        });
    }
}

export const updateProduct: any = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    const { id } = req.params;
    const { productname, category, subcategory, price, color, quantity, description } = req.body;
    const Post = await Product.findOne({ _id: id });
    const filename = Post?.img.substring(Post.img.lastIndexOf("/") + 1)
    const filePath = path.join("/src/Upload/Products/" + filename);

    const data = await Product.findByIdAndUpdate({ _id: id, productname, category, subcategory, img: req?.file?.filename, price, color, quantity, description }, { new: true })

    if (data) {
        fs.unlinkSync(filePath)
    }
    return res.json({
        success: true,
        data: data,
        message: "Product Updated successfully",
    });
}

export const getProducts: any = async (req: Request,
    res: Response,
    next: NextFunction) => {
    const data = await Product.find();
    if (data) {
        return res.json({
            success: true,
            data: data,
        })
    } else {
        return res.json({
            success: false,
            message: "no product found!"
        })

    }
}