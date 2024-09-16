import React from "react";
import { Link } from "react-router-dom";
import { toast } from "react-hot-toast";
import { useState } from "react";
import axios from "axios";
import { Backend_URL } from "../constrins/constrains";
function ForgotPassword() {
  const [forgotPasswordEmail, setForgotPasswordEmail] = useState("");
  const handleForgotPasswordSubmit = async () => {
    const URL = `${Backend_URL}/reset-password`;
    console.log(forgotPasswordEmail);
    const response = await axios.post(URL, {
      email: forgotPasswordEmail,
    });
    if (response.data.success) {
      toast.success(response?.data?.message);
    } else {
      toast.error(response?.data?.message);
    }
  };
  return (
    <div className="flex items-center min-h-screen bg-gray-100 flex-col gap-10 py-10">
      <div>
        <div className="font-bold text-2xl text-center">
          Buzz<span className="text-orange-500">Chat</span>
        </div>

        <p>
          Enter the email address associated with your account and
          <br /> we'll send you a link to reset your password.
        </p>
        <div className="flex flex-col gap-4">
          <label htmlFor="email" className="block text-gray-600 mb-2">
            Email
          </label>
          <input
            type="email"
            id="email"
            placeholder="Email"
            className="w-full p-3 border rounded-lg focus:outline-none focus:ring focus:border-blue-300"
            required
            autoComplete="email"
            onChange={(e) => {
              setForgotPasswordEmail(e.target.value);
            }}
          />
          <button
            className="w-full p-3 border rounded-lg focus:outline-none focus:ring bg-blue-400 hover:bg-blue-600 text-white"
            onClick={handleForgotPasswordSubmit}
          >
            Submit
          </button>
        </div>
      </div>
      <div>
        Don't have an account?
        <Link to={"/register"} className="text-blue-500">
          Sinup
        </Link>
      </div>
    </div>
  );
}

export default ForgotPassword;
