import React, { useState } from "react";
import { useForm, Controller } from "react-hook-form";
import { useMutation } from "@tanstack/react-query";
import axios from "axios";
import { TextField, Button, Box, Typography } from "@mui/material";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";

const LoginMATB = ({ onLoginSuccess }) => {
  const {
    register,
    handleSubmit,
    control,
    formState: { errors },
  } = useForm();
  const [loginError, setLoginError] = useState("");

  const loginMutation = useMutation({
    mutationFn: (credentials) => {
      return axios.post(
        "http://localhost:5000/api/auth/login-registrant",
        credentials
      );
    },
    onSuccess: (data) => {
      onLoginSuccess(data.data._id);
    },
    onError: (error) => {
      setLoginError(error.response?.data?.message || "Login failed");
    },
  });

  const formatDate = (date) => {
    if (!(date instanceof Date)) {
      date = new Date(date);
    }
    return date.toISOString().split("T")[0];
  };

  const onSubmit = (data) => {
    const formattedData = {
      ...data,
      email: data.email.trim().toLowerCase(),
      birthdate: formatDate(data.birthdate),
    };
    console.log("Submitting data:", formattedData);
    loginMutation.mutate(formattedData);
  };

  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        mt: 1,
      }}
      component="form"
      onSubmit={handleSubmit(onSubmit)}
    >
      <TextField
        margin="normal"
        fullWidth
        label="Email Address"
        {...register("email", { required: "Email is required" })}
        error={!!errors.email}
        helperText={errors.email?.message}
      />
      <Controller
        name="birthdate"
        control={control}
        rules={{ required: "Birthdate is required" }}
        render={({ field, fieldState: { error } }) => (
          <DatePicker
            label="Birthdate"
            renderInput={(params) => (
              <TextField
                {...params}
                fullWidth
                margin="normal"
                error={!!error}
                helperText={error?.message}
              />
            )}
            {...field}
            onChange={(date) => {
              field.onChange(date);
              console.log(
                "Selected date:",
                date,
                "Formatted:",
                formatDate(date)
              );
            }}
          />
        )}
      />
      <Button
        type="submit"
        fullWidth
        variant="contained"
        sx={{ mt: 3, mb: 2 }}
        disabled={loginMutation.isPending}
      >
        {loginMutation.isPending ? "Logging in..." : "Log In"}
      </Button>
      {loginError && (
        <Typography color="error" align="center">
          {loginError}
        </Typography>
      )}
    </Box>
  );
};

export default LoginMATB;
