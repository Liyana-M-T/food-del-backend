import adminModel from "../models/adminModel.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

export const AdminLogin = async (req, res) => {
  const { email, password } = req.body;

  try {
    const adminUser = await adminModel.findOne({ email });
    if (!adminUser) {
      return res.status(404).json({ success: false, message: "Admin doesn't exist" });
    }

    const isMatch = await bcrypt.compare(password, adminUser.password);
    if (!isMatch) {
      return res.status(401).json({ success: false, message: "Incorrect email or password" });
    }

    const token = jwt.sign({ id: adminUser._id }, process.env.JWT_SECRET);

    res.status(200).json({
      success: true,
      message: "Admin login successful",
      token,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: "Server error" });
  }
};
