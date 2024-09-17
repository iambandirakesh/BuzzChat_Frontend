import React, { useEffect, useRef, useState } from "react";
import Avatar from "./Avatar";
import Divider from "./Divider";
import axios from "axios";
import toast from "react-hot-toast"; // Fixed typo from 'taost' to 'toast'
import { useDispatch } from "react-redux";
import { setUser } from "../redux/userSlice";
import { Backend_URL } from "../constrins/constrains";
import uploadFile from "../helpers/UploadFile";

const EditUserDetails = ({ onClose, user }) => {
  const [data, setData] = useState({
    name: user?.name || "", // Ensure default value is empty string
    profile_pic: user?.profile_pic || "", // Ensure default value is empty string
  });
  const uploadPhotoRef = useRef();
  const dispatch = useDispatch();

  useEffect(() => {
    if (user) {
      setData({
        name: user?.name || "",
        profile_pic: user?.profile_pic || "",
      });
    }
  }, [user]);

  const handleOnChange = (e) => {
    const { name, value } = e.target;

    setData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleOpenUploadPhoto = (e) => {
    e.preventDefault();
    e.stopPropagation();

    uploadPhotoRef.current.click();
  };

  const handleUploadPhoto = async (e) => {
    const file = e.target.files[0];

    if (file) {
      try {
        const uploadPhoto = await uploadFile(file);

        setData((prevData) => ({
          ...prevData,
          profile_pic: uploadPhoto?.url || "",
        }));
      } catch (error) {
        toast.error("Failed to upload photo");
      }
    }
  };
  const handleRemovePhoto = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setData((prevData) => ({
      ...prevData,
      profile_pic: "",
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    e.stopPropagation();

    try {
      const URL = `${Backend_URL}/update-user`;
      const response = await axios.put(URL, data, { withCredentials: true });

      if (response.data.success) {
        dispatch(setUser(response.data.data));
        toast.success(response.data.message || "Profile updated successfully");
        onClose();
      } else {
        toast.error(response.data.message || "Failed to update profile");
      }
    } catch (error) {
      toast.error("Failed to update profile");
    }
  };

  return (
    <div className="fixed top-0 bottom-0 left-0 right-0 bg-gray-700 bg-opacity-40 flex justify-center items-center z-10">
      <div className="bg-white p-4 py-6 m-1 rounded w-full max-w-sm">
        <h2 className="font-semibold">Profile Details</h2>
        <p className="text-sm">Edit user details</p>

        <form className="grid gap-3 mt-3">
          <div className="flex flex-col gap-1">
            <label htmlFor="name">Name:</label>
            <input
              type="text"
              name="name"
              id="name"
              value={data.name}
              onChange={handleOnChange}
              className="w-full py-1 px-2 focus:outline-primary border border-gray-300 rounded"
            />
          </div>

          <div>
            <div>Photo:</div>
            <div className="my-1 flex items-center gap-4">
              <Avatar
                width={40}
                height={40}
                imageUrl={data.profile_pic}
                name={data.name}
              />
              <label htmlFor="profile_pic">
                <button
                  className="font-semibold"
                  onClick={handleOpenUploadPhoto}
                >
                  Change Photo
                </button>
                <input
                  type="file"
                  id="profile_pic"
                  className="hidden"
                  onChange={handleUploadPhoto}
                  ref={uploadPhotoRef}
                />
              </label>
              <label htmlFor="profile_pic">
                <button className="font-semibold " onClick={handleRemovePhoto}>
                  Remove Photo
                </button>
              </label>
            </div>
          </div>

          <Divider />
          <div className="flex gap-2 w-fit ml-auto">
            <button
              onClick={onClose}
              className="border-primary border text-primary px-4 py-1 rounded hover:bg-primary hover:text-white"
            >
              Cancel
            </button>
            <button
              onClick={handleSubmit}
              className="border-primary bg-primary text-white border px-4 py-1 rounded hover:bg-secondary"
            >
              Save
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default React.memo(EditUserDetails);
