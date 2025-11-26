"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const review_1 = __importDefault(require("./review"));
const productSchema = new mongoose_1.default.Schema({
    productname: {
        type: String,
        required: false,
    },
    category: {
        type: String,
        required: false,
    },
    subcategory: {
        type: String,
        required: false,
    },
    img: {
        type: String,
        required: false,
    },
    galleryimg: {
        type: [String],
        required: false,
    },
    price: {
        type: Number,
        required: false,
    },
    color: {
        type: String,
        required: false,
    },
    quantity: {
        type: Number,
        required: false,
    },
    description: {
        type: String,
        required: false,
    },
    averageRating: {
        type: Number,
        default: 0,
    },
    reviews: [review_1.default],
}, { timestamps: true, collection: "product" });
const Product = mongoose_1.default.model("Product", productSchema);
exports.default = Product;
