import mongoose from "mongoose";

const cartSchema = new mongoose.Schema({
    userId: mongoose.Schema.Types.ObjectId,
    items: [
        {
            bookId: Number,
            title: String,
            price: Number,
            quantity: {
                type: Number,
                default: 1
            }
        }
    ]
}, { timestamps: true });

const Cart = mongoose.model('Cart', cartSchema);

export default Cart;