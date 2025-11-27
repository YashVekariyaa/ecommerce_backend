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

export const subCategory = async (req: Request, res: Response) => {
  try {
    const { category, subcategory } = req.body;

    if (!category || !subcategory) {
      return res.json({
        success: false,
        message: "Category ID and subcategory are required.",
      });
    }

    const addSubCategory = new Subcategory({
      category,
      subcategory,
    });

    await addSubCategory.save();

    res.json({
      success: true,
      message: "SubCategory created successfully.",
    });
  } catch (err) {
    console.log(err);
    res.status(500).json({
      success: false,
      message: "Internal server error.",
    });
  }
};

export const getCategories = async (req: Request, res: Response) => {
  try {
    const categories = await Category.aggregate([
      {
        $lookup: {
          from: "subcategory", // collection name
          localField: "_id",
          foreignField: "category",
          as: "subcategories",
        },
      },
      {
        $project: {
          _id: 1,
          category: 1,
          subcategories: {
            _id: 1,
            subcategory: 1,
            category: 1,
          },
        },
      },
    ]);

    return res.json({ success: true, data: categories });
  } catch (err) {
    console.log(err);
    return res.status(500).json({ success: false, message: "Server error" });
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
