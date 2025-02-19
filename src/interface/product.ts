import { ObjectId } from "mongoose";

export interface Review {
    _id: ObjectId;
    userId: ObjectId;
    rating: number;
    comment: string;
    createdAt: Date;
    updatedAt: Date;
}

export interface Product {
    _id: ObjectId;
    productname: string;
    category: string;
    subcategory: string;
    img: string;
    galleryimg: string[];
    price: number;
    color: string;
    quantity: number;
    description: string;
    createdAt: Date;
    updatedAt: Date;
    __v: number;
    reviews: Review[];
}