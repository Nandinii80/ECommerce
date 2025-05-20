import cookieParser from 'cookie-parser';
import express from 'express';
import cors from 'cors'; 
import connectDB from './configs/db.js';
import 'dotenv/config';
import userRouter from './routes/UserRoute.js';
import sellerRouter from './routes/SellerRoute.js';
import {connectCloudinary} from './configs/cloud.js';
import productRouter from './routes/productRoute.js';
import cartRouter from './routes/cartRoute.js';
import addressRouter from './routes/addressRoute.js';
import orderRouter from './routes/orderRoute.js';
import { stripeWebooks } from './controllers/orderController.js';
import wishlistRoute from './routes/wishlistRoute.js';  // add .js extension in ES modules

const app = express();
const port = process.env.PORT || 4000;

// const corsOptions = {
//   origin: 'http://localhost:5173',
//   credentials: true, // This is important for allowing cookies, auth headers, etc.
// };
// app.use(cors(corsOptions));

app.use(cors({
  origin : "http://localhost:5173" ,
  //methods : ['GET','PUT','POST','DELETE'],
 // allowedHeaders : ['content-type'],
  credentials: true
}));



// app.options('*', cors({
//   origin: 'http://localhost:5173',
//   credentials: true,
// }));

app.use(express.json());
    app.use(cookieParser());

const startServer = async () => {
  try {
    await connectDB(); // Connect to MongoDB
    await connectCloudinary() //connect to cloud 
  
app.post('/stripe', express.raw({type: 'application/json'},stripeWebooks))

    // Routes
    app.get('/', (req, res) => res.send("API is working"));
    app.use('/api/user',userRouter)
    app.use('/api/seller',sellerRouter)
    app.use('/api/product',productRouter)
    app.use('/api/cart',cartRouter)
    app.use('/api/address',addressRouter)
    app.use('/api/order',orderRouter)
    app.use('/api/wishlist', wishlistRoute);
    

    app.listen(port, () => {
      console.log(`🚀 Server is running on http://localhost:${port}`);
    });

  } catch (err) {
    console.error('❌ Failed to start server:', err);
  }
};

startServer();
