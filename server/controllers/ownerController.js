import imagekit from "../configs/imageKit.js";
import Booking from "../models/Booking.js";
import Car from "../models/Car.js";
import User from "../models/User.js";
import fs from "fs";
import jwt from "jsonwebtoken";

// API to Change Role of User
export const changeRoleToOwner = async (req, res) => {
  try {
    const { _id } = req.user;
    console.log("Changing role for user:", _id);
    
    const updatedUser = await User.findByIdAndUpdate(_id, { role: "owner" }, { new: true }).select("-password");
    console.log("Updated user:", updatedUser);
    
    // Generate new token with updated role
    const tokenPayload = { _id: updatedUser._id.toString(), role: updatedUser.role };
    console.log("Token payload:", tokenPayload);
    
    const token = jwt.sign(
      tokenPayload,
      process.env.JWT_SECRET || "your-secret-key"
    );
    
    console.log("Generated new token with role:", updatedUser.role);
    
    res.json({ 
      success: true, 
      message: "Now you can list vehicles",
      token,
      user: updatedUser
    });
  } catch (error) {
    console.log(error.message);
    res.json({ success: false, message: error.message });
  }
};

// API to List Vehicle
export const addCar = async (req, res) => {
  try {
    const { _id, role } = req.user;
    
    console.log("Server received request from user:", { _id, role });
    console.log("Full req.user object:", req.user);
    
    // Check if user is an owner
    if (role !== "owner") {
      console.log("Access denied - user role is:", role);
      return res.status(403).json({ success: false, message: "Only owners can add vehicles. Please change your role to owner first." });
    }
    let vehicle = JSON.parse(req.body.carData);
    const imageFile = req.file;
    // Upload Image to ImageKit
    const fileBuffer = fs.readFileSync(imageFile.path);
    const response = await imagekit.upload({
      file: fileBuffer,
      fileName: imageFile.originalname,
      folder: "/vehicles",
    });

    // optimization through imagekit URL transformation
    var optimizedImageUrl = imagekit.url({
      path: response.filePath,
      transformation: [
        { width: "1280" }, // Width resizing
        { quality: "auto" }, // Auto compression
        { format: "webp" }, // Convert to modern format
      ],
    });

    const image = optimizedImageUrl;
    await Car.create({ ...vehicle, owner: _id, image });
    res.json({ success: true, message: "Vehicle Added" });
  } catch (error) {
    console.log(error.message);
    res.json({ success: false, message: error.message });
  }
};

// API to List Owner Vehicles
export const getOwnerCars = async (req, res) => {
  try {
    const { _id } = req.user;
    const vehicles = await Car.find({ owner: _id });
    res.json({ success: true, cars: vehicles });
  } catch (error) {
    console.log(error.message);
    res.json({ success: false, message: error.message });
  }
};

export const toggleCarAvailability = async (req, res) => {
  try {
    const { _id } = req.user;
    const { carId } = req.body;
    const vehicle = await Car.findById(carId);
    // Checking is vehicle belongs to the user
    if (vehicle.owner.toString() !== _id.toString()) {
      return res.status(403).json({ success: false, message: "You can only toggle your own vehicles" });
    }
    vehicle.isAvaliable = !vehicle.isAvaliable;
    await vehicle.save();
    res.json({ success: true, message: "Vehicle availability toggled" });
  } catch (error) {
    console.log(error.message);
    res.json({ success: false, message: error.message });
  }
};

//delete a vehicle
export const deleteCar = async (req, res) => {
  try {
    const { _id } = req.user;
    const { carId } = req.body;
    const vehicle = await Car.findById(carId);
    // Checking is vehicle belongs to the user
    if (vehicle.owner.toString() !== _id.toString()) {
      return res.status(403).json({ success: false, message: "You can only delete your own vehicles" });
    }
    vehicle.owner = null;
    vehicle.isAvaliable = false;
    await vehicle.save();
    res.json({ success: true, message: "Vehicle deleted" });
  } catch (error) {
    console.log(error.message);
    res.json({ success: false, message: error.message });
  }
};

// API to get dashboard data
export const getDashboardData = async (req, res) => {
  try {
    const { _id } = req.user;
    const vehicles = await Car.find({ owner: _id });
    
    // Get all bookings for overall totals
    const allOwnerBookings = await Booking.find({ owner: _id });
    const totalRevenue = allOwnerBookings.reduce(
      (sum, booking) => sum + (Number(booking.price) || 0),
      0
    );
    const totalBookings = allOwnerBookings.length;

    // Get 5 most recent bookings
    const bookings = await Booking.find({ owner: _id })
      .populate("vehicle")
      .populate("car")
      .populate("user")
      .sort({ createdAt: -1 })
      .limit(5);

    // Normalize bookings so both vehicle and car fields exist
    const normalizedBookings = bookings.map((b) => {
      const doc = b.toObject ? b.toObject() : { ...b };
      const carData = doc.vehicle || doc.car || null;
      return {
        ...doc,
        vehicle: carData,
        car: carData,
      };
    });

    res.json({
      success: true,
      data: {
        totalVehicles: vehicles.length,
        totalBookings,
        totalRevenue,
        recentBookings: normalizedBookings,
      },
    });
  } catch (error) {
    console.error("Error in getDashboardData:", error);
    res.status(500).json({ success: false, message: error.message || "Server error fetching dashboard" });
  }
};

// API to update user image
export const updateUserImage = async (req, res) => {
  try {
    const { _id } = req.user;
    const imageFile = req.file;

    // Upload Image to ImageKit
    const fileBuffer = fs.readFileSync(imageFile.path);
    const response = await imagekit.upload({
      file: fileBuffer,
      fileName: imageFile.originalname,
      folder: "/users",
    });

    // optimization through imagekit URL transformation
    var optimizedImageUrl = imagekit.url({
      path: response.filePath,
      transformation: [
        { width: "1280" }, // Width resizing
        { quality: "auto" }, // Auto compression
        { format: "webp" }, // Convert to modern format
      ],
    });

    const image = optimizedImageUrl;
    await User.findByIdAndUpdate(_id, { image });
    res.json({ success: true, message: "Image updated" });
  } catch (error) {
    console.log(error.message);
    res.json({ success: false, message: error.message });
  }
};
