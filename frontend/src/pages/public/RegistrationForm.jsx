import React, { useEffect, useState } from "react";
import {
  Button,
  Checkbox,
  FormControl,
  FormControlLabel,
  FormLabel,
  TextField,
  Radio,
  RadioGroup,
  Container,
  Typography,
  Box,
  Stack,
  Grid2,
  Paper,
  InputLabel,
  Select,
  MenuItem,
  FormHelperText,
  Snackbar,
  Alert,
  Divider,
  Tooltip,
  CircularProgress,
} from "@mui/material";
import { Controller, useForm, useWatch } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  registrantDefaultValues,
  registrantSchema,
} from "../../components/schema/registration.schema";
import {
  educationalAttainments,
  employmentStatuses,
  employmentTypes,
  civilStatues,
  clientClassifications,
  scholarTypes,
} from "../../components/utils/registrant.enums";
import { DatePicker } from "@mui/x-date-pickers";
import dayjs from "dayjs";
import axios from "axios";

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

function RegistrationForm() {
  const {
    register,
    control,
    formState: { errors },
    handleSubmit,
    setValue,
    reset,
  } = useForm({
    resolver: zodResolver(registrantSchema),
    defaultValues: registrantDefaultValues,
  });

  const [isAgreed, setIsAgreed] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: "",
    severity: "success",
  });

  const hasScholarType = useWatch({ control, name: "hasScholarType" });

  // Handle agreement change
  const handleAgreementChange = (event) => {
    setIsAgreed(event.target.value === "Agree"); // Update state based on selection
  };

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

  // Snackbar handler
  const handleCloseSnackbar = (event, reason) => {
    if (reason === "clickaway") {
      return;
    }
    setSnackbar({ ...snackbar, open: false });
  };

  // Submit handler
  const onSubmit = async (data) => {
    setIsSubmitting(true);
    data.hasScholarType = Boolean(data.hasScholarType);
    console.log("Form Data Before Submission:", data);
    try {
      // Handle successful registration (e.g., show success message, redirect)
      const response = await axios.post("/api/register", data);

      // Check if the response is JSON
      if (response.headers["content-type"].includes("application/json")) {
        console.log("Response Data:", response.data);
        // Process response data here
      } else {
        console.error("Received non-JSON response:", response);
      }

      // Log the response data
      console.log("Registration successful:", response.data);
      // Alert for successful registration
      setSnackbar({
        open: true,
        message: "Registration successful!",
        severity: "success",
      });
      // reset the form
      reset(registrantDefaultValues);
      // alert(JSON.stringify(data, null, 2));
    } catch (error) {
      // Handle registration error (e.g., show error message)
      console.error(
        "Registration failed:",
        error.response ? error.response.data : error.message
      );
      // alert(JSON.stringify(data, null, 2));
      // Alert for failed registration
      setSnackbar({
        open: true,
        message: "Registration failed. Please try again.",
        severity: "error",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Container
      maxWidth="md"
      sx={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        marginBottom: 4,
        marginTop: 4,
      }}
    >
      {/* Title */}
      <Box
        sx={{
          marginBottom: 3, // Adds spacing after the title
          textAlign: "center", // Center-aligns the title for symmetry
        }}
      >
        <Typography
          variant="h3" // Larger but not overwhelming, ideal for a main page title
          component="h1" // Sets the semantic structure as the primary heading
          sx={{
            fontWeight: 600, // Semi-bold for attention
            color: "primary.main", // Use the primary theme color for brand consistency
          }}
        >
          Registration Form
        </Typography>
      </Box>

      {/* Learner/Manpower Profile */}
      <Box
        sx={{
          margin: 2,
          width: "100%",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          bgcolor: "#f5f5f5",
          borderRadius: 2,
          pt: 2,
        }}
        bgcolor={"#f5f5f5"}
      >
        <Typography variant="h6" sx={{ fontWeight: "bold", marginBottom: 1 }}>
          Learner/Manpower Profile
        </Typography>
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
          <Stack
            direction={{ xs: "column", md: "row" }} // Stack direction changes based on screen size
            spacing={2}
          >
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

          {/* Complete Mailing Address */}
          <Divider sx={{ margin: 3 }} />
          <Typography variant="h6">Complete Mailing Address</Typography>

          <Grid2 container spacing={2}>
            <Grid2 size={{ xs: 12, md: 4 }}>
              <TextField
                {...register("completeMailingAddress.street")}
                label="Street"
                helperText={errors.completeMailingAddress?.street?.message}
                error={Boolean(errors.completeMailingAddress?.street)}
                fullWidth
              />
            </Grid2>
            <Grid2 size={{ xs: 12, md: 4 }}>
              <TextField
                {...register("completeMailingAddress.barangay")}
                label="Barangay"
                helperText={errors.completeMailingAddress?.barangay?.message}
                error={Boolean(errors.completeMailingAddress?.barangay)}
                fullWidth
              />
            </Grid2>
            <Grid2 size={{ xs: 12, md: 4 }}>
              <TextField
                {...register("completeMailingAddress.district")}
                label="District"
                helperText={errors.completeMailingAddress?.district?.message}
                error={Boolean(errors.completeMailingAddress?.district)}
                fullWidth
              />
            </Grid2>
            <Grid2 size={{ xs: 12, md: 4 }}>
              <TextField
                {...register("completeMailingAddress.city")}
                label="City/Municipality"
                helperText={errors.completeMailingAddress?.city?.message}
                error={Boolean(errors.completeMailingAddress?.city)}
                fullWidth
              />
            </Grid2>
            <Grid2 size={{ xs: 12, md: 4 }}>
              <TextField
                {...register("completeMailingAddress.province")}
                label="Province"
                helperText={errors.completeMailingAddress?.province?.message}
                error={Boolean(errors.completeMailingAddress?.province)}
                fullWidth
              />
            </Grid2>
            <Grid2 size={{ xs: 12, md: 4 }}>
              <TextField
                {...register("completeMailingAddress.region")}
                label="Region"
                helperText={errors.completeMailingAddress?.region?.message}
                error={Boolean(errors.completeMailingAddress?.region)}
                fullWidth
              />
            </Grid2>
          </Grid2>

          {/* Contact Information */}
          <Divider sx={{ margin: 3 }} />
          <Typography variant="h6">Contact Information</Typography>
          <Stack direction={{ xs: "column", md: "row" }} spacing={2}>
            <TextField
              {...register("contact.email")}
              label="Email"
              helperText={errors.contact?.email?.message}
              error={Boolean(errors.contact?.email)}
              fullWidth
            />
            <TextField
              {...register("contact.mobileNumber")}
              label="Mobile Number"
              helperText={errors.contact?.mobileNumber?.message}
              error={Boolean(errors.contact?.mobileNumber)}
              fullWidth
            />
          </Stack>
        </Paper>
      </Box>

      {/* Personal Information */}
      <Box
        sx={{
          margin: 2,
          width: "100%",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          bgcolor: "#f5f5f5",
          borderRadius: 2,
          pt: 2,
        }}
        bgcolor={"#f5f5f5"}
      >
        <Typography variant="h6" sx={{ fontWeight: "bold", marginBottom: 1 }}>
          Personal Information
        </Typography>

        {/* Personal Information 2 */}
        <Paper
          elevation={3}
          sx={{
            padding: 3,
            margin: 2,
            width: "100%",
          }}
        >
          <Stack
            direction={{ xs: "column", md: "row" }}
            spacing={2}
            sx={{ width: "100%" }}
          >
            {/* Sex */}
            <FormControl
              sx={{ flexGrow: 1, marginRight: 1, width: "100%" }}
              error={Boolean(errors.personalInformation?.sex)}
              fullWidth
            >
              <FormLabel>Sex</FormLabel>
              <Controller
                control={control}
                name="personalInformation.sex"
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
              {errors.personalInformation?.sex && (
                <FormHelperText error>
                  {errors.personalInformation.sex.message}
                </FormHelperText>
              )}
            </FormControl>
            {/* Civil Status */}
            <FormControl
              sx={{ flexGrow: 1, marginRight: 1 }}
              error={Boolean(errors.personalInformation?.civilStatus)}
              fullWidth
            >
              <InputLabel id="civil-status-label">Civil Status</InputLabel>
              <Controller
                control={control}
                name="personalInformation.civilStatus"
                render={({ field }) => (
                  <Select
                    {...field}
                    labelId="civil-status-label"
                    id="civil-status-select"
                    label="Civil Status"
                  >
                    {civilStatues.map((status, index) => (
                      <MenuItem key={index} value={status}>
                        {status}
                      </MenuItem>
                    ))}
                  </Select>
                )}
              />
              {errors.personalInformation?.civilStatus && (
                <FormHelperText>
                  {errors.personalInformation.civilStatus.message}
                </FormHelperText>
              )}
            </FormControl>
            {/* Nationality */}
            <TextField
              sx={{ flexGrow: 1, marginRight: 1 }}
              {...register("personalInformation.nationality")}
              label="Nationality"
              helperText={errors.personalInformation?.nationality?.message}
              error={Boolean(errors.personalInformation?.nationality)}
            />
          </Stack>

          <Divider sx={{ margin: 3 }} />
          {/* Employment Information */}

          <Typography variant="h6">
            Employment Information (Before Training)
          </Typography>
          <Stack direction={{ xs: "column", md: "column" }} spacing={2}>
            <FormControl
              sx={{ flexGrow: 1 }}
              error={Boolean(errors.employmentStatus)}
            >
              <FormLabel>Employment Status</FormLabel>
              <Controller
                name="employmentStatus"
                control={control}
                defaultValue=""
                rules={{ required: "Employment Status is required client" }}
                render={({ field }) => (
                  <RadioGroup {...field} row>
                    {employmentStatuses.map((status) => (
                      <FormControlLabel
                        key={status}
                        value={status}
                        control={<Radio />}
                        label={status}
                      />
                    ))}
                  </RadioGroup>
                )}
              />
              {errors.employmentStatus && (
                <FormHelperText error>
                  {errors.employmentStatus?.message}
                </FormHelperText>
              )}
            </FormControl>

            {showEmploymentType && (
              <FormControl
                sx={{ flexGrow: 1 }}
                error={Boolean(errors.employmentType)}
              >
                <InputLabel id="employment-type-label">
                  Employment Type
                </InputLabel>
                <Controller
                  name="employmentType"
                  control={control}
                  render={({ field }) => (
                    <Select
                      {...field}
                      labelId="employment-type-label"
                      id="employment-type-select"
                      label="Employment Type"
                    >
                      {employmentTypes.map((type, index) => (
                        <MenuItem key={index} value={type}>
                          {type}
                        </MenuItem>
                      ))}
                    </Select>
                  )}
                />
                {errors.employmentType && (
                  <FormHelperText>
                    {errors.employmentType?.message}
                  </FormHelperText>
                )}
              </FormControl>
            )}
          </Stack>

          <Divider sx={{ margin: 3 }} />
          {/* Birthdate */}

          <Typography variant="h6">Birthdate</Typography>
          <Stack
            direction={"row"}
            spacing={2}
            sx={{ justifyContent: "space-evenly" }}
          >
            <Controller
              name="personalInformation.birthdate"
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
                      helperText:
                        errors.personalInformation?.birthdate?.message,
                      error: Boolean(errors.personalInformation?.birthdate),
                    },
                  }}
                />
              )}
            />
            {/* Age */}
            <TextField
              {...register("personalInformation.age", {
                valueAsNumber: true,
                min: { value: 0, message: "Age must be a positive number" },
              })}
              label="Age"
              type="number"
              variant="outlined"
              helperText={errors.personalInformation?.age?.message}
              error={Boolean(errors.personalInformation?.age)}
            />
          </Stack>

          <Divider sx={{ margin: 3 }} />
          {/* Birthplace */}

          <Typography variant="h6">Birthplace</Typography>
          <Stack direction={{ xs: "column", md: "row" }} spacing={2}>
            <TextField
              {...register("personalInformation.birthplace.city")}
              label="Birthplace City"
              helperText={errors.personalInformation?.birthplace?.city?.message}
              error={Boolean(errors.personalInformation?.birthplace?.city)}
              fullWidth
            />

            <TextField
              {...register("personalInformation.birthplace.province")}
              label="Birthplace Province"
              helperText={
                errors.personalInformation?.birthplace?.province?.message
              }
              error={Boolean(errors.personalInformation?.birthplace?.province)}
              fullWidth
            />

            <TextField
              {...register("personalInformation.birthplace.region")}
              label="Birthplace Region"
              helperText={
                errors.personalInformation?.birthplace?.region?.message
              }
              error={Boolean(errors.personalInformation?.birthplace?.region)}
              fullWidth
            />
          </Stack>

          <Divider sx={{ margin: 3 }} />
          {/* Education Attainment Before the Training (Trainee) */}

          <Typography variant="h6">
            Education Attainment Before the Training (Trainee)
          </Typography>
          <FormControl
            sx={{ flexGrow: 1, marginRight: 1 }}
            error={Boolean(errors.education)}
            fullWidth
          >
            <InputLabel id="education-label">Civil Status</InputLabel>
            <Controller
              control={control}
              name="education"
              render={({ field }) => (
                <Select
                  {...field}
                  labelId="education-label"
                  id="education-select"
                  label="Educational Attainment"
                >
                  {educationalAttainments.map((status, index) => (
                    <MenuItem key={index} value={status}>
                      {status}
                    </MenuItem>
                  ))}
                </Select>
              )}
            />
            {errors.education && (
              <FormHelperText>{errors.education?.message}</FormHelperText>
            )}
          </FormControl>

          <Divider sx={{ margin: 3 }} />
          {/* Parent/Guardian Information */}

          <Typography variant="h6">Parent/Guardian Information</Typography>
          <Typography sx={{ margin: 2 }}>Name</Typography>
          <Stack direction={{ xs: "column", md: "row" }} spacing={2}>
            <TextField
              {...register("parent.name.firstName")}
              label="First Name"
              helperText={errors.parent?.name?.firstName?.message}
              error={Boolean(errors.parent?.name?.firstName)}
              fullWidth
            />

            <TextField
              {...register("parent.name.middleName")}
              label="Middle Name"
              helperText={errors.parent?.name?.middleName?.message}
              error={Boolean(errors.parent?.name?.middleName)}
              fullWidth
            />

            <TextField
              {...register("parent.name.lastName")}
              label="Last Name"
              helperText={errors.parent?.name?.lastName?.message}
              error={Boolean(errors.parent?.name?.lastName)}
              fullWidth
            />
          </Stack>
          <Typography sx={{ margin: 2 }}>Complete Mailing Address</Typography>
          <Stack direction={{ xs: "column", md: "row" }} spacing={2}>
            <Grid2 container spacing={2}>
              <Grid2 size={{ xs: 12, md: 4 }}>
                <TextField
                  {...register("parent.completeMailingAddress.street")}
                  label="Street"
                  helperText={
                    errors.parent?.completeMailingAddress?.street?.message
                  }
                  error={Boolean(errors.parent?.completeMailingAddress?.street)}
                  fullWidth
                />
              </Grid2>
              <Grid2 size={{ xs: 12, md: 4 }}>
                <TextField
                  {...register("parent.completeMailingAddress.barangay")}
                  label="Barangay"
                  helperText={
                    errors.parent?.completeMailingAddress?.barangay?.message
                  }
                  error={Boolean(
                    errors.parent?.completeMailingAddress?.barangay
                  )}
                  fullWidth
                />
              </Grid2>
              <Grid2 size={{ xs: 12, md: 4 }}>
                <TextField
                  {...register("parent.completeMailingAddress.district")}
                  label="District"
                  helperText={
                    errors.parent?.completeMailingAddress?.district?.message
                  }
                  error={Boolean(
                    errors.parent?.completeMailingAddress?.district
                  )}
                  fullWidth
                />
              </Grid2>
              <Grid2 size={{ xs: 12, md: 4 }}>
                <TextField
                  {...register("parent.completeMailingAddress.city")}
                  label="City/Municipality"
                  helperText={
                    errors.parent?.completeMailingAddress?.city?.message
                  }
                  error={Boolean(errors.parent?.completeMailingAddress?.city)}
                  fullWidth
                />
              </Grid2>
              <Grid2 size={{ xs: 12, md: 4 }}>
                <TextField
                  {...register("parent.completeMailingAddress.province")}
                  label="Province"
                  helperText={
                    errors.parent?.completeMailingAddress?.province?.message
                  }
                  error={Boolean(
                    errors.parent?.completeMailingAddress?.province
                  )}
                  fullWidth
                />
              </Grid2>
              <Grid2 size={{ xs: 12, md: 4 }}>
                <TextField
                  {...register("parent.completeMailingAddress.region")}
                  label="Region"
                  helperText={
                    errors.parent?.completeMailingAddress?.region?.message
                  }
                  error={Boolean(errors.parent?.completeMailingAddress?.region)}
                  fullWidth
                />
              </Grid2>
            </Grid2>
          </Stack>
        </Paper>
      </Box>

      {/* Learner/Trainee/Student (Clients) Classification */}
      <Box
        sx={{
          margin: 2,
          width: "100%",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          bgcolor: "#f5f5f5",
          borderRadius: 2,
          pt: 2,
        }}
      >
        <Typography variant="h6" sx={{ fontWeight: "bold", marginBottom: 1 }}>
          Learner/Trainee/Student (Clients) Classification
        </Typography>

        <Paper elevation={3} sx={{ padding: 3, margin: 2, width: "100%" }}>
          <Typography variant="h6">Classification:</Typography>
          <FormControl
            sx={{ flexGrow: 1, marginRight: 1 }}
            error={Boolean(errors.clientClassification)}
            fullWidth
          >
            <InputLabel id="client-classification-label">
              Client Classification
            </InputLabel>
            <Controller
              control={control}
              name="clientClassification"
              render={({ field }) => (
                <Select
                  {...field}
                  labelId="client-classification-label"
                  id="client-classification-select"
                  label="Client Classification"
                >
                  {clientClassifications.map((status, index) => (
                    <MenuItem key={index} value={status}>
                      {status}
                    </MenuItem>
                  ))}
                </Select>
              )}
            />
            {errors.clientClassification && (
              <FormHelperText>
                {errors.clientClassification?.message}
              </FormHelperText>
            )}
          </FormControl>
        </Paper>
      </Box>

      {/* Course/Qualification */}
      <Box
        sx={{
          margin: 2,
          width: "100%",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          bgcolor: "#f5f5f5",
          borderRadius: 2,
          pt: 2,
        }}
      >
        <Typography variant="h6" sx={{ fontWeight: "bold", marginBottom: 1 }}>
          Name of Course/Qualification
        </Typography>

        <Paper elevation={3} sx={{ padding: 3, margin: 2, width: "100%" }}>
          <Typography variant="h6">Course:</Typography>
          <TextField
            {...register("course")}
            label="Course"
            helperText={errors.course?.message}
            error={Boolean(errors.course)}
            fullWidth
          />
        </Paper>
      </Box>

      {/* Scholar */}
      <Box
        sx={{
          margin: 2,
          width: "100%",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          bgcolor: "#f5f5f5",
          borderRadius: 2,
          padding: 1,
        }}
      >
        <FormControlLabel
          {...register("hasScholarType")}
          label={
            <Typography variant="h6" sx={{ fontWeight: "bold" }}>
              Are you a scholar?
            </Typography>
          }
          control={<Checkbox />}
        />

        {hasScholarType && (
          <Paper elevation={3} sx={{ padding: 3, margin: 2, width: "100%" }}>
            <FormControl
              sx={{ flexGrow: 1, marginRight: 1 }}
              error={Boolean(errors.scholarType)} // TODO: fix error message
              fullWidth
            >
              <InputLabel id="scholar-type-label">Scholar Type</InputLabel>
              <Controller
                control={control}
                name="scholarType"
                render={({ field }) => (
                  <Select
                    {...field}
                    labelId="scholar-type-label"
                    id="scholar-type-select"
                    label="Scholar Type"
                  >
                    {scholarTypes.map((status, index) => (
                      <MenuItem key={index} value={status}>
                        {status}
                      </MenuItem>
                    ))}
                  </Select>
                )}
              />
              {errors.scholarType && (
                <FormHelperText>{errors.scholarType?.message}</FormHelperText> // TODO:fix error message
              )}
            </FormControl>
          </Paper>
        )}
      </Box>

      {/* Privacy Consent and Disclaimer */}
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

      {/* Snackbar, Alerts for a successful or failed registration */}
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
}

export default RegistrationForm;
