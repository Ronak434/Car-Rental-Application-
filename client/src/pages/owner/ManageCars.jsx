import React, { useState, useEffect } from "react";
import Title from "../../components/Title";
import { useAppContext } from "../../context/AppContext";
import { assets } from "../../assets/assets";
import toast from "react-hot-toast";

const ManageCars = () => {
  const { isOwner, axios, currency } = useAppContext();

  const [vehicles, setVehicles] = useState([]);

  const fetchOwnerVehicles = async () => {
    // setVehicles(dummyCarData);
    try {
      const { data } = await axios.get("/api/owner/cars");
      if (data.success) {
        setVehicles(data.cars);
      }
    } catch (error) {
      toast.error("Failed to fetch vehicles");
    }
  };

  const toggleAvailability = async (vehicleId) => {
    try {
      const { data } = await axios.post("/api/owner/toggle-car", { carId: vehicleId });
      if (data.success) {
        toast.success(data.message);
        fetchOwnerVehicles();
      }
    } catch (error) {
      toast.error("Failed to toggle availability");
    }
  };

  const deleteVehicle = async (vehicleId) => {
    if (
      window.confirm(
        "Are you sure you want to delete this vehicle?"
      )
    ) {
      try {
        const { data } = await axios.post("/api/owner/delete-car", { carId: vehicleId });
        if (data.success) {
          toast.success(data.message);
          fetchOwnerVehicles();
        }
      } catch (error) {
        toast.error("Failed to delete vehicle");
      }
    }
  };

  useEffect(() => {
    isOwner && fetchOwnerVehicles();
  }, [isOwner]);

  return (
    <div className="px-4 py-10 md:px-10 flex-1">
      <Title
        title="Manage Vehicles"
        subTitle="View all listed vehicles, update their details, or remove them from the booking platform. "
      />

      <div className="mt-8 overflow-x-auto">
        <table className="w-full bg-white rounded-lg shadow">
          <thead className="bg-gray-50">
            <tr>
              <th className="p-3 font-medium">Vehicle</th>
              <th className="p-3 font-medium max-md:hidden">Category</th>
              <th className="p-3 font-medium">Price</th>
              <th className="p-3 font-medium">Status</th>
              <th className="p-3 font-medium">Actions</th>
            </tr>
          </thead>
          <tbody>
            {vehicles.map((vehicle, index) => (
              <tr key={vehicle._id} className="border-t">
                <td className="p-3">
                  <div className="flex items-center gap-3">
                    <img
                      src={vehicle.image}
                      alt={vehicle.brand}
                      className="w-12 h-12 rounded-lg object-cover"
                    />
                    <div>
                      <p className="font-medium">
                        {vehicle.brand}
                        {vehicle.model}
                      </p>
                      <p className="text-sm text-gray-500">
                        {vehicle.seating_capacity}•{vehicle.transmission}
                      </p>
                    </div>
                  </div>
                </td>
                <td className="p-3 max-md:hidden">{vehicle.category}</td>
                <td className="p-3">
                  <span className="font-semibold text-gray-800">{currency} {vehicle.pricePerDay?.toLocaleString()}</span>
                  <span className="text-xs text-gray-400">/day</span>
                </td>
                <td className="p-3">
                  <span
                    className={`px-2 py-1 rounded-full text-xs ${
                      vehicle.isAvaliable
                        ? "bg-green-100 text-green-800"
                        : "bg-red-100 text-red-800"
                    }`}
                  >
                    {vehicle.isAvaliable ? "Available" : "Unavailable"}
                  </span>
                </td>
                <td className="p-3">
                  <div className="flex gap-2">
                    <button
                      onClick={() => toggleAvailability(vehicle._id)}
                      className="p-2 hover:bg-gray-100 rounded-lg"
                    >
                      <img
                        src={
                          vehicle.isAvaliable ? assets.eye_close_icon : assets.eye_icon
                        }
                        alt="toggle"
                        className="w-4 h-4"
                      />
                    </button>
                    <button
                      onClick={() => deleteVehicle(vehicle._id)}
                      className="p-2 hover:bg-red-50 rounded-lg"
                    >
                      <img
                        src={assets.delete_icon}
                        alt="delete"
                        className="w-4 h-4"
                      />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default ManageCars;
