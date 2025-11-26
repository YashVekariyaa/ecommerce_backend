"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.paymentVerifySchema = exports.paymentSchema = exports.orderStatusSchema = exports.orderSchema = void 0;
const joi_1 = __importDefault(require("joi"));
exports.orderSchema = joi_1.default.object({
    items: joi_1.default.array()
        .items(joi_1.default.object({
        productId: joi_1.default.string()
            .required()
            .messages({
            "string.base": "Product ID must be a string.",
            "any.required": "Product ID is required.",
        }),
        quantity: joi_1.default.number()
            .integer()
            .min(1)
            .required()
            .messages({
            "number.base": "Quantity must be a number.",
            "number.integer": "Quantity must be an integer.",
            "number.min": "Quantity must be at least 1.",
            "any.required": "Quantity is required.",
        }),
        price: joi_1.default.number()
            .integer()
            .min(1)
            .required()
            .messages({
            "number.base": "Price must be a number.",
            "number.integer": "Price must be an integer.",
            "number.min": "Price must be at least 1.",
            "any.required": "Price is required."
        })
    }))
        .min(1)
        .required()
        .messages({
        "array.base": "Items must be an array.",
        "array.min": "At least one item is required.",
        "any.required": "Items is required.",
    }),
    totalAmount: joi_1.default.number()
        .positive()
        .required()
        .messages({
        "number.base": "Total amount must be a number.",
        "number.positive": "Total amount must be positive.",
        "any.required": "Total amount is required.",
    }),
    shippingAddress: joi_1.default.string()
        .min(10)
        .max(500)
        .required()
        .messages({
        "string.base": "Shipping address must be a string.",
        "string.empty": "Shipping address cannot be empty.",
        "string.min": "Shipping address must be at least {#limit} characters long.",
        "string.max": "Shipping address must be at most {#limit} characters long.",
        "any.required": "Shipping address is required.",
    }),
});
exports.orderStatusSchema = joi_1.default.object({
    orderStatus: joi_1.default.string()
        .valid("Processing", "Shipped", "Delivered", "Cancelled")
        .required()
        .messages({
        "any.only": "Order status is not valid.",
        "string.base": "Order status must be a string.",
        "any.required": "Order status is required."
    }),
});
exports.paymentSchema = joi_1.default.object({
    totalPrice: joi_1.default.number()
        .positive()
        .required()
        .messages({
        "number.base": "Total price must be a number.",
        "number.positive": "Total price must be a positive number.",
        "any.required": "Total price is required."
    })
});
exports.paymentVerifySchema = joi_1.default.object({
    razorpay_order_id: joi_1.default.string()
        .required()
        .messages({
        "string.base": "Razorpay order id must be a string.",
        "any.required": "Razorpay order id is required."
    }),
    razorpay_payment_id: joi_1.default.string()
        .required()
        .messages({
        "string.base": "Razorpay payment id must be a string.",
        "any.required": "Razorpay payment id is required."
    }),
    razorpay_signature: joi_1.default.string()
        .required()
        .messages({
        "string.base": "Razorpay signature must be a string.",
        "any.required": "Razorpay signature is required."
    }),
    userId: joi_1.default.string()
        .required()
        .messages({
        "string.base": "User ID must be a string.",
        "any.required": "User ID is required."
    }),
    items: joi_1.default.array()
        .items(joi_1.default.object({
        productId: joi_1.default.string()
            .required()
            .messages({
            "string.base": "Product ID must be a string.",
            "any.required": "Product ID is required."
        }),
        quantity: joi_1.default.number()
            .integer()
            .min(1)
            .required()
            .messages({
            "number.base": "Quantity must be a number.",
            "number.integer": "Quantity must be an integer.",
            "number.min": "Quantity must be at least 1.",
            "any.required": "Quantity is required."
        }),
        price: joi_1.default.number()
            .integer()
            .min(1)
            .required()
            .messages({
            "number.base": "Price must be a number.",
            "number.integer": "Price must be an integer.",
            "number.min": "Price must be at least 1.",
            "any.required": "Price is required."
        })
    }))
        .min(1)
        .required()
        .messages({
        "array.base": "Items must be an array.",
        "array.min": "At least one item is required.",
        "any.required": "Items are required."
    }),
    totalPrice: joi_1.default.number()
        .positive()
        .required()
        .messages({
        "number.base": "Total price must be a number.",
        "number.positive": "Total price must be a positive number.",
        "any.required": "Total price is required."
    })
});
