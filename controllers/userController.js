import userModel from "../models/userModel.js"
import jwt from "jsonwebtoken"
import bcrypt from "bcrypt"
import validator from "validator"
import dotenv from "dotenv"
import nodemailer from "nodemailer";

dotenv.config();

const transporter = nodemailer.createTransport({
  service: "Gmail", // Use your email service
  auth: {
    user: process.env.EMAIL_USER, // Your email address
    pass: process.env.EMAIL_PASSWORD, // Your email password or app password
  },
});

// login user
export const loginUser = async (req,res) => {

    const {email,password} = req.body;

    try{
      const user = await userModel.findOne({email})

      if(!user){
        return res.status(404).json({success:false,message:"User Doesn't exist"})
      }

      const isMatch = await bcrypt.compare(password,user.password)

      if (!isMatch) {
        return res.status(401).json({success:false,message:"Inavlid credentials"})
      }

      const token = createToken(user._id);
      
      // Send an email on successful login
      const mailOptions = {
        from: process.env.EMAIL_USER, // Your email address
        to: email, // Recipient email
        subject: "Login Notification",
        text: `Hello ${user.name}, 🍩\n\nYou’re all logged in! Time to treat yourself to something sweet—or savory. 🍕.\n\nHappy dining,\nTomato 🍅`,
      };
      
    console.log(process.env.EMAIL_USER,process.env.EMAIL_PASSWORD);
    
    transporter.sendMail(mailOptions, (err, info) => {
      if (err) {
        console.error("Error sending email:", err);
      } else {
        console.log("Email sent:", info.response);
      }
    });

      res.status(200).json({success:true,token})
    }catch (error) {
      console.log(error);
      res.status(500).json({success:false,message:"Error"})
    }
}

const createToken = (id) => {
    return jwt.sign({id},process.env.JWT_SECRET)
}

// register user
export const registerUser = async (req,res) => {
   const {name,password,email} = req.body;
   try{
    const exists = await userModel.findOne({email})
    if (exists) {
        return res.json({success:false,message:"User already registered"})
    }

    //validating email format & strong password
    if(!validator.isEmail(email)) {
        return res.json({success:false, message:"Please enter a valid email"})
    }

    if(password.length<8) {
      return res.json({success:false,message:"Please enter a strong password"})  
    }

    //hashing user password
    const salt = await bcrypt.genSalt(10)
    const hashedPassword = await bcrypt.hash(password,salt)

    const newUser = new userModel({
        name:name,
        email:email,
        password:hashedPassword
    })

    const user = await newUser.save()
    const token = createToken(user._id)
    res.json({success:true,token})
    
   } catch(error) {
     console.log(error);
     res.json({success:false,message:"Error"})
   }
}

// fetch all users (admin)
export const fetchUsers = async (req, res) => {
  try {
    const users = await userModel.find({}, { password: 0 }); // Exclude password for security
    if (users.length === 0) {
      return res.status(404).json({ success: false, message: "No users found" });
    }

    res.status(200).json({ success: true, data: users });
  } catch (error) {
    console.log(error);
    res.status(500).json({ success: false, message: "Error fetching users" });
  }
};

// remove user (admin)
export const removeUser = async (req, res) => {
  const { userId } = req.params;

  try {
    const deletedUser = await userModel.findByIdAndDelete(userId);

    if (!deletedUser) {
      return res.status(404).json({ success: false, message: "User not found" });
    }

    res.status(200).json({ success: true, message: "User removed successfully" });
  } catch (error) {
    console.log(error);
    res.status(500).json({ success: false, message: "Error removing user" });
  }
};