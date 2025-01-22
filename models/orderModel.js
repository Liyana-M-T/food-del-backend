import mongoose from "mongoose"

const orderSchema = new mongoose.Schema({
    userId: {
        type:String,
        required:true
    },
    items: {
        type:mongoose.Schema.Types.ObjectId,
        ref:"item",
    },
    amount:{
        type:Number,
        required:true
    },
    address:{
        type:Object,
        required:true
    },
    status:{
        type:String,
        default:"Food Processing"
    },
    orderId:{
        type:String,
    },
    date:{
        type:Date,
        default:Date.now()
    },
    payment:{
        status: {
            type: String,
            enum: ["Pending", "Paid", "Failed"],
            default: "Pending"
        },
        method: {
            type: String,
            enum: ["Online", "Cash on Delivery"],
            default: "Cash on Delivery"
        }
    }
})

const orderModel = mongoose.model("order",orderSchema);
export default orderModel;