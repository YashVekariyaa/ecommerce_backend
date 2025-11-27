"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.URL = exports.validateRequest = void 0;
const fs_1 = __importDefault(require("fs"));
const validateRequest = (schema, fileField, fileOptions) => {
    return async (req, res, next) => {
        // Validate text fields using Joi.
        const { error, value } = schema.validate(req.body, { abortEarly: false });
        let fileError = null;
        let file = null;
        if (fileField && req.files) {
            const files = req.files;
            file = files && files[fileField] && files[fileField].length > 0 ? files[fileField][0] : null;
            // File validation:
            if (!file) {
                fileError = `${fileField} is required.`;
            }
            else if (fileOptions) {
                const { maxSize, allowedTypes } = fileOptions;
                if (file.size > maxSize) {
                    fileError = `File size exceeds limit of ${maxSize / (1024 * 1024)} MB.`;
                }
                if (!allowedTypes.includes(file.mimetype)) {
                    fileError = `Invalid file type: ${file.mimetype}. Allowed types: ${allowedTypes.join(", ")}`;
                }
            }
        }
        // Type assertion for req.files which is populated by Multer.
        // If any errors occur (either from Joi or file checks), delete the file and return errors.
        if (error || fileError) {
            if (file && file.path) {
                fs_1.default.unlink(file.path, (err) => {
                    if (err)
                        console.error("Error deleting file:", err);
                });
            }
            const errors = error ? error.details.map((d) => d.message) : [];
            if (fileError)
                errors.push(fileError);
            return res.status(400).json({ errors });
        }
        // Attach the validated text data to req.validated.
        // For stronger typing, you could extend the Request interface.
        req.validated = value;
        next();
    };
};
exports.validateRequest = validateRequest;
exports.URL = "https://ecommerce-backend-e75g.onrender.com";
