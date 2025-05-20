import React, { useEffect, useState } from 'react'
import { UseAppContext } from '../context/AppContext'
import { assets } from '../assets/greencart_assets/assets'
import toast from 'react-hot-toast'

const Cart = () => {
  const [showAddress, setShowAddress] = useState(false)
  const {
    products,
    currency,
    cartItem,
    removeFromCart,
    setCartItem,
    axios,
    getCartCount,
    user,
    updateCartItem,
    navigate,
    getCartAmount,
  } = UseAppContext()

  const [cartArray, setCartArray] = useState([])
  const [address, setAddress] = useState([])
  const [selectedAddress, setSelectedAddress] = useState(null)
  const [paymentOption, setPaymentOption] = useState('COD')

  const getCart = () => {
    let tempArray = []
    for (const key in cartItem) {
      const product = products.find((item) => item._id === key)
      if (product) {
        tempArray.push({ ...product, quantity: cartItem[key] }) // create a copy to avoid mutation
      }
    }
    setCartArray(tempArray)
  }

  const getUserAddress = async () => {
    try {
      const { data } = await axios.get('/api/address/get')
      if (data.success) {
        setAddress(data.addresses)  // <---- correct key
        if (data.addresses.length > 0) {
          setSelectedAddress(data.addresses[0])
        }
      } else {
        toast.error(data.message)
      }
    } catch (error) {
      toast.error(error.message)
    }
  }
  

  const placeOrder = async () => {
    try {
      if (!selectedAddress) {
        return toast.error('Please select address')
      }
      if (paymentOption === 'COD') {
        const { data } = await axios.post('/api/order/cod', {
          userId: user._id,
          items: cartArray.map((item) => ({
            product: item._id,
            quantity: item.quantity,
          })),
          address: selectedAddress._id,
        })
        if (data.success) {
          toast.success(data.message)
          setCartItem({})
          navigate('/my-orders')
        } else {
          toast.error(data.message)
        }
      }
      // You can add online payment logic here later
    else{
      const { data } = await axios.post('/api/order/stripe', {
        userId: user._id,
        items: cartArray.map((item) => ({
          product: item._id,
          quantity: item.quantity,
        })),
        address: selectedAddress._id,
      })
      if (data.success) {
       window.location.replace(data.url)
      } else {
        toast.error(data.message)
      }
    }
  
    } 
    catch (error) {
      toast.error(error.message)
    }
  }

  useEffect(() => {
    console.log("cartItem: ", cartItem)
    console.log("products: ", products)
    if (products.length > 0 && cartItem) getCart()
  }, [products, cartItem])

  useEffect(() => {
    if (user) {
      getUserAddress()
    }
  }, [user])

  const cartAmount = getCartAmount()
  const tax = (cartAmount * 2) / 100
  const totalAmount = cartAmount + tax

  if (!products.length || !cartItem || Object.keys(cartItem).length === 0) {
    return (
      <p className="mt-16 text-center text-gray-500 text-lg">
        Your cart is empty
      </p>
    )
  }

  return (
    <div className="flex flex-col md:flex-row mt-16">
      <div className="flex-1 max-w-4xl">
        <h1 className="text-3xl font-medium mb-6">
          Shopping Cart{' '}
          <span className="text-sm text-primary">{getCartCount()} Items</span>
        </h1>

        <div className="grid grid-cols-[2fr_1fr_1fr] text-gray-500 text-base font-medium pb-3">
          <p className="text-left">Product Details</p>
          <p className="text-center">Subtotal</p>
          <p className="text-center">Action</p>
        </div>

        {cartArray.map((product) => (
          <div
            key={product._id}
            className="grid grid-cols-[2fr_1fr_1fr] text-gray-500 items-center text-sm md:text-base font-medium pt-3"
          >
            <div className="flex items-center md:gap-6 gap-3">
              <div
                onClick={() => {
                  navigate(
                    `/products/${product.category.toLowerCase()}/${product._id}`
                  )
                  scrollTo(0, 0)
                }}
                className="cursor-pointer w-24 h-24 flex items-center justify-center border border-gray-300 rounded"
              >
                <img
                  className="max-w-full h-full object-cover"
                  src={product.image[0]}
                  alt={product.name}
                />
              </div>
              <div>
                <p className="hidden md:block font-semibold">{product.name}</p>
                <div className="font-normal text-gray-500/70">
                  <p>
                    Weight: <span>{product.weight || 'N/A'}</span>
                  </p>
                  <div className="flex items-center">
                    <p>Qty:</p>
                    <select
                      onChange={(e) =>
                        updateCartItem(product._id, Number(e.target.value))
                      }
                      value={cartItem[product._id]}
                      className="outline-none"
                    >
                      {Array.from(
                        {
                          length: Math.max(cartItem[product._id], 10),
                        },
                        (_, i) => i + 1
                      ).map((val) => (
                        <option key={val} value={val}>
                          {val}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>
              </div>
            </div>
            <p className="text-center">
              {currency}
              {(product.offerPrice * product.quantity).toFixed(2)}
            </p>
            <button
              onClick={() => removeFromCart(product._id)}
              className="cursor-pointer mx-auto"
            >
              <img
                src={assets.remove_icon}
                className="inline-block w-6 h-6"
                alt="Remove"
              />
            </button>
          </div>
        ))}

        <button
          onClick={() => {
            navigate('/products')
            scrollTo(0, 0)
          }}
          className="group cursor-pointer flex items-center mt-8 gap-2 text-primary font-medium"
        >
          <img
            className="group-hover:-translate-x-1 transition"
            src={assets.arrow_right_icon_colored}
            alt="Continue Shopping"
          />
          Continue Shopping
        </button>
      </div>

      <div className="max-w-[360px] w-full bg-gray-100/40 p-5 max-md:mt-16 border border-gray-300/70">
        <h2 className="text-xl md:text-xl font-medium">Order Summary</h2>
        <hr className="border-gray-300 my-5" />

        <div className="mb-6">
          <p className="text-sm font-medium uppercase">Delivery Address</p>
          <div className="relative flex justify-between items-start mt-2">
            <p className="text-gray-500">
              {selectedAddress
                ? `${selectedAddress.street}, ${selectedAddress.city}, ${selectedAddress.state}, ${selectedAddress.country}`
                : 'No Address Found'}
            </p>
            <button
              onClick={() => setShowAddress(!showAddress)}
              className="text-primary hover:underline cursor-pointer"
            >
              Change
            </button>
            {showAddress && (
              <div className="absolute top-12 py-1 bg-white border border-gray-300 text-sm w-full z-10">
                {address.map((addressItem, index) => (
                  <p
                    key={addressItem._id || index}
                    onClick={() => {
                      setSelectedAddress(addressItem)
                      setShowAddress(false)
                    }}
                    className="text-gray-500 p-2 hover:bg-gray-100 cursor-pointer"
                  >
                    {addressItem.street},{addressItem.city},{addressItem.state},{addressItem.country}
                  </p>
                ))}
                <p
                  onClick={() => navigate('/add-address')}
                  className="text-primary text-center cursor-pointer p-2 hover:bg-primary/10"
                >
                  Add address
                </p>
              </div>
            )}
          </div>

          <p className="text-sm font-medium uppercase mt-6">Payment Method</p>

          <select
            onChange={(e) => setPaymentOption(e.target.value)}
            className="w-full border border-gray-300 bg-white px-3 py-2 mt-2 outline-none"
            value={paymentOption}
          >
            <option value="COD">Cash On Delivery</option>
            <option value="Online">Online Payment</option>
          </select>
        </div>

        <hr className="border-gray-300" />

        <div className="text-gray-500 mt-4 space-y-2">
          <p className="flex justify-between">
            <span>Price</span>
            <span>
              {currency}
              {cartAmount.toFixed(2)}
            </span>
          </p>
          <p className="flex justify-between">
            <span>Shipping Fee</span>
            <span className="text-green-600">Free</span>
          </p>
          <p className="flex justify-between">
            <span>Tax (2%)</span>
            <span>
              {currency}
              {tax.toFixed(2)}
            </span>
          </p>
          <p className="flex justify-between text-lg font-medium mt-3">
            <span>Total Amount:</span>
            <span>
              {currency}
              {totalAmount.toFixed(2)}
            </span>
          </p>
        </div>

        <button
          onClick={placeOrder}
          className="w-full py-3 mt-6 cursor-pointer bg-primary text-white font-medium hover:bg-primary-dull transition"
        >
          {paymentOption === 'COD' ? 'Place Order' : 'Proceed To CheckOut'}
        </button>
      </div>
    </div>
  )
}

export default Cart
