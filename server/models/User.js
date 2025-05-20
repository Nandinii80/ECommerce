import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    cartItem: { type: Object, default: {} },
    wishlist: { type: [String], default: [] }, // array of product _id's

}, { minimize: false });

const User = mongoose.models.user || mongoose.model('user', userSchema);

export default User;
