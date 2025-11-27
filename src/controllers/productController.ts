import { Request, Response, NextFunction } from "express";
import Product from "../model/product";
import path from "path";
import fs from "fs";
import User from "../model/user";
import dotenv from "dotenv";
import Category from "../model/category";
import Subcategory from "../model/subcategory";
import { URL } from "../constants/utils";
dotenv.config();

export const addProduct: any = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const {
    productname,
    category, // this should be category ID
    subcategory, // this should be subcategory ID
    price,
    color,
    quantity,
    description,
  } = req.body;

  if (
    !productname ||
    !category ||
    !subcategory ||
    !price ||
    !color ||
    !quantity ||
    !description
  ) {
    return res.json({ success: false, message: "Something is Empty" });
  }

  try {
    // Find category by ID
    const categoryDoc = await Category.findById(category);
    if (!categoryDoc) {
      return res.json({
        success: false,
        message: "Category does not exist",
      });
    }

    // Find subcategory by ID and category
    const subcategoryDoc = await Subcategory.findOne({
      _id: subcategory,
      category: category,
    });
    if (!subcategoryDoc) {
      return res.json({
        success: false,
        message: "Subcategory does not exist in the specified category",
      });
    }

    // Handle images
    const files = req.files as { [fieldname: string]: Express.Multer.File[] };
    const singleImage = files?.["img"]
      ? `${URL}/api/img/${files["img"][0].filename}`
      : null;
    if (!singleImage) {
      return res
        .status(400)
        .json({ success: false, message: "Single image is required" });
    }

    const galleryImages = files?.["galleryimg"]
      ? files["galleryimg"].map(
          (file: Express.Multer.File) =>
            `${URL}/api/galleryimg/${file.filename}`
        )
      : [];

    // Save product with IDs
    const addproduct = new Product({
      productname,
      category: categoryDoc._id,
      subcategory: subcategoryDoc._id,
      img: singleImage,
      price,
      color,
      quantity,
      description,
      galleryimg: galleryImages,
    });

    const create = await addproduct.save();
    if (create) {
      res.json({
        success: true,
        data: create,
        message: "Product added successfully.",
      });
    } else {
      res.json({ success: false, message: "Something went wrong" });
    }
  } catch (err: any) {
    console.error("Error adding product:", err.message);
    res.status(500).json({
      success: false,
      message: "An error occurred",
      error: err.message,
    });
  }
};

export const deleteProduct: any = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { id } = req.params;
  const data = await Product.findByIdAndDelete({ _id: id });
  if (data) {
    return res.json({
      success: true,
      message: "product deleted successfully",
    });
  }
};

export const updateProduct: any = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { id } = req.params;
  const {
    productname,
    category,
    subcategory,
    price,
    color,
    quantity,
    description,
  } = req.body;
  const product: any = await Product.findOne({ _id: id });
  if (!product) {
    return res.status(404).json({
      success: false,
      message: "Product not found",
    });
  }

  if (
    !productname ||
    !category ||
    !subcategory ||
    !price ||
    !color ||
    !quantity ||
    !description
  ) {
    return res.status(400).json({
      success: false,
      message: "Something is Empty",
    });
  }

  const categoryDoc = await Category.findOne({ category });
  if (!categoryDoc) {
    return res.status(400).json({
      success: false,
      message: "Category does not exist",
    });
  }

  // Verify that the subcategory exists for the given category.
  const subcategoryDoc = await Subcategory.findOne({
    category,
    subcategory,
  });
  if (!subcategoryDoc) {
    return res.status(400).json({
      success: false,
      message: "Subcategory does not exist in the specified category",
    });
  }

  let updateData: any = {
    productname,
    category,
    subcategory,
    price,
    color,
    quantity,
    description,
  };

  const files = req.files as { [fieldname: string]: Express.Multer.File[] };
  const singleImage = files?.["img"]
    ? `${URL}/api/img/${files["img"][0].filename}`
    : null;

  if (singleImage) {
    updateData.img = singleImage;

    // If there is an old image, delete it
    if (product.img) {
      const oldImageFilename = path.basename(product.img); // Extract filename from URL
      const oldImagePath = path.join("./src/Upload/Products", oldImageFilename);
      fs.unlink(oldImagePath, (error) => {
        if (error) {
          console.error("Error deleting old image:", error);
        }
      });
    }
  } else {
    return res
      .status(400)
      .json({ success: false, message: "Single image is required" });
  }

  if (req.files) {
    const galleryImages = (
      req.files as { [fieldname: string]: Express.Multer.File[] }
    )["galleryimg"]?.map(
      (file: Express.Multer.File) =>
        `${URL}/api/galleryimg/${file.filename}`
    );
    if (galleryImages && galleryImages.length > 0) {
      // Delete old gallery images
      if (product.galleryimg && product.galleryimg.length > 0) {
        product.galleryimg.forEach((oldImage: string) => {
          const oldImageFilename = path.basename(oldImage); // Extract filename from URL
          const oldImagePath = path.join(
            "./src/Upload/Products/galleryImage",
            oldImageFilename
          );
          fs.unlink(oldImagePath, (error) => {
            if (error) {
              console.error("Error deleting old gallery image:", error);
            }
          });
        });
      }
      updateData.galleryimg = galleryImages;
    }
  }

  const updatedProduct = await Product.findByIdAndUpdate(
    { _id: id },
    { $set: updateData },
    { new: true }
  );

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

