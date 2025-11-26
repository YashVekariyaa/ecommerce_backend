"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const multer_1 = __importDefault(require("multer"));
const path_1 = __importDefault(require("path"));
const storage = multer_1.default.diskStorage({
    destination: (req, file, cb) => {
        if (file.fieldname === "profile_Image") {
            // Check if the request is for admin registration
            if (req.originalUrl.includes("/api/admin/register")) {
                cb(null, "./src/Upload/AdminProfile");
            }
            else {
                cb(null, "./src/Upload/UserProfile");
            }
        }
        else if (file.fieldname === "img") {
            cb(null, "./src/Upload/Products");
        }
        else if (file.fieldname === "galleryimg") {
            cb(null, "./src/Upload/Products/galleryImage");
        }
        else {
            cb(new Error("Invalid fieldname"));
        }
    },
    filename: (req, file, cb) => {
        cb(null, file.fieldname + "-" + Date.now() + path_1.default.extname(file.originalname));
    },
});
const multerFilter = (req, file, cb) => {
    const allowedTypes = ["image/png", "image/jpg", "image/jpeg"];
    if (allowedTypes.includes(file.mimetype)) {
        cb(null, true);
    }
    else {
        cb(new Error("Please upload a valid image"));
    }
};
const upload = (0, multer_1.default)({
    storage,
    fileFilter: multerFilter,
    limits: { fileSize: 5 * 1024 * 1024 }, // 5MB limit
});
exports.default = upload;
