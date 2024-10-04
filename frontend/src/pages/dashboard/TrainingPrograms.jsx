// components/TrainingProgramForm.js
import React from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { trainingProgramSchema } from "../../components/schema/programs.schema";
import { useMutation } from "@tanstack/react-query";
import axios from "axios";
import {
  TextField,
  Button,
  Box,
  Typography,
  FormGroup,
  FormControlLabel,
  Checkbox,
} from "@mui/material";

// Form component
const TrainingProgramForm = () => {
  // Initialize React Hook Form with Zod resolver for validation
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(trainingProgramSchema),
  });

  // React Query mutation for form submission
  const mutation = useMutation({
    mutationFn: (formData) => axios.post("/api/programs/", formData),
    onSuccess: () => {
      alert("Program created successfully");
    },
    onError: (error) => {
      alert(
        `Error creating program: ${
          error.response?.data?.message || error.message
        }`
      );
    },
  });

  // Form submit handler
  const onSubmit = (data) => {
    mutation.mutate(data);
  };

  return (
    <Box
      component="form"
      noValidate
      onSubmit={handleSubmit(onSubmit)}
      sx={{
        maxWidth: 500,
        mx: "auto",
        mt: 4,
        p: 2,
        borderRadius: 2,
        boxShadow: 3,
      }}
    >
      <Typography variant="h5" gutterBottom>
        Create Training Program
      </Typography>
      <TextField
        fullWidth
        label="Program Name"
        margin="normal"
        {...register("name")}
        error={!!errors.name}
        helperText={errors.name?.message}
      />
      <TextField
        fullWidth
        label="Description"
        margin="normal"
        multiline
        rows={4}
        {...register("description")}
        error={!!errors.description}
        helperText={errors.description?.message}
      />
      <TextField
        fullWidth
        label="Duration (Hours)"
        type="number"
        margin="normal"
        {...register("duration", {
          setValueAs: (value) => (value === "" ? undefined : parseFloat(value)), // Convert string to number
        })}
        error={!!errors.duration}
        helperText={errors.duration?.message}
      />
      <TextField
        fullWidth
        label="Qualification Level"
        margin="normal"
        {...register("qualificationLevel")}
        error={!!errors.qualificationLevel}
        helperText={errors.qualificationLevel?.message}
      />
      <TextField
        fullWidth
        label="Start Date"
        type="date"
        margin="normal"
        {...register("startDate")}
        error={!!errors.startDate}
        helperText={errors.startDate?.message}
        InputLabelProps={{ shrink: true }}
      />
      <TextField
        fullWidth
        label="End Date"
        type="date"
        margin="normal"
        {...register("endDate")}
        error={!!errors.endDate}
        helperText={errors.endDate?.message}
        InputLabelProps={{ shrink: true }}
      />
      <TextField
        fullWidth
        label="Location"
        margin="normal"
        {...register("location")}
        error={!!errors.location}
        helperText={errors.location?.message}
      />
      <TextField
        fullWidth
        label="Trainer Name"
        margin="normal"
        {...register("trainer")}
        error={!!errors.trainer}
        helperText={errors.trainer?.message}
      />
      <TextField
        fullWidth
        label="Slots Available"
        type="number"
        margin="normal"
        {...register("slotsAvailable", {
          setValueAs: (value) => (value === "" ? undefined : parseFloat(value)), // Convert string to number
        })}
        error={!!errors.slotsAvailable}
        helperText={errors.slotsAvailable?.message}
      />
      <FormGroup>
        <FormControlLabel
          control={
            <Checkbox
              {...register("scholarshipAvailable")} // React Hook Form registration
              defaultChecked={false} // Default value (false if unchecked)
            />
          }
          label="Scholarship Available"
        />
      </FormGroup>
      {errors.scholarshipAvailable && (
        <Typography color="error">
          {errors.scholarshipAvailable?.message}
        </Typography>
      )}
      <Button
        type="submit"
        variant="contained"
        color="primary"
        fullWidth
        disabled={mutation.isLoading}
        sx={{ mt: 2 }}
      >
        {mutation.isLoading ? "Submitting..." : "Create Program"}
      </Button>
    </Box>
  );
};

export default TrainingProgramForm;
