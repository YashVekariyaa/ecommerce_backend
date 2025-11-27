import Joi from "joi";

export const categorySchema = Joi.object({
    category: Joi.string()
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
})

export const subCategorySchema = Joi.object({
    category: Joi.string()
        .trim()
        .min(2)
        .max(24)
        .required()
        .messages({
            "string.base": "Category must be a string.",
            "string.empty": "Category cannot be empty.",
            "string.min": "Category must be at least {#limit} characters long.",
            "any.required": "Category is required."
        }),
    subcategory: Joi.string()
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
})

