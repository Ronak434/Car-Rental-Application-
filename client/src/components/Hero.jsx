import React from "react";
import { assets, cityList } from "../assets/assets.js";
import { useAppContext } from "../context/AppContext";
import { motion } from "motion/react";

const Hero = () => {
  const { pickupLocation, setPickupLocation, pickupDate, setPickupDate, returnDate, setReturnDate, navigate } = useAppContext();
  const handleSubmit = (e) => {
    e.preventDefault();
    navigate(
      "/vehicles?pickupLocation=" +
        pickupLocation +
        "&pickupDate=" +
        pickupDate +
        "&returnDate=" +
        returnDate
    );
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.8 }}
      className="h-screen flex flex-col items-center justify-center gap-14 bg-light text-center"
    >
      <motion.h1
        initial={{ y: 50, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.8, delay: 0.2 }}
        className=" text-4x1 md: text-5x1 font-semibold"
      >
        Luxury vehicles on Rent
      </motion.h1>
      <motion.form
        initial={{ scale: 0.95, opacity: 0, y: 50 }}
        animate={{ scale: 1, opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.4 }}
        onSubmit={handleSubmit}
        className="flex flex-col md:flex-row items-start md:items-center justify-between p-6 rounded-full w-full max-w-5xl bg-white shadow-[0px_8px_20px_rgba(0,0,0,0.1)] border border-gray-300"
      >
        <div className="flex flex-col md:flex-row items-start md:items-center gap-10 md:ml-8">
          {/* Location */}
          <div className="flex flex-col items-start gap-2">
            <label htmlFor="location" className="text-sm text-gray-500">
              Select Location
            </label>
            <select
              id="location"
              required
              value={pickupLocation}
              onChange={(e) => setPickupLocation(e.target.value)}
              className="text-sm text-gray-500 border border-gray-300 rounded-md px-4 py-2"
            >
              <option value="">Choose a city</option>
              {cityList.map((city) => (
                <option key={city} value={city}>
                  {city}
                </option>
              ))}
            </select>
          </div>

          {/* Pick-up Date */}
          <div className="flex flex-col items-start gap-2">
            <label htmlFor="pickup-date">Pick-up Date</label>
            <input
              type="date"
              id="pickup-date"
              min={new Date().toISOString().split("T")[0]}
              value={pickupDate}
              onChange={(e) => setPickupDate(e.target.value)}
              className="text-sm text-gray-500 border border-gray-300 rounded-md px-4 py-2"
              required
            />
          </div>

          {/* Return Date */}
          <div className="flex flex-col items-start gap-2">
            <label htmlFor="return-date">Return Date</label>
            <input
              type="date"
              id="return-date"
              min={pickupDate || new Date().toISOString().split("T")[0]}
              value={returnDate}
              onChange={(e) => setReturnDate(e.target.value)}
              className="text-sm text-gray-500 border border-gray-300 rounded-md px-4 py-2"
              required
            />
          </div>

          {/* Search Button */}
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            type="submit"
            className="flex items-center justify-center gap-1 px-9 py-3 max-sm:mt-4 bg-primary hover:bg-primary-dull text-white rounded-full cursor-pointer"
          >
            <motion.img
              initial={{ y: 100, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ duration: 0.8, delay: 0.6 }}
              src={assets.search_icon}
              alt="search"
              className="brightness-300"
            />
            Search
          </motion.button>
        </div>
      </motion.form>

      {/* Hero Image */}
      <img src={assets.main_car} alt="vehicle" className="max-h-74" />
    </motion.div>
  );
};

export default Hero;
