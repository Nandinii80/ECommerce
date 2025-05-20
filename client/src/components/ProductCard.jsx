import React from 'react';
import { assets } from '../assets/greencart_assets/assets';
import { UseAppContext } from '../context/AppContext';
import { FaHeart, FaRegHeart } from 'react-icons/fa'; // Icons for wishlist

const ProductCard = ({ product }) => {
  const {
    currency,
    addToCart,
    removeFromCart,
    cartItem,
    navigate,
    toggleWishlist,
    isInWishlist,
  } = UseAppContext();

  return product && (
    <div
      onClick={() => {
        navigate(`/products/${product.category.toLowerCase()}/${product._id}`);
        scrollTo(0, 0);
      }}
      className="relative border border-gray-500/20 rounded-md md:px-4 px-3 py-2 bg-white min-w-56 max-w-56 w-full"
    >
      {/* Wishlist Button */}
      <button
        onClick={(e) => {
          e.stopPropagation(); // Prevent card click
          toggleWishlist(product._id);
        }}
        className="absolute top-2 right-2 text-lg z-10"
      >
        {isInWishlist(product._id) ? (
          <FaHeart className="text-red-500" />
        ) : (
          <FaRegHeart className="text-gray-400" />
        )}
      </button>

      <div className="group cursor-pointer flex items-center justify-center px-2">
        <img
          className="group-hover:scale-105 transition max-w-26 md:max-w-36"
          src={product.image[0]}
          alt={product.name}
        />
      </div>

      <div className="text-gray-500/60 text-sm">
        <p>{product.category}</p>
        <p className="text-gray-700 font-medium text-lg truncate w-full">{product.name}</p>

        {/* Ratings */}
        <div className="flex items-center gap-0.5">
          {Array(5).fill('').map((_, i) => (
            <img
              key={i}
              className="md:w-3.5 w-3"
              src={i < 4 ? assets.star_icon : assets.star_dull_icon}
              alt="rating"
            />
          ))}
          <p>({product.rating || 4.0})</p>
        </div>

        {/* Price & Cart Controls */}
        <div className="flex items-end justify-between mt-3">
          <p className="md:text-xl text-base font-medium text-primary">
            {currency} {product.offerPrice}{" "}
            <span className="text-gray-500/60 md:text-sm text-xs line-through">
              {currency}{product.price}
            </span>
          </p>

          {/* Cart Controls */}
          <div onClick={(e) => e.stopPropagation()} className="text-primary">
            {!cartItem[product._id] ? (
              <button
                className="flex items-center justify-center gap-1 bg-primary/10 border border-primary/40 md:w-[80px] w-[64px] h-[34px] rounded text-primary-dull font-medium"
                onClick={() => addToCart(product._id)}
              >
                <img src={assets.cart_icon} alt="cart" />
                Add
              </button>
            ) : (
              <div className="flex items-center justify-center gap-2 md:w-20 w-16 h-[34px] bg-primary/25 rounded select-none">
                <button
                  onClick={() => removeFromCart(product._id)}
                  className="cursor-pointer text-md px-2 h-full"
                >-</button>
                <span className="w-5 text-center">{cartItem[product._id]}</span>
                <button
                  onClick={() => addToCart(product._id)}
                  className="cursor-pointer text-md px-2 h-full"
                >+</button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductCard;
