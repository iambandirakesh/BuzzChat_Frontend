import React, { useState } from "react";
import { IoMdCloseCircle } from "react-icons/io";
import { Link, useNavigate } from "react-router-dom";
import uploadFile from "../helpers/UploadFile";
import { Backend_URL } from "../constrins/constrains";
import axios from "axios";
import toast from "react-hot-toast";
import { RxEyeOpen } from "react-icons/rx";
import { GoEyeClosed } from "react-icons/go";
function RegisterPage() {
  const [uploadPhoto, setUploadPhoto] = React.useState(null);
  const [showPassword, setShowPassword] = useState(false);
  const [upload, setUpload] = useState(false);
  const [verify, setVerify] = useState(false);
  const [verified, setVerified] = useState(false);
  const [userVerificationCode, setUserVerificationCode] = useState("");
  const navigate = useNavigate();
  const [data, setData] = React.useState({
    name: "",
    email: "",
    password: "",
    profile_pic: "",
  });

  const handleChange = (e) => {
    setData({ ...data, [e.target.name]: e.target.value });
  };

  const handleUploadPhoto = async (e) => {
    const file = e.target.files[0];

    if (!file) return;
    const cloudinaryPhoto = await uploadFile(file);

    setUploadPhoto(cloudinaryPhoto); // Set Cloudinary response here
    setData({ ...data, profile_pic: cloudinaryPhoto.secure_url }); // Save Cloudinary URL
    setUpload(true);
  };

  const triggerFileUpload = () => {
    document.getElementById("profile_pic").click();
  };

  const handleClearUploadPhoto = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setUploadPhoto(null);
    setData({ ...data, profile_pic: "" }); // Clear the profile pic URL
    setUpload(false);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (!verified) {
      toast.error("Please verify your email first");
      return;
    }
    const URL = `${Backend_URL}/register`;
    // Here, you would submit the data to your backend
    try {
      const response = await axios.post(URL, data);
      await axios.post(`${Backend_URL}/welcome-email`, {
        email: data.email,
        name: data.name,
      });

      if (response.data.success) {
        setData({
          name: "",
          email: "",
          password: "",
          profile_pic: "",
        });
        if (response.data.success) {
          toast.success(response?.data?.message);
          navigate("/login");
        } else {
          throw new Error("Registation failed try again");
        }
      }
    } catch (err) {
      toast.error(err?.response?.data?.message);
      console.log(err);
    }
  };
  const handleVerifySubmit = async () => {
    const URL = `${Backend_URL}/verify-email`;
    try {
      const response = await axios.post(URL, {
        email: data.email,
        userVerificationToken: userVerificationCode,
      });
      if (response.data.success) {
        toast.success(response?.data?.message);
        setVerified(true);
      } else {
        throw new Error("Email verification failed");
      }
    } catch (err) {
      toast.error(err?.response?.data?.message);
    }
  };
  const handleVerify = async () => {
    setVerify(true);
    const URL = `${Backend_URL}/sent-verify-email`;
    try {
      const response = await axios.post(URL, { email: data.email });
      if (response.data.success) {
        toast.success(response?.data?.message);
      } else {
        throw new Error("Email verification failed");
      }
    } catch (err) {
      toast.error(err?.response?.data?.message);
    }
  };
  return (
    <div className="mt-5">
      <div className="bg-white w-full max-w-md rounded overflow-hidden p-4 mx-auto">
        <h3>Welcome to the Chat App!</h3>
        <form className="grid gap-4 mt-5" onSubmit={handleSubmit}>
          <div className="flex flex-col gap-1">
            <label htmlFor="name">Name:</label>
            <input
              type="text"
              id="name"
              name="name"
              placeholder="Enter your name"
              className="bg-slate-100 px-2 py-1 focus:outline-primary"
              value={data.name}
              onChange={handleChange}
              required
            />
          </div>
          <div className="flex flex-col gap-1">
            <label htmlFor="email">Email:</label>
            <div className="flex flex-row gap-2 ">
              <input
                type="email"
                id="email"
                name="email"
                placeholder="Enter your email"
                className="bg-slate-100 px-2 py-1 focus:outline-primary w-[85%]"
                value={data.email}
                onChange={handleChange}
                required
              />
              <button
                className="bg-primary rounded-md w-[12%] hover:bg-secondary text-white"
                onClick={handleVerify}
              >
                Verify
              </button>
            </div>
          </div>
          {verify && (
            <div className="flex flex-col gap-1">
              <label htmlFor="email">Verification Code:</label>
              <div className="flex flex-row gap-2 ">
                <input
                  type="text"
                  id="verificationCode"
                  name="verificationCode"
                  placeholder="Enter Verification Code"
                  className="bg-slate-100 px-2 py-1 focus:outline-primary w-[85%]"
                  onChange={(e) => {
                    setUserVerificationCode(e.target.value);
                  }}
                  required
                />
                <button
                  className="bg-primary rounded-md w-[14%] hover:bg-secondary text-white"
                  onClick={handleVerifySubmit}
                >
                  Submit
                </button>
              </div>
            </div>
          )}
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
          <div className="flex flex-col gap-1">
            <label htmlFor="profile_pic">Photo:</label>
            <div
              className="h-14 bg-slate-200 flex justify-center items-center border rounded hover:border-primary cursor-pointer"
              onClick={triggerFileUpload}
            >
              <p className="text-sm max-w-[300px] line-clamp-1">
                {upload
                  ? uploadPhoto?.original_filename
                  : "Upload profile photo"}
              </p>
              {upload ? (
                <button
                  className="translate-y-1 ml-2 hover:text-red-600"
                  onClick={handleClearUploadPhoto}
                >
                  <IoMdCloseCircle />
                </button>
              ) : (
                ""
              )}
            </div>
            <input
              type="file"
              id="profile_pic"
              name="profile_pic"
              className="hidden"
              onChange={handleUploadPhoto}
            />
          </div>
          <button className="bg-primary text-lg px-4 py-1 hover:bg-secondary rounded mt-2 font-bold text-white leading-relaxed tracking-wider">
            Register
          </button>
        </form>
        <p className="my-3 text-center">
          Already have account?{" "}
          <Link
            to={"/login"}
            className="hover:text-primary hover:underline font-semibold"
          >
            Login
          </Link>
        </p>
      </div>
    </div>
  );
}

export default RegisterPage;
