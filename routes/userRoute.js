import express from "express"
import { loginUser,registerUser,fetchUsers,removeUser, updateUser } from "../controllers/userController.js"

const userRouter = express.Router()

userRouter.post("/register",registerUser)
userRouter.post("/login",loginUser)
userRouter.get("/list", fetchUsers);
userRouter.put('/update/:userId', updateUser)
userRouter.delete("/remove/:userId", removeUser);


export default userRouter;