import LoadingButton from "@mui/lab/LoadingButton";
import { validationSchema } from "../validation";
import { IconButton, InputAdornment, Stack, Typography } from "@mui/material";
import { Visibility, VisibilityOff } from "@mui/icons-material";
import React from "react";
import axios from "axios";
import { useState } from "react";
import { useNavigate } from "react-router-dom";

import {
  JumboForm,
  JumboInput,
  JumboOutlinedInput,
} from "@jumbo/vendors/react-hook-form";
import { postRequest } from "@app/backend managment/apiCalls/apiCalls";

const SignupForm = () => {
  const [errorMessage, setErrorMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const navigate = useNavigate();
  const from = localStorage.getItem("redirectAfterLogin") || "/";

  const [values, setValues] = React.useState({
    password: "",
    showPassword: false,
  });

  const handleClickShowPassword = () => {
    setValues({
      ...values,
      showPassword: !values.showPassword,
    });
  };

  const handleSignup = async (formValues) => {
    setErrorMessage("");
    setSuccessMessage("");
    postRequest("/auth/signup", formValues,
      (res) => {
        setSuccessMessage("Signup successful! You can now log in.");
        localStorage.setItem("redirectAfterLogin", from);
      },
      (err) => {
        setErrorMessage("User or Email already exists");
        console.error("Signup error:", err);
      })
  };


  return (
    <JumboForm
      validationSchema={validationSchema}
      onSubmit={handleSignup}
      onChange={() => { }}
    >
      <Stack spacing={3} mb={3}>
        <JumboInput fieldName={"name"} label={"Name"}
          // defaultValue="Admin"
          placeholder="Admin"
        />
        <JumboInput
          fullWidth
          fieldName={"email"}
          label={"Email"}
          // defaultValue="admin@example.com"
          placeholder="admin@example.com"
        />
        <JumboOutlinedInput
          fieldName={"password"}
          label={"Password"}
          type={values.showPassword ? "text" : "password"}
          margin="none"
          endAdornment={
            <InputAdornment position="end">
              <IconButton
                aria-label="toggle password visibility"
                onClick={handleClickShowPassword}
                edge="end"
              >
                {values.showPassword ? <VisibilityOff /> : <Visibility />}
              </IconButton>
            </InputAdornment>
          }
          // defaultValue="zab#723"
          placeholder="zab#723"
          sx={{ bgcolor: (theme) => theme.palette.background.paper }}
        />

        {successMessage && (
          <Typography color="success.main" variant="body2">
            {successMessage}
          </Typography>
        )}
        {errorMessage && (
          <Typography color="error" variant="body2">
            {errorMessage}
          </Typography>
        )}
        <LoadingButton
          fullWidth
          type="submit"
          variant="contained"
          size="large"
        // loading={isSubmitting || mutation.isLoading}
        >
          Signup
        </LoadingButton>
      </Stack>
    </JumboForm>
  );
};

export { SignupForm };
