import mongoose  from "mongoose";

const itemSchema = new mongoose.Schema({
    _id: { type: mongoose.Schema.Types.ObjectId, required: true },
    name: { type: String, required: true },
    description: { type: String },
    price: { type: Number, required: true },
    category: { type: String },
    image: { type: String },
    quantity: { type: Number, required: true },  
});

const itemModel = mongoose.model("item", itemSchema);
export default itemModel;