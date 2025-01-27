import express from "express";
import cors from "cors";
import { connectDB } from "./config/db.js";
import foodRouter from "./routes/foodRoute.js";
import dotenv from "dotenv";
import userRouter from "./routes/userRoute.js";
import cartRouter from "./routes/cartRoute.js"
import orderRouter from "./routes/orderRoute.js";
import promocodeRouter from "./routes/promoCodeRoute.js";
import adminRouter from "./routes/adminRoute.js";
import bcrypt from "bcrypt"

dotenv.config();

//app config
const app = express();
const port = process.env.PORT;

//middleware
app.use(express.json());
app.use(cors());

//db connection
connectDB();

//api endpoints
app.use("/api/food", foodRouter);
app.use("/images", express.static("uploads"));
app.use("/api/user", userRouter)
app.use("/api/cart",cartRouter)
app.use("/api/order",orderRouter)
app.use("/api/promocode",promocodeRouter)
app.use("/api/admin",adminRouter)

app.get("/", (req, res) => {
  res.send("API Working");
});

app.listen(port, () => {
  console.log(`server started on htttp:localhost:${port}`);
});
const password = 'admin2';
bcrypt.hash(password, 10).then((hash) => console.log(hash));

