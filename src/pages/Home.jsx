import React, { useEffect, useState } from "react";
import { Outlet, useLocation } from "react-router-dom";
import axios from "axios";
import { Backend_URL, Backend_URL_WITHOUT_API } from "../constrins/constrains";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import {
  logout,
  setUser,
  setOnlineUser,
  setSocketConnection,
} from "../redux/userSlice";
import Sidebar from "../components/Sidebar";
import logo from "../assets/main_logo1.png";
import io from "socket.io-client";

function Home() {
  const user = useSelector((state) => state.user);
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const location = useLocation();
  const [loading, setLoading] = useState(true); // Added loading state

  const fetchUserDetails = async () => {
    setLoading(true); // Start loading
    try {
      const URL = `${Backend_URL}/user-details`;
      const response = await axios(URL, { withCredentials: true });

      console.log("Home user details", response);

      // Explicitly check if success is false
      if (response?.data?.success === false) {
        dispatch(logout());
        navigate("/login");
      } else {
        dispatch(setUser(response?.data?.data));
      }
    } catch (err) {
      console.log(err);
      // Optional: Redirect to login in case of an error
      dispatch(logout());
      navigate("/login");
    } finally {
      setLoading(false); // Stop loading after response is handled
    }
  };

  useEffect(() => {
    fetchUserDetails();
  }, []);

  // socket connection
  useEffect(() => {
    const socketConnection = io(Backend_URL_WITHOUT_API, {
      auth: {
        token: localStorage.getItem("token"),
      },
    });

    socketConnection.on("onlineUser", (data) => {
      dispatch(setOnlineUser(data));
    });

    dispatch(setSocketConnection(socketConnection));

    return () => {
      socketConnection.disconnect();
    };
  }, []);

  const basePath = location.pathname === "/";

  // Show loading spinner or message when fetching user details
  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="grid lg:grid-cols-[300px,1fr] h-screen  max-h-screen overflow-hidden">
      <section className={`bg-white ${!basePath && "hidden"} lg:block`}>
        <Sidebar />
      </section>
      <section className={`${basePath && "hidden"}`}>
        <Outlet />
      </section>
      <div
        className={`justify-center items-center flex-col hidden ${
          !basePath ? "hidden" : "lg:flex"
        }`}
      >
        <div>
          <img src={logo} width={250} alt="logo" />
          <p className="text-lg mt-2 text-slate-500 text-center">
            Select user to send message
          </p>
        </div>
      </div>
    </div>
  );
}

export default Home;
