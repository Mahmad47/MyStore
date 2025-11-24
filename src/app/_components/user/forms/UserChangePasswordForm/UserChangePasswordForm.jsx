import React, { useState, useEffect } from "react";
import { useAuth } from "@app/_components/_core/AuthProvider/hooks";
import { putRequest } from "@app/backend managment/apiCalls/apiCalls";
import LoadingButton from "@app/_components/_core/LoadingButton/LoadingButton";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const UserChangePasswordForm = () => {
  const { user } = useAuth();
  const [isProcessing, setIsProcessing] = useState(false);

  const [formData, setFormData] = useState({
    oldPassword: "",
    newPassword: "",
  });
  const [confirmPassword, setConfirmPassword] = useState("");

  // Toggle visibility for all three fields
  const [showPassword, setShowPassword] = useState({
    old: false,
    new: false,
    confirm: false,
  });

  useEffect(() => {
    setFormData({ oldPassword: "", newPassword: "" });
    setConfirmPassword("");
  }, [user]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleUpdate = (e) => {
    e.preventDefault();
    setIsProcessing(true);

    if (formData.newPassword.trim() !== confirmPassword.trim()) {
      toast.error("New Password and Confirm Password do not match");
      setIsProcessing(false);
      return;
    }

    putRequest(
      `/auth/users/${user?.id}/password`,
      formData,
      (res) => {
        toast.success("Password updated successfully!");
        setFormData({ oldPassword: "", newPassword: "" });
        setConfirmPassword("");
        setIsProcessing(false);
      },
      (err) => {
        if (err?.response?.status === 401) {
          toast.error("Old password is incorrect");
        } else {
          toast.error("Error updating password");
        }
        setIsProcessing(false);
        console.error(err);
      }
    );
  };

  return (
    <div className="mx-auto w-full">
      <h2 className="h5 mb-6">Change Password</h2>

      <form onSubmit={handleUpdate} className="text-small !text-black space-y-5">
        {/* Old Password */}
        <div>
          <label
            htmlFor="oldPassword"
            className="mb-1"
          >
            Current Password
          </label>
          <div className="relative">
            <input
              id="oldPassword"
              name="oldPassword"
              type={showPassword.old ? "text" : "password"}
              value={formData.oldPassword}
              onChange={handleChange}
              placeholder="Enter current password"
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
              required
            />
            <button
              type="button"
              onClick={() =>
                setShowPassword((prev) => ({ ...prev, old: !prev.old }))
              }
              className="absolute inset-y-0 right-3 flex items-center text-gray-500 hover:text-gray-700"
            >
              {showPassword.old ? <FaEyeSlash /> : <FaEye />}
            </button>
          </div>
        </div>

        {/* New Password */}
        <div>
          <label
            htmlFor="newPassword"
            className="block mb-1"
          >
            New Password
          </label>
          <div className="relative">
            <input
              id="newPassword"
              name="newPassword"
              type={showPassword.new ? "text" : "password"}
              value={formData.newPassword}
              onChange={handleChange}
              placeholder="Enter new password"
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
              required
            />
            <button
              type="button"
              onClick={() =>
                setShowPassword((prev) => ({ ...prev, new: !prev.new }))
              }
              className="absolute inset-y-0 right-3 flex items-center text-gray-500 hover:text-gray-700"
            >
              {showPassword.new ? <FaEyeSlash /> : <FaEye />}
            </button>
          </div>
        </div>

        {/* Confirm Password */}
        <div>
          <label
            htmlFor="confirmPassword"
            className="block mb-1"
          >
            Confirm New Password
          </label>
          <div className="relative">
            <input
              id="confirmPassword"
              type={showPassword.confirm ? "text" : "password"}
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              placeholder="Confirm new password"
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
              required
            />
            <button
              type="button"
              onClick={() =>
                setShowPassword((prev) => ({ ...prev, confirm: !prev.confirm }))
              }
              className="absolute inset-y-0 right-3 flex items-center text-gray-500 hover:text-gray-700"
            >
              {showPassword.confirm ? <FaEyeSlash /> : <FaEye />}
            </button>
          </div>
        </div>

        <LoadingButton
          isLoading={isProcessing}
          type="submit"
          className="button transition w-full sm:w-auto"
          disabled={isProcessing}
        >
          Update Password
        </LoadingButton>
      </form>

      <ToastContainer position="top-right" autoClose={3000} />
    </div>
  );
};

export default UserChangePasswordForm;
