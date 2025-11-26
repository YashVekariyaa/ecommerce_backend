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
const subCategory = async (req, res, next) => {
    try {
        const { category, subcategory } = req.body;
        const addSubCategory = new subcategory_1.default({
            category,
            subcategory,
        });
        const create = await addSubCategory.save();
        if (create) {
            res.json({ success: true, message: "SubCategory created successfully." });
        }
        else {
            res.json({ success: false, message: "something went wrong" });
        }
    }
    catch (err) { }
};
exports.subCategory = subCategory;
const getCategories = async (req, res, next) => {
    try {
        const existingCategory = await category_1.default.find();
        return res.json({ success: true, data: existingCategory, status: 200 });
    }
    catch (err) {
        console.log("err", err);
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
