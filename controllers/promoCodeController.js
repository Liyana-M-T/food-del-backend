import PromoCodeModel from "../models/promoCodeModel.js";

// Admin: Create a Promo Code
export const createPromoCode = async (req, res) => {
  const { code, discount, expirationDate } = req.body;

  if (!code || !discount || !expirationDate) {
    return res.status(400).json({ message: 'All fields are required' });
  }

  try {
    const newPromoCode = new PromoCodeModel({
      code,
      discount,
      expirationDate,
      isActive: true,
    });

    await newPromoCode.save();
    res.status(201).json({ message: 'Promo code created successfully', promoCode: newPromoCode });
  } catch (error) {
    res.status(500).json({ message: 'Error creating promo code', error: error.message });
  }
};

// Admin: Deactivate a Promo Code
export const deactivatePromoCode = async (req, res) => {
    const { code } = req.body;
  
    if (!code) {
      return res.status(400).json({ message: 'Promo code is required' });
    }
  
    try {
      const promoCode = await PromoCodeModel.findOneAndUpdate(
        { code },
        { isActive: false },
        { new: true }
      );
  
      if (!promoCode) {
        return res.status(404).json({ message: 'Promo code not found' });
      }
  
      res.status(200).json({ message: 'Promo code deactivated', promoCode });
    } catch (error) {
      res.status(500).json({ message: 'Error deactivating promo code', error: error.message });
    }
  };

  // Admin: Fetch all Promo Codes
export const fetchPromoCodes = async (req, res) => {
    try {
      const promoCodes = await PromoCodeModel.find(); // Fetch all promo codes
      if (!promoCodes.length) {
        return res.status(404).json({ message: 'No promo codes available' });
      }
      res.status(200).json(promoCodes); // Return all promo codes
    } catch (error) {
      res.status(500).json({ message: 'Error fetching promo codes', error: error.message });
    }
  };
  
// User: Validate a Promo Code
export const validatePromoCode = async (req, res) => {
  const { code } = req.body;

  if (!code) {
    return res.status(400).json({ message: 'Promo code is required' });
  }

  try {
    const promoCode = await PromoCodeModel.findOne({ code, isActive: true });

    if (!promoCode) {
      return res.status(404).json({ message: 'Invalid or expired promo code' });
    }

    if (new Date() > new Date(promoCode.expirationDate)) {
      return res.status(400).json({ message: 'Promo code has expired' });
    }

    res.status(200).json({ message: 'Promo code is valid', discount: promoCode.discount });
  } catch (error) {
    res.status(500).json({ message: 'Error validating promo code', error: error.message });
  }
};

