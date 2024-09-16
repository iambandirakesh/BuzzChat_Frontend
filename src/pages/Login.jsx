import React, { useState } from "react";
import { Backend_URL } from "../constrins/constrains";
import axios from "axios";
import toast from "react-hot-toast";
import { RxEyeOpen } from "react-icons/rx";
import { GoEyeClosed } from "react-icons/go";
import { useNavigate, Link } from "react-router-dom";
import { useDispatch } from "react-redux";
import { setToken } from "../redux/userSlice";
function Login() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [showPassword, setShowPassword] = useState(false);
  const [data, setData] = useState({
    email: "",
    password: "",
  });

  const handleChange = (e) => {
    setData({ ...data, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    e.stopPropagation();

    const URL = `${Backend_URL}/login`;
    // Here, you would submit the data to your backend
    try {
      const response = await axios.post(URL, data, { withCredentials: true });

      if (response.data.success) {
        console.log("from login page", response?.data);
        dispatch(setToken(response?.data?.token));
        localStorage.setItem("token", response?.data?.token);
        setData({
          email: "",
          password: "",
        });
        toast.success(response?.data?.message);
        navigate("/");
      }
    } catch (err) {
      toast.error(err?.response?.data?.message);
      console.log(err);
    }
  };
  return (
    <div className="mt-5">
      <div className="bg-white w-full max-w-md rounded overflow-hidden p-4 mx-auto">
        <h3>Welcome to the Chat App!</h3>
        <form className="grid gap-4 mt-5" onSubmit={handleSubmit}>
          <div className="flex flex-col gap-1">
            <label htmlFor="email">Email:</label>

            <input
              type="email"
              id="email"
              name="email"
              placeholder="Enter your email"
              className="bg-slate-100 px-2 py-1 focus:outline-primary "
              value={data.email}
              onChange={handleChange}
              required
            />
          </div>
          <div className="flex flex-col gap-1 relative">
            <label htmlFor="password">Password:</label>
            <input
              type={showPassword ? "text" : "password"}
              id="password"
              name="password"
              placeholder="Enter your password"
              className="bg-slate-100 px-2 py-1 focus:outline-primary"
              value={data.password}
              onChange={handleChange}
              required
            />
            {!showPassword && (
              <RxEyeOpen
                className="absolute right-2 top-[70%] -translate-y-2/4 cursor-pointer"
                onClick={() => {
                  setShowPassword(!showPassword);
                }}
              />
            )}
            {showPassword && (
              <GoEyeClosed
                className="absolute right-2 top-[70%] -translate-y-2/4 cursor-pointer"
                onClick={() => setShowPassword(!showPassword)}
              />
            )}
          </div>

          <button className="bg-primary text-lg px-4 py-1 hover:bg-secondary rounded mt-2 font-bold text-white leading-relaxed tracking-wider">
            Login
          </button>
        </form>
        <div className="flex justify-between ">
          <p className="my-3 ">
            New User?
            <Link
              to={"/Register"}
              className="text-primary hover:underline font-semibold"
            >
              Register
            </Link>
          </p>
          <Link
            to={"/forgot-password"}
            className="text-primary hover:underline font-semibold"
          >
            {" "}
            <p className="my-3">forgot password?</p>
          </Link>
        </div>
      </div>
    </div>
  );
}

export default Login;
