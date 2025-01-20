import express from "express"
import { loginUser,registerUser,fetchUsers,removeUser } from "../controllers/userController.js"

const userRouter = express.Router()

userRouter.post("/register",registerUser)
userRouter.post("/login",loginUser)
userRouter.get("/list", fetchUsers);
userRouter.delete("/remove/:userId", removeUser);


export default userRouter;