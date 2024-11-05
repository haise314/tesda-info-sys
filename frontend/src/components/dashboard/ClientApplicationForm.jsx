// src/components/forms/ClientApplicationForm.jsx
import React, { useMemo } from "react";
import { useForm, Controller, useFieldArray } from "react-hook-form";
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
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Stack,
} from "@mui/material";
import {
  assessmentTypes,
  clientTypes,
  employmentStatuses,
  highestEducationalAttainments,
} from "../utils/enums/applicant.enums";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import DeleteIcon from "@mui/icons-material/Delete";
import AddIcon from "@mui/icons-material/Add";
import { DatePicker } from "@mui/x-date-pickers";
import dayjs from "dayjs";
import AssessmentSelectField from "./subcomponent/AssessmentSelectField";
import TrainingCenterSelectField from "./subcomponent/TrainingCenterSelectionField";

const ClientApplicationForm = () => {
  const { user } = useAuth();
  const queryClient = useQueryClient();
  const {
    control,
    handleSubmit,
    formState: { errors },
    watch,
  } = useForm({
    defaultValues: {
      trainingCenterName: "",
      addressLocation: "",
      completeMailingAddress: {
        zipCode: "",
      },
      assessments: [
        {
          assessmentTitle: "",
          assessmentType: "",
          applicationStatus: "For Approval",
        },
      ],
      clientType: "",
      motherName: {
        firstName: "",
        middleName: "",
        lastName: "",
        extension: "",
      },
      fatherName: {
        firstName: "",
        middleName: "",
        lastName: "",
        extension: "",
      },
      // Optional arrays - only include if you want to add them during application
      workExperience: [],
      trainingSeminarAttended: [],
      licensureExaminationPassed: [],
      competencyAssessment: [],
    },
  });

  const uli = useMemo(() => user?.uli, [user?.uli]);

  const createApplicationMutation = useMutation({
    mutationFn: async (formData) => {
      const response = await axios.post(
        `/api/applicants/${uli}/create-from-registrant`,
        {
          uli: user.uli,
          ...formData,
        }
      );
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["applicant"] });
    },
  });

  const onSubmit = (data) => {
    createApplicationMutation.mutate(data);
  };

  const watchEducation = watch("highestEducationalAttainment");

  const workExperienceFields = useFieldArray({
    control,
    name: "workExperience",
  });
  const trainingSeminarFields = useFieldArray({
    control,
    name: "trainingSeminarAttended",
  });
  const licensureExaminationFields = useFieldArray({
    control,
    name: "licensureExaminationPassed",
  });
  const competencyAssessmentFields = useFieldArray({
    control,
    name: "competencyAssessment",
  });

  const renderDynamicFields = (fields, append, remove, name) => (
    <Accordion sx={{ width: "100%", padding: 3 }} defaultExpanded>
      <AccordionSummary expandIcon={<ExpandMoreIcon />}>
        <Typography variant="h6" sx={{ fontWeight: "bold" }}>
          {name}
        </Typography>
      </AccordionSummary>
      <AccordionDetails>
        {fields.map((field, index) => (
          <Box
            key={field.id}
            mb={2}
            sx={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
            }}
          >
            <Grid container spacing={2} alignItems="center">
              {name === "Work Experience (National Qualification-related)" && (
                <>
                  <Grid item xs={12} sm={6}>
                    <Controller
                      name={`workExperience.${index}.companyName`}
                      control={control}
                      render={({ field }) => (
                        <TextField
                          {...field}
                          label="Company Name"
                          fullWidth
                          error={!!errors.workExperience?.[index]?.companyName}
                          helperText={
                            errors.workExperience?.[index]?.companyName?.message
                          }
                        />
                      )}
                    />
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <Controller
                      name={`workExperience.${index}.position`}
                      control={control}
                      render={({ field }) => (
                        <TextField
                          {...field}
                          label="Position"
                          fullWidth
                          error={!!errors.workExperience?.[index]?.position}
                          helperText={
                            errors.workExperience?.[index]?.position?.message
                          }
                        />
                      )}
                    />
                  </Grid>
                  <Grid item xs={6} sm={3}>
                    <Controller
                      name={`workExperience.${index}.inclusiveDates.from`}
                      control={control}
                      render={({ field }) => (
                        <DatePicker
                          {...field}
                          label="From Date"
                          value={field.value ? dayjs(field.value) : null}
                          slotProps={{
                            textField: {
                              helperText:
                                errors.workExperience?.[index]?.inclusiveDates
                                  ?.from?.message,
                              error: Boolean(
                                errors.workExperience?.[index]?.inclusiveDates
                                  ?.from
                              ),
                            },
                          }}
                          onChange={(date) =>
                            field.onChange(date ? dayjs(date).toDate() : null)
                          }
                        />
                      )}
                    />
                  </Grid>
                  <Grid item xs={6} sm={3}>
                    <Controller
                      name={`workExperience.${index}.inclusiveDates.to`}
                      control={control}
                      render={({ field }) => (
                        <DatePicker
                          {...field}
                          label="To Date"
                          value={field.value ? dayjs(field.value) : null}
                          slotProps={{
                            textField: {
                              helperText:
                                errors.workExperience?.[index]?.inclusiveDates
                                  ?.to?.message,
                              error: Boolean(
                                errors.workExperience?.[index]?.inclusiveDates
                                  ?.to
                              ),
                            },
                          }}
                          onChange={(date) =>
                            field.onChange(date ? dayjs(date).toDate() : null)
                          }
                        />
                      )}
                    />
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <Controller
                      name={`workExperience.${index}.monthlySalary`}
                      control={control}
                      render={({ field }) => (
                        <TextField
                          {...field}
                          label="Monthly Salary"
                          type="number"
                          fullWidth
                          error={
                            !!errors.workExperience?.[index]?.monthlySalary
                          }
                          helperText={
                            errors.workExperience?.[index]?.monthlySalary
                              ?.message
                          }
                          onChange={(e) =>
                            field.onChange(Number(e.target.value))
                          }
                        />
                      )}
                    />
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <Controller
                      name={`workExperience.${index}.appointmentStatus`}
                      control={control}
                      render={({ field }) => (
                        <TextField
                          {...field}
                          label="Appointment Status"
                          fullWidth
                          error={
                            !!errors.workExperience?.[index]?.appointmentStatus
                          }
                          helperText={
                            errors.workExperience?.[index]?.appointmentStatus
                              ?.message
                          }
                        />
                      )}
                    />
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <Controller
                      name={`workExperience.${index}.noOfYearsInWork`}
                      control={control}
                      render={({ field }) => (
                        <TextField
                          {...field}
                          label="Years in Work"
                          type="number"
                          fullWidth
                          error={
                            !!errors.workExperience?.[index]?.noOfYearsInWork
                          }
                          helperText={
                            errors.workExperience?.[index]?.noOfYearsInWork
                              ?.message
                          }
                          onChange={(e) =>
                            field.onChange(Number(e.target.value))
                          }
                        />
                      )}
                    />
                  </Grid>
                </>
              )}
              {name ===
                "Training/Seminars Attended (National Qualification-related)" && (
                <>
                  <Grid item xs={12} sm={6}>
                    <Controller
                      name={`trainingSeminarAttended.${index}.title`}
                      control={control}
                      render={({ field }) => (
                        <TextField
                          {...field}
                          label="Title"
                          fullWidth
                          error={
                            !!errors.trainingSeminarAttended?.[index]?.title
                          }
                          helperText={
                            errors.trainingSeminarAttended?.[index]?.title
                              ?.message
                          }
                        />
                      )}
                    />
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <Controller
                      name={`trainingSeminarAttended.${index}.venue`}
                      control={control}
                      render={({ field }) => (
                        <TextField
                          {...field}
                          label="Venue"
                          fullWidth
                          error={
                            !!errors.trainingSeminarAttended?.[index]?.venue
                          }
                          helperText={
                            errors.trainingSeminarAttended?.[index]?.venue
                              ?.message
                          }
                        />
                      )}
                    />
                  </Grid>
                  <Grid item xs={6} sm={3}>
                    <Controller
                      name={`trainingSeminarAttended.${index}.inclusiveDates.from`}
                      control={control}
                      render={({ field }) => (
                        <DatePicker
                          {...field}
                          label="From Date"
                          value={field.value ? dayjs(field.value) : null}
                          slotProps={{
                            textField: {
                              helperText:
                                errors.trainingSeminarAttended?.[index]
                                  ?.inclusiveDates?.from?.message,
                              error: Boolean(
                                errors.trainingSeminarAttended?.[index]
                                  ?.inclusiveDates?.from
                              ),
                            },
                          }}
                          onChange={(date) =>
                            field.onChange(date ? dayjs(date).toDate() : null)
                          }
                        />
                      )}
                    />
                  </Grid>
                  <Grid item xs={6} sm={3}>
                    <Controller
                      name={`trainingSeminarAttended.${index}.inclusiveDates.to`}
                      control={control}
                      render={({ field }) => (
                        <DatePicker
                          {...field}
                          label="To Date"
                          value={field.value ? dayjs(field.value) : null}
                          slotProps={{
                            textField: {
                              helperText:
                                errors.trainingSeminarAttended?.[index]
                                  ?.inclusiveDates?.to?.message,
                              error: Boolean(
                                errors.trainingSeminarAttended?.[index]
                                  ?.inclusiveDates?.to
                              ),
                            },
                          }}
                          onChange={(date) =>
                            field.onChange(date ? dayjs(date).toDate() : null)
                          }
                        />
                      )}
                    />
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <Controller
                      name={`trainingSeminarAttended.${index}.numberOfHours`}
                      control={control}
                      render={({ field }) => (
                        <TextField
                          {...field}
                          label="Number of Hours"
                          type="number"
                          fullWidth
                          error={
                            !!errors.trainingSeminarAttended?.[index]
                              ?.numberOfHours
                          }
                          helperText={
                            errors.trainingSeminarAttended?.[index]
                              ?.numberOfHours?.message
                          }
                          onChange={(e) =>
                            field.onChange(Number(e.target.value))
                          }
                        />
                      )}
                    />
                  </Grid>
                  <Grid item xs={0} sm={3}></Grid>
                  <Grid item xs={12} sm={6}>
                    <Controller
                      name={`trainingSeminarAttended.${index}.conductedBy`}
                      control={control}
                      render={({ field }) => (
                        <TextField
                          {...field}
                          label="Conducted By"
                          fullWidth
                          error={
                            !!errors.trainingSeminarAttended?.[index]
                              ?.conductedBy
                          }
                          helperText={
                            errors.trainingSeminarAttended?.[index]?.conductedBy
                              ?.message
                          }
                        />
                      )}
                    />
                  </Grid>
                  <Grid item xs={0} sm={3}></Grid>
                </>
              )}
              {name === "Licensure Examination(s) Passed" && (
                <>
                  <Grid item xs={12} sm={6}>
                    <Controller
                      name={`licensureExaminationPassed.${index}.title`}
                      control={control}
                      render={({ field }) => (
                        <TextField
                          {...field}
                          label="Title"
                          fullWidth
                          error={
                            !!errors.licensureExaminationPassed?.[index]?.title
                          }
                          helperText={
                            errors.licensureExaminationPassed?.[index]?.title
                              ?.message
                          }
                        />
                      )}
                    />
                  </Grid>
                  <Grid item xs={6} sm={3}>
                    <Controller
                      name={`licensureExaminationPassed.${index}.dateOfExamination`}
                      control={control}
                      render={({ field }) => (
                        <DatePicker
                          {...field}
                          label="Date of Examination"
                          value={field.value ? dayjs(field.value) : null}
                          slotProps={{
                            textField: {
                              helperText:
                                errors.licensureExaminationPassed?.[index]
                                  ?.dateOfExamination?.message,
                              error: Boolean(
                                errors.licensureExaminationPassed?.[index]
                                  ?.dateOfExamination
                              ),
                            },
                          }}
                          onChange={(date) =>
                            field.onChange(date ? dayjs(date).toDate() : null)
                          }
                        />
                      )}
                    />
                  </Grid>
                  <Grid item xs={6} sm={3}>
                    <Controller
                      name={`licensureExaminationPassed.${index}.expiryDate`}
                      control={control}
                      render={({ field }) => (
                        <DatePicker
                          {...field}
                          label="Expiry Date"
                          value={field.value ? dayjs(field.value) : null}
                          slotProps={{
                            textField: {
                              helperText:
                                errors.licensureExaminationPassed?.[index]
                                  ?.expiryDate?.message,
                              error: Boolean(
                                errors.licensureExaminationPassed?.[index]
                                  ?.expiryDate
                              ),
                            },
                          }}
                          onChange={(date) =>
                            field.onChange(date ? dayjs(date).toDate() : null)
                          }
                        />
                      )}
                    />
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <Controller
                      name={`licensureExaminationPassed.${index}.examinationVenue`}
                      control={control}
                      render={({ field }) => (
                        <TextField
                          {...field}
                          label="Examination Venue"
                          fullWidth
                          error={
                            !!errors.licensureExaminationPassed?.[index]
                              ?.examinationVenue
                          }
                          helperText={
                            errors.licensureExaminationPassed?.[index]
                              ?.examinationVenue?.message
                          }
                        />
                      )}
                    />
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <Controller
                      name={`licensureExaminationPassed.${index}.rating`}
                      control={control}
                      render={({ field }) => (
                        <TextField
                          {...field}
                          label="Rating"
                          type="number"
                          fullWidth
                          error={
                            !!errors.licensureExaminationPassed?.[index]?.rating
                          }
                          helperText={
                            errors.licensureExaminationPassed?.[index]?.rating
                              ?.message
                          }
                          onChange={(e) =>
                            field.onChange(Number(e.target.value))
                          }
                        />
                      )}
                    />
                  </Grid>
                  <Grid item xs={0} sm={3}></Grid>
                  <Grid item xs={12} sm={6}>
                    <Controller
                      name={`licensureExaminationPassed.${index}.remarks`}
                      control={control}
                      render={({ field }) => (
                        <TextField
                          {...field}
                          label="Remarks"
                          fullWidth
                          error={
                            !!errors.licensureExaminationPassed?.[index]
                              ?.remarks
                          }
                          helperText={
                            errors.licensureExaminationPassed?.[index]?.remarks
                              ?.message
                          }
                        />
                      )}
                    />
                  </Grid>
                  <Grid item xs={0} sm={3}></Grid>
                </>
              )}
              {name === "Competency Assessment(s) Passed" && (
                <>
                  <Grid item xs={12} sm={6}>
                    <Controller
                      name={`competencyAssessment.${index}.title`}
                      control={control}
                      render={({ field }) => (
                        <TextField
                          {...field}
                          label="Title"
                          fullWidth
                          error={!!errors.competencyAssessment?.[index]?.title}
                          helperText={
                            errors.competencyAssessment?.[index]?.title?.message
                          }
                        />
                      )}
                    />
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <Controller
                      name={`competencyAssessment.${index}.qualificationLevel`}
                      control={control}
                      render={({ field }) => (
                        <TextField
                          {...field}
                          label="Qualification Level"
                          fullWidth
                          error={
                            !!errors.competencyAssessment?.[index]
                              ?.qualificationLevel
                          }
                          helperText={
                            errors.competencyAssessment?.[index]
                              ?.qualificationLevel?.message
                          }
                        />
                      )}
                    />
                  </Grid>
                  <Grid item xs={12} sm={4}>
                    <Controller
                      name={`competencyAssessment.${index}.industrySector`}
                      control={control}
                      render={({ field }) => (
                        <TextField
                          {...field}
                          label="Industry Sector"
                          fullWidth
                          error={
                            !!errors.competencyAssessment?.[index]
                              ?.industrySector
                          }
                          helperText={
                            errors.competencyAssessment?.[index]?.industrySector
                              ?.message
                          }
                        />
                      )}
                    />
                  </Grid>
                  <Grid item xs={12} sm={4}>
                    <Controller
                      name={`competencyAssessment.${index}.certificateNumber`}
                      control={control}
                      render={({ field }) => (
                        <TextField
                          {...field}
                          label="Certificate Number"
                          fullWidth
                          error={
                            !!errors.competencyAssessment?.[index]
                              ?.certificateNumber
                          }
                          helperText={
                            errors.competencyAssessment?.[index]
                              ?.certificateNumber?.message
                          }
                        />
                      )}
                    />
                  </Grid>
                  <Grid item xs={6} sm={2}>
                    <Controller
                      name={`competencyAssessment.${index}.dateIssued`}
                      control={control}
                      render={({ field }) => (
                        <DatePicker
                          {...field}
                          label="Date Issued"
                          value={field.value ? dayjs(field.value) : null}
                          slotProps={{
                            textField: {
                              helperText:
                                errors.competencyAssessment?.[index]?.dateIssued
                                  ?.message,
                              error: Boolean(
                                errors.competencyAssessment?.[index]?.dateIssued
                              ),
                            },
                          }}
                          onChange={(date) =>
                            field.onChange(date ? dayjs(date).toDate() : null)
                          }
                        />
                      )}
                    />
                  </Grid>
                  <Grid item xs={6} sm={2}>
                    <Controller
                      name={`competencyAssessment.${index}.expirationDate`}
                      control={control}
                      render={({ field }) => (
                        <DatePicker
                          {...field}
                          label="Expiration Date"
                          value={field.value ? dayjs(field.value) : null}
                          slotProps={{
                            textField: {
                              helperText:
                                errors.competencyAssessment?.[index]
                                  ?.expirationDate?.message,
                              error: Boolean(
                                errors.competencyAssessment?.[index]
                                  ?.expirationDate
                              ),
                            },
                          }}
                          onChange={(date) =>
                            field.onChange(date ? dayjs(date).toDate() : null)
                          }
                        />
                      )}
                    />
                  </Grid>
                </>
              )}
            </Grid>
            <Button
              startIcon={<DeleteIcon />}
              onClick={() => remove(index)}
              sx={{
                marginTop: 3,
                width: "50%",
                color: "red", // Text and icon color
                borderColor: "red", // Outline color
                "&:hover": {
                  borderColor: "darkred", // Outline color on hover
                  backgroundColor: "rgba(255, 0, 0, 0.1)", // Light red background on hover
                },
              }}
              variant="outlined"
            >
              Remove Field
            </Button>
          </Box>
        ))}
        <Button
          startIcon={<AddIcon />}
          onClick={() => append({})}
          variant="outlined"
          fullWidth
        >
          Add {name}
        </Button>
      </AccordionDetails>
    </Accordion>
  );

  return (
    <Paper elevation={3} sx={{ p: 4, maxWidth: 800, mx: "auto", my: 4 }}>
      <Typography variant="h5" gutterBottom>
        Assessment Application Form
      </Typography>
      <Divider sx={{ mb: 4 }} />

      <form onSubmit={handleSubmit(onSubmit)}>
        <Grid container spacing={3}>
          {/* Training Center Information */}
          <Grid item xs={12}>
            <Typography variant="h6" gutterBottom>
              Training Center Information
            </Typography>
          </Grid>

          <Grid item xs={12} md={6}>
            <TrainingCenterSelectField
              control={control}
              errors={errors}
              name="trainingCenterName"
            />
          </Grid>

          <Grid item xs={12} md={6}>
            <Controller
              name="addressLocation"
              control={control}
              rules={{ required: "Address location is required" }}
              render={({ field }) => (
                <TextField
                  {...field}
                  label="Address Location"
                  fullWidth
                  error={!!errors.addressLocation}
                  helperText={errors.addressLocation?.message}
                />
              )}
            />
          </Grid>

          {/* Assessment Information */}
          <Grid item xs={12}>
            <Typography variant="h6" gutterBottom>
              Assessment Information
            </Typography>
          </Grid>

          <Grid item xs={12} md={6}>
            <AssessmentSelectField
              control={control}
              index={0} // or whatever index you're using
              errors={errors}
              // Optionally override the default name if needed:
              // name="customAssessmentField"
              // required={false} // if you want to make it optional
            />
          </Grid>

          <Grid item xs={12} md={6}>
            <Controller
              name="assessments[0].assessmentType"
              control={control}
              rules={{ required: "Assessment type is required" }}
              render={({ field }) => (
                <FormControl
                  fullWidth
                  error={!!errors.assessments?.[0]?.assessmentType}
                >
                  <InputLabel>Assessment Type</InputLabel>
                  <Select {...field} label="Assessment Type">
                    {assessmentTypes.map((type) => (
                      <MenuItem key={type} value={type}>
                        {type}
                      </MenuItem>
                    ))}
                  </Select>
                  <FormHelperText>
                    {errors.assessments?.[0]?.assessmentType?.message}
                  </FormHelperText>
                </FormControl>
              )}
            />
          </Grid>

          {renderDynamicFields(
            workExperienceFields.fields,
            workExperienceFields.append,
            workExperienceFields.remove,
            "Work Experience (National Qualification-related)"
          )}
          {renderDynamicFields(
            trainingSeminarFields.fields,
            trainingSeminarFields.append,
            trainingSeminarFields.remove,
            "Training/Seminars Attended (National Qualification-related)"
          )}
          {renderDynamicFields(
            licensureExaminationFields.fields,
            licensureExaminationFields.append,
            licensureExaminationFields.remove,
            "Licensure Examination(s) Passed"
          )}
          {renderDynamicFields(
            competencyAssessmentFields.fields,
            competencyAssessmentFields.append,
            competencyAssessmentFields.remove,
            "Competency Assessment(s) Passed"
          )}
          {/* Submission Button */}
          <Grid item xs={12}>
            <Box sx={{ mt: 3, display: "flex", justifyContent: "flex-end" }}>
              <Button
                variant="contained"
                color="primary"
                type="submit"
                disabled={createApplicationMutation.isPending}
              >
                {createApplicationMutation.isPending
                  ? "Submitting..."
                  : "Submit Application"}
              </Button>
            </Box>
          </Grid>

          {/* Error Message */}
          {createApplicationMutation.isError && (
            <Grid item xs={12}>
              <Alert severity="error">
                {createApplicationMutation.error?.response?.data?.message ||
                  "An error occurred while submitting the application"}
              </Alert>
            </Grid>
          )}

          {/* Success Message */}
          {createApplicationMutation.isSuccess && (
            <Grid item xs={12}>
              <Alert severity="success">
                Application submitted successfully!
              </Alert>
            </Grid>
          )}
        </Grid>
      </form>
    </Paper>
  );
};

export default ClientApplicationForm;
