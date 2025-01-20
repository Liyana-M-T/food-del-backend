import Razorpay from "razorpay";
import orderModel from "../models/orderModel.js";
import userModel from "../models/userModel.js";
import dotenv from "dotenv";
import foodModel from "../models/foodModel.js";

dotenv.config();

const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID,
  key_secret: process.env.RAZORPAY_KEY_SECRET,
});

// Placing user order for frontend
export const placeOrder = async (req, res) => {
  const frontend_url = "http://localhost:5173";

  try {
    const { items, address, paymentMode, userId } = req.body;
    console.log(userId, "user");

    // Validate payment mode
    if (!["online", "cod"].includes(paymentMode)) {
      return res.json({ success: false, message: "Invalid payment mode" });
    }
  let amount = 0;
  
  const datas = await Promise.all(
    Object.entries(items).map(async (item) => {
      // console.log(item,'item');
      const food = await foodModel.findById(item[0]);
      
      if (food) {
        // console.log(item, 'item');
        
        amount = amount + (food?.price * item[1]);
      }
    })
  );
  console.log(amount, "amount");


    // After placing order, clear user's cart
    await userModel.findByIdAndUpdate(userId, { cartData: {} });
    const newOrder = new orderModel({
      userId,
      items,
      amount,
      address,
      payment: paymentMode === "online" ? false : true, // Set payment status for COD
    });
    if (paymentMode === "online") {
      // Prepare Razorpay order for online payment
      const options = {
        amount: amount *100, // Razorpay accepts amount in paise
        currency: "INR",
        receipt: `${newOrder._id}`, // Unique receipt ID
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
      // For cash on delivery, respond with success
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
    const orders = await orderModel.find({ userId: req.body.userId });
    console.log("User ID from request:", req.body.userId);

    res.status(200).json({ success: true, data: orders });
  } catch (error) {
    console.log(error);
    res.status(500).json({ success: false, message: "Error" });
  }
};

//Listing orders for admin panel

export const listOrders = async (req, res) => {
  try {
    const orders = await orderModel.find({});
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
