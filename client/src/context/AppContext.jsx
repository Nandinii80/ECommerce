import { createContext, useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import React from "react";
import toast from "react-hot-toast";
import { dummyProducts } from "../assets/greencart_assets/assets";
import axios from 'axios';

axios.defaults.withCredentials = true;
//console.log('Backend URL:', import.meta.env.VITE_BACKEND_URL);
axios.defaults.baseURL = import.meta.env.VITE_BACKEND_URL;

export const AppContext = createContext();

export const AppContextProvider = ({ children }) => {
  const currency = import.meta.env.VITE_CURRENCY;
  const navigate = useNavigate();

  const [user, setUser] = useState(null);
  const [isSeller, setIsSeller] = useState(false);
  const [ShowUserLogin, SetShowUserLogin] = useState(false);
  const [products, setProducts] = useState([]);
  const [cartItem, setCartItem] = useState({});
  const [searchQuery, setsearchQuery] = useState("");
  const [wishlist, setWishlist] = useState([]);

  // Fetch seller status
  const fetchSeller = async () => {
    try {
      const { data } = await axios.get('/api/seller/is-auth');
      if (data.success) {
        setIsSeller(true);
      } else {
        setIsSeller(false);
      }
    } catch (error) {
      setIsSeller(false);
    }
  };

  // Fetch user auth status, cart items
  const fetchUser = async () => {
    try {
      const { data } = await axios.get('/api/user/is-auth');
      if (data.success) {
        setUser(data.user);
        setCartItem(data.user.cartItem || {});
      }
    } catch (error) {
      setUser(null);
    }
  };

  // Fetch all products
  const fetchProducts = async () => {
    try {
      const { data } = await axios.get('/api/product/list');
      if (data.success) {
        setProducts(data.products);
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      toast.error(error.message);
    }
  };

  // Fetch Wishlist
  const fetchWishlist = async () => {
    try {
      const { data } = await axios.get('/api/wishlist');
    //  console.log("Fetched wishlist data:", data);
      if (data.success) {
        setWishlist(data.wishlist);
      }
    } catch (error) {
      console.error(error.message);
    }
  };


  const toggleWishlist = async (productId) => {
   // console.log("toggleWishlist called with:", productId);
    if (isInWishlist(productId)) {
    //  console.log("Product is in wishlist, removing:", productId);
      await removeFromWishlist(productId);
    } else {
    //  console.log("Product not in wishlist, adding:", productId);
      await addToWishlist(productId);
    }
  };
  
  const isInWishlist = (productId) => {
    return wishlist.includes(productId);
  };
  
  
  // Add to Wishlist
 const addToWishlist = async (productId) => {
  try {
    const { data } = await axios.post(`/api/wishlist/add/${productId}`);    
    if (data.success) {
      // Optimistic UI update:
      setWishlist(prev => [...prev, productId]);
      toast.success(data.message);
    }
  } catch (error) {
    toast.error(error.message);
  }
};

//remove from wishlist
const removeFromWishlist = async (productId) => {
    try {
      const { data } = await axios.delete(`/api/wishlist/remove/${productId}`);
      if (data.success) {
        // Optimistically remove the product ID directly
        setWishlist(prev => prev.filter(item => item !== productId));
        toast.success(data.message);
      }
    } catch (error) {
      toast.error(error.response?.data?.message || error.message);
    }
  };
  

  
  

  // useEffect to fetch wishlist on user change
  useEffect(() => {
    if (user) {
      fetchWishlist();
    }
  }, [user]);

  useEffect(() => {
    fetchSeller();
    fetchProducts();
    fetchUser();
  }, []);

  // Update database cart items when cartItem changes
  useEffect(() => {
    const updateCart = async () => {
      try {
        const { data } = await axios.post('/api/cart/update', { cartItem: cartItem });
        if (!data.success) {
          toast.error(data.message);
        }
      } catch (error) {
        toast.error(error.message);
      }
    };

    if (user) {
      updateCart();
    }
  }, [cartItem]);

  // Add product to cart
  const addToCart = (itemId) => {
    let cartData = structuredClone(cartItem);
    if (cartData[itemId]) {
      cartData[itemId] += 1;
    } else {
      cartData[itemId] = 1;
    }
    setCartItem(cartData);
    toast.success("Item added to cart");
  };

  // Update cart item quantity
  const updateCartItem = (itemId, quantity) => {
    let cartData = structuredClone(cartItem);
    cartData[itemId] = quantity;
    setCartItem(cartData);
    toast.success("Cart updated");
  };

  // Remove product from cart
  const removeFromCart = (itemId) => {
    let cartData = structuredClone(cartItem);
    if (cartData[itemId]) {
      cartData[itemId] -= 1;
      if (cartData[itemId] === 0) {
        delete cartData[itemId];
      }
      toast.success("Item Removed from cart");
      setCartItem(cartData);
    }
  };

  // Get cart item count
  const getCartCount = () => {
    let totalCount = 0;
    for (const item in cartItem) {
      totalCount += cartItem[item];
    }
    return totalCount;
  };

  // Get cart total amount
  const getCartAmount = () => {
    let totalAmount = 0;
    for (const item in cartItem) {
      let itemInfo = products.find((product) => product._id === item);
      if (cartItem[item] > 0 && itemInfo) {
        totalAmount += itemInfo.offerPrice * cartItem[item];
      }
    }
    return Math.floor(totalAmount * 100) / 100;
  };

  const value = {
    navigate,
    user,
    setUser,
    setIsSeller,
    isSeller,
    ShowUserLogin,
    SetShowUserLogin,
    products,
    currency,
    addToCart,
    updateCartItem,
    removeFromCart,
    cartItem,
    searchQuery,
    setsearchQuery,
    getCartAmount,
    getCartCount,
    axios,
    fetchProducts,
    setCartItem,
    wishlist,
    addToWishlist,
    removeFromWishlist,
    fetchWishlist,
    isInWishlist, 
    toggleWishlist ,
  };

  return (
    <AppContext.Provider value={value}>
      {children}
    </AppContext.Provider>
  );
};

export const UseAppContext = () => {
  return useContext(AppContext);
};
