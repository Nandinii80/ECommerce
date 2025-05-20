import React from "react";
import { UseAppContext } from "../context/AppContext";
import { assets } from "../assets/greencart_assets/assets";
import { FaHeart } from "react-icons/fa";

const WishlistPage = () => {
  const { wishlist, products, toggleWishlist, addToCart, currency, navigate } = UseAppContext();

  const wishlistItems = products.filter(p => wishlist.includes(p._id));

  const handleMoveToCart = (e, product) => {
    e.stopPropagation();
    toggleWishlist(product._id); // remove from wishlist
    addToCart(product._id); // add to cart
  };

  return (
    <div className="p-4 min-h-[80vh] bg-gray-50">
      <h1 className="text-2xl font-bold mb-6 text-center md:text-left">My Wishlist</h1>

      {wishlistItems.length === 0 ? (
        <p className="text-gray-500 text-center mt-8">No items in wishlist.</p>
      ) : (
        <div className="flex flex-wrap gap-6 justify-center md:justify-start">
          {wishlistItems.map(product => (
            <div
              key={product._id}
              onClick={() => {
                navigate(`/products/${product.category.toLowerCase()}/${product._id}`);
                scrollTo(0, 0);
              }}
              className="relative border border-gray-300 rounded-md md:px-4 px-3 py-4 bg-white min-w-[200px] max-w-[240px] w-full cursor-pointer hover:shadow-lg transition flex flex-col"
            >
              {/* Wishlist Heart Icon */}
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  toggleWishlist(product._id);
                }}
                className="absolute top-2 right-2 text-red-500 text-lg"
                aria-label="Remove from wishlist"
              >
                <FaHeart />
              </button>

              {/* Image */}
              <div className="group flex items-center justify-center px-2 mb-3">
                <img
                  className="group-hover:scale-105 transition max-w-[100px] md:max-w-[140px] object-contain"
                  src={product.image[0]}
                  alt={product.name}
                />
              </div>

              {/* Product Info */}
              <div className="text-gray-600 text-sm flex-grow">
                <p className="capitalize">{product.category}</p>
                <p className="text-gray-800 font-semibold text-lg truncate w-full">{product.name}</p>
                <div className="flex items-center gap-1 mb-2">
                  {Array(5).fill('').map((_, i) => (
                    <img
                      key={i}
                      className="md:w-4 w-3"
                      src={i < Math.floor(product.rating || 4) ? assets.star_icon : assets.star_dull_icon}
                      alt="star"
                    />
                  ))}
                  <p className="text-xs">({product.rating || 4.0})</p>
                </div>

                {/* Price */}
                <div className="mb-4">
                  <p className="md:text-xl text-base font-semibold text-primary">
                    {currency} {product.offerPrice}{" "}
                    <span className="text-gray-500 line-through text-sm">
                      {currency}{product.price}
                    </span>
                  </p>
                </div>
              </div>

              {/* Move to Cart Button */}
              <button
                onClick={(e) => handleMoveToCart(e, product)}
                className="mt-auto bg-primary text-white py-2 rounded-md hover:bg-primary-dark transition"
                aria-label={`Move ${product.name} to cart`}
              >
                Move to Cart
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default WishlistPage;
