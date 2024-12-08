import React from "react";
import { useForm, Controller } from "react-hook-form";
import { useMutation } from "@tanstack/react-query";
import { styled } from "@mui/material/styles";
import Rating from "@mui/material/Rating";
import SentimentVeryDissatisfiedIcon from "@mui/icons-material/SentimentVeryDissatisfied";
import SentimentDissatisfiedIcon from "@mui/icons-material/SentimentDissatisfied";
import SentimentSatisfiedIcon from "@mui/icons-material/SentimentSatisfied";
import SentimentSatisfiedAltIcon from "@mui/icons-material/SentimentSatisfiedAltOutlined";
import SentimentVerySatisfiedIcon from "@mui/icons-material/SentimentVerySatisfied";
import {
  TextField,
  RadioGroup,
  Radio,
  FormControlLabel,
  FormControl,
  FormLabel,
  MenuItem,
  Select,
  Button,
  Box,
  Typography,
  Container,
  Paper,
  Grid,
  Snackbar,
  Alert,
  InputLabel,
  FormHelperText,
  Divider,
} from "@mui/material";
import axios from "axios";
import {
  qualityDimensions,
  serviceTypes,
} from "../../components/utils/enums/citizensCharter.enum.js";

const primaryColor = "#0038a8";

const StyledContainer = styled(Container)(({ theme }) => ({
  marginTop: theme.spacing(4),
  marginBottom: theme.spacing(4),
}));

