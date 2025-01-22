import mongoose from "mongoose";

const promoCodeSchema = new mongoose.Schema({
    code: {
         type: String,
         required: true,
         unique: true
         },
    discount: { 
         type: Number,
         required: 
         true 
         }, 
    expirationDate: {
         type: Date,
         required: true 
        },
    isActive: {
         type: Boolean, 
         default: true 
        },
  });

  const promoCodeModel = mongoose.model("promoCode",promoCodeSchema);
  export default promoCodeModel;