import React, { useState } from "react";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import axios from "axios";
import {
  TextField,
  Button,
  Box,
  Typography,
  CircularProgress,
} from "@mui/material";

const loginSchema = z.object({
  uli: z
    .string()
    .regex(/^[A-Z]{3}-\d{2}-\d{3}-03907-001$/, "Invalid ULI format"),
  password: z.string().min(1, "Password is required"),
});

const LoginMATB = ({ onLoginSuccess }) => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      uli: "",
      password: "",
    },
  });

  const onSubmit = async (data) => {
    setIsLoading(true);
    setError("");

    try {
      console.log("Attempting login with data:", { uli: data.uli }); // Don't log password

      const response = await axios.post("/api/auth/login", data);
      console.log("Login response:", response.data);

      if (response.data) {
        onLoginSuccess(response.data);
      }
    } catch (error) {
      console.error("Login error:", error);

      const errorMessage =
        error.response?.data?.message ||
        error.message ||
        "Login failed. Please check your credentials.";

      setError(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Box
      component="form"
      onSubmit={handleSubmit(onSubmit)}
      sx={{
        width: "100%",
        maxWidth: 400,
        display: "flex",
        flexDirection: "column",
        gap: 2,
      }}
    >
      <Controller
        name="uli"
        control={control}
        render={({ field }) => (
          <TextField
            {...field}
            label="ULI"
            fullWidth
            error={!!errors.uli}
            helperText={errors.uli?.message || "Format: XXX-YY-ZZZ-03907-001"}
            disabled={isLoading}
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
            fullWidth
            error={!!errors.password}
            helperText={errors.password?.message}
            disabled={isLoading}
          />
        )}
      />

      {error && (
        <Typography color="error" variant="body2">
          {error}
        </Typography>
      )}

      <Button
        type="submit"
        variant="contained"
        fullWidth
        disabled={isLoading}
        sx={{ mt: 2 }}
      >
        {isLoading ? (
          <CircularProgress size={24} sx={{ color: "white" }} />
        ) : (
          "Login"
        )}
      </Button>
    </Box>
  );
};

export default LoginMATB;
