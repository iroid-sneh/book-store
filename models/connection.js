require('dotenv').config();
import mongoose from "mongoose";

export async function mongoConnection() {
    try {
        mongoose.connect(process.env.MONGO_DB_URL, {})
            .then(() => {
                console.log('Connected to MongoDB');
            })
            .catch((e) => {
                console.log('could not connect to mongodb', e);
            })
    } catch (error) {
        console.log('Error In MongoDB Connection', error);
    }
}

export default mongoConnection;