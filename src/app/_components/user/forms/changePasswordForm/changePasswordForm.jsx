import React, { useState, useEffect } from "react";
import { useAuth } from "@app/_components/_core/AuthProvider/hooks";
import {
  Box,
  Typography,
  TextField,
  Stack,
  Divider,
  IconButton,
  InputAdornment,
} from "@mui/material";
import { LoadingButton } from "@mui/lab";
import { Visibility, VisibilityOff } from "@mui/icons-material";
import { putRequest } from "@app/backend managment/apiCalls/apiCalls";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const ChangePasswordForm = () => {
  const [isProcessing, setIsProcessing] = useState(false);
  const { user } = useAuth();

  const [formData, setFormData] = useState({
    oldPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

  // Track visibility for each password field
  const [showPassword, setShowPassword] = useState({
    old: false,
    new: false,
    confirm: false,
  });

  useEffect(() => {
    setFormData({
      oldPassword: "",
      newPassword: "",
      confirmPassword: "",
    });
  }, [user]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const toggleVisibility = (field) => {
    setShowPassword((prev) => ({ ...prev, [field]: !prev[field] }));
  };

  const handleUpdate = (e) => {
    e.preventDefault();
    setIsProcessing(true);

    const { oldPassword, newPassword, confirmPassword } = formData;

    if (!oldPassword || !newPassword || !confirmPassword) {
      toast.error("Please fill in all fields");
      setIsProcessing(false);
      return;
    }

    if (newPassword.trim() !== confirmPassword.trim()) {
      toast.error("New password and confirm password do not match");
      setIsProcessing(false);
      return;
    }

    putRequest(
      `/auth/users/${user?.id}/password`,
      { oldPassword, newPassword },
      (res) => {
        setIsProcessing(false);
        toast.success("Password updated successfully!");
        setFormData({
          oldPassword: "",
          newPassword: "",
          confirmPassword: "",
        });
      },
      (err) => {
        setIsProcessing(false);
        if (err.response?.status === 401) {
          toast.error("Old password is incorrect");
        } else {
          toast.error("Error updating password");
        }
        console.error(err);
      }
    );
  };

  return (
    <Box sx={{ width: "100%", mx: "auto" }}>
      <Stack spacing={3} alignItems="center">
        <Typography variant="h4">Change Password</Typography>
      </Stack>

      <Divider sx={{ my: 3 }} />

      <form onSubmit={handleUpdate}>
        <Stack spacing={2}>
          {/* Old Password */}
          <TextField
            name="oldPassword"
            label="Old Password"
            type={showPassword.old ? "text" : "password"}
            value={formData.oldPassword}
            onChange={handleChange}
            fullWidth
            InputProps={{
              endAdornment: (
                <InputAdornment position="end">
                  <IconButton
                    onClick={() => toggleVisibility("old")}
                    edge="end"
                    aria-label="toggle old password visibility"
                  >
                    {showPassword.old ? <VisibilityOff /> : <Visibility />}
                  </IconButton>
                </InputAdornment>
              ),
            }}
          />

          {/* New Password */}
          <TextField
            name="newPassword"
            label="New Password"
            type={showPassword.new ? "text" : "password"}
            value={formData.newPassword}
            onChange={handleChange}
            fullWidth
            InputProps={{
              endAdornment: (
                <InputAdornment position="end">
                  <IconButton
                    onClick={() => toggleVisibility("new")}
                    edge="end"
                    aria-label="toggle new password visibility"
                  >
                    {showPassword.new ? <VisibilityOff /> : <Visibility />}
                  </IconButton>
                </InputAdornment>
              ),
            }}
          />

          {/* Confirm Password */}
          <TextField
            name="confirmPassword"
            label="Confirm New Password"
            type={showPassword.confirm ? "text" : "password"}
            value={formData.confirmPassword}
            onChange={handleChange}
            fullWidth
            InputProps={{
              endAdornment: (
                <InputAdornment position="end">
                  <IconButton
                    onClick={() => toggleVisibility("confirm")}
                    edge="end"
                    aria-label="toggle confirm password visibility"
                  >
                    {showPassword.confirm ? <VisibilityOff /> : <Visibility />}
                  </IconButton>
                </InputAdornment>
              ),
            }}
          />

          <LoadingButton
            type="submit"
            loading={isProcessing}
            variant="contained"
            color="primary"
            loadingPosition="center"
          >
            Update Password
          </LoadingButton>
        </Stack>
      </form>

      <ToastContainer position="top-right" autoClose={3000} />
    </Box>
  );
};

export default ChangePasswordForm;
