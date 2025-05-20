import React from 'react'
import Navbar from './components/Navbar'
import { Route, Routes, useLocation } from 'react-router-dom'
import Home from './pages/Home'
import { Toaster } from 'react-hot-toast'
import Footer from './components/Footer'
import { UseAppContext } from './context/AppContext'
import Login from './components/Login'
import AllProducts from './pages/AllProducts'
import ProductCategory from './pages/ProductCategory'
import ProductDetails from './pages/ProductDetails'
import Cart from './pages/Cart'
import AddAddress from './pages/AddAddress'
import MyOrders from './pages/MyOrders'
import SellerLogin from './components/seller/SellerLogin'
import SellerLayout from './pages/seller/SellerLayout'
import AddProduct from './pages/seller/AddProduct'
import ProductsList from './pages/seller/ProductsList'
import Orders from './pages/seller/Orders'
import Loading from './components/Loading'
import WishlistPage from './pages/WishlistPage'

const App = () => {

  const isSellerPath = useLocation().pathname.includes("seller");
const {ShowUserLogin,isSeller} = UseAppContext()
  return (
    <div className='text-default min-h-screen text-gray-700 bg-white'>
    {isSellerPath ? null : <Navbar/> }  
{ShowUserLogin ? <Login/> : null}
    <Toaster>
    </Toaster>
      <div className= {`${isSellerPath ? "" : "px-6 md:px-16 lg:px-24 xl:px-32"}`}>
      <Routes>
  <Route path='/' element={<Home/>} />
  <Route path='/products' element={<AllProducts/>}/>
  <Route path='/products/:category' element={<ProductCategory/>}/>
  <Route path='/products/:category/:id' element={<ProductDetails/>}/>
  <Route path='/cart' element={<Cart/>}/>
  <Route path='/add-address' element={<AddAddress/>}/>
  <Route path='/my-orders' element={<MyOrders/>}/>
  <Route path="/wishlist" element={<WishlistPage />} />
  <Route path='/loader' element={<Loading/>}/>
  <Route path='/seller' element={isSeller ? <SellerLayout/> : <SellerLogin/>}>
    <Route index element={<AddProduct />} />
    <Route path='product-list' element={<ProductsList />} />
    <Route path='orders' element={<Orders />} />
  </Route>
</Routes>

      </div>
    { !isSellerPath && <Footer/>}
    </div>

  )
}

export default App
