import Razorpay from "razorpay";
import orderModel from "../models/orderModel.js";
import userModel from "../models/userModel.js";
import dotenv from "dotenv";

dotenv.config();

const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID,
  key_secret: process.env.RAZORPAY_KEY_SECRET,
});

// Placing user order for frontend
export const placeOrder = async (req, res) => {
  const frontend_url = "http://localhost:5173";

  try {
    const { items, address, paymentMode, userId, amount } = req.body;

    if (!["online", "cod"].includes(paymentMode)) {
      return res.json({ success: false, message: "Invalid payment mode" });
    }

    await userModel.findByIdAndUpdate(userId, { cartData: {} });
    const newOrder = new orderModel({
      userId,
      items,
      amount,
      address,
      payment: paymentMode === "online" ? false : true,
    });
    if (paymentMode === "online") {
       const options = {
        amount: amount , 
        currency: "INR",
        receipt: `${newOrder._id}`, 
      };

      const razorpayOrder = await razorpay.orders.create(options);
      newOrder.orderId = razorpayOrder.id,
      await newOrder.save();
      return res.json({
        success: true,
        orderId: razorpayOrder.id,
        currency: razorpayOrder.currency,
        receipt: razorpayOrder.receipt,
        success_url: `${frontend_url}/verify?success=true&orderId=${newOrder._id}`,
        cancel_url: `${frontend_url}/verify?success=false&orderId=${newOrder._id}`,
      });
    } else if (paymentMode === "cod") {
      await newOrder.save();
      return res.json({
        success: true,
        message: "Order placed successfully with cash on delivery",
        orderId: newOrder._id,
      });
    }
  } catch (error) {
    console.log(error);
    res.json({
      success: false,
      message: "Error occurred while placing the order",
    });
  }
};

export const verifyOrder = async (req, res) => {
  const { razorpay_payment_id,orderId } = req.body;
  
  try {
    if (orderId) {
      await orderModel.findOneAndUpdate({orderId}, { payment: true });
      res.status(200).json({ success: true, message: "Paid" });
    } else {
      await orderModel.findByIdAndDelete(orderId);
      res.status().json({ success: false, message: "Not Paid" });
    }
  } catch (error) {
    console.log(error);
    res.status(500).json({ success: false, message: "error" });
  }
};

// user orders for frontend

export const userOrders = async (req, res) => {
  try {
   
    const {userId} = req.body;

    const orders = await orderModel.find({ userId }); 

    if (orders.length === 0) {
      return res.status(404).json({ success: false, message: "No orders found for this user" });
    }

    res.status(200).json({ success: true, data: orders });
  } catch (error) {
    console.log(error);
    res.status(500).json({ success: false, message: "Error fetching orders" });
  }
};


//Listing orders for admin panel

export const listOrders = async (req, res) => {
  try {
    const orders = await orderModel.find({});
    console.log(orders,"orders");
    
    res.json({ success: true, data: orders });
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: "Error" });
  }
};

// api for updating order status
export const updateStatus = async (req, res) => {
  try {
    await orderModel.findByIdAndUpdate(req.body.orderId, {
      status: req.body.status,
    });
    res.status(200).json({ success: true, message: "Status Updated" });
  } catch (error) {
    console.log(error);
    res.status(500).json({ success: false, message: "Error" });
  }
};
