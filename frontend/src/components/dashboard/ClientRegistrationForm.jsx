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
      nationality: "",
      employmentStatus: "",
      employmentType: "",
      education: "",
      clientClassification: "",
      otherClientClassification: "",
      disabilityType: "",
      disabilityCause: "",
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

  const watchClientClassification = watch("clientClassification");
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
        Complete Registration
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
          {/* Nationality */}
          <Grid item xs={12}>
            <Controller
              name="nationality"
              control={control}
              rules={{ required: "Nationality is required" }}
              render={({ field }) => (
                <TextField
                  {...field}
                  label="Nationality"
                  fullWidth
                  error={!!errors.nationality}
                  helperText={errors.nationality?.message}
                />
              )}
            />
          </Grid>

          {/* Employment Status */}
          <Grid item xs={12} md={6}>
            <Controller
              name="employmentStatus"
              control={control}
              rules={{ required: "Employment status is required" }}
              render={({ field }) => (
                <FormControl fullWidth error={!!errors.employmentStatus}>
                  <InputLabel>Employment Status</InputLabel>
                  <Select {...field} label="Employment Status">
                    {employmentStatuses.map((status) => (
                      <MenuItem key={status} value={status}>
                        {status}
                      </MenuItem>
                    ))}
                  </Select>
                  <FormHelperText>
                    {errors.employmentStatus?.message}
                  </FormHelperText>
                </FormControl>
              )}
            />
          </Grid>

          {/* Conditionally Render Employment Type */}
          {showEmploymentType && (
            <Grid item xs={12} md={6}>
              <Controller
                name="employmentType"
                control={control}
                render={({ field }) => (
                  <FormControl fullWidth error={!!errors.employmentType}>
                    <InputLabel>Employment Type</InputLabel>
                    <Select {...field} label="Employment Type">
                      {employmentTypes.map((type) => (
                        <MenuItem key={type} value={type}>
                          {type}
                        </MenuItem>
                      ))}
                    </Select>
                    {errors.employmentType && (
                      <FormHelperText>
                        {errors.employmentType?.message}
                      </FormHelperText>
                    )}
                  </FormControl>
                )}
              />
            </Grid>
          )}

          {/* Education */}
          <Grid item xs={12}>
            <Controller
              name="education"
              control={control}
              rules={{ required: "Education is required" }}
              render={({ field }) => (
                <FormControl fullWidth error={!!errors.education}>
                  <InputLabel>Educational Attainment</InputLabel>
                  <Select {...field} label="Educational Attainment">
                    {educationalAttainments.map((edu) => (
                      <MenuItem key={edu} value={edu}>
                        {edu}
                      </MenuItem>
                    ))}
                  </Select>
                  <FormHelperText>{errors.education?.message}</FormHelperText>
                </FormControl>
              )}
            />
          </Grid>

          {/* Client Classification */}
          <Grid
            item
            xs={12}
            md={watchClientClassification === "Others" ? 6 : 12}
          >
            <Controller
              name="clientClassification"
              control={control}
              rules={{ required: "Client classification is required" }}
              render={({ field }) => (
                <FormControl fullWidth error={!!errors.clientClassification}>
                  <InputLabel>Client Classification</InputLabel>
                  <Select {...field} label="Client Classification">
                    {clientClassifications.map((classification) => (
                      <MenuItem key={classification} value={classification}>
                        {classification}
                      </MenuItem>
                    ))}
                  </Select>
                  <FormHelperText>
                    {errors.clientClassification?.message}
                  </FormHelperText>
                </FormControl>
              )}
            />
          </Grid>

          {/* Other Client Classification */}
          {watchClientClassification === "Others" && (
            <Grid item xs={12} md={6}>
              <Controller
                name="otherClientClassification"
                control={control}
                rules={{ required: "Please specify other classification" }}
                render={({ field }) => (
                  <TextField
                    {...field}
                    label="Specify Other Classification"
                    fullWidth
                    error={!!errors.otherClientClassification}
                    helperText={errors.otherClientClassification?.message}
                  />
                )}
              />
            </Grid>
          )}

          {/* Disability Type */}
          {/* <Grid item xs={12} md={6}>
            <Controller
              name="disabilityType"
              control={control}
              render={({ field }) => (
                <FormControl fullWidth>
                  <InputLabel>Disability Type</InputLabel>
                  <Select {...field} label="Disability Type">
                    <MenuItem value="">None</MenuItem>
                    {disabilityTypes.map((type) => (
                      <MenuItem key={type} value={type}>
                        {type}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              )}
            />
          </Grid> */}

          {/* Disability Cause */}
          {/* <Grid item xs={12} md={6}>
            <Controller
              name="disabilityCause"
              control={control}
              render={({ field }) => (
                <FormControl fullWidth>
                  <InputLabel>Disability Cause</InputLabel>
                  <Select {...field} label="Disability Cause">
                    <MenuItem value="">None</MenuItem>
                    {disabilityCauses.map((cause) => (
                      <MenuItem key={cause} value={cause}>
                        {cause}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              )}
            />
          </Grid> */}

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
                    <Controller
                      name={`course.${index}.courseName`}
                      control={control}
                      rules={{ required: "Course name is required" }}
                      render={({ field }) => (
                        <TextField
                          {...field}
                          label="Course Name"
                          fullWidth
                          error={!!errors.course?.[index]?.courseName}
                          helperText={
                            errors.course?.[index]?.courseName?.message
                          }
                        />
                      )}
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
