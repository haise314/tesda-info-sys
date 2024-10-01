import React, { useState } from "react";
import { useForm, useFieldArray, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "@tanstack/react-query";
import axios from "axios";
import dayjs from "dayjs";
import {
  applicantDefaultValues,
  applicantSchema,
} from "../../components/schema/applicant.schema";
import {
  assessmentTypes,
  clientTypes,
  highestEducationalAttainments,
  employmentStatuses,
  civilStatues,
} from "../../components/utils/applicant.enums";
import {
  TextField,
  Select,
  MenuItem,
  Button,
  Grid,
  Typography,
  Container,
  Box,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  IconButton,
  FormControl,
  InputLabel,
  FormHelperText,
  Radio,
  RadioGroup,
  FormControlLabel,
  Snackbar,
  Alert,
  Tooltip,
  Paper,
  Stack,
  Grid2,
  FormLabel,
  CircularProgress,
  Divider,
} from "@mui/material";
import { DatePicker } from "@mui/x-date-pickers";
import AddIcon from "@mui/icons-material/Add";
import RemoveIcon from "@mui/icons-material/Remove";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import DeleteIcon from "@mui/icons-material/Delete";

const SubmitButton = ({ isSubmitting, onSubmit, isAgreed }) => {
  return (
    <Tooltip title={!isAgreed ? "You must agree to the terms" : ""} arrow>
      <span>
        <Button
          variant="contained"
          color="primary"
          onClick={onSubmit}
          disabled={isSubmitting || !isAgreed}
          sx={{
            position: "relative",
            bgcolor: isAgreed ? "primary.main" : "grey.400",
            "&:hover": {
              bgcolor: isAgreed ? "primary.dark" : "grey.500",
            },
            transition: "background-color 0.3s",
            padding: "10px 20px",
          }}
        >
          {isSubmitting ? (
            <>
              <CircularProgress
                size={24}
                sx={{
                  position: "absolute",
                  top: "50%",
                  left: "50%",
                  transform: "translate(-50%, -50%)",
                }}
              />
              <span className="opacity-0">Submitting...</span>
            </>
          ) : (
            "Submit"
          )}
        </Button>
      </span>
    </Tooltip>
  );
};

const ApplicationForm = () => {
  const {
    control,
    handleSubmit,
    formState: { errors },
    reset,
    register,
  } = useForm({
    mode: "all",
    resolver: zodResolver(applicantSchema),
    defaultValues: applicantDefaultValues,
  });

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
  const [snackbar, setSnackbar] = React.useState({
    open: false,
    message: "",
    severity: "success",
  });

  const [isAgreed, setIsAgreed] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Handle agreement change
  const handleAgreementChange = (event) => {
    setIsAgreed(event.target.value === "Agree"); // Update state based on selection
  };

  const api = axios.create({
    baseURL: "http://localhost:5000",
  });

  const mutation = useMutation({
    mutationFn: (newApplicant) => {
      return api.post("/api/applicants", newApplicant);
    },
    onSuccess: () => {
      setSnackbar({
        open: true,
        message: "Application submitted successfully!",
        severity: "success",
      });
      reset();
    },
    onError: (error) => {
      setSnackbar({
        open: true,
        message: `Error submitting application: ${error.message}`,
        severity: "error",
      });
    },
  });

  const onSubmit = (data) => {
    console.log("Form data:", data);
    setIsSubmitting(true);

    mutation.mutate(data, {
      onSuccess: (response) => {
        console.log("Server response:", response.data);
        setSnackbar({
          open: true,
          message: "Application submitted successfully!",
          severity: "success",
        });
        reset();
      },
      onError: (error) => {
        console.error("Error submitting form:", error);
        setSnackbar({
          open: true,
          message: `Error submitting application: ${error.message}`,
          severity: "error",
        });
      },
      onSettled: () => {
        setIsSubmitting(false);
      },
    });
  };

  const handleCloseSnackbar = (event, reason) => {
    if (reason === "clickaway") {
      return;
    }
    setSnackbar({ ...snackbar, open: false });
  };

  const renderDynamicFields = (fields, append, remove, name) => (
    <Accordion sx={{ width: "100%" }}>
      <AccordionSummary expandIcon={<ExpandMoreIcon />}>
        <Typography>{name}</Typography>
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
              {name === "Work Experience" && (
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
                  <Grid item xs={12} sm={6}>
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
                  <Grid item xs={12} sm={6}>
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
              {name === "Training/Seminars Attended" && (
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
                  <Grid item xs={12} sm={6}>
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
                  <Grid item xs={12} sm={6}>
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
                </>
              )}
              {name === "Licensure Examination" && (
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
                  <Grid item xs={12} sm={6}>
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
                  <Grid item xs={12} sm={6}>
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
                </>
              )}
              {name === "Competency Assessment" && (
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
                  <Grid item xs={12} sm={6}>
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
                  <Grid item xs={12} sm={6}>
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
                  <Grid item xs={12} sm={6}>
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
                  <Grid item xs={12} sm={6}>
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
            <IconButton sx={{ marginTop: 3 }} onClick={() => remove(index)}>
              <DeleteIcon sx={{ color: "#ff4538", marginRight: 1 }} />
              <Typography variant="body2" sx={{ color: "#ff4538" }}>
                Delete
              </Typography>
            </IconButton>
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
    <Container
      maxWidth="md"
      sx={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        marginBotton: 4,
      }}
    >
      {/* Title */}

      <Paper elevation={1} sx={{ padding: 3, margin: 2 }}>
        <Typography variant="h4">Application Form</Typography>
      </Paper>

      {/* Pre-Profile */}
      <Paper
        elevation={2}
        spacing={2}
        sx={{
          padding: 3,
          margin: 2,
          width: "100%",
        }}
      >
        <Stack spacing={2}>
          <Stack direction={"row"} spacing={2}>
            <TextField
              sx={{ flex: 1 }}
              {...register("trainingCenterName")}
              label="Name of School/Training Center/Company"
              helperText={errors.trainingCenterName?.message}
              error={Boolean(errors.trainingCenterName)}
              fullWidth
            />

            <TextField
              sx={{ flex: 1 }}
              {...register("addressLocation")}
              label="Address"
              helperText={errors.addressLocation?.message}
              error={Boolean(errors.addressLocation)}
              fullWidth
            />

            <FormControl error={Boolean(errors.clientType)} sx={{ flex: 1 }}>
              <InputLabel id="client-type-label">Civil Status</InputLabel>
              <Controller
                control={control}
                name="clientType"
                render={({ field }) => (
                  <Select
                    {...field}
                    labelId="client-type-label"
                    id="client-type-select"
                    label="Client Type"
                    value={field.value || ""}
                  >
                    {clientTypes.map((status, index) => (
                      <MenuItem key={index} value={status}>
                        {status}
                      </MenuItem>
                    ))}
                  </Select>
                )}
              />
              {errors.clientType && (
                <FormHelperText>{errors.clientType?.message}</FormHelperText>
              )}
            </FormControl>
          </Stack>
          <Stack direction={"row"} spacing={2}>
            <TextField
              sx={{ flex: 1 }}
              {...register("assessmentTitle")}
              label="Title of Assessment Applied For:"
              helperText={errors.assessmentTitle?.message}
              error={Boolean(errors.assessmentTitle)}
              fullWidth
            />
            <FormControl
              error={Boolean(errors.assessmentType)}
              sx={{ flex: 1 }}
            >
              <InputLabel id="assessment-type-label">
                Assessment Type
              </InputLabel>
              <Controller
                control={control}
                name="assessmentType"
                render={({ field }) => (
                  <Select
                    {...field}
                    labelId="assessment-type-label"
                    id="assessment-type-select"
                    label="Assessment Type"
                    value={field.value || ""}
                  >
                    {assessmentTypes.map((status, index) => (
                      <MenuItem key={index} value={status}>
                        {status}
                      </MenuItem>
                    ))}
                  </Select>
                )}
              />
              {errors.assessmentType && (
                <FormHelperText>
                  {errors.assessmentType?.message}
                </FormHelperText>
              )}
            </FormControl>
          </Stack>
        </Stack>
      </Paper>

      {/* Profile Separator */}
      <Box
        sx={{
          margin: 2,
          width: "100%",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
        }}
        bgcolor={"#f5f5f5"}
      >
        <Typography variant="h6">Profile</Typography>
      </Box>

      {/* Name */}
      <Paper
        elevation={2}
        sx={{
          padding: 3,
          margin: 2,
          width: "100%",
        }}
      >
        <Typography variant="h6">Name</Typography>
        <Stack direction={"row"} spacing={2}>
          <TextField
            {...register("name.firstName")}
            label="First Name"
            helperText={errors.name?.firstName?.message}
            error={Boolean(errors.name?.firstName)}
            fullWidth
          />

          <TextField
            {...register("name.middleName")}
            label="Middle Name"
            helperText={errors.name?.middleName?.message}
            error={Boolean(errors.name?.middleName)}
            fullWidth
          />

          <TextField
            {...register("name.lastName")}
            label="Last Name"
            helperText={errors.name?.lastName?.message}
            error={Boolean(errors.name?.lastName)}
            fullWidth
          />

          <TextField
            {...register("name.extension")}
            label="Extension"
            helperText={errors.name?.extension?.message}
            error={Boolean(errors.name?.extension)}
            fullWidth
          />
        </Stack>
      </Paper>

      {/* Complete Mailing Address */}
      <Paper elevation={3} sx={{ padding: 3, margin: 2, width: "100%" }}>
        <Typography variant="h6">Complete Mailing Address</Typography>

        <Grid2 container spacing={2}>
          <Grid2 size={{ xs: 6, md: 4 }}>
            <TextField
              {...register("completeMailingAddress.street")}
              label="Street"
              helperText={errors.completeMailingAddress?.street?.message}
              error={Boolean(errors.completeMailingAddress?.street)}
              fullWidth
            />
          </Grid2>
          <Grid2 size={{ xs: 6, md: 4 }}>
            <TextField
              {...register("completeMailingAddress.barangay")}
              label="Barangay"
              helperText={errors.completeMailingAddress?.barangay?.message}
              error={Boolean(errors.completeMailingAddress?.barangay)}
              fullWidth
            />
          </Grid2>
          <Grid2 size={{ xs: 6, md: 4 }}>
            <TextField
              {...register("completeMailingAddress.district")}
              label="District"
              helperText={errors.completeMailingAddress?.district?.message}
              error={Boolean(errors.completeMailingAddress?.district)}
              fullWidth
            />
          </Grid2>
          <Grid2 size={{ xs: 6, md: 4 }}>
            <TextField
              {...register("completeMailingAddress.city")}
              label="City/Municipality"
              helperText={errors.completeMailingAddress?.city?.message}
              error={Boolean(errors.completeMailingAddress?.city)}
              fullWidth
            />
          </Grid2>
          <Grid2 size={{ xs: 6, md: 4 }}>
            <TextField
              {...register("completeMailingAddress.province")}
              label="Province"
              helperText={errors.completeMailingAddress?.province?.message}
              error={Boolean(errors.completeMailingAddress?.province)}
              fullWidth
            />
          </Grid2>
          <Grid2 size={{ xs: 3, md: 2 }}>
            <TextField
              {...register("completeMailingAddress.region")}
              label="Region"
              helperText={errors.completeMailingAddress?.region?.message}
              error={Boolean(errors.completeMailingAddress?.region)}
              fullWidth
            />
          </Grid2>
          <Grid2 size={{ xs: 3, md: 2 }}>
            <TextField
              {...register("completeMailingAddress.zipCode")}
              label="ZipCode"
              helperText={errors.completeMailingAddress?.zipCode?.message}
              error={Boolean(errors.completeMailingAddress?.zipCode)}
              fullWidth
            />
          </Grid2>
        </Grid2>
      </Paper>

      {/* Parents */}
      <Paper elevation={3} sx={{ padding: 3, margin: 2, width: "100%" }}>
        <Typography variant="h6">Parents</Typography>
        <Stack spacing={2}>
          <Typography>Mother</Typography>
          <Stack direction={"row"} spacing={2}>
            <TextField
              {...register("motherName.firstName")}
              label="First Name"
              helperText={errors.motherName?.firstName?.message}
              error={Boolean(errors.motherName?.firstName)}
              fullWidth
            />

            <TextField
              {...register("motherName.middleName")}
              label="Middle Name"
              helperText={errors.motherName?.middleName?.message}
              error={Boolean(errors.motherName?.middleName)}
              fullWidth
            />

            <TextField
              {...register("motherName.lastName")}
              label="Last Name"
              helperText={errors.motherName?.lastName?.message}
              error={Boolean(errors.motherName?.lastName)}
              fullWidth
            />

            <TextField
              {...register("motherName.extension")}
              label="Extension"
              helperText={errors.motherName?.extension?.message}
              error={Boolean(errors.motherName?.extension)}
              fullWidth
            />
          </Stack>
          <Typography>Father</Typography>
          <Stack direction={"row"} spacing={2}>
            <TextField
              {...register("fatherName.firstName")}
              label="First Name"
              helperText={errors.fatherName?.firstName?.message}
              error={Boolean(errors.fatherName?.firstName)}
              fullWidth
            />

            <TextField
              {...register("fatherName.middleName")}
              label="Middle Name"
              helperText={errors.fatherName?.middleName?.message}
              error={Boolean(errors.fatherName?.middleName)}
              fullWidth
            />

            <TextField
              {...register("fatherName.lastName")}
              label="Last Name"
              helperText={errors.fatherName?.lastName?.message}
              error={Boolean(errors.fatherName?.lastName)}
              fullWidth
            />

            <TextField
              {...register("fatherName.extension")}
              label="Extension"
              helperText={errors.fatherName?.extension?.message}
              error={Boolean(errors.fatherName?.extension)}
              fullWidth
            />
          </Stack>
        </Stack>
      </Paper>

      {/* Personal Information 2 */}
      <Paper elevation={3} sx={{ padding: 3, margin: 2, width: "100%" }}>
        <Grid2 container spacing={2}>
          <Grid2 size={{ xs: 6, md: 5 }}>
            <FormControl
              sx={{ flexGrow: 1, marginRight: 1 }}
              error={Boolean(errors.sex)}
              fullWidth
            >
              <FormLabel>Sex</FormLabel>
              <Controller
                control={control}
                name="sex"
                render={({ field }) => (
                  <RadioGroup {...field} row>
                    <FormControlLabel
                      value="Male"
                      control={<Radio />}
                      label="Male"
                    />
                    <FormControlLabel
                      value="Female"
                      control={<Radio />}
                      label="Female"
                    />
                    <FormControlLabel
                      value="Others"
                      control={<Radio />}
                      label="Others"
                    />
                  </RadioGroup>
                )}
              />
              {errors?.sex && (
                <FormHelperText error>{errors.sex.message}</FormHelperText>
              )}
            </FormControl>
          </Grid2>

          <Grid2 size={{ xs: 6, md: 7 }}>
            <FormControl
              sx={{ flexGrow: 1, marginRight: 1 }}
              error={Boolean(errors.civilStatus)}
              fullWidth
            >
              <InputLabel id="civil-status-label">Civil Status</InputLabel>
              <Controller
                control={control}
                name="civilStatus"
                render={({ field }) => (
                  <Select
                    {...field}
                    labelId="civil-status-label"
                    id="civil-status-select"
                    label="Civil Status"
                    value={field.value || ""}
                  >
                    {civilStatues.map((status, index) => (
                      <MenuItem key={index} value={status}>
                        {status}
                      </MenuItem>
                    ))}
                  </Select>
                )}
              />
              {errors.civilStatus && (
                <FormHelperText>{errors.civilStatus.message}</FormHelperText>
              )}
            </FormControl>
          </Grid2>

          <Grid2 size={{ xs: 6, md: 6 }}>
            <FormControl
              sx={{ flexGrow: 1, marginRight: 1 }}
              error={Boolean(errors.highestEducationalAttainment)}
              fullWidth
            >
              <InputLabel id="highest-educational-attainment-label">
                Highest Educational Attainment
              </InputLabel>
              <Controller
                control={control}
                name="highestEducationalAttainment"
                render={({ field }) => (
                  <Select
                    {...field}
                    labelId="highest-educational-attainment-label"
                    id="highest-educational-attainment-select"
                    label="Highest Educational Attainment"
                    value={field.value || ""}
                  >
                    {highestEducationalAttainments.map((status, index) => (
                      <MenuItem key={index} value={status}>
                        {status}
                      </MenuItem>
                    ))}
                  </Select>
                )}
              />
              {errors.highestEducationalAttainment && (
                <FormHelperText>
                  {errors.highestEducationalAttainment.message}
                </FormHelperText>
              )}
            </FormControl>
          </Grid2>

          <Grid2 size={{ xs: 6, md: 6 }}>
            <FormControl
              sx={{ flexGrow: 1, marginRight: 1 }}
              error={Boolean(errors.employmentStatus)}
              fullWidth
            >
              <InputLabel id="employment-status-label">
                Employment Status
              </InputLabel>
              <Controller
                control={control}
                name="employmentStatus"
                render={({ field }) => (
                  <Select
                    {...field}
                    labelId="employment-status-label"
                    id="employment-status-select"
                    label="Employment Status"
                    value={field.value || ""}
                  >
                    {employmentStatuses.map((status, index) => (
                      <MenuItem key={index} value={status}>
                        {status}
                      </MenuItem>
                    ))}
                  </Select>
                )}
              />
              {errors.employmentStatus && (
                <FormHelperText>
                  {errors.employmentStatus?.message}
                </FormHelperText>
              )}
            </FormControl>
          </Grid2>
        </Grid2>
      </Paper>

      {/* Contact Information */}
      <Paper elevation={3} sx={{ padding: 3, margin: 2, width: "100%" }}>
        <Grid2 container spacing={2}>
          <Grid2 size={{ xs: 6, md: 6 }}>
            <TextField
              {...register("contact.telephoneNumber")}
              label="Telephone Number"
              helperText={errors.contact?.telephoneNumber?.message}
              error={Boolean(errors.contact?.telephoneNumber)}
              fullWidth
            />
          </Grid2>

          <Grid2 size={{ xs: 6, md: 6 }}>
            <TextField
              {...register("contact.mobileNumber")}
              label="Mobile Number"
              helperText={errors.contact?.mobileNumber?.message}
              error={Boolean(errors.contact?.mobileNumber)}
              fullWidth
            />
          </Grid2>

          <Grid2 size={{ xs: 6, md: 6 }}>
            <TextField
              {...register("contact.email")}
              label="Email"
              helperText={errors.contact?.email?.message}
              error={Boolean(errors.contact?.email)}
              fullWidth
            />
          </Grid2>

          <Grid2 size={{ xs: 6, md: 3 }}>
            <TextField
              {...register("contact.fax")}
              label="Fax"
              helperText={errors.contact?.fax?.message}
              error={Boolean(errors.contact?.fax)}
              fullWidth
            />
          </Grid2>

          <Grid2 size={{ xs: 6, md: 3 }}>
            <TextField
              {...register("contact.others")}
              label="Others"
              helperText={errors.contact?.others?.message}
              error={Boolean(errors.contact?.others)}
              fullWidth
            />
          </Grid2>
        </Grid2>
      </Paper>

      {/* Birthdate */}
      <Paper elevation={3} sx={{ padding: 3, margin: 2, width: "100%" }}>
        <Typography variant="h6">Birthdate</Typography>
        <Stack
          direction={"row"}
          spacing={2}
          sx={{ justifyContent: "space-evenly" }}
        >
          <Controller
            name="birthdate"
            control={control}
            render={({ field }) => (
              <DatePicker
                sx={{ flexGrow: 1 }}
                {...field}
                label="Birthdate"
                value={field.value ? dayjs(field.value) : null} // Make sure the value is either a Date object or null
                onChange={(date) => {
                  // Convert the date to a valid Date object or null
                  field.onChange(date ? dayjs(date).toDate() : null);
                }}
                slotProps={{
                  textField: {
                    helperText: errors.birthdate?.message,
                    error: Boolean(errors.birthdate),
                  },
                }}
              />
            )}
          />

          <TextField
            {...register("age", {
              valueAsNumber: true,
              min: { value: 0, message: "Age must be a positive number" },
            })}
            label="Age"
            type="number"
            variant="outlined"
            helperText={errors.age?.message}
            error={Boolean(errors.age)}
          />

          <TextField
            {...register("birthplace")}
            label="Birthplace City"
            helperText={errors.birthplace?.message}
            error={Boolean(errors.birthplace)}
            fullWidth
          />
        </Stack>
      </Paper>

      <Box
        sx={{
          margin: 2,
          width: "100%",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
        }}
        bgcolor={"##F0F0F0"}
      >
        <Typography>
          Simply delete the field if you're not entering any inputs.
        </Typography>
      </Box>

      {renderDynamicFields(
        workExperienceFields.fields,
        workExperienceFields.append,
        workExperienceFields.remove,
        "Work Experience"
      )}
      {renderDynamicFields(
        trainingSeminarFields.fields,
        trainingSeminarFields.append,
        trainingSeminarFields.remove,
        "Training/Seminars Attended"
      )}
      {renderDynamicFields(
        licensureExaminationFields.fields,
        licensureExaminationFields.append,
        licensureExaminationFields.remove,
        "Licensure Examination"
      )}
      {renderDynamicFields(
        competencyAssessmentFields.fields,
        competencyAssessmentFields.append,
        competencyAssessmentFields.remove,
        "Competency Assessment"
      )}

      <Box
        sx={{
          margin: 2,
          width: "100%",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          bgcolor: "#f5f5f5",
          borderRadius: 2,
          padding: 2,
        }}
      >
        <Typography variant="h6" sx={{ fontWeight: "bold", marginBottom: 1 }}>
          Privacy Consent and Disclaimer
        </Typography>
        <Divider sx={{ marginBottom: 2 }} />
        <Paper elevation={3} sx={{ padding: 3, width: "100%" }}>
          <Typography variant="body1" paragraph>
            I hereby attest that I have read and understood the Privacy Notice
            of TESDA through its website
            <a
              href="https://www.tesda.gov.ph"
              target="_blank"
              rel="noopener noreferrer"
            >
              (https://www.tesda.gov.ph)
            </a>{" "}
            and thereby giving my consent in the processing of my personal
            information indicated in this Learner's Profile. The processing
            includes scholarships, employment, surveys, and all other related
            TESDA programs that may be beneficial to my qualifications.
          </Typography>
          <Box
            sx={{
              width: "100%",
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
            }}
          >
            <Typography variant="subtitle1" sx={{ marginTop: 2 }}>
              Please select your choice:
            </Typography>
            <RadioGroup
              row
              onChange={handleAgreementChange}
              sx={{ marginTop: 1 }}
            >
              <FormControlLabel
                value="Agree"
                control={<Radio />}
                label="Agree"
              />
              <FormControlLabel
                value="Disagree"
                control={<Radio />}
                label="Disagree"
              />
            </RadioGroup>
          </Box>
        </Paper>
      </Box>

      <SubmitButton
        isSubmitting={isSubmitting}
        onSubmit={handleSubmit(onSubmit)}
        isAgreed={isAgreed}
      />

      <Snackbar
        open={snackbar.open}
        autoHideDuration={6000}
        onClose={handleCloseSnackbar}
        anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
      >
        <Alert
          onClose={handleCloseSnackbar}
          severity={snackbar.severity}
          sx={{ width: "100%" }}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Container>
  );
};
export default ApplicationForm;
