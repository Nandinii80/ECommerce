

//add address = /api/address/add

import Address from "../models/Address.js"


// POST /api/address/add
export const addAddress = async (req, res) => {
  try {
    const {
      firstName,
      lastName,
      email,
      street,
      city,
      state,
      zipcode,
      country,
      phone
    } = req.body.address;

    const userId = req.user._id; // ✅ Get user ID from auth middleware

    if (!userId) {
      return res.status(400).json({ success: false, message: "User not authenticated" });
    }

    await Address.create({
      userId,
      firstName,
      lastName,
      email,
      street,
      city,
      state,
      zipcode,
      country,
      phone
    });

    res.json({ success: true, message: "Address added successfully" });
  } catch (error) {
    console.log(error.message);
    res.status(500).json({ success: false, message: error.message });
  }
};

 
//get address = /api/address/get

export const getAddress = async (req, res) => {
  try {
    const userId = req.user._id;  // get userId from authenticated user

    if (!userId) {
      return res.status(400).json({ success: false, message: "userId is required" });
    }

    const addresses = await Address.find({ userId });

    res.json({ success: true, addresses });
  } catch (error) {
    console.log(error.message);
    res.status(500).json({ success: false, message: error.message });
  }
};
