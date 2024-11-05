import React, { useEffect, useMemo } from "react";
import { useForm, Controller, useWatch } from "react-hook-form";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import axios from "axios";
import { useAuth } from "../../context/AuthContext";
import {
  Box,
  TextField,
  Button,
  Grid,
  Typography,
  MenuItem,
  Paper,
  Divider,
  Alert,
  FormControl,
  InputLabel,
  Select,
  FormHelperText,
  Switch,
  FormControlLabel,
  IconButton,
} from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import AddIcon from "@mui/icons-material/Add";
import {
  clientClassifications,
  employmentTypes,
  employmentStatuses,
  educationalAttainments,
  disabilityTypes,
  disabilityCauses,
  scholarTypes,
} from "../../components/utils/enums/registrant.enums";
import ProgramSelectField from "./subcomponent/ProgramsSelectField";

const ClientRegistrationForm = () => {
  const { user } = useAuth();
  const queryClient = useQueryClient();
  const {
    control,
    handleSubmit,
    formState: { errors },
    watch,
    setValue,
    getValues,
  } = useForm({
    defaultValues: {
      course: [
        {
          courseName: "",
          registrationStatus: "Pending",
          hasScholarType: false,
          scholarType: "",
          otherScholarType: "",
        },
      ],
    },
  });

  const uli = useMemo(() => user?.uli, [user?.uli]);

  // Ccheck if employmentType should be shown
  const employmentStatus = useWatch({
    control,
    name: "employmentStatus",
  });
  const showEmploymentType =
    employmentStatus === "Wage-Employed" ||
    employmentStatus === "Underemployed";

  // Added useEffect to clear employmentType when not needed
  useEffect(() => {
    if (!showEmploymentType) {
      setValue("employmentType", "");
    }
  }, [showEmploymentType, setValue]);

  const createRegistrationMutation = useMutation({
    mutationFn: async (formData) => {
      const response = await axios.post(
        `/api/register/${uli}/create-from-applicant`,
        {
          uli: user.uli,
          ...formData,
        }
      );
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["registrant"] });
    },
  });

  const watchCourses = watch("course");

  const addCourse = () => {
    const courses = getValues("course");
    setValue("course", [
      ...courses,
      {
        courseName: "",
        registrationStatus: "Pending",
        hasScholarType: false,
        scholarType: "",
        otherScholarType: "",
      },
    ]);
  };

  const removeCourse = (index) => {
    const courses = getValues("course");
    if (courses.length > 1) {
      setValue(
        "course",
        courses.filter((_, i) => i !== index)
      );
    }
  };

  const onSubmit = (data) => {
    createRegistrationMutation.mutate(data);
  };

  return (
    <Paper elevation={3} sx={{ p: 4, maxWidth: 800, mx: "auto", my: 4 }}>
      <Typography variant="h5" gutterBottom>
        Course/Qualification Registration Form
      </Typography>
      <Divider sx={{ mb: 3 }} />

      {createRegistrationMutation.isError && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {createRegistrationMutation.error?.response?.data?.message ||
            "An error occurred"}
        </Alert>
      )}

      {createRegistrationMutation.isSuccess && (
        <Alert severity="success" sx={{ mb: 2 }}>
          Registration completed successfully!
        </Alert>
      )}

      <form onSubmit={handleSubmit(onSubmit)}>
        <Grid container spacing={3}>
          {/* Courses Section */}
          <Grid item xs={12}>
            <Typography variant="h6" gutterBottom>
              Courses
            </Typography>
            {watchCourses.map((_, index) => (
              <Box
                key={index}
                sx={{
                  mb: 3,
                  p: 2,
                  border: "1px solid #e0e0e0",
                  borderRadius: 1,
                }}
              >
                <Grid container spacing={2}>
                  <Grid item xs={12}>
                    <ProgramSelectField
                      control={control}
                      name={`course.${index}.courseName`}
                      index={index}
                      errors={errors?.course?.[index]}
                    />
                  </Grid>

                  <Grid item xs={12}>
                    <Controller
                      name={`course.${index}.hasScholarType`}
                      control={control}
                      render={({ field: { value, onChange } }) => (
                        <FormControlLabel
                          control={
                            <Switch
                              checked={value}
                              onChange={(e) => onChange(e.target.checked)}
                            />
                          }
                          label="Has Scholarship"
                        />
                      )}
                    />
                  </Grid>

                  {watch(`course.${index}.hasScholarType`) && (
                    <Grid item xs={12}>
                      <Controller
                        name={`course.${index}.scholarType`}
                        control={control}
                        rules={{ required: "Scholar type is required" }}
                        render={({ field }) => (
                          <FormControl
                            fullWidth
                            error={!!errors.course?.[index]?.scholarType}
                          >
                            <InputLabel>Scholar Type</InputLabel>
                            <Select {...field} label="Scholar Type">
                              {scholarTypes.map((type) => (
                                <MenuItem key={type} value={type}>
                                  {type}
                                </MenuItem>
                              ))}
                            </Select>
                            <FormHelperText>
                              {errors.course?.[index]?.scholarType?.message}
                            </FormHelperText>
                          </FormControl>
                        )}
                      />
                    </Grid>
                  )}

                  {watch(`course.${index}.scholarType`) === "Others" && (
                    <Grid item xs={12}>
                      <Controller
                        name={`course.${index}.otherScholarType`}
                        control={control}
                        rules={{
                          required: "Please specify other scholar type",
                        }}
                        render={({ field }) => (
                          <TextField
                            {...field}
                            label="Specify Other Scholar Type"
                            fullWidth
                            error={!!errors.course?.[index]?.otherScholarType}
                            helperText={
                              errors.course?.[index]?.otherScholarType?.message
                            }
                          />
                        )}
                      />
                    </Grid>
                  )}

                  {watchCourses.length > 1 && (
                    <Grid item xs={12}>
                      <IconButton
                        onClick={() => removeCourse(index)}
                        color="error"
                        aria-label="remove course"
                      >
                        <DeleteIcon />
                      </IconButton>
                    </Grid>
                  )}
                </Grid>
              </Box>
            ))}

            <Button
              startIcon={<AddIcon />}
              onClick={addCourse}
              variant="outlined"
              sx={{ mt: 1 }}
            >
              Add Another Course
            </Button>
          </Grid>

          <Grid item xs={12}>
            <Button
              type="submit"
              variant="contained"
              color="primary"
              fullWidth
              disabled={createRegistrationMutation.isPending}
            >
              {createRegistrationMutation.isPending
                ? "Submitting..."
                : "Submit Registration"}
            </Button>
          </Grid>
        </Grid>
      </form>
    </Paper>
  );
};

export default ClientRegistrationForm;
