"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.subCategorySchema = exports.categorySchema = void 0;
const joi_1 = __importDefault(require("joi"));
exports.categorySchema = joi_1.default.object({
    category: joi_1.default.string()
        .trim()
        .min(2)
        .max(20)
        .required()
        .messages({
        "string.base": "Category must be a string.",
        "string.empty": "Category cannot be empty.",
        "string.min": "Category must be at least {#limit} characters long.",
        "any.required": "Category is required."
    }),
});
exports.subCategorySchema = joi_1.default.object({
    category: joi_1.default.string()
        .trim()
        .min(2)
        .max(20)
        .required()
        .messages({
        "string.base": "Category must be a string.",
        "string.empty": "Category cannot be empty.",
        "string.min": "Category must be at least {#limit} characters long.",
        "any.required": "Category is required."
    }),
    subcategory: joi_1.default.string()
        .trim()
        .min(2)
        .max(20)
        .required()
        .messages({
        "string.base": "SubCategory must be a string.",
        "string.empty": "SubCategory cannot be empty.",
        "string.min": "SubCategory must be at least {#limit} characters long.",
        "any.required": "SubCategory is required."
    }),
});
