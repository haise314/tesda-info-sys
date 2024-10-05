import React from "react";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "@tanstack/react-query";
import axios from "axios";
import {
  TextField,
  Button,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  FormControlLabel,
  Checkbox,
  Typography,
  Container,
  Box,
  Grid,
  Paper,
  Rating,
  Snackbar,
  Alert,
  styled,
} from "@mui/material";
import SentimentVeryDissatisfiedIcon from "@mui/icons-material/SentimentVeryDissatisfied";
import SentimentDissatisfiedIcon from "@mui/icons-material/SentimentDissatisfied";
import SentimentSatisfiedIcon from "@mui/icons-material/SentimentSatisfied";
import SentimentSatisfiedAltIcon from "@mui/icons-material/SentimentSatisfiedAltOutlined";
import SentimentVerySatisfiedIcon from "@mui/icons-material/SentimentVerySatisfied";
import { feedbackSchema } from "../../components/schema/feedback.schema";

// Custom styling for the Container component
const StyledContainer = styled(Container)(({ theme }) => ({
  marginTop: theme.spacing(4),
  marginBottom: theme.spacing(4),
}));

// Custom styling for the Paper component
const StyledPaper = styled(Paper)(({ theme }) => ({
  padding: theme.spacing(4),
  borderRadius: theme.shape.borderRadius * 2,
  boxShadow: "0 4px 20px rgba(0, 0, 0, 0.1)",
}));

// Custom styling for the Rating component
const StyledRating = styled(Rating)(({ theme }) => ({
  display: "flex",
  justifyContent: "space-between", // Spreads the icons further apart
  width: "80%", // Ensure the container takes full width for spreading
  "& .MuiRating-icon": {
    transform: "scale(2)", // Keeps the icons large
    margin: theme.spacing(0, 4), // Increase the horizontal margin to spread icons more apart
    marginLeft: theme.spacing(6.5),
  },
  "& .MuiRating-iconEmpty .MuiSvgIcon-root": {
    color: theme.palette.action.disabled,
  },
  [theme.breakpoints.down("sm")]: {
    "& .MuiRating-icon": {
      transform: "scale(1.5)", // Smaller icons for mobile screens
      margin: theme.spacing(0, 2), // Reduce spacing on mobile for better fit
      marginLeft: theme.spacing(1),
    },
  },
}));

const FormSection = styled(Box)(({ theme }) => ({
  marginBottom: theme.spacing(4),
}));

const SectionTitle = styled(Typography)(({ theme }) => ({
  marginBottom: theme.spacing(2),
  color: theme.palette.primary.main,
  fontWeight: 600,
}));

const QuestionContainer = styled(Box)(({ theme }) => ({
  marginBottom: theme.spacing(8),
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
  "& .question-text": {
    marginBottom: theme.spacing(4),
    fontSize: "1.2rem",
    fontWeight: 500,
    textAlign: "center",
  },
}));

const RatingContainer = styled(Box)(({ theme }) => ({
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
  width: "100%",
}));

const RatingLabelContainer = styled(Box)(({ theme }) => ({
  display: "flex",
  justifyContent: "center",
  width: "75%",
  marginTop: theme.spacing(1),
}));

const RatingLabel = styled(Typography)(({ theme }) => ({
  fontSize: "0.75rem",
  color: theme.palette.text.secondary,
  textAlign: "center",
  width: "20%",
  padding: theme.spacing(0, 1),
}));

const customIcons = {
  1: {
    icon: <SentimentVeryDissatisfiedIcon color="error" />,
    label: "Very Dissatisfied",
  },
  2: {
    icon: <SentimentDissatisfiedIcon color="error" />,
    label: "Dissatisfied",
  },
  3: {
    icon: <SentimentSatisfiedIcon color="warning" />,
    label: "Neutral",
  },
  4: {
    icon: <SentimentSatisfiedAltIcon color="success" />,
    label: "Satisfied",
  },
  5: {
    icon: <SentimentVerySatisfiedIcon color="success" />,
    label: "Very Satisfied",
  },
};

function IconContainer(props) {
  const { value, ...other } = props;
  return <span {...other}>{customIcons[value].icon}</span>;
}

