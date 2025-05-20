import mongoose from "mongoose";

const addressSchema = new mongoose.Schema(
  {
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },

    firstName: { type: String, required: true, trim: true },
    lastName: { type: String, required: true, trim: true },

    email: { type: String, required: true, trim: true, lowercase: true },

    street: { type: String, required: true },
    city: { type: String, required: true },
    state: { type: String, required: true },
    zipcode: { type: String, required: true }, // Use string to support leading zeros
    country: { type: String, required: true },

    phone: { type: String, required: true, trim: true },
  },
  {
    timestamps: true, // adds createdAt and updatedAt fields
  }
);

const Address = mongoose.models.Address || mongoose.model('Address', addressSchema);

export default Address;
