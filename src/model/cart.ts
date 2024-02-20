import mongoose, { Schema, Document } from 'mongoose';

export interface ICartItem extends Document {
    productId: string;
    quantity: number;
}

const cartItemSchema: Schema = new Schema({
    productId: { type: mongoose.Schema.Types.ObjectId, ref: 'Product', required: true },
    quantity: { type: Number, required: true }
},
    { timestamps: true, collection: "cart" },
);

export default mongoose.model<ICartItem>('Cart', cartItemSchema);
