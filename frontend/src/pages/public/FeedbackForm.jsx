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

const StyledContainer = styled(Container)(({ theme }) => ({
  marginTop: theme.spacing(4),
  marginBottom: theme.spacing(4),
}));

const StyledPaper = styled(Paper)(({ theme }) => ({
  padding: theme.spacing(4),
  borderRadius: theme.shape.borderRadius * 2,
  boxShadow: "0 4px 20px rgba(0, 0, 0, 0.1)",
}));

const StyledRating = styled(Rating)(({ theme }) => ({
  display: "flex",
  justifyContent: "space-between",
  width: "80%",
  "& .MuiRating-icon": {
    transform: "scale(1.5)",
    margin: theme.spacing(0, 2),
  },
  "& .MuiRating-iconEmpty .MuiSvgIcon-root": {
    color: theme.palette.action.disabled,
  },
  [theme.breakpoints.down("sm")]: {
    "& .MuiRating-icon": {
      transform: "scale(1.2)",
      margin: theme.spacing(0, 1),
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
  marginBottom: theme.spacing(4),
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
  "& .question-text": {
    marginBottom: theme.spacing(2),
    fontSize: "1.1rem",
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

const RatingLegend = styled(Box)(({ theme }) => ({
  display: "flex",
  justifyContent: "space-between",
  width: "80%",
  marginTop: theme.spacing(1),
  [theme.breakpoints.down("sm")]: {
    width: "100%",
  },
}));

const RatingLabel = styled(Typography)(({ theme }) => ({
  fontSize: "0.75rem",
  color: theme.palette.text.secondary,
  textAlign: "center",
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

const IconContainer = (props) => {
  const { value, ...other } = props;
  return <span {...other}>{customIcons[value].icon}</span>;
};

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
        { question: "Mabilis na serbisyo", rating: "" },
        { question: "Mahusay na serbisyo", rating: "" },
        { question: "Malinis at maayos na tanggapan", rating: "" },
        { question: "May malasakit at nauunawaan ang serbisyo", rating: "" },
        { question: "Makatwiran ang presyo ng piling serbisyo", rating: "" },
        { question: "Mapagkakatiwalaan ang serbisyo", rating: "" },
        { question: "Magalang at tapat na serbisyo", rating: "" },
        { question: "Abot ang lahat ng serbisyo ng TESDA", rating: "" },
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
        <Box component="form" onSubmit={handleSubmit(onSubmit)}>
          <Typography
            variant="h4"
            align="center"
            gutterBottom
            color="primary"
            sx={{ fontWeight: 700 }}
          >
            Customer Feedback Form
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
                    rules={{ required: "This field is required" }}
                    render={({ field, fieldState: { error } }) => (
                      <>
                        <StyledRating
                          {...field}
                          onChange={(_, value) => field.onChange(value)}
                          IconContainerComponent={IconContainer}
                          getLabelText={(value) => customIcons[value].label}
                          highlightSelectedOnly
                        />
                        {error && (
                          <Typography color="error" variant="caption">
                            {"This field is required"}
                          </Typography>
                        )}
                      </>
                    )}
                  />
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
        </Box>
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
