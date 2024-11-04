import React, { useEffect, useState } from "react";
import { useForm, Controller, useWatch } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "@tanstack/react-query";
import axios from "axios";
import { useNavigate, Link } from "react-router-dom";
import dayjs from "dayjs";
import ReCAPTCHA from "react-google-recaptcha";
import {
  Box,
  TextField,
  Button,
  Typography,
  Paper,
  Container,
  CircularProgress,
  Grid,
  MenuItem,
  InputAdornment,
  IconButton,
  FormControl,
  InputLabel,
  Select,
  FormHelperText,
} from "@mui/material";
import { Eye, EyeOff } from "lucide-react";
import { registrationSchema } from "../../components/schema/user.schema";
import {
  employmentTypes,
  employmentStatuses,
  educationalAttainments,
  civilStatues,
  clientClassifications,
  municipalities,
  regions,
  provinces,
  locationData,
} from "../../components/utils/enums/registrant.enums";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import { useAuth } from "../../context/AuthContext";
import ReCAPTCHAWrapper from "./RecaptchaWrapper";

const RegisterUser = () => {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [captchaToken, setCaptchaToken] = useState(null);

  const {
    control,
    setValue,
    handleSubmit,
    watch,
    setError,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(registrationSchema),
    defaultValues: {
      name: {
        firstName: "",
        middleName: "",
        lastName: "",
        extension: "",
      },
      sex: "",
      civilStatus: "",
      birthdate: "",
      age: "",
      nationality: "",
      birthplace: {
        city: "",
        province: "",
        region: "",
      },
      contact: {
        telephoneNumber: "",
        mobileNumber: "",
        email: "",
        fax: "",
        others: "",
      },
      completeMailingAddress: {
        street: "",
        barangay: "",
        district: "",
        city: "",
        province: "",
        region: "",
        zipCode: "",
      },
      employmentStatus: "",
      employmentType: "",
      education: "",
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
      clientClassification: "",
      otherClientClassification: "",
      password: "",
      confirmPassword: "",
    },
  });

  const employmentStatus = watch("employmentStatus");
  const watchedFields = watch();
  const watchClientClassification = watch("clientClassification");

  // Watch the birthdate field to calculate age dynamically
  const birthdate = useWatch({ control, name: "birthdate" });

  React.useEffect(() => {
    if (birthdate) {
      const age = dayjs().diff(dayjs(birthdate), "year");
      setValue("age", age); // Update age when birthdate changes
    } else {
      setValue("age", ""); // Clear age if birthdate is not set
    }
  }, [birthdate, setValue]);

  const registerMutation = useMutation({
    mutationFn: (userData) => {
      const transformedData = {
        ...userData,
        birthdate: dayjs(userData.birthdate).toISOString(),
        captchaToken: captchaToken, // Add captcha token to the request
      };
      console.log("Registering user with data:", transformedData);
      return axios.post("/api/auth/register", transformedData);
    },
    onSuccess: (response) => {
      console.log("Registration successful:", response.data);
      login(response.data);
      navigate("/dashboard");
    },
    onError: (error) => {
      console.error(
        "Registration error:",
        error.response?.data || error.message
      );
      setError("root", {
        type: "manual",
        message:
          error.response?.data?.message ||
          "Registration failed. Please try again.",
      });
    },
  });

  const renderNameFields = (prefix) => (
    <Grid container spacing={2}>
      <Grid item xs={12} sm={3.2}>
        <Controller
          name={`${prefix}.firstName`}
          control={control}
          render={({ field }) => (
            <TextField
              {...field}
              fullWidth
              label="First Name"
              error={!!errors[prefix]?.firstName}
              helperText={errors[prefix]?.firstName?.message}
            />
          )}
        />
      </Grid>
      <Grid item xs={12} sm={3.2}>
        <Controller
          name={`${prefix}.middleName`}
          control={control}
          render={({ field }) => (
            <TextField
              {...field}
              fullWidth
              label="Middle Name"
              error={!!errors[prefix]?.middleName}
              helperText={errors[prefix]?.middleName?.message}
            />
          )}
        />
      </Grid>
      <Grid item xs={12} sm={3.2}>
        <Controller
          name={`${prefix}.lastName`}
          control={control}
          render={({ field }) => (
            <TextField
              {...field}
              fullWidth
              label="Last Name"
              error={!!errors[prefix]?.lastName}
              helperText={errors[prefix]?.lastName?.message}
            />
          )}
        />
      </Grid>

      <Grid item xs={12} sm={2.4}>
        <Controller
          name={`${prefix}.extension`}
          control={control}
          render={({ field }) => {
            const [isCustom, setIsCustom] = useState(false);

            const handleChange = (event) => {
              const value = event.target.value;
              setIsCustom(value === "custom");
              field.onChange(value === "custom" ? "" : value); // Clear value if custom
            };

            const handleReset = () => {
              setIsCustom(false);
              field.onChange(""); // Reset field value when going back to select
            };

            return isCustom ? (
              <TextField
                {...field}
                fullWidth
                label="Extension"
                placeholder="Type extension"
                onChange={(e) => field.onChange(e.target.value)}
                error={!!errors[prefix]?.extension}
                helperText={errors[prefix]?.extension?.message}
                InputProps={{
                  endAdornment: (
                    <InputAdornment position="end">
                      <IconButton onClick={handleReset} edge="end">
                        <ArrowBackIcon />
                      </IconButton>
                    </InputAdornment>
                  ),
                }}
              />
            ) : (
              <TextField
                {...field}
                select
                fullWidth
                label="Extension"
                onChange={handleChange}
                error={!!errors[prefix]?.extension}
                helperText={errors[prefix]?.extension?.message}
              >
                {["Jr.", "Sr.", "II", "III", "IV", "V", "Custom"].map(
                  (option) => (
                    <MenuItem
                      key={option}
                      value={option === "Custom" ? "custom" : option}
                    >
                      {option}
                    </MenuItem>
                  )
                )}
              </TextField>
            );
          }}
        />
      </Grid>
    </Grid>
  );

  const onSubmit = (data) => {
    if (!captchaToken) {
      setError("root", {
        type: "manual",
        message: "Please complete the CAPTCHA verification",
      });
      return;
    }
    registerMutation.mutate(data);
  };

  const handleCaptchaChange = (token) => {
    setCaptchaToken(token);
    // Clear any previous captcha errors
    if (errors.root?.message === "Please complete the CAPTCHA verification") {
      setError("root", undefined);
    }
  };

  useEffect(() => {
    if (["Unemployed", "Self-Employed"].includes(employmentStatus)) {
      setValue("employmentType", null); // Reset to null when disabled
    }
  }, [employmentStatus, setValue]);

  return (
    <Container component="main" maxWidth="md">
      <Paper elevation={3} sx={{ p: 4, mt: 4, mb: 4 }}>
        <Typography component="h1" variant="h4" align="center" gutterBottom>
          Register
        </Typography>

        <form onSubmit={handleSubmit(onSubmit)}>
          <Grid container spacing={3}>
            {/* Personal Information Section */}
            <Grid item xs={12}>
              <Typography variant="h6" gutterBottom>
                Personal Information
              </Typography>
              {renderNameFields("name")}
            </Grid>
            <Grid item xs={12} sm={6}>
              <Controller
                name="sex"
                control={control}
                render={({ field }) => (
                  <TextField
                    {...field}
                    select
                    fullWidth
                    label="Sex"
                    error={!!errors.sex}
                    helperText={errors.sex?.message}
                  >
                    {["Male", "Female"].map((option) => (
                      <MenuItem key={option} value={option}>
                        {option}
                      </MenuItem>
                    ))}
                  </TextField>
                )}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <Controller
                name="civilStatus"
                control={control}
                render={({ field }) => (
                  <TextField
                    {...field}
                    select
                    fullWidth
                    label="Civil Status"
                    error={!!errors.civilStatus}
                    helperText={errors.civilStatus?.message}
                  >
                    {civilStatues.map((status) => (
                      <MenuItem key={status} value={status}>
                        {status}
                      </MenuItem>
                    ))}
                  </TextField>
                )}
              />
            </Grid>

            <Grid item xs={12} sm={6}>
              <Controller
                name="birthdate"
                control={control}
                rules={{
                  required: "Birthdate is required",
                  validate: (value) => {
                    if (dayjs(value).isAfter(dayjs())) {
                      return "Birthdate cannot be in the future";
                    }
                    const age = dayjs().diff(dayjs(value), "year");
                    if (age < 16) {
                      return "You must be at least 18 years old to register.";
                    }
                    return true;
                  },
                }}
                render={({ field }) => (
                  <TextField
                    {...field}
                    fullWidth
                    type="date"
                    label="Birthdate"
                    InputLabelProps={{ shrink: true }}
                    error={!!errors.birthdate}
                    helperText={errors.birthdate?.message}
                    inputProps={{
                      max: dayjs().format("YYYY-MM-DD"),
                    }}
                  />
                )}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <Controller
                name="age"
                control={control}
                render={({ field }) => (
                  <TextField
                    {...field}
                    fullWidth
                    type="number"
                    label="Age"
                    error={!!errors.age}
                    helperText={errors.age?.message}
                    InputProps={{
                      readOnly: true,
                    }}
                  />
                )}
              />
            </Grid>

            <Grid item xs={12} sm={6}>
              <Controller
                name="nationality"
                control={control}
                render={({ field }) => (
                  <TextField
                    {...field}
                    fullWidth
                    type="text"
                    label="Nationality"
                    error={!!errors.nationality}
                    helperText={errors.nationality?.message}
                  />
                )}
              />
            </Grid>
            {/* Birthplace Section */}
            <Grid item xs={12}>
              <Typography variant="h6" gutterBottom>
                Birthplace
              </Typography>
            </Grid>

            <Grid item xs={12} sm={4}>
              <Controller
                name="birthplace.region"
                control={control}
                render={({ field: { ref, ...fieldProps } }) => {
                  const [isCustom, setIsCustom] = useState(false);

                  const handleChange = (event) => {
                    const value = event.target.value;
                    setIsCustom(value === "custom");
                    fieldProps.onChange(value === "custom" ? "" : value);

                    // Clear dependent fields
                    control.setValue("birthplace.province", "");
                    control.setValue("birthplace.city", "");
                  };

                  const handleReset = () => {
                    setIsCustom(false);
                    fieldProps.onChange("");
                    control.setValue("birthplace.province", "");
                    control.setValue("birthplace.city", "");
                  };

                  return isCustom ? (
                    <TextField
                      {...fieldProps}
                      inputRef={ref}
                      fullWidth
                      label="Custom Region"
                      placeholder="Type your region"
                      onChange={(e) => fieldProps.onChange(e.target.value)}
                      error={!!errors.birthplace?.region}
                      helperText={errors.birthplace?.region?.message}
                      InputProps={{
                        endAdornment: (
                          <InputAdornment position="end">
                            <IconButton onClick={handleReset} edge="end">
                              <ArrowBackIcon />
                            </IconButton>
                          </InputAdornment>
                        ),
                      }}
                    />
                  ) : (
                    <TextField
                      {...fieldProps}
                      inputRef={ref}
                      select
                      fullWidth
                      label="Region"
                      onChange={handleChange}
                      error={!!errors.birthplace?.region}
                      helperText={errors.birthplace?.region?.message}
                    >
                      {[...regions, "Custom"].map((option) => (
                        <MenuItem
                          key={option}
                          value={option === "Custom" ? "custom" : option}
                        >
                          {option}
                        </MenuItem>
                      ))}
                    </TextField>
                  );
                }}
              />
            </Grid>

            <Grid item xs={12} sm={4}>
              <Controller
                name="birthplace.province"
                control={control}
                render={({ field: { ref, ...fieldProps } }) => {
                  const [isCustom, setIsCustom] = useState(false);
                  const currentRegion = control._formValues.birthplace?.region;

                  const handleChange = (event) => {
                    const value = event.target.value;
                    setIsCustom(value === "custom");
                    fieldProps.onChange(value === "custom" ? "" : value);

                    // Clear dependent city
                    control.setValue("birthplace.city", "");
                  };

                  const handleReset = () => {
                    setIsCustom(false);
                    fieldProps.onChange("");
                    control.setValue("birthplace.city", "");
                  };

                  const isDisabled = !currentRegion;
                  const getHelperText = () => {
                    if (errors.birthplace?.province?.message) {
                      return errors.birthplace.province.message;
                    }
                    if (isDisabled) {
                      return "Please select a region first";
                    }
                    if (currentRegion !== "Central Luzon (Region III)") {
                      return "Province selection is only available for Region III";
                    }
                    return "";
                  };

                  return isCustom ? (
                    <TextField
                      {...fieldProps}
                      inputRef={ref}
                      fullWidth
                      disabled={isDisabled}
                      label="Custom Province"
                      placeholder="Type your province"
                      onChange={(e) => fieldProps.onChange(e.target.value)}
                      error={!!errors.birthplace?.province}
                      helperText={getHelperText()}
                      InputProps={{
                        endAdornment: (
                          <InputAdornment position="end">
                            <IconButton onClick={handleReset} edge="end">
                              <ArrowBackIcon />
                            </IconButton>
                          </InputAdornment>
                        ),
                      }}
                    />
                  ) : (
                    <TextField
                      {...fieldProps}
                      inputRef={ref}
                      select
                      fullWidth
                      disabled={isDisabled}
                      label="Province"
                      onChange={handleChange}
                      error={!!errors.birthplace?.province}
                      helperText={getHelperText()}
                    >
                      {[
                        ...(currentRegion === "Central Luzon (Region III)"
                          ? Object.keys(
                              locationData["Central Luzon (Region III)"]
                            )
                          : []),
                        "Custom",
                      ].map((option) => (
                        <MenuItem
                          key={option}
                          value={option === "Custom" ? "custom" : option}
                        >
                          {option}
                        </MenuItem>
                      ))}
                    </TextField>
                  );
                }}
              />
            </Grid>

            <Grid item xs={12} sm={4}>
              <Controller
                name="birthplace.city"
                control={control}
                render={({ field: { ref, ...fieldProps } }) => {
                  const [isCustom, setIsCustom] = useState(false);
                  const currentRegion = control._formValues.birthplace?.region;
                  const currentProvince =
                    control._formValues.birthplace?.province;

                  const handleChange = (event) => {
                    const value = event.target.value;
                    setIsCustom(value === "custom");
                    fieldProps.onChange(value === "custom" ? "" : value);
                  };

                  const handleReset = () => {
                    setIsCustom(false);
                    fieldProps.onChange("");
                  };

                  const isDisabled = !currentRegion || !currentProvince;
                  const getHelperText = () => {
                    if (errors.birthplace?.city?.message) {
                      return errors.birthplace.city.message;
                    }
                    if (isDisabled) {
                      return "Please select a region and province first";
                    }
                    if (currentRegion !== "Central Luzon (Region III)") {
                      return "City selection is only available for Region III";
                    }
                    return "";
                  };

                  return isCustom ? (
                    <TextField
                      {...fieldProps}
                      inputRef={ref}
                      fullWidth
                      disabled={isDisabled}
                      label="Custom Municipality/City"
                      placeholder="Type your municipality/city"
                      onChange={(e) => fieldProps.onChange(e.target.value)}
                      error={!!errors.birthplace?.city}
                      helperText={getHelperText()}
                      InputProps={{
                        endAdornment: (
                          <InputAdornment position="end">
                            <IconButton onClick={handleReset} edge="end">
                              <ArrowBackIcon />
                            </IconButton>
                          </InputAdornment>
                        ),
                      }}
                    />
                  ) : (
                    <TextField
                      {...fieldProps}
                      inputRef={ref}
                      select
                      fullWidth
                      disabled={isDisabled}
                      label="Municipality/City"
                      onChange={handleChange}
                      error={!!errors.birthplace?.city}
                      helperText={getHelperText()}
                    >
                      {[
                        ...(currentRegion === "Central Luzon (Region III)" &&
                        currentProvince
                          ? locationData["Central Luzon (Region III)"][
                              currentProvince
                            ] || []
                          : []),
                        "Custom",
                      ].map((option) => (
                        <MenuItem
                          key={option}
                          value={option === "Custom" ? "custom" : option}
                        >
                          {option}
                        </MenuItem>
                      ))}
                    </TextField>
                  );
                }}
              />
            </Grid>
            {/* Contact Information Section */}
            <Grid item xs={12}>
              <Typography variant="h6" gutterBottom>
                Contact Information
              </Typography>
            </Grid>
            <Grid item xs={12} sm={6}>
              <Controller
                name="contact.telephoneNumber"
                control={control}
                render={({ field: { ref, ...field } }) => (
                  <TextField
                    {...field}
                    inputRef={ref}
                    fullWidth
                    label="Telephone Number"
                    error={!!errors.contact?.telephoneNumber}
                    helperText={errors.contact?.telephoneNumber?.message}
                  />
                )}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <Controller
                name="contact.mobileNumber"
                control={control}
                render={({ field: { ref, ...field } }) => (
                  <TextField
                    {...field}
                    inputRef={ref}
                    fullWidth
                    label="Mobile Number"
                    error={!!errors.contact?.mobileNumber}
                    helperText={errors.contact?.mobileNumber?.message}
                  />
                )}
              />
            </Grid>
            <Grid item xs={12}>
              <Controller
                name="contact.email"
                control={control}
                render={({ field: { ref, ...field } }) => (
                  <TextField
                    {...field}
                    inputRef={ref}
                    fullWidth
                    label="Email"
                    type="email"
                    error={!!errors.contact?.email}
                    helperText={errors.contact?.email?.message}
                  />
                )}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <Controller
                name="contact.fax"
                control={control}
                render={({ field: { ref, ...field } }) => (
                  <TextField
                    {...field}
                    inputRef={ref}
                    fullWidth
                    label="Fax"
                    error={!!errors.contact?.fax}
                    helperText={errors.contact?.fax?.message}
                  />
                )}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <Controller
                name="contact.others"
                control={control}
                render={({ field: { ref, ...field } }) => (
                  <TextField
                    {...field}
                    inputRef={ref}
                    fullWidth
                    label="Other Contact"
                    error={!!errors.contact?.others}
                    helperText={errors.contact?.others?.message}
                  />
                )}
              />
            </Grid>
            {/* Complete Mailing Address Section */}
            <Grid item xs={12}>
              <Typography variant="h6" gutterBottom>
                Complete Mailing Address
              </Typography>
            </Grid>
            {Object.keys(control._defaultValues.completeMailingAddress).map(
              (field) => (
                <Grid item xs={12} sm={4} key={field}>
                  <Controller
                    name={`completeMailingAddress.${field}`}
                    control={control}
                    render={({ field: { ref, ...fieldProps } }) => {
                      const [isCustom, setIsCustom] = useState(false);

                      // Get currently selected region and province from form values
                      const currentRegion =
                        control._formValues.completeMailingAddress?.region;
                      const currentProvince =
                        control._formValues.completeMailingAddress?.province;

                      // Determine if this field should have custom option
                      const hasCustomOption = [
                        "province",
                        "region",
                        "city",
                      ].includes(field);

                      // Get the appropriate options list for select fields
                      const getOptions = () => {
                        switch (field) {
                          case "region":
                            return regions;
                          case "province":
                            // Only show provinces if Region 3 is selected
                            return currentRegion ===
                              "Central Luzon (Region III)"
                              ? Object.keys(
                                  locationData["Central Luzon (Region III)"]
                                )
                              : [];
                          case "city":
                            // Only show municipalities if province is selected and region is Region 3
                            return currentRegion ===
                              "Central Luzon (Region III)" && currentProvince
                              ? locationData["Central Luzon (Region III)"][
                                  currentProvince
                                ] || []
                              : [];
                          default:
                            return [];
                        }
                      };

                      // Handle select change for custom fields
                      const handleChange = (event) => {
                        const value = event.target.value;
                        if (hasCustomOption) {
                          setIsCustom(value === "custom");
                          fieldProps.onChange(value === "custom" ? "" : value);

                          // Clear dependent fields when parent field changes
                          if (field === "region") {
                            control.setValue(
                              "completeMailingAddress.province",
                              ""
                            );
                            control.setValue("completeMailingAddress.city", "");
                          } else if (field === "province") {
                            control.setValue("completeMailingAddress.city", "");
                          }
                        } else {
                          fieldProps.onChange(value);
                        }
                      };

                      // Handle reset for custom input
                      const handleReset = () => {
                        setIsCustom(false);
                        fieldProps.onChange("");

                        // Clear dependent fields when resetting
                        if (field === "region") {
                          control.setValue(
                            "completeMailingAddress.province",
                            ""
                          );
                          control.setValue("completeMailingAddress.city", "");
                        } else if (field === "province") {
                          control.setValue("completeMailingAddress.city", "");
                        }
                      };

                      // Format the label
                      const formattedLabel =
                        field.charAt(0).toUpperCase() +
                        field.slice(1).replace(/([A-Z])/g, " $1");

                      // Determine if field should be disabled and get helper text
                      const isDisabled =
                        (field === "province" && !currentRegion) ||
                        (field === "city" &&
                          (!currentRegion || !currentProvince));

                      const getHelperText = () => {
                        if (errors.completeMailingAddress?.[field]?.message) {
                          return errors.completeMailingAddress[field].message;
                        }
                        if (isDisabled) {
                          return `Please select a ${
                            field === "city" ? "province" : "region"
                          } first`;
                        }
                        if (
                          field === "province" &&
                          currentRegion !== "Central Luzon (Region III)"
                        ) {
                          return "Province selection is only available for Region III";
                        }
                        if (
                          field === "city" &&
                          currentRegion !== "Central Luzon (Region III)"
                        ) {
                          return "City selection is only available for Region III";
                        }
                        return "";
                      };

                      // If it's a custom-enabled field and in custom mode
                      if (hasCustomOption && isCustom) {
                        return (
                          <TextField
                            {...fieldProps}
                            inputRef={ref}
                            fullWidth
                            disabled={isDisabled}
                            label={`Custom ${formattedLabel}`}
                            placeholder={`Type your ${field}`}
                            onChange={(e) =>
                              fieldProps.onChange(e.target.value)
                            }
                            error={!!errors.completeMailingAddress?.[field]}
                            helperText={getHelperText()}
                            InputProps={{
                              endAdornment: (
                                <InputAdornment position="end">
                                  <IconButton onClick={handleReset} edge="end">
                                    <ArrowBackIcon />
                                  </IconButton>
                                </InputAdornment>
                              ),
                            }}
                          />
                        );
                      }

                      // If it's a custom-enabled field but in select mode
                      if (hasCustomOption) {
                        const options = getOptions();
                        return (
                          <TextField
                            {...fieldProps}
                            inputRef={ref}
                            select
                            fullWidth
                            disabled={isDisabled}
                            label={formattedLabel}
                            onChange={handleChange}
                            error={!!errors.completeMailingAddress?.[field]}
                            helperText={getHelperText()}
                          >
                            {[...options, "Custom"].map((option) => (
                              <MenuItem
                                key={option}
                                value={option === "Custom" ? "custom" : option}
                              >
                                {option}
                              </MenuItem>
                            ))}
                          </TextField>
                        );
                      }

                      // Regular text field for other fields
                      return (
                        <TextField
                          {...fieldProps}
                          inputRef={ref}
                          fullWidth
                          label={formattedLabel}
                          error={!!errors.completeMailingAddress?.[field]}
                          helperText={
                            errors.completeMailingAddress?.[field]?.message
                          }
                        />
                      );
                    }}
                  />
                </Grid>
              )
            )}
            {/* Employment & Education Section */}
            <Grid item xs={12}>
              <Typography variant="h6" gutterBottom>
                Employment & Education
              </Typography>
            </Grid>
            <Grid item xs={12} sm={6}>
              <Controller
                name="employmentStatus"
                control={control}
                render={({ field }) => (
                  <TextField
                    {...field}
                    select
                    fullWidth
                    label="Employment Status"
                    error={!!errors.employmentStatus}
                    helperText={errors.employmentStatus?.message}
                  >
                    {employmentStatuses.map((status) => (
                      <MenuItem key={status} value={status}>
                        {status}
                      </MenuItem>
                    ))}
                  </TextField>
                )}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <Controller
                name="employmentType"
                control={control}
                defaultValue={null} // Set default value to null instead of empty string
                render={({ field }) => (
                  <TextField
                    {...field}
                    select
                    fullWidth
                    label="Employment Type"
                    disabled={["Unemployed", "Self-Employed"].includes(
                      employmentStatus
                    )}
                    error={!!errors.employmentType}
                    helperText={errors.employmentType?.message}
                    value={field.value || ""} // Handle null value in display
                  >
                    {employmentTypes.map((type) => (
                      <MenuItem key={type} value={type}>
                        {type}
                      </MenuItem>
                    ))}
                  </TextField>
                )}
              />
            </Grid>
            <Grid item xs={12}>
              <Controller
                name="education"
                control={control}
                render={({ field }) => (
                  <TextField
                    {...field}
                    select
                    fullWidth
                    label="Educational Attainment"
                    error={!!errors.education}
                    helperText={errors.education?.message}
                  >
                    {educationalAttainments.map((edu) => (
                      <MenuItem key={edu} value={edu}>
                        {edu}
                      </MenuItem>
                    ))}
                  </TextField>
                )}
              />
            </Grid>
            {/* Family Information Section */}
            <Grid item xs={12}>
              <Typography variant="h6" gutterBottom>
                Mother's Information
              </Typography>
              {renderNameFields("motherName")}
            </Grid>
            <Grid item xs={12} sx={{ mt: 2 }}>
              <Typography variant="h6" gutterBottom>
                Father's Information
              </Typography>
              {renderNameFields("fatherName")}
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

            {/* Password Section */}
            <Grid item xs={12}>
              <Typography variant="h6" gutterBottom>
                Account Security
              </Typography>
            </Grid>
            <Grid item xs={12}>
              <Controller
                name="password"
                control={control}
                render={({ field: { ref, ...field } }) => (
                  <TextField
                    {...field}
                    inputRef={ref}
                    fullWidth
                    type={showPassword ? "text" : "password"}
                    label="Password"
                    error={!!errors.password}
                    helperText={errors.password?.message}
                    InputProps={{
                      endAdornment: (
                        <InputAdornment position="end">
                          <IconButton
                            aria-label="toggle password visibility"
                            onClick={() => setShowPassword(!showPassword)}
                            edge="end"
                          >
                            {showPassword ? (
                              <EyeOff size={20} />
                            ) : (
                              <Eye size={20} />
                            )}
                          </IconButton>
                        </InputAdornment>
                      ),
                    }}
                  />
                )}
              />
            </Grid>
            <Grid item xs={12}>
              <Controller
                name="confirmPassword"
                control={control}
                render={({ field: { ref, ...field } }) => (
                  <TextField
                    {...field}
                    inputRef={ref}
                    fullWidth
                    type={showConfirmPassword ? "text" : "password"}
                    label="Confirm Password"
                    error={!!errors.confirmPassword}
                    helperText={errors.confirmPassword?.message}
                    InputProps={{
                      endAdornment: (
                        <InputAdornment position="end">
                          <IconButton
                            aria-label="toggle confirm password visibility"
                            onClick={() =>
                              setShowConfirmPassword(!showConfirmPassword)
                            }
                            edge="end"
                          >
                            {showConfirmPassword ? (
                              <EyeOff size={20} />
                            ) : (
                              <Eye size={20} />
                            )}
                          </IconButton>
                        </InputAdornment>
                      ),
                    }}
                  />
                )}
              />
            </Grid>
            {/* Add ReCAPTCHA before the submit button */}
            <Grid
              item
              xs={12}
              sx={{ display: "flex", justifyContent: "center", mt: 2 }}
            >
              <ReCAPTCHAWrapper
                siteKey={import.meta.env.VITE_RECAPTCHA_SITE_KEY}
                onVerify={handleCaptchaChange}
              />
              {/* <ReCAPTCHA
                sitekey={import.meta.env.VITE_RECAPTCHA_SITE_KEY}
                onChange={handleCaptchaChange}
              /> */}
            </Grid>

            {/* Submit Button */}
            <Grid item xs={12}>
              <Button
                type="submit"
                fullWidth
                variant="contained"
                color="primary"
                disabled={registerMutation.isLoading || !captchaToken}
                sx={{ mt: 2 }}
              >
                {registerMutation.isLoading ? (
                  <CircularProgress size={24} />
                ) : (
                  "Register"
                )}
              </Button>
            </Grid>
          </Grid>
        </form>

        {/* <Typography variant="h6" sx={{ mt: 4 }}>
          Form State:
        </Typography>
        <pre>{JSON.stringify(watchedFields, null, 2)}</pre> */}

        {errors.root && (
          <Typography color="error" sx={{ mt: 2 }}>
            {errors.root.message}
          </Typography>
        )}

        <Box sx={{ mt: 3, textAlign: "center" }}>
          <Typography variant="body2">
            Already have an account? <Link to="/login">Login here</Link>
          </Typography>
        </Box>
      </Paper>
    </Container>
  );
};

export default RegisterUser;
