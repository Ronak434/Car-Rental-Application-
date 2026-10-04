import mongoose from "mongoose";
const { ObjectId } = mongoose.Schema.Types;
const vehicleSchema = new mongoose.Schema(
  {
    brand: { type: String, required: true },
    model: { type: String, required: true },
    year: { type: Number, required: true },
    pricePerDay: { type: Number, required: true },
    category: { type: String, required: true },
    transmission: { type: String, required: true },
    fuel_type: { type: String, required: true },
    seating_capacity: { type: Number, required: true },
    location: { type: String, required: true },
    description: { type: String, required: true },
    image: { type: String, required: true },
    owner: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    isAvaliable: { type: Boolean, default: true },
  },
  { timestamps: true }
);
const Car = mongoose.model('Car', vehicleSchema);
export default Car;