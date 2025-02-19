import Joi from "joi";

export const productSchema = Joi.object({
    productname: Joi.string()
        .min(2)
        .max(100)
        .required()
        .messages({
            "string.base": "Product name must be a string.",
            "string.empty": "Product name is required.",
            "string.min": "Product name must have at least {#limit} characters.",
            "any.required": "Product name is required."
        }),
    category: Joi.string()
        .min(2)
        .max(50)
        .required()
        .messages({
            "string.base": "Category must be a string.",
            "string.empty": "Category is required.",
            "string.min": "Category must have at least {#limit} characters.",
            "any.required": "Category is required."
        }),
    subcategory: Joi.string()
        .min(2)
        .max(50)
        .required()
        .messages({
            "string.base": "Subcategory must be a string.",
            "string.empty": "Subcategory is required.",
            "string.min": "Subcategory must have at least {#limit} characters.",
            "any.required": "Subcategory is required."
        }),
    price: Joi.number()
        .positive()
        .required()
        .messages({
            "number.base": "Price must be a number.",
            "number.positive": "Price must be a positive number.",
            "any.required": "Price is required."
        }),
    color: Joi.string()
        .required()
        .messages({
            "string.base": "Color must be a string.",
            "string.empty": "Color is required.",
            "any.required": "Color is required."
        }),
    quantity: Joi.number()
        .integer()
        .min(0)
        .required()
        .messages({
            "number.base": "Quantity must be a number.",
            "number.integer": "Quantity must be an integer.",
            "number.min": "Quantity cannot be negative.",
            "any.required": "Quantity is required."
        }),
    description: Joi.string()
        .min(10)
        .max(1000)
        .required()
        .messages({
            "string.base": "Description must be a string.",
            "string.empty": "Description is required.",
            "string.min": "Description must be at least {#limit} characters long.",
            "string.max": "Description must be less than or equal to {#limit} characters long.",
            "any.required": "Description is required."
        })
});

export const cartSchema = Joi.object({
    productId: Joi.string()
        .required()
        .messages({
            "string.base": "Product ID must be a string.",
            "string.empty": "Product ID cannot be empty.",
            "any.required": "Product ID is required."
        }),
    quantity: Joi.number()
        .integer()
        .min(1)
        .required()
        .messages({
            "number.base": "Quantity must be a number.",
            "number.integer": "Quantity must be an integer.",
            "number.min": "Quantity must be at least 1.",
            "any.required": "Quantity is required."
        }),
});

export const wishlistSchema = Joi.object({
    productId: Joi.string()
        .required()
        .messages({
            "string.base": "Product ID must be a string.",
            "string.empty": "Product ID cannot be empty.",
            "any.required": "Product ID is required."
        }),
});

export const reviewSchema = Joi.object({
    rating: Joi.number()
        .integer()
        .min(1)
        .required()
        .messages({
            "number.base": "Rating must be a number.",
            "number.integer": "Rating must be an integer.",
            "number.min": "Rating must be at least 1.",
            "any.required": "Rating is required."
        }),
    comment: Joi.string()
        .required()
        .messages({
            "string.base": "Comment must be a string.",
            "string.empty": "Comment cannot be empty.",
            "any.required": "Comment is required."
        }),
});