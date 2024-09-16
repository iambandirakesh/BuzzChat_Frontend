import React from "react";
import { useParams } from "react-router-dom";
import { useState } from "react";
import toast from "react-hot-toast";
import axios from "axios";
import { Backend_URL } from "../constrins/constrains";
import { RxEyeOpen } from "react-icons/rx";
import { GoEyeClosed } from "react-icons/go";
function ResetPage() {
  const resetURL = useParams();
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const handleRestPassword = async () => {
    if (password !== confirmPassword) {
      toast.error("Password and Confirm Password do not match");
      return;
    } else {
      try {
        const URL = `${Backend_URL}/reset-success`;
        const response = await axios.post(URL, {
          resetToken: resetURL.token,
          newPassword: password,
        });
        if (response.data.success) {
          toast.success(response?.data?.message);
        } else {
          toast.error(response?.data?.message);
        }
      } catch (err) {
        toast.error(err);
      }
    }
  };
  return (
    <div className="flex items-center min-h-screen bg-gray-100 flex-col gap-10 py-10">
      <div>
        <div className="font-bold text-2xl text-center">
          Buzz<span className="text-orange-500">Chat</span>
        </div>
        <div className="font-bold text-2xl text-center">Reset Password</div>
        <p>Please enter your new password below.</p>
        <div className="flex flex-col gap-4">
          <div className="relative">
            <label htmlFor="password" className="block text-gray-600 mb-2">
              password:
            </label>
            <input
              type={showPassword ? "text" : "password"}
              id="password"
              placeholder="Enter new  password"
              className="w-full p-3 border rounded-lg focus:outline-none focus:ring focus:border-blue-300"
              required
              autoComplete="email"
              onChange={(e) => {
                setPassword(e.target.value);
              }}
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
          <div className="relative">
            <input
              type={showConfirmPassword ? "text" : "password"}
              id="password"
              placeholder="Confirm password"
              className="w-full p-3 border rounded-lg focus:outline-none focus:ring focus:border-blue-300"
              required
              autoComplete="email"
              onChange={(e) => {
                setConfirmPassword(e.target.value);
              }}
            />
            {!showConfirmPassword && (
              <RxEyeOpen
                className="absolute right-2 top-[50%] -translate-y-2/4 cursor-pointer"
                onClick={() => {
                  setShowConfirmPassword(!showConfirmPassword);
                }}
              />
            )}
            {showConfirmPassword && (
              <GoEyeClosed
                className="absolute right-2 top-[50%] -translate-y-2/4 cursor-pointer"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
              />
            )}
          </div>
          <button
            className="w-full p-3 border rounded-lg focus:outline-none focus:ring bg-blue-400 hover:bg-blue-600 text-white"
            onClick={handleRestPassword}
          >
            Submit
          </button>
        </div>
      </div>
      <div></div>
    </div>
  );
}

export default ResetPage;
