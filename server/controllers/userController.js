import User from "../models/User.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import Car from "../models/Car.js"; // ✅ Use correct path & casing

// Generate JWT Token
const generateToken = (userId, role = 'user') => {
  return jwt.sign({ _id: userId, role }, process.env.JWT_SECRET || "your-secret-key");
};

const publicUser = (user) => ({
  _id: user._id,
  name: user.name,
  email: user.email,
  role: user.role,
  image: user.image || "",
});

// Register User
export const registerUser = async (req, res) => {
  try {
    const { name, email, password } = req.body;
    if (!name || !email || !password ) {
      return res.json({ success: false, message: "Fill all the fields" });
    }
    const userExists = await User.findOne({ email });
    if (userExists) {
      return res.json({ success: false, message: "User already exists" });
    }
    const hashedPassword = await bcrypt.hash(password, 10);
    const user = await User.create({ name, email, password: hashedPassword });
    const token = generateToken(user._id.toString(), user.role);
    res.json({
      success: true,
      token,
      user: publicUser(user),
      message: "Registration successful",
    });
  } catch (error) {
    console.log(error.message);
    res.json({ success: false, message: error.message });
  }
};

// Login User
export const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    if (!user) {
      return res.json({ success: false, message: "User not found" });
    }
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.json({ success: false, message: "Invalid credentials" });
    }
    const token = generateToken(user._id.toString(), user.role);
    res.json({
      success: true,
      token,
      user: publicUser(user),
      message: "Login successful",
    });
  } catch (error) {
    console.log(error.message);
    res.json({ success: false, message: error.message });
  }
};

// Get user data from token
export const getUserData = async (req, res) => {
  try {
    const { _id } = req.user;
    const user = await User.findById(_id).select('-password');
    if (!user) {
      return res.status(404).json({ success: false, message: "User not found" });
    }
    res.json({ success: true, user });
  } catch (error) {
    res.json({ success: false, message: error.message });
  }
};

// List a new vehicle
export const addCar = async (req, res) => {
  try {   
    const { _id } = req.user;
    const vehicle = JSON.parse(req.body.carData);
    const imageFile = req.file;

    const newVehicle = new Car({
      ...vehicle,
      image: imageFile.filename,
      owner: _id,
    });

    await newVehicle.save();

    res.json({ success: true, message: "Vehicle added successfully" });
  } catch (error) {
    res.json({ success: false, message: error.message });
  }
};

export const getCars = async (req, res) => {
  try {
    const vehicles = await Car.find({ isAvaliable: true });
    res.json({ success: true, cars: vehicles });
  } catch (error) {
    res.json({ success: false, message: error.message });
  }
};
