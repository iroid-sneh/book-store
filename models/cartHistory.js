import mongoose from "mongoose";

const cartHistorySchema = new mongoose.Schema({
    userId: mongoose.Schema.Types.ObjectId,
    items: [
        {
            bookId: Number,
            title: String,
            price: Number,
            quantity: { type: Number }
        }
    ]
}, { timestamps: true });

const cartHistory = mongoose.model('CartHistory', cartHistorySchema);

export default cartHistory;