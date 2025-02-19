import { Request, Response, NextFunction } from "express";
import Category from "../model/category";
import Subcategory from "../model/subcategory";

export const category: any = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { category } = req.body;

    const existingCategory = await Category.findOne({ category });

    if (existingCategory) {
      return res.json({
        success: false,
        message: "Category with the same name already exists.",
      });
    }

    const addCategory = new Category({
      category,
    });
    const create = await addCategory.save();
    if (create) {
      res.json({ success: true, message: "Category created successfully." });
    } else {
      res.json({ success: false, message: "something went wrong" });
    }
  } catch (err) {}
};

export const subCategory: any = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { category, subcategory } = req.body;

    const addSubCategory = new Subcategory({
      category,
      subcategory,
    });
    const create = await addSubCategory.save();
    if (create) {
      res.json({ success: true, message: "SubCategory created successfully." });
    } else {
      res.json({ success: false, message: "something went wrong" });
    }
  } catch (err) {}
};

export const getCategories: any = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const existingCategory = await Category.find();
    return res.json({ success: true, data: existingCategory, status: 200 });
  } catch (err) {
    console.log("err", err);
  }
};

export const getSubCategories: any = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const existingCategory = await Subcategory.find();
    return res.json({ success: true, data: existingCategory, status: 200 });
  } catch (err) {
    console.log("err", err);
  }
};
