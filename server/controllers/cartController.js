import User from "../models/User.js";
export const updateCart = async (req, res) => {
  try {
    const { cartItem} = req.body;  // Get cartItems from body
    const userId = req.user._id;     // Get userId from JWT middleware

    if (!userId) {
      return res.status(401).json({ success: false, message: "User not authenticated" });
    }

    if (!cartItem) {
      return res.status(400).json({ success: false, message: "cartItems is required" });
    }

    await User.findByIdAndUpdate(userId, { cartItem });

    return res.json({ success: true, message: "Cart updated successfully" });
  } catch (error) {
    console.error(error.message);
    return res.status(500).json({ success: false, message: error.message });
  }
};
