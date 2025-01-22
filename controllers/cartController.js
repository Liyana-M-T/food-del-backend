import cartModel from "../models/cartModel.js"

//add items to user cart
export const addToCart = async (req, res) => {
  try {
    const { userId, itemId, name, price, quantity } = req.body;

    let cart = await cartModel.findOne({ userId });

    if (!cart) {
      // Create a new cart if none exists for the user
      cart = new cartModel({
        userId,
        items: [{ itemId, name, price, quantity }],
      });
    } else {
      // Check if the item already exists in the cart
      const existingItem = cart.items.find(item => item.itemId.toString() === itemId);

      if (existingItem) {
        // Update the quantity if the item exists
        existingItem.quantity += quantity;
      } else {
        // Add the new item to the cart
        cart.items.push({ itemId, name, price, quantity });
      }
    }

    await cart.save();
    res.status(200).json({ success: true, message: "Item added to cart", cart });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: "Error adding to cart" });
  }
};


//remove items from user cart
export const removeFromCart = async (req, res) => {
  try {
    const { userId, itemId } = req.body;

    const cart = await cartModel.findOne({ userId });

    if (!cart) {
      return res.status(404).json({ success: false, message: "Cart not found" });
    }

    const itemIndex = cart.items.findIndex(item => item.itemId.toString() === itemId);

    if (itemIndex !== -1) {
      if (cart.items[itemIndex].quantity > 1) {
        // Decrement the quantity if more than 1
        cart.items[itemIndex].quantity -= 1;
      } else {
        // Remove the item from the cart if quantity is 1
        cart.items.splice(itemIndex, 1);
      }

      await cart.save();
      res.status(200).json({ success: true, message: "Item removed from cart", cart });
    } else {
      res.status(404).json({ success: false, message: "Item not found in cart" });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: "Error removing from cart" });
  }
};


//fetch user cart data
export const getCart = async (req, res) => {
  try {
    const { userId } = req.params;

    const cart = await cartModel.findOne({ userId });

    if (!cart) {
      return res.status(404).json({ success: false, message: "Cart not found" });
    }

    res.status(200).json({ success: true, cart });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: "Error fetching cart data" });
  }
};
