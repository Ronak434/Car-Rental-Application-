import React, { useState } from "react";
import { assets, menuLinks } from "../assets/assets";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useAppContext } from "../context/AppContext";
import toast from "react-hot-toast";

import { motion } from "motion/react";

const Navbar = () => {
  const { setShowLogin, user, token, logout, isOwner, axios, applyAuth } =
    useAppContext();
  const isLoggedIn = Boolean(user || token);

  const location = useLocation();
  const [open, setOpen] = useState(false);
  const navigate = useNavigate();
  const [navbarSearch, setNavbarSearch] = useState("");

  const changeRole = async () => {
    try {
      const { data } = await axios.post("/api/owner/change-role");

      if (data.success) {
        applyAuth(data.token, data.user);
        toast.success(data.message);
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      toast.error(error.response?.data?.message || error.message);
    }
  };

  const handleNavbarSearch = () => {
    if (navbarSearch.trim() !== "") {
      navigate(`/vehicles?search=${encodeURIComponent(navbarSearch.trim())}`);
      setOpen(false);
    }
  };

  return (
    <motion.div
      initial={{ y: -20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.5 }}
      className={`flex items-center justify-between px-6 md:px-16 lg:px-24 xl:px-32 py-4 text-gray-600 border-b border-borderColor relative transition-all ${
        location.pathname === "/" ? "bg-light" : "bg-white"
      }`}
    >
      {/* Logo */}
      <Link to="/">
        <motion.img
          whileHover={{ scale: 1.05 }}
          src={assets.logo}
          alt="logo"
          className="h-8"
        />{" "}
      </Link>

      {/* Navigation Links */}
      <div
        className={`max-sm:fixed max-sm:top-16 max-sm:right-0 max-sm:h-screen max-sm:w-3/4 max-sm:bg-white max-sm:flex max-sm:flex-col max-sm:gap-6 max-sm:p-6 max-sm:transition-transform max-sm:z-50 max-sm:border-l max-sm:border-borderColor
        sm:flex sm:flex-row sm:items-center sm:gap-6 sm:static sm:translate-x-0
        ${open ? "max-sm:translate-x-0" : "max-sm:translate-x-full"}
      `}
      >
        {/* Nav links */}
        <div className="flex flex-col sm:flex-row gap-6 sm:gap-8 text-sm">
          {menuLinks.map((link, index) => (
            <Link key={index} to={link.path} onClick={() => setOpen(false)}>
              {link.name}
            </Link>
          ))}
        </div>

        {/* Dashboard / List Vehicles */}
        <Link
          to={isOwner ? "/owner" : "#"}
          onClick={(e) => {
            e.preventDefault();
            setOpen(false);
            if (!isLoggedIn) {
              // User is not logged in — show login modal first
              toast.error("Please login first to list your vehicles");
              setShowLogin(true);
              return;
            }
            if (isOwner) {
              navigate("/owner");
            } else {
              changeRole();
            }
          }}
          className="text-sm mt-4 sm:mt-0"
        >
          {isOwner ? "Dashboard" : "List vehicles"}
        </Link>

        {/* Search input */}
        <div className="relative flex items-center border border-borderColor px-3 rounded-full w-full sm:w-64 mt-4 sm:mt-0">
          <input
            type="text"
            className="w-full py-1.5 pl-3 pr-10 bg-transparent outline-none rounded-3xl placeholder-gray-500 text-sm"
            placeholder="Search products"
            value={navbarSearch}
            onChange={e => setNavbarSearch(e.target.value)}
            onKeyDown={e => {
              if (e.key === 'Enter') {
                handleNavbarSearch();
              }
            }}
          />
          <img
            src={assets.search_icon}
            alt="search"
            className="w-4 absolute right-3 top-1/2 transform -translate-y-1/2 cursor-pointer"
            onClick={handleNavbarSearch}
          />
        </div>

        <button
          onClick={() => {
            if (isLoggedIn) {
              logout();
            } else {
              setShowLogin(true);
            }
            setOpen(false);
          }}
          className="h-10 mt-4 sm:mt-0 sm:ml-4 px-6 py-2 bg-primary hover:bg-primary-dull transition-all text-white rounded-lg text-sm"
        >
          {isLoggedIn ? "Logout" : "Login"}
        </button>
      </div>

      {/* Mobile Menu Toggle */}
      <button
        className="sm:hidden z-50"
        onClick={() => setOpen(!open)}
        aria-label="Toggle Menu"
      >
        <img src={open ? assets.close_icon : assets.menu_icon} alt="menu" />
      </button>
    </motion.div>
  );
};

export default Navbar;
