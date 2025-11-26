"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.contactSchema = void 0;
const joi_1 = __importDefault(require("joi"));
exports.contactSchema = joi_1.default.object({
    name: joi_1.default.string()
        .min(2)
        .max(10)
        .required()
        .messages({
        'any.required': 'Name is required.',
        'string.min': 'Name must be at least {#limit} characters long.',
    }),
    mobile: joi_1.default.number()
        .required()
        .messages({
        'any.required': 'Mobile number is required.',
        'number.base': 'Mobile number must be a number.',
    }),
    email: joi_1.default.string()
        .email({ tlds: { allow: false } })
        .required()
        .messages({
        'any.required': 'Email is required.',
        'string.email': 'Please provide a valid email address.',
    }),
    message: joi_1.default.string()
        .min(1)
        .max(100)
        .required()
        .messages({
        'any.required': 'Message is required.',
        'string.min': 'Message must contain at least {#limit} character.',
    })
});
