"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getSubCategories = exports.getCategories = exports.subCategory = exports.category = void 0;
const category_1 = __importDefault(require("../model/category"));
const subcategory_1 = __importDefault(require("../model/subcategory"));
const category = async (req, res, next) => {
    try {
        const { category } = req.body;
        const existingCategory = await category_1.default.findOne({ category });
        if (existingCategory) {
            return res.json({
                success: false,
                message: "Category with the same name already exists.",
            });
        }
        const addCategory = new category_1.default({
            category,
        });
        const create = await addCategory.save();
        if (create) {
            res.json({ success: true, message: "Category created successfully." });
        }
        else {
            res.json({ success: false, message: "something went wrong" });
        }
    }
    catch (err) { }
};
exports.category = category;
const subCategory = async (req, res) => {
    try {
        const { category, subcategory } = req.body;
        if (!category || !subcategory) {
            return res.json({
                success: false,
                message: "Category ID and subcategory are required.",
            });
        }
        const addSubCategory = new subcategory_1.default({
            category,
            subcategory,
        });
        await addSubCategory.save();
        res.json({
            success: true,
            message: "SubCategory created successfully.",
        });
    }
    catch (err) {
        console.log(err);
        res.status(500).json({
            success: false,
            message: "Internal server error.",
        });
    }
};
exports.subCategory = subCategory;
const getCategories = async (req, res) => {
    try {
        const categories = await category_1.default.aggregate([
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
    }
    catch (err) {
        console.log(err);
        return res.status(500).json({ success: false, message: "Server error" });
    }
};
exports.getCategories = getCategories;
const getSubCategories = async (req, res, next) => {
    try {
        const existingCategory = await subcategory_1.default.find();
        return res.json({ success: true, data: existingCategory, status: 200 });
    }
    catch (err) {
        console.log("err", err);
    }
};
exports.getSubCategories = getSubCategories;
