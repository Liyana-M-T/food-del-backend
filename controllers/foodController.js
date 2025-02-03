import foodModel from "../models/foodModel.js";
import fs from 'fs'

// Add food item
export const addFood = async (req, res) => {
    let image_filename = `${req.file.filename}`;

        const food = new foodModel({
            name: req.body.name,
            description: req.body.description,
            price: req.body.price,
            category: req.body.category,
            image: image_filename,
        });
        try {
            await food.save();
        res.status(201).json({
            success: true,
            message: "Food Added",});
        }catch(error) {
            console.log(error)
            res.status(500).json({success:false,message:"An error occurred while adding the food item."})
        }
    }
      

// List all food items
export const listFood = async (req, res) => {
    try {
        const foods = await foodModel.find({});
        res.status(200).json({
            success: true,
            data: foods
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({
            success: false,
            message: "An error occurred while fetching the food list."
        });
    }
};


//update Food

export let updateFood = async (req, res) => {
  const { id, name, category, price } = req.body;
  const image_filename = req.file ? `${req.file.filename}` : null; 
  
  try {
    const food = await foodModel.findById(id); 
    if (!food) {
      return res.status(404).json({ success: false, message: "Food item not found" });
    }

    if (name) food.name = name;
    if (category) food.category = category;
    if (price) food.price = price;
    if (image_filename) food.image = image_filename; 

    await food.save();

    res.status(200).json({
      success: true,
      message: "Food item updated successfully",
      data: food,
    });
  } catch (error) {
    console.error("Error updating food item:", error);
    res.status(500).json({
      success: false,
      message: "An error occurred while updating the food item",
    });
  }
};


// Remove food item
export const removeFood = async (req, res) => {
    try {
        if (!req.body.id) {
            return res.status(400).json({
                success: false,
                message: "ID is required."
            });
        }

        const food = await foodModel.findById(req.body.id);
        if (!food) {
            return res.status(404).json({
                success: false,
                message: "Food item not found."
            });
        }

        // Delete the file
        fs.unlink(`uploads/${food.image}`, (err) => {
            if (err) {
                console.error("Error deleting file:", err);
            }
        });

        await foodModel.findByIdAndDelete(req.body.id);

        res.status(200).json({
            success: true,
            message: "Food Removed"
        });
        
    } catch (error) {
        console.error(error);
        res.status(500).json({
            success: false,
            message: "An error occurred while removing the food item."
        });
    }
};




