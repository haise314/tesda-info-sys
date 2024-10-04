import React from "react";
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
} from "@mui/material";
import { z } from "zod";

// Updated login schema
const loginSchema = z.object({
  uli: z
    .string()
    .regex(/^[A-Z]{3}-\d{2}-\d{3}-03907-001$/, "Invalid ULI format"),
  password: z.string().min(1, "Password is required"),
});

const Login = () => {
  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const {
    control,
    handleSubmit,
    setError,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      uli: "",
      password: "",
    },
  });

  const loginMutation = useMutation({
    mutationFn: (credentials) => axios.post("/api/auth/login", credentials),
    onSuccess: (response) => {
      console.log("Login response:", response.data);
      login(response.data);
      navigate(location.state?.from || "/dashboard");
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
                type="password"
                variant="outlined"
                error={!!errors.password}
                helperText={errors.password?.message}
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
    </Container>
  );
};

export default Login;
