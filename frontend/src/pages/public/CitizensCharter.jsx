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
} from "@mui/material";
import axios from "axios";

const StyledRating = styled(Rating)(({ theme }) => ({
  "& .MuiRating-iconEmpty .MuiSvgIcon-root": {
    color: theme.palette.action.disabled,
  },
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
    formState: { errors },
  } = useForm({
    defaultValues: {
      serviceQualityDimensions: {
        satisfaction: 3,
        processingTime: 3,
        documentCompliance: 3,
        processSimplicity: 3,
        informationAccessibility: 3,
        reasonableCost: 3,
        fairness: 3,
        staffRespect: 3,
        serviceDelivery: 3,
      },
    },
  });

  const createCharter = async (data) => {
    // Transform ratings to text values based on the number
    const ratingToText = {
      1: "Strongly Disagree",
      2: "Disagree",
      3: "Neutral",
      4: "Agree",
      5: "Strongly Agree",
    };

    // Transform the numeric ratings to text values as required by the schema
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

    // Ensure required fields are not empty strings
    if (!transformedData.emailAddress) delete transformedData.emailAddress;
    if (!transformedData.name) delete transformedData.name;
    if (!transformedData.employeeName) delete transformedData.employeeName;
    if (!transformedData.suggestions) delete transformedData.suggestions;

    const response = await axios.post("/api/citizens-charter", transformedData);
    return response.data;
  };

  const mutation = useMutation({
    mutationFn: createCharter,
    onSuccess: () => {
      alert("Form submitted successfully!");
    },
    onError: (error) => {
      console.error("Submission error:", error);
      alert(`Error submitting form: ${error.message}`);
    },
  });

  const onSubmit = (data) => {
    mutation.mutate(data);
  };

  const serviceTypes = [
    "Customer Inquiry and Feedback Through Assistance and Complaint Desk",
    "Customer Inquiry and Feedback Through Calls",
    "Application for Assessment and Certification",
    "Payment of Training and Support Fund",
    "Application for Scholarship and Enrollment",
    "Application of Competency Assessment",
    "Issuance of Certificate of Training",
    "Replacement of Lost Training Certificate",
    "Community-Based Training",
    "Customer Inquiry and Feedback Electronic Mails",
    "Conduct of Training Induction Program",
    "Availment of Scholarship Program",
    "Payment of Scholarship Voucher",
    "Catering Services",
  ];

  const qualityDimensions = [
    {
      name: "satisfaction",
      label:
        "I was satisfied with the service I received at the office I visited.",
    },
    {
      name: "processingTime",
      label: "The time I spent for processing my transaction was reasonable.",
    },
    {
      name: "documentCompliance",
      label:
        "The office follows the necessary documents and steps based on the information provided.",
    },
    {
      name: "processSimplicity",
      label: "The processing steps, including payment are easy and simple.",
    },
    {
      name: "informationAccessibility",
      label:
        "I can quickly and easily find information about my transaction from the office or its website.",
    },
    {
      name: "reasonableCost",
      label: "I paid a reasonable amount for my transaction.",
    },
    {
      name: "fairness",
      label:
        'I feel the office is fair to everyone, "or no sports", in my transaction.',
    },
    {
      name: "staffRespect",
      label:
        "I was treated with respect by the staff, and (if I ever asked for help) I knew they would be willing to help me.",
    },
    {
      name: "serviceDelivery",
      label:
        "I got what I needed from the government office, if rejected, it was adequately explained to me.",
    },
  ];

  return (
    <Container maxWidth="md">
      <Box component="form" onSubmit={handleSubmit(onSubmit)} sx={{ mt: 4 }}>
        <Typography variant="h4" gutterBottom>
          Citizens Charter Form
        </Typography>

        <TextField
          fullWidth
          label="Email Address"
          margin="normal"
          {...register("emailAddress")}
          error={!!errors.emailAddress}
          helperText={errors.emailAddress?.message}
        />

        <TextField
          fullWidth
          label="Name"
          margin="normal"
          {...register("name")}
          error={!!errors.name}
          helperText={errors.name?.message}
        />

        <FormControl fullWidth margin="normal">
          <FormLabel>Gender</FormLabel>
          <RadioGroup row>
            <FormControlLabel
              value="Male"
              control={<Radio {...register("gender", { required: true })} />}
              label="Male"
            />
            <FormControlLabel
              value="Female"
              control={<Radio {...register("gender", { required: true })} />}
              label="Female"
            />
            <FormControlLabel
              value="Other"
              control={<Radio {...register("gender", { required: true })} />}
              label="Other"
            />
          </RadioGroup>
        </FormControl>

        <TextField
          fullWidth
          label="Age"
          type="number"
          margin="normal"
          {...register("age")}
          error={!!errors.age}
          helperText={errors.age?.message}
        />

        <FormControl fullWidth margin="normal">
          <FormLabel>Citizens Charter Service Type</FormLabel>
          <Select
            {...register("serviceType", { required: true })}
            defaultValue=""
          >
            {serviceTypes.map((type) => (
              <MenuItem key={type} value={type}>
                {type}
              </MenuItem>
            ))}
          </Select>
        </FormControl>

        <FormControl fullWidth margin="normal">
          <FormLabel>Client Type</FormLabel>
          <RadioGroup row>
            <FormControlLabel
              value="Citizen"
              control={
                <Radio {...register("clientType", { required: true })} />
              }
              label="Citizen"
            />
            <FormControlLabel
              value="Business"
              control={
                <Radio {...register("clientType", { required: true })} />
              }
              label="Business"
            />
            <FormControlLabel
              value="Government Employee/Agency"
              control={
                <Radio {...register("clientType", { required: true })} />
              }
              label="Government Employee/Agency"
            />
          </RadioGroup>
        </FormControl>

        <FormControl fullWidth margin="normal">
          <FormLabel>Transaction Type</FormLabel>
          <Select
            {...register("transactionType", { required: true })}
            defaultValue=""
          >
            <MenuItem value="Assessment and Certification">
              Assessment and Certification
            </MenuItem>
            <MenuItem value="Program Registration">
              Program Registration
            </MenuItem>
            <MenuItem value="Training">Training</MenuItem>
            <MenuItem value="Scholarship">Scholarship</MenuItem>
            <MenuItem value="Administrative">Administrative</MenuItem>
            <MenuItem value="Others">Others</MenuItem>
          </Select>
        </FormControl>

        {watch("transactionType") === "Others" && (
          <TextField
            fullWidth
            label="Please specify"
            margin="normal"
            {...register("otherTransactionType", { required: true })}
          />
        )}

        <FormControl fullWidth margin="normal">
          <FormLabel>Knowledge of Citizens Charter</FormLabel>
          <RadioGroup>
            <FormControlLabel
              value="I know the Citizens Charter and I saw it in the office I visited."
              control={
                <Radio
                  {...register("citizensCharterKnowledge", { required: true })}
                />
              }
              label="I know the Citizens Charter and I saw it in the office I visited."
            />
            <FormControlLabel
              value="I know the Citizens Charter but I didn't see it in the office I went to."
              control={
                <Radio
                  {...register("citizensCharterKnowledge", { required: true })}
                />
              }
              label="I know the Citizens Charter but I didn't see it in the office I went to."
            />
            <FormControlLabel
              value="I learned about the Citizens Charter when I saw it in the office I visited."
              control={
                <Radio
                  {...register("citizensCharterKnowledge", { required: true })}
                />
              }
              label="I learned about the Citizens Charter when I saw it in the office I visited."
            />
            <FormControlLabel
              value="I don't know what the Citizens Charter is and I didn't see any in the office I went to"
              control={
                <Radio
                  {...register("citizensCharterKnowledge", { required: true })}
                />
              }
              label="I don't know what the Citizens Charter is and I didn't see any in the office I went to"
            />
          </RadioGroup>
        </FormControl>

        <Typography variant="h6" gutterBottom sx={{ mt: 3 }}>
          Service Quality Dimensions
        </Typography>

        {qualityDimensions.map((dimension) => (
          <FormControl key={dimension.name} fullWidth margin="normal">
            <FormLabel>{dimension.label}</FormLabel>
            <Controller
              name={`serviceQualityDimensions.${dimension.name}`}
              control={control}
              defaultValue={3}
              rules={{ required: true }}
              render={({ field }) => (
                <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
                  <StyledRating
                    {...field}
                    IconContainerComponent={IconContainer}
                    getLabelText={(value) => customIcons[value].label}
                    highlightSelectedOnly
                  />
                  <Typography variant="body2" color="text.secondary">
                    {field.value
                      ? customIcons[field.value].label
                      : "Select a rating"}
                  </Typography>
                </Box>
              )}
            />
          </FormControl>
        ))}

        {/* Suggestions Field */}
        <TextField
          fullWidth
          label="Suggestions"
          margin="normal"
          multiline
          rows={4}
          {...register("suggestions")}
          error={!!errors.suggestions}
          helperText={errors.suggestions?.message}
        />

        {/* Employee Name Field */}
        <TextField
          fullWidth
          label="Employee Name"
          margin="normal"
          {...register("employeeName")}
          error={!!errors.employeeName}
          helperText={errors.employeeName?.message}
        />

        <Button
          type="submit"
          variant="contained"
          color="primary"
          fullWidth
          sx={{ mt: 3, mb: 2 }}
        >
          Submit
        </Button>
      </Box>
    </Container>
  );
};

export default CitizensCharter;
