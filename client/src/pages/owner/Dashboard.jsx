import React, { useState, useEffect } from "react";
import Title from "../../components/Title";
import { useAppContext } from "../../context/AppContext";
import { assets } from "../../assets/assets";
import toast from "react-hot-toast";

const Dashboard = () => {
  const { axios, currency } = useAppContext();
  const [data, setData] = useState({
    totalVehicles: 0,
    totalBookings: 0,
    totalRevenue: 0,
    recentBookings: [],
  });

  const dashboardCards = [
    { title: "Total Vehicles", value: data.totalVehicles, icon: assets.carIconColored },
    { title: "Total Bookings", value: data.totalBookings, icon: assets.bookingIconColored },
    { title: "Total Revenue", value: `${currency} ${Number(data.totalRevenue).toLocaleString()}`, icon: assets.revenueIconColored },
  ];

  const fetchDashboardData = async () => {
    try {
      const { data: responseData } = await axios.get("/api/owner/dashboard");
      if (responseData.success) {
        setData(responseData.data);
      } else {
        toast.error(responseData.message || "Failed to fetch dashboard data");
      }
    } catch (error) {
      console.error("Dashboard fetch error:", error);
      toast.error(error.response?.data?.message || "Failed to fetch dashboard data");
    }
  };

  useEffect(() => {
    fetchDashboardData();
  }, []);

  return (
    <div className="px-4 py-10 md:px-10 flex-1">
      <Title
        title="Dashboard"
        subTitle="Monitor overall platform performance including total vehicles, bookings, revenue, and recent activities"
      />

      {/* Dashboard Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-8">
        {dashboardCards.map((card, index) => (
          <div key={index} className="bg-white p-6 rounded-lg shadow">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-xs text-gray-500">{card.title}</h1>
                <p className="text-lg font-semibold">{card.value}</p>
              </div>
              <div className="p-3 bg-gray-100 rounded-lg">
                <img src={card.icon} alt="" className="h-4 w-4" />
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Recent Bookings */}
      <div className="mt-8 bg-white rounded-lg shadow">
        <div className="p-6 border-b">
          <h2 className="text-lg font-semibold">Recent Bookings</h2>
        </div>
        <div className="p-6">
          {data.recentBookings && data.recentBookings.length > 0 ? (
            <div className="space-y-4">
              {data.recentBookings.map((booking, index) => {
                const vehicle = booking.vehicle || booking.car;
                return (
                  <div key={booking._id || index} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                    <div className="flex items-center gap-4">
                      <img
                        src={vehicle?.image || assets.main_car}
                        alt={vehicle?.brand || "Car"}
                        className="w-12 h-12 rounded-lg object-cover"
                      />
                      <div>
                        <p className="font-medium">
                          {vehicle ? `${vehicle.brand} ${vehicle.model}` : "Vehicle unavailable"}
                        </p>
                        <p className="text-sm text-gray-500">
                          {booking.pickupDate ? new Date(booking.pickupDate).toLocaleDateString() : ""} - {booking.returnDate ? new Date(booking.returnDate).toLocaleDateString() : ""}
                        </p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="font-semibold text-gray-800">{currency} {Number(booking.price).toLocaleString()}</p>
                      <p className="text-sm text-gray-500 capitalize">{booking.status}</p>
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            <p className="text-gray-500 text-center py-8">No recent bookings</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
