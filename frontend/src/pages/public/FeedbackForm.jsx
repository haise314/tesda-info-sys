import React, { useState } from "react";
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
} from "@mui/material";
import { styled } from "@mui/material/styles";
import SentimentVeryDissatisfiedIcon from "@mui/icons-material/SentimentVeryDissatisfied";
import SentimentDissatisfiedIcon from "@mui/icons-material/SentimentDissatisfied";
import SentimentSatisfiedIcon from "@mui/icons-material/SentimentSatisfied";
import SentimentSatisfiedAltIcon from "@mui/icons-material/SentimentSatisfiedAltOutlined";
import SentimentVerySatisfiedIcon from "@mui/icons-material/SentimentVerySatisfied";
import { feedbackSchema } from "../../components/schema/feedback.schema";

const StyledRating = styled(Rating)(({ theme }) => ({
  "& .MuiRating-iconFilled, & .MuiRating-iconHover": {
    color: theme.palette.primary.main,
  },
  "& .MuiRating-icon": {
    fontSize: "2.5rem",
  },
}));

const customIcons = {
  1: {
    icon: <SentimentVeryDissatisfiedIcon />,
    label: "Very Dissatisfied",
  },
  2: {
    icon: <SentimentDissatisfiedIcon />,
    label: "Dissatisfied",
  },
  3: {
    icon: <SentimentSatisfiedIcon />,
    label: "Neutral",
  },
  4: {
    icon: <SentimentSatisfiedAltIcon />,
    label: "Satisfied",
  },
  5: {
    icon: <SentimentVerySatisfiedIcon />,
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
        { question: "Mabilis na serbisyo", rating: 3 },
        { question: "Mahusay na serbisyo", rating: 3 },
        { question: "Malinis at maayos na tanggapan", rating: 3 },
        { question: "May malasakit at nauunawaan ang serbisyo", rating: 3 },
        { question: "Makatwiran ang presyo ng piling serbisyo", rating: 3 },
        { question: "Mapagkakatiwalaan ang serbisyo", rating: 3 },
        { question: "Magalang at tapat na serbisyo", rating: 3 },
        { question: "Abot ang lahat ng serbisyo ng TESDA", rating: 3 },
      ],
      recommendInstitution: false,
      suggestion: "",
    },
  });

  const [snackbar, setSnackbar] = useState({
    open: false,
    message: "",
    severity: "success",
  });

  const mutation = useMutation({
    mutationFn: (newFeedback) => {
      console.log("New feedback: ", newFeedback);
      return axios.post("/api/feedback/", newFeedback);
    },
    onSuccess: () => {
      setSnackbar({
        open: true,
        message: "Feedback submitted successfully!",
        severity: "success",
      });
      reset();
    },
    onError: () => {
      console.error("Response error:", error.response?.data || error.message);
      setSnackbar({
        open: true,
        message: "Error submitting feedback. Please try again.",
        severity: "error",
      });
    },
  });

  const handleCloseSnackbar = (event, reason) => {
    if (reason === "clickaway") {
      return;
    }
    setSnackbar({ ...snackbar, open: false });
  };

  const onSubmit = (data) => {
    console.log(data);
    mutation.mutate(data);
  };

  return (
    <Container maxWidth="md" sx={{ py: 4 }}>
      <Paper elevation={3} sx={{ p: 4, borderRadius: 2 }}>
        <form onSubmit={handleSubmit(onSubmit)}>
          <Typography variant="h4" gutterBottom align="center" color="primary">
            Feedback Form
          </Typography>
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
                      <MenuItem value=""></MenuItem>
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

          <Typography variant="h6" gutterBottom sx={{ mt: 4, mb: 2 }}>
            Please rate the following aspects of our service:
          </Typography>

          <Grid container spacing={2}>
            {control._defaultValues.feedbackQuestions.map((question, index) => (
              <Grid item xs={12} key={index}>
                <Box
                  sx={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                  }}
                >
                  <Typography sx={{ flexGrow: 1, mr: 2 }}>
                    {question.question}
                  </Typography>
                  <Controller
                    name={`feedbackQuestions.${index}.rating`}
                    control={control}
                    render={({ field }) => (
                      <StyledRating
                        {...field}
                        name={`rating-${index}`}
                        defaultValue={3}
                        IconContainerComponent={IconContainer}
                        getLabelText={(value) => customIcons[value].label}
                        onChange={(_, newValue) => {
                          field.onChange(newValue);
                        }}
                      />
                    )}
                  />
                </Box>
              </Grid>
            ))}
          </Grid>

          <Box sx={{ mt: 3 }}>
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
          </Box>

          <Box sx={{ mt: 3 }}>
            <Controller
              name="suggestion"
              control={control}
              render={({ field }) => (
                <TextField
                  {...field}
                  label="Suggestions"
                  multiline
                  rows={4}
                  fullWidth
                  variant="outlined"
                />
              )}
            />
          </Box>

          <Box sx={{ mt: 4, display: "flex", justifyContent: "center" }}>
            <Button
              type="submit"
              variant="contained"
              color="primary"
              disabled={mutation.isLoading}
              size="large"
            >
              {mutation.isLoading ? "Submitting..." : "Submit Feedback"}
            </Button>
          </Box>
        </form>
      </Paper>
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

export default FeedbackForm;
