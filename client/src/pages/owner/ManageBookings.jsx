import React, { useState, useEffect } from "react";
// import { dummyMyBookingsData } from "../../assets/assets";
import Title from "../../components/owner/Title";
import { useAppContext } from "../../context/AppContext";
import toast from "react-hot-toast";
const ManageBookings = () => {
  const { currency, axios } = useAppContext();
  // const currency = import.meta.env.VITE_CURRENCY;

  const [bookings, setBookings] = useState([]);
  const fetchOwnerBookings = async () => {
    // setBookings(dummyMyBookingsData);

    try {
      const { data } = await axios.get("/api/bookings/owner");
      data.success ? setBookings(data.bookings) : toast.error(data.message);
    } catch (error) {
      toast.error(error.message);
    }
  };

  const changeBookingStatus = async (bookingId, status) => {
    try {
      const { data } = await axios.post("/api/bookings/change-status", {
        bookingId,
        status,
      });
      if (data.success) {
        toast.success(data.message);
        fetchOwnerBookings();
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      toast.error(error.message);
    }
  };
  useEffect(() => {
    fetchOwnerBookings();
  }, []);
  return (
    <div className="px-4 pt-10 md:px-10 w-full">
      <Title
        title="Manage Bookings"
        subTitle="Track all customer bookings, approve or cancel requests, and manage booking statuses. "
      />
      <div className="max-w-3xl w-full rounded-md overflow-hidden border border-borderColor mt-6">
        <table className="w-full border-collapse text-left text-sm text-gray-600">
          <thead className="text-gray-500">
            <tr>
              <th className="p-3 font-medium">Vehicle</th>
              <th className="p-3 font-medium">Customer</th>
              <th className="p-3 font-medium">Dates</th>
              <th className="p-3 font-medium">Price</th>
              <th className="p-3 font-medium">Status</th>
            </tr>
          </thead>
          <tbody>
            {bookings.map((booking, index) => {
              const vehicle = booking.vehicle || booking.car;
              return (
                <tr
                  key={booking._id || index}
                  className="border-t border-borderColor text-gray-500"
                >
                  <td className="p-3">
                    <div className="flex items-center gap-3">
                      <img
                        src={vehicle?.image || ""}
                        alt={vehicle?.brand || "Car"}
                        className="w-12 h-12 rounded-lg object-cover"
                      />
                      <div>
                        <p className="font-medium">
                          {vehicle ? `${vehicle.brand} ${vehicle.model}` : "Vehicle unavailable"}
                        </p>
                        {vehicle?.pricePerDay && (
                          <p className="text-xs text-gray-400">
                            {currency} {vehicle.pricePerDay}/day
                          </p>
                        )}
                      </div>
                    </div>
                  </td>
                  <td className="p-3 max-md:hidden">
                    {booking.pickupDate ? booking.pickupDate.split("T")[0] : ""} to{" "}
                    {booking.returnDate ? booking.returnDate.split("T")[0] : ""}
                  </td>
                  <td className="p-3">
                    <span className="font-semibold text-gray-800">
                      {currency} {booking.price?.toLocaleString()}
                    </span>
                  </td>
                  <td className="p-3 max-md:hidden">
                    <span className="bg-gray-100 px-3 py-1 rounded-full text-xs">
                      offline
                    </span>
                  </td>
                  <td className="p-3">
                    {booking.status === "pending" ? (
                      <select
                        onChange={e => changeBookingStatus(booking._id, e.target.value)}
                        value={booking.status}
                        className="px-2 py-1.5 mt-1 text-gray-500 border border-borderColor rounded-md outline-none"
                      >
                        <option value="pending">Pending</option>
                        <option value="cancelled">Cancelled</option>
                        <option value="confirmed">Confirmed</option>
                      </select>
                    ) : (
                      <span
                        className={`px-3 py-1 rounded-full text-xs font-semibold ${
                          booking.status === 'confirmed' ? 'bg-green-100 text-green-500' : 'bg-red-100 text-red-500'
                        }`}
                      >
                        {booking.status}
                      </span>
                    )}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default ManageBookings;
