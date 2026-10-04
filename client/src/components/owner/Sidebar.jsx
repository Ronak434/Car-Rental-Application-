import React, { useState } from "react";
import { assets, ownerMenuLinks } from "../../assets/assets";
import { NavLink, useLocation } from "react-router-dom";
import { useAppContext } from "../../context/AppContext";
import toast from "react-hot-toast";

const Sidebar = () => {
  const { user, axios, fetchUser } = useAppContext();
  const location = useLocation();
  const [image, setImage] = useState(null);

  const updateImage = async () => {
    try {
      const formData = new FormData();
      formData.append("image", image); // ✅ fixed the key (no space)
      const { data } = await axios.post("/api/owner/update-image", formData);
      if (data.success) {
        fetchUser(); // ✅ reload updated user
        toast.success(data.message);
        setImage(null); // ✅ clear after upload
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      toast.error(error?.response?.data?.message || "Something went wrong");
    }
  };

  return (
    <div className="relative min-h-screen flex flex-col items-center pt-8 max-w-[13rem] md:max-w-[15rem] w-full border-r border-borderColor text-sm">
      {/* Profile Picture */}
      <div className="group relative">
        <label htmlFor="image">
          <img
            src={
              image
                ? URL.createObjectURL(image)
                : user?.image ||
                  "https://images.unsplash.com/photo-1633332755192-727a05c4013d?q=80&w=300"
            }
            className="h-9 md:h-14 w-9 md:w-14 rounded-full mx-auto"
            alt="Profile"
          />
          <input
            type="file"
            id="image"
            accept="image/*"
            hidden
            onChange={(e) => setImage(e.target.files[0])}
          />
          <div className="absolute hidden top-0 right-0 left-0 bottom-0 bg-black/10 rounded-full group-hover:flex items-center justify-center cursor-pointer">
            <img src={assets.edit_icon} alt="Edit" />
          </div>
        </label>
      </div>

      {/* Save button */}
      {image && (
        <button
          className="absolute top-2 right-2 flex items-center gap-1 px-2 py-1 bg-primary/10 text-primary text-xs rounded"
          onClick={updateImage}
        >save
          
          <img src={assets.check_icon} width={13} alt="Check" />
        </button>
      )}

      {/* Username */}
      <p className="mt-2 text-base max-md:hidden">{user?.name}</p>

      {/* Sidebar Links */}
      <div className="w-full">
        {ownerMenuLinks.map((link, index) => (
          <NavLink
            key={index}
            to={link.path}
            className={`relative flex items-center gap-2 w-full py-3 pl-4 first:mt-6 ${
              link.path === location.pathname
                ? "bg-primary/10 text-primary"
                : "text-gray-600"
            }`}
          >
            <img
              src={
                link.path === location.pathname
                  ? link.coloredIcon
                  : link.icon
              }
              alt={link.name}
            />
            <span className="max-md:hidden">{link.name}</span>
            <div
              className={`${
                link.path === location.pathname ? "bg-primary" : ""
              } w-1.5 h-8 rounded-l right-0 absolute`}
            ></div>
          </NavLink>
        ))}
      </div>
    </div>
  );
};

export default Sidebar;
