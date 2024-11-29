import React, { useState, useEffect } from "react";
import {
  Modal,
  Box,
  Typography,
  TextField,
  Button,
  Grid,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
} from "@mui/material";
import axios from "axios";

const UserEditModal = ({ open, onClose, uli, onSubmit, error }) => {
  console.log("ULI: ", uli);
  const [userData, setUserData] = useState({
    // Personal Information
    firstName: "",
    middleName: "",
    lastName: "",
    extension: "",

    // Contact Information
    email: "",
    mobileNumber: "",
    telephoneNumber: "",

    // Address Information
    street: "",
    barangay: "",
    district: "",
    city: "",
    province: "",
    region: "",
    zipCode: "",

    // Additional Details
    nationality: "",
    sex: "",
    civilStatus: "",
    birthdate: "",
    age: "",
    employmentStatus: "",
    employmentType: "",
    education: "",
    clientClassification: "",
  });

  // Fetch user data when modal opens
  useEffect(() => {
    const fetchUserData = async () => {
      console.log("Fetching user data for ULI: ", uli);
      if (open && uli) {
        try {
          const response = await axios.get(`/api/auth/${uli}`);
          const data = response.data.data; // Access the nested data
          console.log("Before setUserData: ", data);

          setUserData({
            // Personal Information
            firstName: data.name.firstName || "",
            middleName: data.name.middleName || "",
            lastName: data.name.lastName || "",
            extension: data.name.extension || "",

            // Contact Information
            email: data.contact.email || "",
            mobileNumber: data.contact.mobileNumber || "",
            telephoneNumber: data.contact.telephoneNumber || "",

            // Address Information
            street: data.completeMailingAddress.street || "",
            barangay: data.completeMailingAddress.barangay || "",
            district: data.completeMailingAddress.district || "",
            city: data.completeMailingAddress.city || "",
            province: data.completeMailingAddress.province || "",
            region: data.completeMailingAddress.region || "",
            zipCode: data.completeMailingAddress.zipCode || "",

            // Additional Details
            nationality: data.nationality || "",
            sex: data.sex || "",
            civilStatus: data.civilStatus || "",
            birthdate: data.birthdate
              ? new Date(data.birthdate).toISOString().split("T")[0]
              : "",
            age: data.age || "",
            employmentStatus: data.employmentStatus || "",
            employmentType: data.employmentType || "",
            education: data.education || "",
            clientClassification: data.clientClassification || "",
          });
        } catch (err) {
          console.error("Error fetching user data:", err);
        }
      }
    };

    fetchUserData();
  }, [open, uli]);

  console.log("userData: ", userData);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setUserData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    // Prepare data in the original nested structure
    const updatedUser = {
      name: {
        firstName: userData.firstName,
        middleName: userData.middleName,
        lastName: userData.lastName,
        extension: userData.extension,
      },
      contact: {
        email: userData.email,
        mobileNumber: userData.mobileNumber,
        telephoneNumber: userData.telephoneNumber,
      },
      completeMailingAddress: {
        street: userData.street,
        barangay: userData.barangay,
        district: userData.district,
        city: userData.city,
        province: userData.province,
        region: userData.region,
        zipCode: userData.zipCode,
      },
      nationality: userData.nationality,
      sex: userData.sex,
      civilStatus: userData.civilStatus,
      birthdate: userData.birthdate
        ? new Date(userData.birthdate).getTime()
        : null,
      age: parseInt(userData.age) || null,
      employmentStatus: userData.employmentStatus,
      employmentType: userData.employmentType,
      education: userData.education,
      clientClassification: userData.clientClassification,
    };

    onSubmit(updatedUser);
  };

  const style = {
    position: "absolute",
    top: "50%",
    left: "50%",
    transform: "translate(-50%, -50%)",
    width: "80%",
    maxWidth: 800,
    maxHeight: "90vh",
    overflowY: "auto",
    bgcolor: "background.paper",
    boxShadow: 24,
    p: 4,
  };

  return (
    <Modal
      open={open}
      onClose={onClose}
      aria-labelledby="user-edit-modal-title"
    >
      <Box sx={style} component="form" onSubmit={handleSubmit}>
        <Typography
          id="user-edit-modal-title"
          variant="h6"
          component="h2"
          sx={{ mb: 3 }}
        >
          Edit User: {uli}
        </Typography>

        {error && (
          <Typography color="error" sx={{ mb: 2 }}>
            {error}
          </Typography>
        )}

        <Grid container spacing={2}>
          {/* Personal Information */}
          <Grid item xs={12} sm={4}>
            <TextField
              fullWidth
              label="First Name"
              name="firstName"
              value={userData.firstName}
              onChange={handleChange}
            />
          </Grid>
          <Grid item xs={12} sm={4}>
            <TextField
              fullWidth
              label="Middle Name"
              name="middleName"
              value={userData.middleName}
              onChange={handleChange}
            />
          </Grid>
          <Grid item xs={12} sm={4}>
            <TextField
              fullWidth
              label="Last Name"
              name="lastName"
              value={userData.lastName}
              onChange={handleChange}
            />
          </Grid>

          {/* Contact Information */}
          <Grid item xs={12} sm={4}>
            <TextField
              fullWidth
              label="Email"
              name="email"
              type="email"
              value={userData.email}
              onChange={handleChange}
            />
          </Grid>
          <Grid item xs={12} sm={4}>
            <TextField
              fullWidth
              label="Mobile Number"
              name="mobileNumber"
              value={userData.mobileNumber}
              onChange={handleChange}
            />
          </Grid>
          <Grid item xs={12} sm={4}>
            <TextField
              fullWidth
              label="Telephone Number"
              name="telephoneNumber"
              value={userData.telephoneNumber}
              onChange={handleChange}
            />
          </Grid>

          {/* Address Information */}
          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              label="Street"
              name="street"
              value={userData.street}
              onChange={handleChange}
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              label="Barangay"
              name="barangay"
              value={userData.barangay}
              onChange={handleChange}
            />
          </Grid>
          <Grid item xs={12} sm={4}>
            <TextField
              fullWidth
              label="City"
              name="city"
              value={userData.city}
              onChange={handleChange}
            />
          </Grid>
          <Grid item xs={12} sm={4}>
            <TextField
              fullWidth
              label="Province"
              name="province"
              value={userData.province}
              onChange={handleChange}
            />
          </Grid>
          <Grid item xs={12} sm={4}>
            <TextField
              fullWidth
              label="Zip Code"
              name="zipCode"
              value={userData.zipCode}
              onChange={handleChange}
            />
          </Grid>

          {/* Additional Details */}
          <Grid item xs={12} sm={4}>
            <FormControl fullWidth>
              <InputLabel>Sex</InputLabel>
              <Select
                name="sex"
                value={userData.sex}
                label="Sex"
                onChange={handleChange}
              >
                <MenuItem value="Male">Male</MenuItem>
                <MenuItem value="Female">Female</MenuItem>
              </Select>
            </FormControl>
          </Grid>
          <Grid item xs={12} sm={4}>
            <TextField
              fullWidth
              label="Birthdate"
              name="birthdate"
              type="date"
              InputLabelProps={{ shrink: true }}
              value={userData.birthdate}
              onChange={handleChange}
            />
          </Grid>
          <Grid item xs={12} sm={4}>
            <TextField
              fullWidth
              label="Age"
              name="age"
              type="number"
              value={userData.age}
              onChange={handleChange}
            />
          </Grid>

          {/* More Detailed Dropdowns */}
          <Grid item xs={12} sm={4}>
            <FormControl fullWidth>
              <InputLabel>Employment Status</InputLabel>
              <Select
                name="employmentStatus"
                value={userData.employmentStatus}
                label="Employment Status"
                onChange={handleChange}
              >
                <MenuItem value="Wage-Employed">Wage-Employed</MenuItem>
                <MenuItem value="Self-Employed">Self-Employed</MenuItem>
                <MenuItem value="Unemployed">Unemployed</MenuItem>
              </Select>
            </FormControl>
          </Grid>
          <Grid item xs={12} sm={4}>
            <FormControl fullWidth>
              <InputLabel>Employment Type</InputLabel>
              <Select
                name="employmentType"
                value={userData.employmentType}
                label="Employment Type"
                onChange={handleChange}
              >
                <MenuItem value="Probationary">Probationary</MenuItem>
                <MenuItem value="Regular">Regular</MenuItem>
                <MenuItem value="Contractual">Contractual</MenuItem>
              </Select>
            </FormControl>
          </Grid>
          <Grid item xs={12} sm={4}>
            <FormControl fullWidth>
              <InputLabel>Education</InputLabel>
              <Select
                name="education"
                value={userData.education}
                label="Education"
                onChange={handleChange}
              >
                <MenuItem value="Elementary Undergraduate">
                  Elementary Undergraduate
                </MenuItem>
                <MenuItem value="High School Graduate">
                  High School Graduate
                </MenuItem>
                <MenuItem value="College Undergraduate">
                  College Undergraduate
                </MenuItem>
                <MenuItem value="College Graduate">College Graduate</MenuItem>
              </Select>
            </FormControl>
          </Grid>

          <Grid item xs={12}>
            <Button type="submit" variant="contained" color="primary" fullWidth>
              Update User
            </Button>
          </Grid>
        </Grid>
      </Box>
    </Modal>
  );
};

export default UserEditModal;
