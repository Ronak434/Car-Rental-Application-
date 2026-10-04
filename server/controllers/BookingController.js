import Car from "../models/Car.js";
import Booking from "../models/Booking.js";

// Function to check if a vehicle is available for the selected date range
const checkAvailability = async (vehicle, pickupDate, returnDate) => {
  const conflictingBooking = await Booking.findOne({
    vehicle,
    $or: [
      {
        pickupDate: { $lte: new Date(returnDate) },
        returnDate: { $gte: new Date(pickupDate) },
      },
    ],
  });
  return !conflictingBooking;
};

// API to check availability of vehicles at a location for the date range
export const checkAvailabilityOfCar = async (req, res) => {
  try {
    const { location, pickupDate, returnDate } = req.body;
    const vehicles = await Car.find({ location, isAvaliable: true });

    const availableVehiclesPromises = vehicles.map(async (vehicle) => {
      const isAvailable = await checkAvailability(vehicle._id, pickupDate, returnDate);
      return { ...vehicle._doc, isAvailable };
    });

    let availableVehicles = await Promise.all(availableVehiclesPromises);
    availableVehicles = availableVehicles.filter((vehicle) => vehicle.isAvailable === true);

    res.json({ success: true, availableCars: availableVehicles });
  } catch (error) {
    console.log(error.message);
    res.json({ success: false, message: error.message });
  }
};

// API to create a new booking
export const createBooking = async (req, res) => {
  try {
    const { _id } = req.user;
    const { car, pickupDate, returnDate } = req.body;

    const isAvailable = await checkAvailability(car, pickupDate, returnDate);
    if (!isAvailable) {
      return res.status(400).json({ success: false, message: "Vehicle is not available" });
    }

    const vehicleData = await Car.findById(car);

    const picked = new Date(pickupDate);
    const returned = new Date(returnDate);
    const noOfDays = Math.ceil((returned - picked) / (1000 * 60 * 60 * 24));
    const price = vehicleData.pricePerDay * noOfDays;

    const booking = await Booking.create({
      vehicle: car,
      car: car,
      owner: vehicleData.owner,
      user: _id,
      pickupDate,
      returnDate,
      price,
    });

    res.status(201).json({ success: true, message: "Booking Created", booking });
  } catch (error) {
    console.log(error.message);
    res.status(500).json({ success: false, message: error.message });
  }
};

// API to get user bookings
export const getUserBookings = async (req, res) => {
  try {
    const { _id } = req.user;
    const bookings = await Booking.find({ user: _id })
      .populate("vehicle")
      .populate("car")
      .populate("owner")
      .sort({ createdAt: -1 });

    const normalizedBookings = bookings.map((b) => {
      const doc = b.toObject ? b.toObject() : { ...b };
      const carData = doc.vehicle || doc.car || null;
      return {
        ...doc,
        vehicle: carData,
        car: carData,
      };
    });

    res.json({ success: true, bookings: normalizedBookings });
  } catch (error) {
    console.log(error.message);
    res.json({ success: false, message: error.message });
  }
};

// API to get owner bookings
export const getOwnerBookings = async (req, res) => {
  try {
    const { _id } = req.user;
    const bookings = await Booking.find({ owner: _id })
      .populate("vehicle")
      .populate("car")
      .populate("user")
      .sort({ createdAt: -1 });

    const normalizedBookings = bookings.map((b) => {
      const doc = b.toObject ? b.toObject() : { ...b };
      const carData = doc.vehicle || doc.car || null;
      return {
        ...doc,
        vehicle: carData,
        car: carData,
      };
    });

    res.json({ success: true, bookings: normalizedBookings });
  } catch (error) {
    console.log(error.message);
    res.json({ success: false, message: error.message });
  }
};

// API to change booking status by the owner
export const changeBookingStatus = async (req, res) => {
  try {
    const { _id } = req.user;
    const { bookingId, status } = req.body;

    const validStatuses = ["pending", "confirmed", "cancelled"];
    if (!validStatuses.includes(status)) {
      return res.status(400).json({ success: false, message: "Invalid status" });
    }

    const booking = await Booking.findById(bookingId);
    if (!booking) {
      return res.status(404).json({ success: false, message: "Booking not found" });
    }

    if (booking.owner.toString() !== _id.toString()) {
      return res.status(403).json({ success: false, message: "Unauthorized" });
    }

    booking.status = status;
    await booking.save();

    res.status(200).json({ success: true, message: "Status Updated" });
  } catch (error) {
    console.log(error.message);
    res.status(500).json({ success: false, message: error.message });
  }
};
