import Joi from "joi";

export const orderSchema = Joi.object({
    items: Joi.array()
        .items(
            Joi.object({
                productId: Joi.string()
                    .required()
                    .messages({
                        "string.base": "Product ID must be a string.",
                        "any.required": "Product ID is required.",
                    }),
                quantity: Joi.number()
                    .integer()
                    .min(1)
                    .required()
                    .messages({
                        "number.base": "Quantity must be a number.",
                        "number.integer": "Quantity must be an integer.",
                        "number.min": "Quantity must be at least 1.",
                        "any.required": "Quantity is required.",
                    }),
                price: Joi.number()
                    .integer()
                    .min(1)
                    .required()
                    .messages({
                        "number.base": "Price must be a number.",
                        "number.integer": "Price must be an integer.",
                        "number.min": "Price must be at least 1.",
                        "any.required": "Price is required."
                    })
            })
        )
        .min(1)
        .required()
        .messages({
            "array.base": "Items must be an array.",
            "array.min": "At least one item is required.",
            "any.required": "Items is required.",
        }),
    totalAmount: Joi.number()
        .positive()
        .required()
        .messages({
            "number.base": "Total amount must be a number.",
            "number.positive": "Total amount must be positive.",
            "any.required": "Total amount is required.",
        }),
    shippingAddress: Joi.string()
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

export const orderStatusSchema = Joi.object({
    orderStatus: Joi.string()
        .valid("Processing", "Shipped", "Delivered", "Cancelled")
        .required()
        .messages({
            "any.only": "Order status is not valid.",
            "string.base": "Order status must be a string.",
            "any.required": "Order status is required."
        }),
});

export const paymentSchema = Joi.object({
    totalPrice: Joi.number()
        .positive()
        .required()
        .messages({
            "number.base": "Total price must be a number.",
            "number.positive": "Total price must be a positive number.",
            "any.required": "Total price is required."
        })
})

export const paymentVerifySchema = Joi.object({
    razorpay_order_id: Joi.string()
        .required()
        .messages({
            "string.base": "Razorpay order id must be a string.",
            "any.required": "Razorpay order id is required."
        }),
    razorpay_payment_id: Joi.string()
        .required()
        .messages({
            "string.base": "Razorpay payment id must be a string.",
            "any.required": "Razorpay payment id is required."
        }),
    razorpay_signature: Joi.string()
        .required()
        .messages({
            "string.base": "Razorpay signature must be a string.",
            "any.required": "Razorpay signature is required."
        }),
    userId: Joi.string()
        .required()
        .messages({
            "string.base": "User ID must be a string.",
            "any.required": "User ID is required."
        }),
    items: Joi.array()
        .items(
            Joi.object({
                productId: Joi.string()
                    .required()
                    .messages({
                        "string.base": "Product ID must be a string.",
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
                price: Joi.number()
                    .integer()
                    .min(1)
                    .required()
                    .messages({
                        "number.base": "Price must be a number.",
                        "number.integer": "Price must be an integer.",
                        "number.min": "Price must be at least 1.",
                        "any.required": "Price is required."
                    })
            })
        )
        .min(1)
        .required()
        .messages({
            "array.base": "Items must be an array.",
            "array.min": "At least one item is required.",
            "any.required": "Items are required."
        }),
    totalPrice: Joi.number()
        .positive()
        .required()
        .messages({
            "number.base": "Total price must be a number.",
            "number.positive": "Total price must be a positive number.",
            "any.required": "Total price is required."
        })
});