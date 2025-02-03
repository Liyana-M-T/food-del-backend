import userModel from "../models/userModel.js"


//add items to user cart
export const addToCart = async (req,res) => {
   const { userId, itemId } = req.body;

  try{
    let userData = await userModel.findOne({_id:userId});
    let cartData = await userData.cartData;
    if(!cartData[itemId])
    {
       cartData[itemId] = 1
    }
    else{
        cartData[itemId] += 1;
    }
    await userModel.findByIdAndUpdate(userId,{cartData});
    res.status(200).json({success:true,message:"Added to Cart"})
}catch (error) {
   console.log(error);
   res.status(500).json({success:false,message:"Error"})
  }
}

//remove items from user cart
export const removeFromCart = async (req,res) => {
  const { userId, itemId } = req.body;

  try{
    let userData = await userModel.findById(userId)
    let cartData = await userData.cartData;
    if(cartData[itemId]>0) {
      cartData[itemId] -= 1;
    }
    await userModel.findByIdAndUpdate(userId,{cartData});
    res.status(200).json({success:true,message:"Removed From Cart"})
  } catch (error) {
    console.log(error);
    res.status(500).json({success:false,message:"Error"})
  }
}

//fetch user cart data
export const getCart = async (req,res) => {
  const { userId } = req.body;

  try{
    let userData = await userModel.findById(userId);
    let cartData = await userData.cartData;
    res.status(200).json({success:true,cartData})
  }
  catch(error) {
   console.log(error);
   res.status(500).json({success:false,message:"Error"})
  }
}

