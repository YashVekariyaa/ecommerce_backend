import Joi from "joi";

export const registerSchema = Joi.object({
    firstname: Joi.string()
        .trim()
        .min(2)
        .max(20)
        .required()
        .messages({
            "string.base": "Firstname must be a string.",
            "string.empty": "Firstname cannot be empty.",
            "string.min": "Firstname must be at least {#limit} characters long.",
            "any.required": "Firstname is required."
        }),
    lastname: Joi.string()
        .trim()
        .min(2)
        .max(20)
        .required()
        .messages({
            "string.base": "Lastname must be a string.",
            "string.empty": "Lastname cannot be empty.",
            "string.min": "Lastname must be at least {#limit} characters long.",
            "any.required": "Lastname is required."
        }),
    mobile: Joi.number()
        .required()
        .messages({
            "number.base": "Mobile must be a number.",
            "any.required": "Mobile is required."
        }),
    email: Joi.string()
        .email({ tlds: { allow: false } })
        .required()
        .messages({
            "string.email": "Please provide a valid email address.",
            "any.required": "Email is required."
        }),
    password: Joi.string()
        .min(8)
        .required()
        .messages({
            "string.base": "Password must be a string.",
            "string.min": "Password must be at least {#limit} characters long.",
            "any.required": "Password is required."
        })
});

export const loginSchema = Joi.object({
    email: Joi.string()
        .email({ tlds: { allow: false } })
        .required()
        .messages({
            "string.email": "Please provide a valid email address.",
            "any.required": "Email is required."
        }),
    password: Joi.string()
        .min(8)
        .required()
        .messages({
            "string.base": "Password must be a string.",
            "string.min": "Password must be at least {#limit} characters long.",
            "any.required": "Password is required."
        })
})

export const forgotPasswordSchema = Joi.object({
    email: Joi.string()
        .email({ tlds: { allow: false } })
        .required()
        .messages({
            "string.email": "Please provide a valid email address.",
            "any.required": "Email is required."
        }),
})

export const resetPasswordSchema = Joi.object({
    newPassword: Joi.string()
        .min(8)
        .required()
        .messages({
            "string.min": "New Password must be at least {#limit} characters long.",
            "any.required": "New Password is required."
        }),
    confirmPassword: Joi.any()
        .valid(Joi.ref("newPassword"))
        .required()
        .messages({
            "any.only": "Confirm Password must match New Password.",
            "any.required": "Confirm Password is required."
        })
});

export const adminRegisterSchema = Joi.object({
    name: Joi.string()
        .trim()
        .min(2)
        .max(20)
        .required()
        .messages({
            "string.base": "Name must be a string.",
            "string.empty": "Name cannot be empty.",
            "string.min": "Name must be at least {#limit} characters long.",
            "any.required": "Name is required."
        }),
    mobile: Joi.number()
        .required()
        .messages({
            "number.base": "Mobile must be a number.",
            "any.required": "Mobile is required."
        }),
    email: Joi.string()
        .email({ tlds: { allow: false } })
        .required()
        .messages({
            "string.email": "Please provide a valid email address.",
            "any.required": "Email is required."
        }),
    password: Joi.string()
        .min(8)
        .required()
        .messages({
            "string.base": "Password must be a string.",
            "string.min": "Password must be at least {#limit} characters long.",
            "any.required": "Password is required."
        })
});