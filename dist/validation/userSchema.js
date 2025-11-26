"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.adminRegisterSchema = exports.resetPasswordSchema = exports.forgotPasswordSchema = exports.loginSchema = exports.registerSchema = void 0;
const joi_1 = __importDefault(require("joi"));
exports.registerSchema = joi_1.default.object({
    firstname: joi_1.default.string()
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
    lastname: joi_1.default.string()
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
    mobile: joi_1.default.number()
        .required()
        .messages({
        "number.base": "Mobile must be a number.",
        "any.required": "Mobile is required."
    }),
    email: joi_1.default.string()
        .email({ tlds: { allow: false } })
        .required()
        .messages({
        "string.email": "Please provide a valid email address.",
        "any.required": "Email is required."
    }),
    password: joi_1.default.string()
        .min(8)
        .required()
        .messages({
        "string.base": "Password must be a string.",
        "string.min": "Password must be at least {#limit} characters long.",
        "any.required": "Password is required."
    })
});
exports.loginSchema = joi_1.default.object({
    email: joi_1.default.string()
        .email({ tlds: { allow: false } })
        .required()
        .messages({
        "string.email": "Please provide a valid email address.",
        "any.required": "Email is required."
    }),
    password: joi_1.default.string()
        .min(8)
        .required()
        .messages({
        "string.base": "Password must be a string.",
        "string.min": "Password must be at least {#limit} characters long.",
        "any.required": "Password is required."
    })
});
exports.forgotPasswordSchema = joi_1.default.object({
    email: joi_1.default.string()
        .email({ tlds: { allow: false } })
        .required()
        .messages({
        "string.email": "Please provide a valid email address.",
        "any.required": "Email is required."
    }),
});
exports.resetPasswordSchema = joi_1.default.object({
    newPassword: joi_1.default.string()
        .min(8)
        .required()
        .messages({
        "string.min": "New Password must be at least {#limit} characters long.",
        "any.required": "New Password is required."
    }),
    confirmPassword: joi_1.default.any()
        .valid(joi_1.default.ref("newPassword"))
        .required()
        .messages({
        "any.only": "Confirm Password must match New Password.",
        "any.required": "Confirm Password is required."
    })
});
exports.adminRegisterSchema = joi_1.default.object({
    name: joi_1.default.string()
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
    mobile: joi_1.default.number()
        .required()
        .messages({
        "number.base": "Mobile must be a number.",
        "any.required": "Mobile is required."
    }),
    email: joi_1.default.string()
        .email({ tlds: { allow: false } })
        .required()
        .messages({
        "string.email": "Please provide a valid email address.",
        "any.required": "Email is required."
    }),
    password: joi_1.default.string()
        .min(8)
        .required()
        .messages({
        "string.base": "Password must be a string.",
        "string.min": "Password must be at least {#limit} characters long.",
        "any.required": "Password is required."
    })
});
