import React from "react";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "@tanstack/react-query";
import axios from "axios";
import { useNavigate, Link } from "react-router-dom";
import {
  Box,
  TextField,
  Button,
  Typography,
  Paper,
  Container,
  CircularProgress,
} from "@mui/material";
import { registrationSchema } from "../../components/schema/user.schema";

const RegisterUser = () => {
  const navigate = useNavigate();

  const {
    control,
    handleSubmit,
    setError,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(registrationSchema),
    defaultValues: {
      uli: "",
      password: "",
      confirmPassword: "",
    },
  });

  const registerMutation = useMutation({
    mutationFn: (userData) => axios.post("/api/auth/register", userData),
    onSuccess: () => {
      navigate("/login");
    },
    onError: (error) => {
      console.error(
        "Registration error:",
        error.response?.data || error.message
      );
      setError("root", {
        type: "manual",
        message:
          error.response?.data?.message ||
          "Registration failed. Please try again.",
      });
    },
  });

  const onSubmit = (data) => {
    registerMutation.mutate(data);
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
          Register
        </Typography>
        {errors.root && (
          <Typography color="error" variant="body2" gutterBottom align="center">
            {errors.root.message}
          </Typography>
        )}
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
          <Controller
            name="confirmPassword"
            control={control}
            render={({ field }) => (
              <TextField
                {...field}
                label="Confirm Password"
                type="password"
                variant="outlined"
                error={!!errors.confirmPassword}
                helperText={errors.confirmPassword?.message}
                sx={{
                  "& .MuiOutlinedInput-root": {
                    borderRadius: "8px",
                  },
                }}
              />
            )}
          />
          <Button
            variant="contained"
            color="primary"
            type="submit"
            disabled={registerMutation.isPending}
            sx={{
              borderRadius: "8px",
              position: "relative",
              "&:hover": { bgcolor: "primary.dark" },
            }}
          >
            {registerMutation.isPending ? (
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
              "Register"
            )}
          </Button>
        </Box>
        <Typography variant="body2" align="center" sx={{ mt: 2 }}>
          Already have an account? <Link to="/login">Login here</Link>
        </Typography>
      </Paper>
    </Container>
  );
};

export default RegisterUser;
