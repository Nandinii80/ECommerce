import mongoose from "mongoose";

const orderSchema = new mongoose.Schema(
  {
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },

    items: [
      {
        product: { type: mongoose.Schema.Types.ObjectId, ref: 'Product', required: true },
        quantity: { type: Number, required: true, min: 1 }
      }
    ],

    amount: { type: Number, required: true, min: 0 },

    address: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Address',
      required: true
    },
    status: {
      type: String,
      enum: ["order placed", "processing", "shipped", "delivered", "cancelled"],
      default: "order placed"
    },

    paymentType: {
      type: String,
      enum: ["COD", "Online"],
      required: true
    },

    isPaid: { type: Boolean, default: false }
  },
  {
    timestamps: true
  }
);

const Order = mongoose.models.Order || mongoose.model('Order', orderSchema);

export default Order;
