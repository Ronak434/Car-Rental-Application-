import React from "react";
import { useNavigate } from "react-router-dom";

import Title from "./Title";
import CarCards from "./CarCards";
import { assets } from "../assets/assets.js";
import { useAppContext } from "../context/AppContext";
import { motion } from "motion/react";

const FeaturedSection = () => {
  const navigate = useNavigate();
  const { cars } = useAppContext();
  
  console.log("FeaturedSection - vehicles:", cars);
  console.log("FeaturedSection - vehicles length:", cars.length);

  return (
    <motion.section
      initial={{ opacity: 0, y: 50 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8 }}
      viewport={{ once: true }}
      className="py-20 bg-white"
    >
      <div className="max-w-7xl mx-auto px-6 md:px-16 lg:px-24 xl:px-32">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-800 mb-4">
            Featured Vehicles
          </h2>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Discover our handpicked selection of premium vehicles for your next
            adventure
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
          {cars.slice(0, 6).map((vehicle) => (
            <motion.div
              key={vehicle._id}
              whileHover={{ y: -5 }}
              transition={{ duration: 0.3 }}
            >
              <CarCards car={vehicle} />
            </motion.div>
          ))}
        </div>

        <div className="text-center">
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => navigate("/vehicles")}
            className="inline-flex items-center gap-2 bg-primary text-white px-8 py-3 rounded-lg hover:bg-primary-dull transition-colors"
          >
            Explore all vehicles <img src={assets.arrow_icon} alt="arrow" />
          </motion.button>
        </div>
      </div>
    </motion.section>
  );
};

export default FeaturedSection;
