import { Request, Response, NextFunction, RequestHandler } from "express";
import fs from "fs";
import Joi, { ObjectSchema } from "joi";

interface FileOptions {
    maxSize: number;
    allowedTypes: string[];
}

interface DiskFile extends Express.Multer.File {
    path: string;
}

export const validateRequest = (
    schema: ObjectSchema,
    fileField?: string,
    fileOptions?: FileOptions
): RequestHandler => {
    return async (req: Request, res: Response, next: NextFunction) => {
        // Validate text fields using Joi.
        const { error, value } = schema.validate(req.body, { abortEarly: false });
        let fileError: string | null = null;
        let file: DiskFile | null = null;


        if (fileField && req.files) {
            const files = req.files as { [fieldname: string]: DiskFile[] } | undefined;
            file = files && files[fileField] && files[fileField].length > 0 ? files[fileField][0] : null;

            // File validation:
            if (!file) {
                fileError = `${fileField} is required.`;
            } else if (fileOptions) {
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
                fs.unlink(file.path, (err) => {
                    if (err) console.error("Error deleting file:", err);
                });
            }
            const errors: string[] = error ? error.details.map((d) => d.message) : [];
            if (fileError) errors.push(fileError);
            return res.status(400).json({ errors });
        }

        // Attach the validated text data to req.validated.
        // For stronger typing, you could extend the Request interface.
        (req as any).validated = value;
        next();
    };
};