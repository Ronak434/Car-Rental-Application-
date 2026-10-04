import React, { useState } from "react";
import Title from "../components/Title";
import { assets, dummyCarData } from "../assets/assets";
import CarCards from "../components/CarCards";
import { useSearchParams } from "react-router-dom";
import { useAppContext } from "../context/AppContext";
import toast from "react-hot-toast";
import { useEffect } from "react";
import { motion } from "motion/react";

const Cars = () => {
  // getting search params from url
  const [searchParams] = useSearchParams();
  const pickupLocation = searchParams.get("pickupLocation");
  const pickupDate = searchParams.get("pickupDate");
  const returnDate = searchParams.get("returnDate");
  const { cars, axios, setPickupLocation, setPickupDate, setReturnDate } = useAppContext();

  const searchParam = searchParams.get("search") || "";
  const [input, setInput] = useState(searchParam);

  const isSearchData = pickupLocation && pickupDate && returnDate;
  const [filteredVehicles, setFilteredVehicles] = useState([]);

  const applyFilter = () => {
    if (input === "") {
      setFilteredVehicles(cars);
      return;
    }
    const filtered = cars.filter((vehicle) => {
      return (
        vehicle.brand.toLowerCase().includes(input.toLowerCase()) ||
        vehicle.model.toLowerCase().includes(input.toLowerCase()) ||
        vehicle.category.toLowerCase().includes(input.toLowerCase()) ||
        vehicle.transmission.toLowerCase().includes(input.toLowerCase())
      );
    });
    setFilteredVehicles(filtered);
  };

  const searchVehicleAvailablity = async () => {
    const { data } = await axios.post("/api/bookings/check-availability", {
      location: pickupLocation,
      pickupDate,
      returnDate,
    });
    if (data.success) {
      let availableVehicles = data.availableCars;
      if (input !== "") {
        availableVehicles = availableVehicles.filter((vehicle) => {
          return (
            vehicle.brand.toLowerCase().includes(input.toLowerCase()) ||
            vehicle.model.toLowerCase().includes(input.toLowerCase()) ||
            vehicle.category.toLowerCase().includes(input.toLowerCase()) ||
            vehicle.transmission.toLowerCase().includes(input.toLowerCase())
          );
        });
      }
      setFilteredVehicles(availableVehicles);
      if (availableVehicles.length === 0) {
        toast("No vehicles available");
      }
      return;
    }
    setFilteredVehicles([]);
  };

  useEffect(() => {
    setInput(searchParam);
  }, [searchParam]);

  useEffect(() => {
    if (isSearchData) {
      searchVehicleAvailablity();
    } else {
      applyFilter();
    }
  }, [input, cars]);

  useEffect(() => {
    if (pickupLocation) setPickupLocation(pickupLocation);
    if (pickupDate) setPickupDate(pickupDate);
    if (returnDate) setReturnDate(returnDate);
  }, [pickupLocation, pickupDate, returnDate]);

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, ease: "easeOut" }}
    >
      <div className="flex flex-col items-center py-20 bg-light max-md:px-4">
        <Title
          title="Available Vehicles"
          subTitle="Browse our selection of premium vehicles available for your next adventure"
        />
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, duration: 0.5 }}
          className="flex items-center bg-white px-4 mt-6 max-w-140 w-full h-12 rounded-full shadow"
        >
          <img src={assets.search_icon} alt="" className="w-4.5 h-4.5 mr-2" />
          <input
            onChange={(e) => setInput(e.target.value)}
            value={input}
            type="text"
            placeholder="Search by make, model, or features"
            className="w-full h-full outline-none text-gray-500"
          />
          <img src={assets.filter_icon} alt="" className="w-4.5 h-4.5 ml-2" />
        </motion.div>
      </div>
              <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6, duration: 0.5 }}
          className="px-6 md:px-16 lg:px-24 xl:px-32 mt-10"
        >
          <p className="text-gray-500 xl:px-20 max-w-7xl mx-auto">
            Showing {filteredVehicles.length} Vehicles
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 mt-4 xl:px-20 max-w-7xl mx-auto">
          {filteredVehicles.map((vehicle, index) => (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 * index, duration: 0.4 }}
              key={index}
            >
              <CarCards car={vehicle} />
            </motion.div>
          ))}
        </div>
      </motion.div>
    </motion.div>
  );
};

export default Cars;
