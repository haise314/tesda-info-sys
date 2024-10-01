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
  FormLabel,
  Box,
  Grid,
} from "@mui/material";
import { styled } from "@mui/material/styles";
import Rating from "@mui/material/Rating";
import SentimentVeryDissatisfiedIcon from "@mui/icons-material/SentimentVeryDissatisfied";
import SentimentDissatisfiedIcon from "@mui/icons-material/SentimentDissatisfied";
import SentimentSatisfiedIcon from "@mui/icons-material/SentimentSatisfied";
import SentimentSatisfiedAltIcon from "@mui/icons-material/SentimentSatisfiedAltOutlined";
import SentimentVerySatisfiedIcon from "@mui/icons-material/SentimentVerySatisfied";
import { feedbackSchema } from "../../components/schema/feedback.schema";

const StyledRating = styled(Rating)(({ theme }) => ({
  "& .MuiRating-icon": {
    fontSize: "3rem", // Set desired size here
  },
  "& .MuiRating-iconEmpty .MuiSvgIcon-root": {
    color: theme.palette.action.disabled,
  },
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

  const mutation = useMutation({
    mutationFn: (newFeedback) => {
      return axios.post("http://localhost:5000/api/feedback", newFeedback);
    },
  });

  const onSubmit = (data) => {
    console.log(data);
    mutation.mutate(data);
  };

  return (
    <Container maxWidth="sm" sx={{ flexGrow: 1 }}>
      <form onSubmit={handleSubmit(onSubmit)}>
        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
          }}
        >
          <Typography variant="h4" gutterBottom>
            Feedback Form
          </Typography>
          <Grid container spacing={2}>
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
                    margin="normal"
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
                    margin="normal"
                    onChange={(e) => field.onChange(Number(e.target.value))}
                  />
                )}
              />
            </Grid>
            <Grid item xs={12} sm={3}>
              <Controller
                name="sex"
                control={control}
                render={({ field }) => (
                  <FormControl fullWidth margin="normal">
                    <InputLabel>Sex</InputLabel>
                    <Select {...field} error={!!errors.sex}>
                      <MenuItem value="Male">Male</MenuItem>
                      <MenuItem value="Female">Female</MenuItem>
                      <MenuItem value="Other">Other</MenuItem>
                    </Select>
                  </FormControl>
                )}
              />
            </Grid>
            <Grid item xs={12} sm={12}>
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
                    margin="normal"
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
                    margin="normal"
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
                    margin="normal"
                  />
                )}
              />
            </Grid>
          </Grid>

          <Typography variant="h6" gutterBottom sx={{ mt: 4 }}>
            Please rate the following aspects of our service:
          </Typography>

          {control._defaultValues.feedbackQuestions.map((question, index) => (
            <Controller
              key={index}
              name={`feedbackQuestions.${index}.rating`}
              control={control}
              render={({ field }) => (
                <FormControl component="fieldset" margin="normal" fullWidth>
                  <Typography sx={{ fontSize: "0.8 rem" }}>
                    {question.question}
                  </Typography>
                  <StyledRating
                    {...field}
                    name={`rating-${index}`}
                    defaultValue={3}
                    IconContainerComponent={IconContainer}
                    getLabelText={(value) => customIcons[value].label}
                    highlightSelectedOnly
                    onChange={(_, newValue) => {
                      field.onChange(newValue);
                    }}
                  />
                </FormControl>
              )}
            />
          ))}

          <Controller
            name="recommendInstitution"
            control={control}
            render={({ field }) => (
              <FormControlLabel
                control={<Checkbox {...field} />}
                label="Irerekomenda nyo po ba ang TESDA sa inyong kamag-anak at kaibigan?"
              />
            )}
          />

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
                margin="normal"
              />
            )}
          />

          <Button
            type="submit"
            variant="contained"
            color="primary"
            disabled={mutation.isLoading}
            sx={{ mt: 2 }}
          >
            {mutation.isLoading ? "Submitting..." : "Submit Feedback"}
          </Button>
        </Box>
      </form>
    </Container>
  );
};

export default FeedbackForm;
