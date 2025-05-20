import React from "react";
import { Trash2, ShoppingCart } from "lucide-react";

const WishlistItem = ({ item, onRemove, onAddToCart }) => {
  return (
    <div className="border p-3 rounded-lg shadow bg-white relative">
      <img
        src={item.image}
        alt={item.name}
        className="w-full h-40 object-cover rounded"
      />
      <h2 className="text-md mt-2 font-medium">{item.name}</h2>

      <div className="flex justify-between items-center mt-2">
        <p className="text-sm text-gray-700 font-semibold">₹{item.price}</p>

        <div className="flex gap-2">
          <button
            onClick={() => onAddToCart(item._id)}
            title="Add to Cart"
            className="text-green-600 hover:text-green-800"
          >
            <ShoppingCart size={18} />
          </button>

          <button
            onClick={() => onRemove(item._id)}
            title="Remove"
            className="text-red-500 hover:text-red-700"
          >
            <Trash2 size={18} />
          </button>
        </div>
      </div>
    </div>
  );
};

export default WishlistItem;
