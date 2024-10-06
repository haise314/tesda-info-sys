import React, { useEffect, useState } from "react";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "@tanstack/react-query";
import axios from "axios";
import { useAuth } from "../../context/AuthContext";
import { useNavigate, useLocation, Link } from "react-router-dom";
import {
  Box,
  TextField,
  Button,
  Typography,
  Paper,
  Container,
  CircularProgress,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  IconButton,
  InputAdornment,
} from "@mui/material";
import { Visibility, VisibilityOff } from "@mui/icons-material";
import { z } from "zod";

const loginSchema = z.object({
  uli: z
    .string()
    .regex(/^[A-Z]{3}-\d{2}-\d{3}-03907-001$/, "Invalid ULI format"),
  password: z.string().min(1, "Password is required"),
});

const passwordChangeSchema = z
  .object({
    newPassword: z.string().min(6, "Password must be at least 6 characters"),
    confirmPassword: z.string(),
  })
  .refine((data) => data.newPassword === data.confirmPassword, {
    message: "Passwords don't match",
    path: ["confirmPassword"],
  });

const Login = () => {
  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [openDialog, setOpenDialog] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const {
    control,
    handleSubmit,
    setError,
    setValue,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      uli: "",
      password: "",
    },
  });

  const {
    control: passwordChangeControl,
    handleSubmit: handlePasswordChangeSubmit,
    formState: { errors: passwordChangeErrors },
  } = useForm({
    resolver: zodResolver(passwordChangeSchema),
    defaultValues: {
      newPassword: "",
      confirmPassword: "",
    },
  });

  useEffect(() => {
    // Check for stored credentials
    const storedUli = localStorage.getItem("newUserUli");
    const storedPassword = localStorage.getItem("newUserPassword");

    if (storedUli && storedPassword) {
      setValue("uli", storedUli);
      setValue("password", storedPassword);
    }
  }, [setValue]);

  const loginMutation = useMutation({
    mutationFn: (credentials) => axios.post("/api/auth/login", credentials),
    onSuccess: (response) => {
      console.log("Login response:", response.data);
      login(response.data);

      // Check if it's the first login (using placeholder password)
      if (localStorage.getItem("newUserPassword")) {
        setOpenDialog(true);
      } else {
        navigate(location.state?.from || "/dashboard");
      }
    },
    onError: (error) => {
      console.error("Login error:", error.response?.data || error.message);
      setError("root", {
        type: "manual",
        message:
          error.response?.data?.message ||
          "Login failed. Please check your credentials and try again.",
      });
    },
  });

  const onSubmit = (data) => {
    loginMutation.mutate(data);
  };

  const handlePasswordChange = async (data) => {
    try {
      await axios.put("/api/auth/change-password", {
        uli: localStorage.getItem("newUserUli"),
        newPassword: data.newPassword,
      });
      localStorage.removeItem("newUserUli");
      localStorage.removeItem("newUserPassword");
      setOpenDialog(false);
      navigate("/dashboard");
    } catch (error) {
      console.error("Password change error:", error);
      setError("root", {
        type: "manual",
        message: "Failed to change password. Please try again.",
      });
    }
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const toggleNewPasswordVisibility = () => {
    setShowNewPassword(!showNewPassword);
  };

  const toggleConfirmPasswordVisibility = () => {
    setShowConfirmPassword(!showConfirmPassword);
  };

  return (
    <Container
      sx={{
        flexGrow: 1,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        minHeight: "100vh",
      }}
    >
      <Paper
        elevation={3}
        sx={{ p: 4, maxWidth: 400, width: "100%", borderRadius: "16px" }}
      >
        <Typography variant="h5" gutterBottom align="center">
          Login
        </Typography>

        <Box
          component="form"
          onSubmit={handleSubmit(onSubmit)}
          sx={{ display: "flex", flexDirection: "column", gap: 2 }}
        >
          <Controller
            name="uli"
            control={control}
            render={({ field }) => (
              <TextField
                {...field}
                label="ULI"
                variant="outlined"
                error={!!errors.uli}
                helperText={
                  errors.uli?.message || "Format: XXX-YY-ZZZ-03907-001"
                }
                sx={{
                  "& .MuiOutlinedInput-root": {
                    borderRadius: "8px",
                  },
                }}
              />
            )}
          />
          <Controller
            name="password"
            control={control}
            render={({ field }) => (
              <TextField
                {...field}
                label="Password"
                type={showPassword ? "text" : "password"}
                variant="outlined"
                error={!!errors.password}
                helperText={errors.password?.message}
                InputProps={{
                  endAdornment: (
                    <InputAdornment position="end">
                      <IconButton onClick={togglePasswordVisibility} edge="end">
                        {showPassword ? <VisibilityOff /> : <Visibility />}
                      </IconButton>
                    </InputAdornment>
                  ),
                }}
                sx={{
                  "& .MuiOutlinedInput-root": {
                    borderRadius: "8px",
                  },
                }}
              />
            )}
          />
          {errors.root && (
            <Typography
              color="error"
              variant="body2"
              gutterBottom
              align="center"
            >
              {errors.root.message}
            </Typography>
          )}
          <Button
            variant="contained"
            color="primary"
            type="submit"
            disabled={loginMutation.isPending}
            sx={{
              borderRadius: "8px",
              position: "relative",
              "&:hover": { bgcolor: "primary.dark" },
            }}
          >
            {loginMutation.isPending ? (
              <CircularProgress
                size={24}
                sx={{
                  position: "absolute",
                  left: "50%",
                  top: "50%",
                  transform: "translate(-50%, -50%)",
                }}
              />
            ) : (
              "Login"
            )}
          </Button>
        </Box>
        <Typography variant="body2" align="center" sx={{ mt: 2 }}>
          Don't have an account? <Link to="/registeruser">Register here</Link>
        </Typography>
      </Paper>

      <Dialog open={openDialog} onClose={() => setOpenDialog(false)}>
        <DialogTitle>Change Your Password</DialogTitle>
        <DialogContent>
          <DialogContentText>
            For security reasons, please change your password.
          </DialogContentText>
          <Box
            component="form"
            onSubmit={handlePasswordChangeSubmit(handlePasswordChange)}
            sx={{ display: "flex", flexDirection: "column", gap: 2, mt: 2 }}
          >
            <Controller
              name="newPassword"
              control={passwordChangeControl}
              render={({ field }) => (
                <TextField
                  {...field}
                  label="New Password"
                  type={showNewPassword ? "text" : "password"}
                  fullWidth
                  variant="outlined"
                  error={!!passwordChangeErrors.newPassword}
                  helperText={passwordChangeErrors.newPassword?.message}
                  InputProps={{
                    endAdornment: (
                      <InputAdornment position="end">
                        <IconButton
                          onClick={toggleNewPasswordVisibility}
                          edge="end"
                        >
                          {showNewPassword ? <VisibilityOff /> : <Visibility />}
                        </IconButton>
                      </InputAdornment>
                    ),
                  }}
                />
              )}
            />
            <Controller
              name="confirmPassword"
              control={passwordChangeControl}
              render={({ field }) => (
                <TextField
                  {...field}
                  label="Confirm New Password"
                  type={showConfirmPassword ? "text" : "password"}
                  fullWidth
                  variant="outlined"
                  error={!!passwordChangeErrors.confirmPassword}
                  helperText={passwordChangeErrors.confirmPassword?.message}
                  InputProps={{
                    endAdornment: (
                      <InputAdornment position="end">
                        <IconButton
                          onClick={toggleConfirmPasswordVisibility}
                          edge="end"
                        >
                          {showConfirmPassword ? (
                            <VisibilityOff />
                          ) : (
                            <Visibility />
                          )}
                        </IconButton>
                      </InputAdornment>
                    ),
                  }}
                />
              )}
            />
            <Button type="submit" variant="contained" color="primary">
              Change Password
            </Button>
          </Box>
        </DialogContent>
      </Dialog>
    </Container>
  );
};

export default Login;
