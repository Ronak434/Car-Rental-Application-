import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import NavbarOwner from "../../components/owner/NavbarOwner";
import Sidebar from "../../components/owner/Sidebar";
import { Outlet } from "react-router-dom";
import { useAppContext } from "../../context/AppContext";

const Layout = () => {
  const { isOwner, user, token } = useAppContext();
  const navigate = useNavigate();

  useEffect(() => {
    if (!token && !localStorage.getItem("token")) {
      navigate("/");
      return;
    }
    if (user && user.role !== "owner") {
      navigate("/");
    }
  }, [isOwner, user, token, navigate]);

  return (
    <div className="flex flex-col">
      <NavbarOwner />
      <div className="flex">
        <Sidebar />
        <Outlet />
      </div>
    </div>
  );
};

export default Layout;
    