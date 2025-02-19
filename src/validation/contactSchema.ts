import Joi from "joi";

export const contactSchema = Joi.object({
    name: Joi.string()
        .min(2)
        .max(10)
        .required()
        .messages({
            'any.required': 'Name is required.',
            'string.min': 'Name must be at least {#limit} characters long.',
        }),
    mobile: Joi.number()
        .required()
        .messages({
            'any.required': 'Mobile number is required.',
            'number.base': 'Mobile number must be a number.',
        }),
    email: Joi.string()
        .email({ tlds: { allow: false } })
        .required()
        .messages({
            'any.required': 'Email is required.',
            'string.email': 'Please provide a valid email address.',
        }),
    message: Joi.string()
        .min(1)
        .max(100)
        .required()
        .messages({
            'any.required': 'Message is required.',
            'string.min': 'Message must contain at least {#limit} character.',
        })
});