const StyledPaper = styled(Paper)(({ theme }) => ({
  padding: theme.spacing(4),
  borderTop: `6px solid ${primaryColor}`,
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
  color: primaryColor,
  fontWeight: 600,
  borderBottom: `2px solid ${primaryColor}`,
  paddingBottom: theme.spacing(1),
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

const customIcons = {
  1: {
    icon: <SentimentVeryDissatisfiedIcon color="error" />,
    label: "Strongly Disagree",
  },
  2: {
    icon: <SentimentDissatisfiedIcon color="error" />,
    label: "Disagree",
  },
  3: {
    icon: <SentimentSatisfiedIcon color="warning" />,
    label: "Neutral",
  },
  4: {
    icon: <SentimentSatisfiedAltIcon color="success" />,
    label: "Agree",
  },
  5: {
    icon: <SentimentVerySatisfiedIcon color="success" />,
    label: "Strongly Agree",
  },
};

const IconContainer = (props) => {
  const { value, ...other } = props;
  return <span {...other}>{customIcons[value].icon}</span>;
};

const CitizensCharter = () => {
  const {
    register,
    watch,
    handleSubmit,
    control,
    reset,
    formState: { errors },
  } = useForm({
    defaultValues: {
      serviceQualityDimensions: {
        satisfaction: "",
        processingTime: "",
        documentCompliance: "",
        processSimplicity: "",
        informationAccessibility: "",
        reasonableCost: "",
        fairness: "",
        staffRespect: "",
        serviceDelivery: "",
      },
      transactionType: "",
      otherTransactionType: "",
      gender: "",
      clientType: "",
      citizensCharterKnowledge: "",
    },
  });

  const [snackbar, setSnackbar] = React.useState({
    open: false,
    message: "",
    severity: "success",
  });

  const transactionType = watch("transactionType");

  const createCharter = async (data) => {
    const ratingToText = {
      1: "Strongly Disagree",
      2: "Disagree",
      3: "Neutral",
      4: "Agree",
      5: "Strongly Agree",
    };

    const transformedData = {
      ...data,
      serviceQualityDimensions: Object.keys(
        data.serviceQualityDimensions
      ).reduce(
        (acc, key) => ({
          ...acc,
          [key]: ratingToText[data.serviceQualityDimensions[key]],
        }),
        {}
      ),
    };

    const optionalFields = [
      "emailAddress",
      "name",
      "employeeName",
      "suggestions",
    ];
    optionalFields.forEach((field) => {
      if (!transformedData[field]) delete transformedData[field];
    });

    if (transformedData.transactionType !== "Others") {
      delete transformedData.otherTransactionType;
    }

    const response = await axios.post("/api/citizens-charter", transformedData);
    return response.data;
  };

  const mutation = useMutation({
    mutationFn: createCharter,
    onSuccess: () => {
      setSnackbar({
        open: true,
        message: "Form submitted successfully!",
        severity: "success",
      });
      reset();
    },
    onError: (error) => {
      setSnackbar({
        open: true,
        message: `Error submitting form: ${error.message}`,
        severity: "error",
      });
    },
  });

  const onSubmit = (data) => {
    mutation.mutate(data);
  };

  const handleCloseSnackbar = (_, reason) => {
    if (reason === "clickaway") return;
    setSnackbar({ ...snackbar, open: false });
  };

  return (
    <StyledContainer maxWidth="md">
      <StyledPaper>
        <Box component="form" onSubmit={handleSubmit(onSubmit)}>
          <Typography
            variant="h4"
            align="center"
            gutterBottom
            sx={{ color: primaryColor, fontWeight: "bold" }}
          >
            Citizens Charter Form
          </Typography>
          <Typography
            variant="body1"
            align="center"
            color="text.secondary"
            gutterBottom
          >
            Provincial Training Center – Iba
          </Typography>

          <Divider sx={{ my: 3, backgroundColor: primaryColor }} />

          <FormSection>
            <SectionTitle variant="h6">Personal Information</SectionTitle>
            <Grid container spacing={3}>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Email Address"
                  {...register("emailAddress")}
                  error={!!errors.emailAddress}
                  helperText={errors.emailAddress?.message}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Name"
                  {...register("name")}
                  error={!!errors.name}
                  helperText={errors.name?.message}
                />
              </Grid>
              <Grid item xs={12} sm={4}>
                <FormControl fullWidth error={!!errors.gender}>
                  <FormLabel sx={{ color: primaryColor }}>Gender</FormLabel>
                  <Controller
                    name="gender"
                    control={control}
                    rules={{ required: "Gender is required" }}
                    render={({ field }) => (
                      <RadioGroup {...field} row>
                        <FormControlLabel
                          value="Male"
                          control={<Radio sx={{ color: primaryColor }} />}
                          label="Male"
                        />
                        <FormControlLabel
                          value="Female"
                          control={<Radio sx={{ color: primaryColor }} />}
                          label="Female"
                        />
                        <FormControlLabel
                          value="Other"
                          control={<Radio sx={{ color: primaryColor }} />}
                          label="Other"
                        />
                      </RadioGroup>
                    )}
                  />
                  <FormHelperText>{errors.gender?.message}</FormHelperText>
                </FormControl>
              </Grid>
              <Grid item xs={12} sm={4}>
                <TextField
                  fullWidth
                  label="Age"
                  type="number"
                  {...register("age")}
                  error={!!errors.age}
                  helperText={errors.age?.message}
                />
              </Grid>
              <Grid item xs={12} sm={4}>
                <FormControl fullWidth error={!!errors.serviceType}>
                  <InputLabel sx={{ color: primaryColor }}>
                    Service Type
                  </InputLabel>
                  <Controller
                    name="serviceType"
                    control={control}
                    rules={{ required: "Please select a service type" }}
                    render={({ field }) => (
                      <Select
                        {...field}
                        label="Service Type"
                        sx={{
                          "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
                            borderColor: primaryColor,
                          },
                        }}
                      >
                        {serviceTypes.map((type) => (
                          <MenuItem key={type} value={type}>
                            {type}
                          </MenuItem>
                        ))}
                      </Select>
                    )}
                  />
                  <FormHelperText>{errors.serviceType?.message}</FormHelperText>
                </FormControl>
              </Grid>
            </Grid>
          </FormSection>

          <FormSection>
            <SectionTitle variant="h6">Client Information</SectionTitle>
            <Grid container spacing={3}>
              <Grid item xs={12}>
                <FormControl fullWidth error={!!errors.clientType}>
                  <FormLabel>Client Type</FormLabel>
                  <RadioGroup row>
                    <FormControlLabel
                      value="Citizen"
                      control={
                        <Radio
                          {...register("clientType", {
                            required: "Please select a client type",
                          })}
                        />
                      }
                      label="Citizen"
                    />
                    <FormControlLabel
                      value="Business"
                      control={
                        <Radio
                          {...register("clientType", {
                            required: "Please select a client type",
                          })}
                        />
                      }
                      label="Business"
                    />
                    <FormControlLabel
                      value="Government Employee/Agency"
                      control={
                        <Radio
                          {...register("clientType", {
                            required: "Please select a client type",
                          })}
                        />
                      }
                      label="Government Employee/Agency"
                    />
                  </RadioGroup>
                  <FormHelperText>{errors.clientType?.message}</FormHelperText>
                </FormControl>
              </Grid>
              <Grid item xs={12}>
                <FormControl fullWidth error={!!errors.transactionType}>
                  <InputLabel>Transaction Type</InputLabel>
                  <Controller
                    name="transactionType"
                    control={control}
                    rules={{ required: "Please select a transaction type" }}
                    render={({ field }) => (
                      <Select {...field} label="Transaction Type">
                        <MenuItem value="Assessment and Certification">
                          Assessment and Certification
                        </MenuItem>
                        <MenuItem value="Program Registration">
                          Program Registration
                        </MenuItem>
                        <MenuItem value="Training">Training</MenuItem>
                        <MenuItem value="Scholarship">Scholarship</MenuItem>
                        <MenuItem value="Administrative">
                          Administrative
                        </MenuItem>
                        <MenuItem value="Others">Others</MenuItem>
                      </Select>
                    )}
                  />
                  <FormHelperText>
                    {errors.transactionType?.message}
                  </FormHelperText>
                </FormControl>
              </Grid>

              {transactionType === "Others" && (
                <Grid item xs={12}>
                  <Controller
                    name="otherTransactionType"
                    control={control}
                    rules={{ required: "Please specify the transaction type" }}
                    render={({ field, fieldState: { error } }) => (
                      <TextField
                        {...field}
                        fullWidth
                        label="Please specify"
                        error={!!error}
                        helperText={error?.message}
                      />
                    )}
                  />
                </Grid>
              )}
            </Grid>
          </FormSection>

          <FormSection>
            <SectionTitle variant="h6">Citizens Charter Knowledge</SectionTitle>
            <FormControl fullWidth error={!!errors.citizensCharterKnowledge}>
              <RadioGroup>
                <FormControlLabel
                  value="I know the Citizens Charter and I saw it in the office I visited."
                  control={
                    <Radio
                      {...register("citizensCharterKnowledge", {
                        required: "Please select an option",
                      })}
                    />
                  }
                  label="I know the Citizens Charter and I saw it in the office I visited."
                />
                <FormControlLabel
                  value="I know the Citizens Charter but I didn't see it in the office I went to."
                  control={
                    <Radio
                      {...register("citizensCharterKnowledge", {
                        required: "Please select an option",
                      })}
                    />
                  }
                  label="I know the Citizens Charter but I didn't see it in the office I went to."
                />
                <FormControlLabel
                  value="I learned about the Citizens Charter when I saw it in the office I visited."
                  control={
                    <Radio
                      {...register("citizensCharterKnowledge", {
                        required: "Please select an option",
                      })}
                    />
                  }
                  label="I learned about the Citizens Charter when I saw it in the office I visited."
                />
                <FormControlLabel
                  value="I don't know what the Citizens Charter is and I didn't see any in the office I went to"
                  control={
                    <Radio
                      {...register("citizensCharterKnowledge", {
                        required: "Please select an option",
                      })}
                    />
                  }
                  label="I don't know what the Citizens Charter is and I didn't see any in the office I went to"
                />
              </RadioGroup>
              <FormHelperText>
                {errors.citizensCharterKnowledge?.message}
              </FormHelperText>
            </FormControl>
          </FormSection>
          <FormSection>
            <SectionTitle variant="h6" align="center">
              Service Quality Dimensions
            </SectionTitle>
            {qualityDimensions.map((dimension) => (
              <QuestionContainer key={dimension.name}>
                <Typography className="question-text">
                  {dimension.label}
                </Typography>
                <RatingContainer>
                  <Controller
                    name={`serviceQualityDimensions.${dimension.name}`}
                    control={control}
                    defaultValue={3}
                    rules={{ required: "This field is required" }}
                    render={({ field, fieldState: { error } }) => (
                      <>
                        <StyledRating
                          {...field}
                          IconContainerComponent={IconContainer}
                          getLabelText={(value) => customIcons[value].label}
                          highlightSelectedOnly
                        />
                        {error && (
                          <FormHelperText error>{error.message}</FormHelperText>
                        )}
                      </>
                    )}
                  />
                </RatingContainer>
              </QuestionContainer>
            ))}
          </FormSection>

          <FormSection>
            <TextField
              fullWidth
              label="Suggestions"
              multiline
              rows={4}
              {...register("suggestions")}
              error={!!errors.suggestions}
              helperText={errors.suggestions?.message}
            />
          </FormSection>

          <FormSection>
            <TextField
              fullWidth
              label="Employee Name"
              {...register("employeeName")}
              error={!!errors.employeeName}
              helperText={errors.employeeName?.message}
            />
          </FormSection>

          <Box sx={{ display: "flex", justifyContent: "center" }}>
            <Button
              type="submit"
              variant="contained"
              sx={{
                backgroundColor: primaryColor,
                "&:hover": {
                  backgroundColor: `${primaryColor}e6`, // Slightly darker on hover
                },
                px: 4,
                py: 1.5,
                borderRadius: 2,
                fontSize: "1.1rem",
              }}
            >
              Submit
            </Button>
          </Box>
        </Box>
      </StyledPaper>

      <Snackbar
        open={snackbar.open}
        autoHideDuration={6000}
        onClose={handleCloseSnackbar}
      >
        <Alert
          onClose={handleCloseSnackbar}
          severity={snackbar.severity}
          sx={{
            width: "100%",
            backgroundColor:
              snackbar.severity === "success" ? primaryColor : undefined,
          }}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </StyledContainer>
  );
};

export default CitizensCharter;