export const getProducts: any = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const {
      page = "1",
      limit = "10",
      color,
      category,
      subcategory,
      minPrice,
      maxPrice,
      search,
      rating,
    } = req.query;

    const query: any = {};

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
      if (minPrice) query.price.$gte = Number(minPrice);
      if (maxPrice) query.price.$lte = Number(maxPrice);
    }
    if (search) {
      query.$or = [{ productname: { $regex: search, $options: "i" } }];
    }

    const pageNumber = parseInt(page as string, 10) || 1;
    const limitNumber = parseInt(limit as string, 10) || 10;
    const skipNumber = (pageNumber - 1) * limitNumber;

    const pipeline: any[] = [];
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
    const results = await Product.aggregate(pipeline);
    const products = results[0].data;
    const totalProducts =
      results[0].totalCount.length > 0 ? results[0].totalCount[0].total : 0;

    const formattedData = products.map((product: any) => ({
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
  } catch (error) {
    next(error);
  }
};

export const addReview = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { rating, comment } = req.body;
    const userId = req.user?._id;

    if (!userId) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    const product = await Product.findById(id);
    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }

    // Check if the user already reviewed this product
    const existingReview = product.reviews.find(
      (review) => review.userId.toString() === userId
    );
    if (existingReview) {
      return res
        .status(400)
        .json({ message: "You have already reviewed this product" });
    }

    // Add new review with only user ID
    product.reviews.push({ userId, rating, comment, createdAt: new Date() });

    await product.save();
    res.status(201).json({ message: "Review added successfully", product });
  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
};

export const deleteReview = async (req: Request, res: Response) => {
  try {
    const { productId, id } = req.params;
    const userId = req.user?._id; // User ID from authentication

    if (!userId) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    // Find product
    const product = await Product.findById(productId);
    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }

    // Find review
    const reviewIndex = product.reviews.findIndex(
      (review) => review && review._id?.toString() === id
    );
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
  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
};

export const getReviews = async (req: Request, res: Response) => {
  try {
    const { productId } = req.params;

    // Find product and populate user details in reviews
    const product = await Product.findById(productId).populate(
      "reviews.userId",
      "name email"
    );
    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }

    // Check if product has reviews
    if (product.reviews.length === 0) {
      return res.status(200).json({ message: "No reviews found", reviews: [] });
    }

    res.status(200).json({ reviews: product.reviews });
  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
};

export const updateReview = async (req: Request, res: Response) => {
  try {
    const { productId, id } = req.params;
    const { rating, comment } = req.body;
    const userId = req.user?._id;

    // Find product
    const product = await Product.findById(productId);
    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }

    // Find review
    const review = product.reviews.find(
      (r) => r?._id && r?._id.toString() === id
    );
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
  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
};