const FeedbackForm = () => {
  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(feedbackSchema),
    defaultValues: {
      name: "",
      age: "",
      sex: "",
      address: "",
      mobileNumber: "",
      emailAddress: "",
      feedbackQuestions: [
        { question: "Mabilis na serbisyo", rating: null },
        { question: "Mahusay na serbisyo", rating: null },
        { question: "Malinis at maayos na tanggapan", rating: null },
        { question: "May malasakit at nauunawaan ang serbisyo", rating: null },
        { question: "Makatwiran ang presyo ng piling serbisyo", rating: null },
        { question: "Mapagkakatiwalaan ang serbisyo", rating: null },
        { question: "Magalang at tapat na serbisyo", rating: null },
        { question: "Abot ang lahat ng serbisyo ng TESDA", rating: null },
      ],
      recommendInstitution: false,
      suggestion: "",
    },
  });

  const [snackbar, setSnackbar] = React.useState({
    open: false,
    message: "",
    severity: "success",
  });

  const mutation = useMutation({
    mutationFn: (newFeedback) => axios.post("/api/feedback/", newFeedback),
    onSuccess: () => {
      setSnackbar({
        open: true,
        message: "Feedback submitted successfully!",
        severity: "success",
      });
    },
    onError: (error) => {
      setSnackbar({
        open: true,
        message: "Error submitting feedback. Please try again.",
        severity: "error",
      });
    },
  });

  const handleCloseSnackbar = (_, reason) => {
    if (reason === "clickaway") return;
    setSnackbar({ ...snackbar, open: false });
  };

  const onSubmit = (data) => mutation.mutate(data);

  return (
    <StyledContainer maxWidth="md">
      <StyledPaper>
        <form onSubmit={handleSubmit(onSubmit)}>
          <Typography
            variant="h4"
            align="center"
            gutterBottom
            color="primary"
            sx={{ fontWeight: 700 }}
          >
            TESDA Feedback Form
          </Typography>

          <FormSection>
            <SectionTitle variant="h6">Personal Information</SectionTitle>
            <Grid container spacing={3}>
              <Grid item xs={12} sm={6}>
                <Controller
                  name="name"
                  control={control}
                  render={({ field }) => (
                    <TextField
                      {...field}
                      label="Name"
                      error={!!errors.name}
                      helperText={errors.name?.message}
                      fullWidth
                      variant="outlined"
                    />
                  )}
                />
              </Grid>
              <Grid item xs={12} sm={3}>
                <Controller
                  name="age"
                  control={control}
                  render={({ field }) => (
                    <TextField
                      {...field}
                      label="Age"
                      type="number"
                      error={!!errors.age}
                      helperText={errors.age?.message}
                      fullWidth
                      variant="outlined"
                      onChange={(e) =>
                        field.onChange(
                          e.target.value === "" ? "" : Number(e.target.value)
                        )
                      }
                    />
                  )}
                />
              </Grid>
              <Grid item xs={12} sm={3}>
                <Controller
                  name="sex"
                  control={control}
                  render={({ field }) => (
                    <FormControl fullWidth variant="outlined">
                      <InputLabel>Sex</InputLabel>
                      <Select {...field} label="Sex">
                        <MenuItem value="Male">Male</MenuItem>
                        <MenuItem value="Female">Female</MenuItem>
                        <MenuItem value="Other">Other</MenuItem>
                      </Select>
                    </FormControl>
                  )}
                />
              </Grid>
              <Grid item xs={12}>
                <Controller
                  name="address"
                  control={control}
                  render={({ field }) => (
                    <TextField
                      {...field}
                      label="Address"
                      error={!!errors.address}
                      helperText={errors.address?.message}
                      fullWidth
                      variant="outlined"
                    />
                  )}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <Controller
                  name="mobileNumber"
                  control={control}
                  render={({ field }) => (
                    <TextField
                      {...field}
                      label="Mobile Number"
                      error={!!errors.mobileNumber}
                      helperText={errors.mobileNumber?.message}
                      fullWidth
                      variant="outlined"
                    />
                  )}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <Controller
                  name="emailAddress"
                  control={control}
                  render={({ field }) => (
                    <TextField
                      {...field}
                      label="Email Address"
                      error={!!errors.emailAddress}
                      helperText={errors.emailAddress?.message}
                      fullWidth
                      variant="outlined"
                    />
                  )}
                />
              </Grid>
            </Grid>
          </FormSection>
          <FormSection>
            <SectionTitle variant="h6" align="center">
              Service Evaluation
            </SectionTitle>
            {control._defaultValues.feedbackQuestions.map((question, index) => (
              <QuestionContainer key={index}>
                <Typography className="question-text">
                  {question.question}
                </Typography>
                <RatingContainer>
                  <Controller
                    name={`feedbackQuestions.${index}.rating`}
                    control={control}
                    render={({ field }) => (
                      <StyledRating
                        {...field}
                        IconContainerComponent={IconContainer}
                        getLabelText={(value) => customIcons[value].label}
                        highlightSelectedOnly
                        onChange={(_, newValue) => field.onChange(newValue)}
                      />
                    )}
                  />
                  <RatingLabelContainer>
                    {Object.values(customIcons).map((icon, i) => (
                      <RatingLabel key={i}>{icon.label}</RatingLabel>
                    ))}
                  </RatingLabelContainer>
                </RatingContainer>
              </QuestionContainer>
            ))}
          </FormSection>

          <FormSection>
            <Controller
              name="recommendInstitution"
              control={control}
              render={({ field }) => (
                <FormControlLabel
                  control={<Checkbox {...field} color="primary" />}
                  label="Irerekomenda nyo po ba ang TESDA sa inyong kamag-anak at kaibigan?"
                />
              )}
            />
          </FormSection>

          <FormSection>
            <Controller
              name="suggestion"
              control={control}
              render={({ field }) => (
                <TextField
                  {...field}
                  label="Suggestions for Improvement"
                  multiline
                  rows={4}
                  fullWidth
                  variant="outlined"
                />
              )}
            />
          </FormSection>

          <Box sx={{ display: "flex", justifyContent: "center" }}>
            <Button
              type="submit"
              variant="contained"
              color="primary"
              disabled={mutation.isLoading}
              size="large"
              sx={{
                px: 4,
                py: 1.5,
                borderRadius: 2,
                fontSize: "1.1rem",
              }}
            >
              {mutation.isLoading ? "Submitting..." : "Submit Feedback"}
            </Button>
          </Box>
        </form>
      </StyledPaper>

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
    </StyledContainer>
  );
};

export default FeedbackForm;
