import mongoose, { Schema, Document } from 'mongoose';

export interface IWishlistItem extends Document {
    productId: string;
}

const wishItemSchema: Schema = new Schema({
    productId: { type: mongoose.Schema.Types.ObjectId, ref: 'Product', required: true },
},
    { timestamps: true, collection: "wishlist" },
);

export default mongoose.model<IWishlistItem>('Wish', wishItemSchema);
