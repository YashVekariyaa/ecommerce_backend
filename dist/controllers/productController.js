"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateReview = exports.getReviews = exports.deleteReview = exports.addReview = exports.getProducts = exports.updateProduct = exports.deleteProduct = exports.addProduct = void 0;
const product_1 = __importDefault(require("../model/product"));
const path_1 = __importDefault(require("path"));
const fs_1 = __importDefault(require("fs"));
const dotenv_1 = __importDefault(require("dotenv"));
const category_1 = __importDefault(require("../model/category"));
const subcategory_1 = __importDefault(require("../model/subcategory"));
dotenv_1.default.config();
const addProduct = async (req, res, next) => {
    const { productname, category, subcategory, price, color, quantity, description, } = req.body;
    if (!productname ||
        !category ||
        !subcategory ||
        !price ||
        !color ||
        !quantity ||
        !description) {
        return res.json({ success: false, message: "Something is Empty" });
    }
    try {
        const categoryDoc = await category_1.default.findOne({ category });
        if (!categoryDoc) {
            return res.json({
                success: false,
                message: "Category does not exist",
            });
        }
        const subcategoryDoc = await subcategory_1.default.findOne({
            category,
            subcategory,
        });
        if (!subcategoryDoc) {
            return res.json({
                success: false,
                message: "Subcategory does not exist in the specified category",
            });
        }
        const files = req.files;
        const singleImage = files?.["img"]
            ? `${process.env.BASE_URL}/img/${files["img"][0].filename}`
            : null;
        if (!singleImage) {
            return res
                .status(400)
                .json({ success: false, message: "Single image is required" });
        }
        const galleryImages = files?.["galleryimg"]
            ? files["galleryimg"].map((file) => `${process.env.BASE_URL}/galleryimg/${file.filename}`)
            : [];
        const addproduct = new product_1.default({
            productname,
            category,
            subcategory,
            img: singleImage,
            price,
            color,
            quantity,
            description,
            galleryimg: galleryImages,
        });
        const create = await addproduct.save();
        if (create) {
            console.log("Product added successfully:", create);
            res.json({
                success: true,
                data: create,
                message: "Product add successfully.",
            });
        }
        else {
            console.log("Failed to add product");
            res.json({ success: false, message: "something went wrong" });
        }
    }
    catch (err) {
        console.error("Error adding product:", err.message);
        res.status(500).json({
            success: false,
            message: "An error occurred",
            error: err.message,
        });
    }
};
exports.addProduct = addProduct;
const deleteProduct = async (req, res, next) => {
    const { id } = req.params;
    const data = await product_1.default.findByIdAndDelete({ _id: id });
    if (data) {
        return res.json({
            success: true,
            message: "product deleted successfully",
        });
    }
};
exports.deleteProduct = deleteProduct;
const updateProduct = async (req, res, next) => {
    const { id } = req.params;
    const { productname, category, subcategory, price, color, quantity, description, } = req.body;
    const product = await product_1.default.findOne({ _id: id });
    if (!product) {
        return res.status(404).json({
            success: false,
            message: "Product not found",
        });
    }
    if (!productname ||
        !category ||
        !subcategory ||
        !price ||
        !color ||
        !quantity ||
        !description) {
        return res.status(400).json({
            success: false,
            message: "Something is Empty",
        });
    }
    const categoryDoc = await category_1.default.findOne({ category });
    if (!categoryDoc) {
        return res.status(400).json({
            success: false,
            message: "Category does not exist",
        });
    }
    // Verify that the subcategory exists for the given category.
    const subcategoryDoc = await subcategory_1.default.findOne({
        category,
        subcategory,
    });
    if (!subcategoryDoc) {
        return res.status(400).json({
            success: false,
            message: "Subcategory does not exist in the specified category",
        });
    }
    let updateData = {
        productname,
        category,
        subcategory,
        price,
        color,
        quantity,
        description,
    };
    const files = req.files;
    const singleImage = files?.["img"]
        ? `${process.env.BASE_URL}/img/${files["img"][0].filename}`
        : null;
    if (singleImage) {
        updateData.img = singleImage;
        // If there is an old image, delete it
        if (product.img) {
            const oldImageFilename = path_1.default.basename(product.img); // Extract filename from URL
            const oldImagePath = path_1.default.join("./src/Upload/Products", oldImageFilename);
            fs_1.default.unlink(oldImagePath, (error) => {
                if (error) {
                    console.error("Error deleting old image:", error);
                }
            });
        }
    }
    else {
        return res
            .status(400)
            .json({ success: false, message: "Single image is required" });
    }
    if (req.files) {
        const galleryImages = req.files["galleryimg"]?.map((file) => `${process.env.BASE_URL}/galleryimg/${file.filename}`);
        if (galleryImages && galleryImages.length > 0) {
            // Delete old gallery images
            if (product.galleryimg && product.galleryimg.length > 0) {
                product.galleryimg.forEach((oldImage) => {
                    const oldImageFilename = path_1.default.basename(oldImage); // Extract filename from URL
                    const oldImagePath = path_1.default.join("./src/Upload/Products/galleryImage", oldImageFilename);
                    fs_1.default.unlink(oldImagePath, (error) => {
                        if (error) {
                            console.error("Error deleting old gallery image:", error);
                        }
                    });
                });
            }
            updateData.galleryimg = galleryImages;
        }
    }
    const updatedProduct = await product_1.default.findByIdAndUpdate({ _id: id }, { $set: updateData }, { new: true });
    if (!updatedProduct) {
        return res.status(500).json({
            success: false,
            message: "Failed to update product",
        });
    }
    return res.json({
        success: true,
        data: updatedProduct,
        status: 200,
        message: "Product Updated successfully",
    });
};
exports.updateProduct = updateProduct;
const getProducts = async (req, res, next) => {
    try {
        const { page = "1", limit = "10", color, category, subcategory, minPrice, maxPrice, search, rating, } = req.query;
        const query = {};
        if (color) {
            query.color = color;
        }
        if (category) {
            query.category = category;
        }
        if (subcategory) {
            query.subcategory = subcategory;
        }
        if (minPrice || maxPrice) {
            query.price = {};
            if (minPrice)
                query.price.$gte = Number(minPrice);
            if (maxPrice)
                query.price.$lte = Number(maxPrice);
        }
        if (search) {
            query.$or = [{ productname: { $regex: search, $options: "i" } }];
        }
        const pageNumber = parseInt(page, 10) || 1;
        const limitNumber = parseInt(limit, 10) || 10;
        const skipNumber = (pageNumber - 1) * limitNumber;
        const pipeline = [];
        if (Object.keys(query).length > 0) {
            pipeline.push({ $match: query });
        }
        pipeline.push({
            $addFields: {
                averageRating: { $avg: "$reviews.rating" },
            },
        });
        if (rating) {
            pipeline.push({
                $match: { averageRating: Number(rating) },
            });
        }
        // Use $facet to run two parallel pipelines: one for data, one for count
        pipeline.push({
            $facet: {
                data: [
                    { $sort: { createdAt: -1 } },
                    { $skip: skipNumber },
                    { $limit: limitNumber },
                ],
                totalCount: [{ $count: "total" }],
            },
        });
        const results = await product_1.default.aggregate(pipeline);
        const products = results[0].data;
        const totalProducts = results[0].totalCount.length > 0 ? results[0].totalCount[0].total : 0;
        const formattedData = products.map((product) => ({
            _id: product._id,
            productname: product.productname,
            category: product.category,
            subcategory: product.subcategory,
            price: product.price,
            color: product.color,
            quantity: product.quantity,
            description: product.description,
            createdAt: product.createdAt,
            updatedAt: product.updatedAt,
            img: product.img,
            galleryimg: product.galleryimg,
            averageRating: product.averageRating,
            reviews: product.reviews,
        }));
        return res.json({
            success: true,
            status: 200,
            currentPage: pageNumber,
            totalPages: Math.ceil(totalProducts / limitNumber),
            totalProducts,
            data: formattedData,
        });
    }
    catch (error) {
        next(error);
    }
};
exports.getProducts = getProducts;
const addReview = async (req, res) => {
    try {
        const { id } = req.params;
        const { rating, comment } = req.body;
        const userId = req.user?._id;
        if (!userId) {
            return res.status(401).json({ message: "Unauthorized" });
        }
        const product = await product_1.default.findById(id);
        if (!product) {
            return res.status(404).json({ message: "Product not found" });
        }
        // Check if the user already reviewed this product
        const existingReview = product.reviews.find((review) => review.userId.toString() === userId);
        if (existingReview) {
            return res
                .status(400)
                .json({ message: "You have already reviewed this product" });
        }
        // Add new review with only user ID
        product.reviews.push({ userId, rating, comment, createdAt: new Date() });
        await product.save();
        res.status(201).json({ message: "Review added successfully", product });
    }
    catch (error) {
        res.status(500).json({ message: "Server error", error });
    }
};
exports.addReview = addReview;
const deleteReview = async (req, res) => {
    try {
        const { productId, id } = req.params;
        const userId = req.user?._id; // User ID from authentication
        if (!userId) {
            return res.status(401).json({ message: "Unauthorized" });
        }
        // Find product
        const product = await product_1.default.findById(productId);
        if (!product) {
            return res.status(404).json({ message: "Product not found" });
        }
        // Find review
        const reviewIndex = product.reviews.findIndex((review) => review && review._id?.toString() === id);
        if (reviewIndex === -1) {
            return res
                .status(404)
                .json({ message: "Review not found", success: false });
        }
        // Check if the logged-in user is the one who posted the review
        if (product.reviews[reviewIndex].userId.toString() !== userId) {
            return res
                .status(403)
                .json({
                message: "You can only delete your own review",
                success: false,
            });
        }
        // Remove the review
        product.reviews.splice(reviewIndex, 1);
        await product.save();
        res
            .status(200)
            .json({ message: "Review deleted successfully", success: true });
    }
    catch (error) {
        res.status(500).json({ message: "Server error", error });
    }
};
exports.deleteReview = deleteReview;
const getReviews = async (req, res) => {
    try {
        const { productId } = req.params;
        // Find product and populate user details in reviews
        const product = await product_1.default.findById(productId).populate("reviews.userId", "name email");
        if (!product) {
            return res.status(404).json({ message: "Product not found" });
        }
        // Check if product has reviews
        if (product.reviews.length === 0) {
            return res.status(200).json({ message: "No reviews found", reviews: [] });
        }
        res.status(200).json({ reviews: product.reviews });
    }
    catch (error) {
        res.status(500).json({ message: "Server error", error });
    }
};
exports.getReviews = getReviews;
const updateReview = async (req, res) => {
    try {
        const { productId, id } = req.params;
        const { rating, comment } = req.body;
        const userId = req.user?._id;
        // Find product
        const product = await product_1.default.findById(productId);
        if (!product) {
            return res.status(404).json({ message: "Product not found" });
        }
        // Find review
        const review = product.reviews.find((r) => r?._id && r?._id.toString() === id);
        if (!review) {
            return res.status(404).json({ message: "Review not found" });
        }
        // Check if the logged-in user owns the review
        if (review.userId.toString() !== userId) {
            return res
                .status(403)
                .json({ message: "You can only update your own review" });
        }
        // Validate rating
        if (rating < 1 || rating > 5) {
            return res
                .status(400)
                .json({ message: "Rating must be between 1 and 5" });
        }
        // Update review
        review.rating = rating;
        review.comment = comment;
        review.createdAt = new Date();
        await product.save();
        res
            .status(200)
            .json({ message: "Review updated successfully", product, success: true });
    }
    catch (error) {
        res.status(500).json({ message: "Server error", error });
    }
};
exports.updateReview = updateReview;
