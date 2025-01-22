import jwt from "jsonwebtoken"
import { v4 as uuidv4 } from 'uuid';

const authMiddleware = async (req,res,next) => {
 const {token} = req.headers;
 if (!token){
    return res.status(401).json({success:"false",message:"not Authorized Login Again"})
 }
 try{
    const token_decode = jwt.verify(token,process.env.JWT_SECRET);
    req.body.userId = token_decode.id ? token_decode.id : uuidv4();  ;
    next();
 }catch (error) {
   console.log(error);
   res.status(500).json({success:false,message:"Error"})
 }
}

export default authMiddleware;
