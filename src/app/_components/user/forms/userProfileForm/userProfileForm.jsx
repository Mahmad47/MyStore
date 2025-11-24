import React, { useState, useEffect } from "react";
import { useAuth } from "@app/_components/_core/AuthProvider/hooks";
import { updateRequest } from "@app/backend managment/apiCalls/apiCalls";
import { ToastContainer, toast } from "react-toastify";
import LoadingButton from "@app/_components/_core/LoadingButton/LoadingButton";
import "react-toastify/dist/ReactToastify.css";

const UserProfileForm = () => {
  const { user, updateUserInCookie } = useAuth();
  const [isProcessing, setIsProcessing] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    age: "",
    phone: "",
  });

  const [avatarFile, setAvatarFile] = useState(null);
  const [avatarPreview, setAvatarPreview] = useState(null);

  useEffect(() => {
    setFormData({
      name: user?.name || "",
      email: user?.email || "",
      age: user?.age || "",
      phone: user?.phone || "",
    });
  }, [user]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setAvatarFile(file);
      setAvatarPreview(URL.createObjectURL(file));
    }
  };

  const handleUpdate = (e) => {
    e.preventDefault();
    setIsProcessing(true);

    if (!formData.name.trim()) {
      toast.error("Invalid user name")
      setIsProcessing(false);
      return;
    };
    if (!String(formData.phone).trim()) {
      toast.error("Invalid user age")
      setIsProcessing(false);
      return;
    };
    if (!String(formData.phone).trim()) {
      toast.error("Invalid phone number")
      setIsProcessing(false);
      return;
    };

    const data = new FormData();
    data.append("name", formData.name);
    data.append("email", formData.email);
    data.append("age", formData.age);
    data.append("phone", formData.phone);
    if (avatarFile) data.append("avatar", avatarFile);

    console.log("your avatar", avatarFile)

    updateRequest(
      `/auth/users/${user?.id}`,
      data,
      (res) => {
        const updatedUser = {
          ...res.data,
          id: res.data._id,
        };
        updateUserInCookie(updatedUser);
        toast.success("Profile updated successfully!");
        setAvatarFile(null);
        setAvatarPreview(null);
        setIsProcessing(false);
      },
      (err) => {
        toast.error("Error updating profile");
        setIsProcessing(false);
        console.error(err);
      }
    );
  };

  return (
    <div className="mx-auto w-full">
      <h2 className="h5 mb-6">
        Update Profile Details
      </h2>

      <form onSubmit={handleUpdate} className="space-y-6">
        {/* Avatar preview */}
        <div className="flex flex-col items-start gap-3">
          {avatarPreview ? (
            <img
              src={avatarPreview}
              alt="Avatar Preview"
              className="w-24 h-24 rounded-full object-cover border border-gray-300"
            />
          ) : (
            user?.avatar && (
              <img
                src={user.avatar}
                alt="User Avatar"
                className="w-24 h-24 rounded-full object-cover border border-gray-300"
              />
            )
          )}

          <label className="cursor-pointer px-4 py-2 border border-gray-300 rounded-md bg-white text-small !text-black hover:bg-gray-100 transition">
            Upload Avatar
            <input
              type="file"
              hidden
              accept="image/*"
              onChange={handleFileChange}
              className="w-1/2"
            />
          </label>
        </div>

        {/* Inputs */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5 text-small !text-black">
          <div>
            <label
              htmlFor="name"
              className="block mb-1"
            >
              Full Name
            </label>
            <input
              id="name"
              name="name"
              type="text"
              value={formData.name}
              onChange={handleChange}
              placeholder="Enter full name"
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
              required
            />
          </div>

          <div>
            <label
              htmlFor="email"
              className="block mb-1"
            >
              Email
            </label>
            <input
              id="email"
              name="email"
              type="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="Enter email"
              className="w-full px-4 py-2 border border-gray-300 rounded-md bg-gray-100 cursor-not-allowed"
              disabled
            />
          </div>

          <div>
            <label
              htmlFor="age"
              className="block mb-1"
            >
              Age
            </label>
            <input
              id="age"
              name="age"
              type="number"
              value={formData.age}
              onChange={handleChange}
              placeholder="Enter age"
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
            />
          </div>

          <div>
            <label
              htmlFor="phone"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Phone Number
            </label>
            <input
              id="phone"
              name="phone"
              type="tel"
              value={formData.phone}
              onChange={handleChange}
              placeholder="Enter phone number"
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
            />
          </div>
        </div>

        {/* Submit */}
        <LoadingButton
          isLoading={isProcessing}
          type="submit"
          className="button transition w-full sm:w-auto"
          disabled={isProcessing}
        >
          Save Changes
        </LoadingButton>
      </form>

      <ToastContainer position="top-right" autoClose={3000} />
    </div>
  );
};

export default UserProfileForm;
