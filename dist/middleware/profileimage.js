"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const multer_1 = __importDefault(require("multer"));
const path_1 = __importDefault(require("path"));
const storage = multer_1.default.diskStorage({
    destination: function (req, file, cd) {
        cd(null, "./src/Upload/UserProfile");
    },
    filename: (req, file, cd) => {
        // console.log('first', file.fieldname + "-" + Date.now() + path.extname(file.originalname))
        // console.log('file', file)
        cd(null, file.fieldname + "-" + Date.now() + path_1.default.extname(file.originalname));
    },
});
const multerFilter = (req, file, cd) => {
    if (file.mimetype == "image/png" ||
        file.mimetype == "image/jpg" ||
        file.mimetype == "image/jpeg" ||
        file.mimetype == "image/mp4" ||
        file.mimetype == "image/webp") {
        cd(null, true);
    }
    else {
        cd("please upload reght image");
    }
};
const UserProfile = (0, multer_1.default)({ storage: storage, fileFilter: multerFilter });
exports.default = UserProfile;
