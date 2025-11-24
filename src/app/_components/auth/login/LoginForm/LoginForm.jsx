import LoadingButton from "@mui/lab/LoadingButton";
import {
  JumboCheckbox,
  JumboForm,
  JumboInput,
  JumboOutlinedInput,
} from "@jumbo/vendors/react-hook-form";
import { validationSchema } from "../validation";
import { IconButton, InputAdornment, Stack, Typography } from "@mui/material";
import { Link } from "@jumbo/shared";
import React from "react";
import { Visibility, VisibilityOff } from "@mui/icons-material";
import { useAuth } from "@app/_components/_core/AuthProvider/hooks";
import { useNavigate, useLocation } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { useState } from "react";


const LoginForm = () => {
  const [errorMessage, setErrorMessage] = useState("");
  const { t } = useTranslation();
  const { user, loading, login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const from = location.state?.from || localStorage.getItem("redirectAfterLogin") || "/";
  if (location.state?.from) {
    localStorage.setItem("redirectAfterLogin", location.state.from);
  }
  const [values, setValues] = React.useState({
    password: "",
    showPassword: false,
  });
  async function handleLogin(data) {
    setErrorMessage(""); // reset error
    try {
      // login() should return the logged-in user or update context
      const loggedInUser = await login({
        email: data.email.trim(),
        password: data.password.trim(),
      });
      localStorage.removeItem("redirectAfterLogin");
      // Check user role safely (prefer returned data if available)
      const role = loggedInUser?.role || user?.role;
      console.log("Logged in user:", loggedInUser);
      console.log("User role:", role);
      // Redirect based on role or to the original destination
      if (role === "admin") {
        navigate("/admin/dashboard", { replace: true });
      } else {
        navigate(from, { replace: true });
      }
    } catch (error) {
      setErrorMessage("Invalid email or password");
      console.error("Login failed:", error);
    }
  }
  const handleClickShowPassword = () => {
    setValues({
      ...values,
      showPassword: !values.showPassword,
    });
  };
  return (
    <JumboForm
      validationSchema={validationSchema}
      onSubmit={handleLogin}
      onChange={() => { }}
    >
      <Stack spacing={3} mb={3}>
        <JumboInput
          fullWidth
          fieldName={"email"}
          label={t("login.email")}
          placeholder="demo@example.com"
        // defaultValue="demo@example.com"
        />
        <JumboOutlinedInput
          fieldName={"password"}
          label={t("login.password")}
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
          sx={{ bgcolor: (theme) => theme.palette.background.paper }}
          // defaultValue={"zab#723"}
          placeholder="zab#723"
        />
        {errorMessage && (
          <Typography color="error" variant="body2">
            {errorMessage}
          </Typography>
        )}
        <Stack
          direction={"row"}
          justifyContent={"space-between"}
          alignItems={"center"}
        >
          <JumboCheckbox
            fieldName="rememberMe"
            label={t("login.rememberMe")}
            defaultChecked
          />
          {/* <Typography textAlign={"right"} variant={"body1"}>
            <Link underline="none" to={"/auth/forgot-password"}>
              {t("login.forgotPassword")}
            </Link>

          </Typography> */}
        </Stack>
        <LoadingButton
          fullWidth
          type="submit"
          variant="contained"
          size="large"
          loading={loading}
        >
          {t("login.loggedIn")}
        </LoadingButton>
      </Stack>
    </JumboForm>
  );
};

export { LoginForm };
