import Order from "../models/Order.js"
import Product from "../models/Product.js"
import Stripe from 'stripe';
import User from "../models/User.js"
//place order trough online payemnt
//api/order/stripe
export const placeOrderStripe = async(req,res) => {
  try {
    const { userId, items, address } = req.body;
    const {origin} = req.headers;
    if (!address || items.length === 0) {
      return res.status(400).json({ success: false, message: "Invalid data" });
    }
    let productData = []
    // Calculate amount properly with async loop
    let amount = 0;
    for (const item of items) {
      const product = await Product.findById(item.product);
      productData.push({
        name : product.name,
        price : product.offerPrice,
        quantity : item.quantity,
      })
      if (!product) return res.status(400).json({ success: false, message: "Invalid product in items" });
      amount += product.offerPrice * item.quantity;
    }

    // Add tax (2%)
    amount += Math.floor(amount * 0.02);

   const order =  await Order.create({
      userId,
      items,
      amount,
      address,
      paymentType: "Online",
    });

//stripe gateway 
const stripeInstance = new Stripe(process.env.STRIPE_SECRET_KEY) 

//create line items for stripe 
const line_items = productData.map((item)=>{
  return {
    price_data : {
      currency: "usd",
      product_data :{
        name: item.name,
      },
      unit_amount : Math.floor((item.price + item.price * 0.02) *100) 
    },
    quantity : item.quantity,
  }
})

  
//create session 
const session = await stripeInstance.checkout.sessions.create({
  payment_method_types: ['card'],
  line_items,
  mode:"payment",
  success_url : `${origin}/loader?next=my-orders`,
  cancel_url : `${origin}/cart`,
  metadata : {
    orderId : order._id.toString(),
    userId,
  }
})

return res.json({ success: true, url : session.url });
} catch (error) {
  return res.status(500).json({ success: false, message: error.message });
}
};

//stripe webooks to verify payments action 
export const stripeWebooks = async (request, response) => {
  const stripeInstance = new Stripe(process.env.STRIPE_SECRET_KEY);
  const sig = request.headers["stripe-signature"];

  let event;

  try {
    event = stripeInstance.webhooks.constructEvent(
  request.body,
  sig,
  process.env.STRIPE_WEBHOOK_SECRET
);

  } catch (error) {
    console.log("Error constructing webhook event:", error.message);
    return response.status(400).send(`Webhook Error: ${error.message}`);
  }

  try {
    switch (event.type) {
      case "payment_intent.succeeded": {
        console.log("PaymentIntent was successful!");
        const paymentIntent = event.data.object;
        const paymentIntentId = paymentIntent.id;

        // Retrieve session(s) for this payment intent
        const sessions = await stripeInstance.checkout.sessions.list({
          payment_intent: paymentIntentId,
        });

        if (sessions.data.length === 0) {
          console.log("No sessions found for payment_intent:", paymentIntentId);
          break;
        }

        const { orderId, userId } = sessions.data[0].metadata;

        // Mark order paid
        await Order.findByIdAndUpdate(orderId, { isPaid: true });

        // Clear user cart (ensure field name is correct)
        await User.findByIdAndUpdate(userId, { cartItem: [] });

        break;
      }
      case "payment_intent.payment_failed": {
        const paymentIntent = event.data.object;
        const paymentIntentId = paymentIntent.id;

        const sessions = await stripeInstance.checkout.sessions.list({
          payment_intent: paymentIntentId,
        });

        if (sessions.data.length > 0) {
          const { orderId } = sessions.data[0].metadata;
          await Order.findByIdAndDelete(orderId);
        }

        break;
      }
      default:
        console.log(`Unhandled event type ${event.type}`);
    }

    response.json({ received: true });
  } catch (error) {
    response.status(500).send(`Webhook handler error: ${error.message}`);
  }
};




//place order COD = /api/order/cod
export const placeOrderCOD = async(req,res) => {
  try {
    const { userId, items, address } = req.body;
    if (!address || items.length === 0) {
      return res.status(400).json({ success: false, message: "Invalid data" });
    }

    // Calculate amount properly with async loop
    let amount = 0;
    for (const item of items) {
      const product = await Product.findById(item.product);
      if (!product) return res.status(400).json({ success: false, message: "Invalid product in items" });
      amount += product.offerPrice * item.quantity;
    }

    // Add tax (2%)
    amount += Math.floor(amount * 0.02);

    await Order.create({
      userId,
      items,
      amount,
      address,
      paymentType: "COD",
    });

    return res.json({ success: true, message: "Order placed successfully" });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};


//get orders by user id /api/order/user

export const getUserOrders = async (req,res)=>{
   try{
    const userId = req.user._id;
    const orders = await Order.find({
        userId, 
        $or: [{paymentType : "COD"},{isPaid:true}]
     }).populate('items.product address').sort({createdAt : -1})
     res.json({success:true,orders})
   }
   catch(error){
    return res.json({success:false, message: error.message})
 }
}

// get all order seller/admin = /api/order/seller

export const getAllOrders = async (req, res) => {
  try {
    const orders = await Order.find({
      $or: [{ paymentType: "COD" }, { isPaid: true }],
    })
      .populate("items.product address")
      .sort({ createdAt: -1 });

    res.json({ success: true, orders });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};