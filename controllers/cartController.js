import userModel from "../models/userModel.js"


//add items to user cart
export const addToCart = async (req,res) => {
  try{
    let userData = await userModel.findOne({_id:req.body.userId});
    let cartData = await userData.cartData;
    if(!cartData[req.body.itemId])
    {
    cartData[req.body.itemId] = 1
    }
    else{
        cartData[req.body.itemId] += 1;
    }
    await userModel.findByIdAndUpdate(req.body.userId,{cartData});
    res.status(200).json({success:true,message:"Added to Cart"})
}catch (error) {
   console.log(error);
   res.status(500).json({success:false,message:"Error"})
  }
}



//remove items from user cart
export const removeFromCart = async (req,res) => {
  try{
    let userData = await userModel.findById(req.body.userId)
    
    let cartData = await userData.cartData;
    console.log(cartData,"cartData");
    
    if(cartData[req.body.itemId]>0) {
      cartData[req.body.itemId] -= 1;
 }
 console.log(Object.keys(cartData),"key");
 
 
 
 await userModel.findByIdAndUpdate(req.body.userId,{cartData});
 res.status(200).json({success:true,message:"Removed From Cart"})
  } catch (error) {
    console.log(error);
    res.status(500).json({success:false,message:"Error"})

  }

}
//fetch user cart data
export const getCart = async (req,res) => {
  try{
    let userData = await userModel.findById(req.body.userId);
    let cartData = await userData.cartData;
    res.status(200).json({success:true,cartData})
  }
  catch(error) {
   console.log(error);
   res.status(500).json({success:false,message:"Error"})
  }

}

