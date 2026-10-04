import React, { useState, useEffect } from "react";
import Title from "../../components/owner/Title";
import { assets } from "../../assets/assets";
import { useAppContext } from "../../context/AppContext";
import toast from "react-hot-toast";

const AddCar = () => {
  const { axios, currency, user, isOwner, updateUserData } = useAppContext();
  // const currency = import.meta.env.VITE_CURRENCY;
  const [image, setImage] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  
  // Monitor state changes
  useEffect(() => {
    console.log("AddCar component - user changed:", user);
    console.log("AddCar component - isOwner changed:", isOwner);
  }, [user, isOwner]);
  
  const [vehicle, setVehicle] = useState({
    brand: "",
    model: "",
    year: 0,
    pricePerDay: 0,
    category: "",
    transmission: "",
    fuel_type: "",
    seating_capacity: 0,
    location: "",
    description: "",
  });
  const onSubmitHandler = async (e) => {
    e.preventDefault();
    if (isLoading) return null;
    setIsLoading(true);
    
    // Debug: Check current token and headers
    console.log("Current token:", localStorage.getItem("token"));
    console.log("Current axios headers:", axios.defaults.headers.common["Authorization"]);
    console.log("Current user role:", user?.role);
    console.log("Is owner state:", isOwner);
    
    try {
      const formData = new FormData();
      formData.append("image", image);
      formData.append("carData", JSON.stringify(vehicle));
      const { data } = await axios.post("/api/owner/add-car", formData);
      if (data.success) {
        toast.success(data.message);
        setImage(null);
        setVehicle({
          brand: "",
          model: "",
          year: 0,
          pricePerDay: 0,
          category: "",
          transmission: "",
          fuel_type: "",
          seating_capacity: 0,
          location: "",
          description: "",
        });
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      if (error.response?.status === 403) {
        toast.error("You need to be an owner to add vehicles. Please change your role to owner first.");
      } else {
        toast.error(error.response?.data?.message || error.message);
      }
    }
    finally {
      setIsLoading(false);
    }
  };
  // Check if user is an owner
  console.log("Current user:", user);
  console.log("Is owner:", isOwner);
  console.log("User role from user object:", user?.role);
  
  // Force check the token
  const currentToken = localStorage.getItem("token");
  console.log("Current token from localStorage:", currentToken);
  
  // Decode token to see what's in it
  if (currentToken) {
    try {
      const tokenParts = currentToken.split('.');
      const payload = JSON.parse(atob(tokenParts[1]));
      console.log("Decoded token payload:", payload);
      console.log("Token user ID:", payload._id);
      console.log("Current user ID:", user?._id);
      console.log("Database user ID from image: 68850c784da40779ffa72a79");
      console.log("Are they the same?", payload._id === user?._id);
    } catch (error) {
      console.log("Error decoding token:", error);
    }
  }
  
  if (!isOwner || user?.role !== "owner") {
    return (
      <div className="px-4 py-10 md:px-10 flex-1">
        <Title
          title="Access Denied"
          subTitle="You need to be an owner to add vehicles"
        />
        <div className="mt-6 max-w-xl">
          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-6">
            <h3 className="text-lg font-semibold text-yellow-800 mb-2">
              Owner Access Required
            </h3>
            <p className="text-yellow-700 mb-4">
              To add vehicles to the platform, you need to change your role to "owner" first.
            </p>
            <div className="flex flex-wrap gap-3">
              <button
                onClick={async () => {
                  try {
                    const { data } = await axios.post("/api/owner/change-role");
                    if (data.success) {
                      // Update token and headers
                      localStorage.setItem("token", data.token);
                      axios.defaults.headers.common["Authorization"] = `Bearer ${data.token}`;
                      updateUserData(data.user);
                      toast.success(data.message);
                      
                      // Verify the new token
                      console.log("New token:", data.token);
                      const tokenParts = data.token.split('.');
                      const payload = JSON.parse(atob(tokenParts[1]));
                      console.log("New token payload:", payload);
                      
                      // Force refresh to ensure everything is updated
                      setTimeout(() => {
                        window.location.reload();
                      }, 1000);
                    } else {
                      toast.error(data.message);
                    }
                  } catch (error) {
                    toast.error(error.response?.data?.message || error.message);
                  }
                }}
                className="bg-primary text-white px-4 py-2 rounded-md hover:bg-primary-dull transition-colors mr-3"
              >
                Change to Owner
              </button>
              
              <button
                onClick={() => {
                  localStorage.removeItem("token");
                  window.location.reload();
                }}
                className="bg-gray-500 text-white px-4 py-2 rounded-md hover:bg-gray-600 transition-colors"
              >
                Logout & Login Again
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="px-4 py-10 md:px-10 flex-1">
      <Title
        title="Add New Vehicle"
        subTitle="Fill in details to list a new vehicle for booking, including pricing, availability, and vehicle specifications. "
      />

      <form onSubmit={onSubmitHandler} className="mt-8 max-w-4xl">
        {/* Vehicle Image */}
        <div className="mb-6">
          <label htmlFor="vehicle-image">
            <span className="block text-sm font-medium text-gray-700 mb-2">
              Vehicle Image *
            </span>
          </label>
          <input
            type="file"
            id="vehicle-image"
            accept="image/*"
            onChange={(e) => setImage(e.target.files[0])}
            required
            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
          />
          <p className="text-sm text-gray-500">Upload a picture of your vehicle</p>
        </div>

        {/* Vehicle Brand & Model */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Brand *
            </label>
            <input
              type="text"
              placeholder="e.g., Toyota, Honda"
              value={vehicle.brand}
              onChange={(e) => setVehicle({ ...vehicle, brand: e.target.value })}
              required
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Model *
            </label>
            <input
              type="text"
              placeholder="e.g., Camry, Civic"
              value={vehicle.model}
              onChange={(e) => setVehicle({ ...vehicle, model: e.target.value })}
              required
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
            />
          </div>
        </div>

        {/* Vehicle Year, Price, Category */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Year *
            </label>
            <input
              type="number"
              placeholder="2020"
              value={vehicle.year}
              onChange={(e) => setVehicle({ ...vehicle, year: e.target.value })}
              required
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Price per Day ({currency}) *
            </label>
            <input
              type="number"
              placeholder="50"
              value={vehicle.pricePerDay}
              onChange={(e) => setVehicle({ ...vehicle, pricePerDay: e.target.value })}
              required
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Category *
            </label>
            <select
              onChange={(e) => setVehicle({ ...vehicle, category: e.target.value })}
              value={vehicle.category}
              required
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
            >
              <option value="">Select Category</option>
              <option value="Sedan">Sedan</option>
              <option value="SUV">SUV</option>
              <option value="Hatchback">Hatchback</option>
              <option value="Luxury">Luxury</option>
              <option value="Sports">Sports</option>
            </select>
          </div>
        </div>

        {/* Vehicle Transmission, Fuel Type, Seating Capacity */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Transmission *
            </label>
            <select
              onChange={(e) => setVehicle({ ...vehicle, transmission: e.target.value })}
              value={vehicle.transmission}
              required
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
            >
              <option value="">Select Transmission</option>
              <option value="Automatic">Automatic</option>
              <option value="Manual">Manual</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Fuel Type *
            </label>
            <select
              onChange={(e) => setVehicle({ ...vehicle, fuel_type: e.target.value })}
              value={vehicle.fuel_type}
              required
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
            >
              <option value="">Select Fuel Type</option>
              <option value="Petrol">Petrol</option>
              <option value="Diesel">Diesel</option>
              <option value="Electric">Electric</option>
              <option value="Hybrid">Hybrid</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Seating Capacity *
            </label>
            <input
              type="number"
              placeholder="5"
              value={vehicle.seating_capacity}
              onChange={(e) => setVehicle({ ...vehicle, seating_capacity: e.target.value })}
              required
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
            />
          </div>
        </div>

        {/* Location & Description */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Location *
            </label>
            <input
              type="text"
              placeholder="e.g., New York, NY"
              value={vehicle.location}
              onChange={(e) => setVehicle({ ...vehicle, location: e.target.value })}
              required
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Description *
            </label>
            <textarea
              placeholder="Describe your vehicle..."
              value={vehicle.description}
              onChange={(e) => setVehicle({ ...vehicle, description: e.target.value })}
              required
              rows="3"
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
            />
          </div>
        </div>

        <button
          type="submit"
          disabled={isLoading}
          className="w-full bg-primary text-white py-3 px-6 rounded-lg hover:bg-primary-dull transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isLoading ? "Adding Vehicle..." : "Add Vehicle"}
        </button>
      </form>
    </div>
  );
};

export default AddCar;
