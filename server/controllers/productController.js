import Product from "../models/Product.js"
import { cloudinary } from "../configs/cloud.js";

//add product = api/product/add
export const addProduct = async(req,res)=>{
   try{
       let productData = JSON.parse(req.body.productData)

       const images = req.files

       let imagesUrl = await Promise.all(
        images.map(async(item)=>{
            let result = await cloudinary.uploader.upload(item.path, {resource_type: 'image'})
            return result.secure_url
        })
       )
       await Product.create({...productData , image:imagesUrl})

       res.json({success:true, message:"product addedd"})
   }
   catch(error){
console.log(error.message);
res.json({success:false , message: error.message})
   }
}

//get product /api/product/list 
// GET /api/product/list
export const productList = async (req, res) => {
    try {
      const { category, sort, priceRange, inStock } = req.query;
      let filter = {};
      let sortQuery = {};
  
      // Filter by category
      if (category) {
        filter.category = category;
      }
  
      // Filter by price range
      if (priceRange) {
        const [min, max] = priceRange.split("-").map(Number);
        filter.price = { $gte: min, $lte: max };
      }
  
      // Filter by inStock
      if (inStock === "true") {
        filter.inStock = true;
      } else if (inStock === "false") {
        filter.inStock = false;
      }
  
      // Sort by selected field
      if (sort === "price_asc") sortQuery.price = 1;
      else if (sort === "price_desc") sortQuery.price = -1;
      else if (sort === "name_asc") sortQuery.name = 1;
      else if (sort === "name_desc") sortQuery.name = -1;
  
      const products = await Product.find(filter).sort(sortQuery);
  
      res.json({ success: true, products });
    } catch (error) {
      console.log(error.message);
      res.json({ success: false, message: error.message });
    }
  };
  
//get single product = /api/product/idd
export const productById = async (req,res)=>{
try {
const {id} = req.params 
const product = await Product.findById(id)
res.json({success: true, product})
}
catch(error){
    console.log(error.message);
    res.json({success:false , message: error.message})
       }
}

//change product instock = /api/product/stock
export const changeStock = async (req,res)=>{
    try{
        const {inStock} = req.body
        const {id} = req.params

        await Product.findByIdAndUpdate(id,{inStock})
        res.json({success:true , message:"stock updated"})
    }
    catch(error){
        console.log(error.message);
        res.json({success:false , message: error.message})
           }
}