import express from 'express';
import authUser from '../middlewares/authUser.js';
import User from '../models/User.js';

const router = express.Router();

// Get user's wishlist
router.get('/', authUser, async (req, res) => {
  const user = await User.findById(req.user._id).populate('wishlist');
  res.json({ success: true, wishlist: user.wishlist });
});

// Add item to wishlist
router.post('/add/:productId', authUser, async (req, res) => {
  const user = await User.findById(req.user._id);
  const productId = req.params.productId;

  if (!user.wishlist.includes(productId)) {
    user.wishlist.push(productId);
    await user.save();
    return res.json({ success: true, message: "Added to wishlist" });
  }

  res.json({ success: false, message: "Already in wishlist" });
});

// Remove item from wishlist
router.delete('/remove/:productId', authUser, async (req, res) => {
  const user = await User.findById(req.user._id);
  user.wishlist = user.wishlist.filter(
    (item) => item.toString() !== req.params.productId
  );
  await user.save();
  res.json({ success: true, message: "Removed from wishlist" });
});

export default router;
