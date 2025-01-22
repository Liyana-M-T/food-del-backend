import mongoose from "mongoose";

const cartSchema = new mongoose.Schema({
    userId: {
        type: String,
        required: true
    },
    items: [{
        itemId: { 
            type: mongoose.Schema.Types.ObjectId,  // This will refer to the item collection
            ref: 'food',
            required: true 
        },
        name: { 
            type: String, 
            required: true 
        },
        price: { 
            type: Number, 
            required: true 
        },
        quantity: { 
            type: Number, 
            required: true 
        }
    }]
});

const cartModel = mongoose.model('cart', cartSchema);

export default cartModel;
