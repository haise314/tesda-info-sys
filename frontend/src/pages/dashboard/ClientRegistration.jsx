import React, { useState, useMemo } from "react";
import {
  Typography,
  Paper,
  Box,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  CircularProgress,
  FormControlLabel,
  Checkbox,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
} from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useAuth } from "../../context/AuthContext.jsx";
import ClientRegistrationForm from "../../components/dashboard/ClientRegistrationForm.jsx";
import ProgramSelectField from "../../components/dashboard/subcomponent/ProgramsSelectField.jsx";
import { useForm, Controller } from "react-hook-form";

const Courses = () => {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const queryClient = useQueryClient();
  const { user } = useAuth();
  const uli = useMemo(() => user?.uli, [user?.uli]);

  const {
    control,
    handleSubmit,
    watch,
    reset,
    formState: { errors },
  } = useForm({
    defaultValues: {
      courseName: "",
      hasScholarType: false,
      scholarType: "",
      otherScholarType: "",
    },
  });

  // Watch all form values
  const formValues = watch();
  const hasScholarType = formValues.hasScholarType;
  const scholarType = formValues.scholarType;

  const {
    data: registrantData,
    isLoading,
    error,
  } = useQuery({
    queryKey: ["registrant", uli],
    queryFn: () => fetch(`/api/register/uli/${uli}`).then((res) => res.json()),
    enabled: !!uli,
    staleTime: 1000 * 60 * 5,
    retry: 1,
    refetchOnWindowFocus: false,
  });

  const addCourseMutation = useMutation({
    mutationFn: (newCourse) =>
      fetch(`/api/register/${uli}/course`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newCourse),
      }).then((res) => {
        if (!res.ok) {
          throw new Error("Failed to add course");
        }
        return res.json();
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["registrant", uli] });
      handleCloseDialog();
    },
    onError: (error) => {
      console.error("Failed to add course:", error);
    },
  });

  const handleOpenDialog = () => {
    setIsDialogOpen(true);
  };

  const handleCloseDialog = () => {
    setIsDialogOpen(false);
    reset();
  };

  const onSubmit = (data) => {
    addCourseMutation.mutate({
      ...data,
      registrationStatus: "Pending",
    });
  };

  const scholarTypes = [
    "Training for Work Scholarship (TWSP)",
    "Private Education Student Financial Assistance (PESFA)",
    "Special Training for Employment Program (STEP)",
    "Others",
  ];

  // Function to check if form is valid for submission
  const isFormValid = () => {
    if (!formValues.courseName) return false;
    if (hasScholarType && !scholarType) return false;
    if (scholarType === "Others" && !formValues.otherScholarType) return false;
    return true;
  };

  if (!uli) return <Typography>Please log in to view courses.</Typography>;
  if (isLoading) return <CircularProgress />;
  if (error)
    return <Typography color="error">Error: {error.message}</Typography>;

  const courses = registrantData?.data?.course || [];

  if (!registrantData?.data || !courses.length) {
    return <ClientRegistrationForm />;
  }

  return (
    <Box sx={{ mt: 4 }}>
      <Typography variant="h6" gutterBottom>
        Courses
      </Typography>
      {courses.map((course, index) => (
        <Paper key={index} sx={{ p: 2, mb: 2 }}>
          <Typography variant="subtitle1">{course.courseName}</Typography>
          <Typography>Status: {course.registrationStatus}</Typography>
          {course.hasScholarType && (
            <Typography>
              Scholarship: {course.scholarType}
              {course.scholarType === "Others" &&
                ` - ${course.otherScholarType}`}
            </Typography>
          )}
        </Paper>
      ))}
      <Button
        startIcon={<AddIcon />}
        onClick={handleOpenDialog}
        variant="contained"
        color="primary"
        sx={{ mt: 2 }}
      >
        Add Course
      </Button>

      <Dialog open={isDialogOpen} onClose={handleCloseDialog}>
        <form onSubmit={handleSubmit(onSubmit)}>
          <DialogTitle>Add New Course</DialogTitle>
          <DialogContent>
            <Box sx={{ mt: 2 }}>
              <ProgramSelectField
                control={control}
                name="courseName"
                rules={{ required: true }}
                errors={errors}
                index={0}
              />
            </Box>

            <Controller
              name="hasScholarType"
              control={control}
              render={({ field: { onChange, value } }) => (
                <FormControlLabel
                  control={
                    <Checkbox
                      checked={value}
                      onChange={(e) => onChange(e.target.checked)}
                    />
                  }
                  label="Apply for Scholarship"
                />
              )}
            />

            {hasScholarType && (
              <>
                <FormControl fullWidth sx={{ mt: 2 }}>
                  <InputLabel>Scholarship Type</InputLabel>
                  <Controller
                    name="scholarType"
                    control={control}
                    rules={{ required: hasScholarType }}
                    render={({ field }) => (
                      <Select
                        {...field}
                        label="Scholarship Type"
                        error={!!errors.scholarType}
                      >
                        {scholarTypes.map((type) => (
                          <MenuItem key={type} value={type}>
                            {type}
                          </MenuItem>
                        ))}
                      </Select>
                    )}
                  />
                </FormControl>

                {scholarType === "Others" && (
                  <Controller
                    name="otherScholarType"
                    control={control}
                    rules={{ required: scholarType === "Others" }}
                    render={({ field }) => (
                      <TextField
                        {...field}
                        margin="dense"
                        label="Specify Other Scholarship"
                        fullWidth
                        error={!!errors.otherScholarType}
                        helperText={errors.otherScholarType?.message}
                      />
                    )}
                  />
                )}
              </>
            )}
          </DialogContent>
          <DialogActions>
            <Button onClick={handleCloseDialog}>Cancel</Button>
            <Button
              type="submit"
              color="primary"
              disabled={!isFormValid() || addCourseMutation.isPending}
            >
              {addCourseMutation.isPending ? "Adding..." : "Add"}
            </Button>
          </DialogActions>
        </form>
      </Dialog>
    </Box>
  );
};

export default Courses;
