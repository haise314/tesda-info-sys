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
  Tabs,
  Tab,
  Paper,
} from "@mui/material";
import axios from "axios";
import { useAuth } from "../../../context/AuthContext";
import {
  employmentTypes,
  employmentStatuses,
  educationalAttainments,
  civilStatues,
  clientClassifications,
  disabilityTypes,
  disabilityCauses,
} from "../../utils/enums/registrant.enums";

const CompactUserEditModal = ({ open, onClose, uli, onSubmit, error }) => {
  const { user: loggedInUser } = useAuth();
  console.log("Logged In User: ", loggedInUser);
  const [activeTab, setActiveTab] = useState(0);
  const [userData, setUserData] = useState({
    // Authentication Fields
    role: "client",
    uli: "",
    password: "",

    // Personal Information
    name: {
      firstName: "",
      middleName: "",
      lastName: "",
      extension: "",
    },
    nationality: "",
    sex: "",
    civilStatus: "",
    birthdate: "",
    age: "",
    clientClassification: "",
    otherClientClassification: "",

    // Contact Information
    contact: {
      email: "",
      mobileNumber: "",
      telephoneNumber: "",
      fax: "",
      others: "",
    },

    // Address Information
    completeMailingAddress: {
      street: "",
      barangay: "",
      district: "",
      city: "",
      province: "",
      region: "",
      zipCode: "",
    },

    // Employment Information
    employmentStatus: "",
    employmentType: "",
    education: "",

    // Birthplace Information
    birthplace: {
      barangay: "",
      city: "",
      province: "",
      region: "",
    },

    // Parent Information
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

    // Additional Fields
    disabilityType: "",
    disabilityCause: "",

    // Tracking
    updatedBy: "",
  });

  // Fetch user data when modal opens
  useEffect(() => {
    const fetchUserData = async () => {
      if (open && uli) {
        try {
          const response = await axios.get(`/api/auth/${uli}`);
          const data = response.data.data;

          setUserData({
            role: data.role || "client",
            uli: data.uli || "",
            password: "", // We typically don't pre-fill passwords

            name: {
              firstName: data.name?.firstName || "",
              middleName: data.name?.middleName || "",
              lastName: data.name?.lastName || "",
              extension: data.name?.extension || "",
            },
            nationality: data.nationality || "",
            sex: data.sex || "",
            civilStatus: data.civilStatus || "",
            birthdate: data.birthdate
              ? new Date(data.birthdate).toISOString().split("T")[0]
              : "",
            age: data.age || "",
            clientClassification: data.clientClassification || "",
            otherClientClassification: data.otherClientClassification || "",

            contact: {
              email: data.contact?.email || "",
              mobileNumber: data.contact?.mobileNumber || "",
              telephoneNumber: data.contact?.telephoneNumber || "",
              fax: data.contact?.fax || "",
              others: data.contact?.others || "",
            },

            completeMailingAddress: {
              street: data.completeMailingAddress?.street || "",
              barangay: data.completeMailingAddress?.barangay || "",
              district: data.completeMailingAddress?.district || "",
              city: data.completeMailingAddress?.city || "",
              province: data.completeMailingAddress?.province || "",
              region: data.completeMailingAddress?.region || "",
              zipCode: data.completeMailingAddress?.zipCode || "",
            },

            employmentStatus: data.employmentStatus || "",
            employmentType: data.employmentType || "",
            education: data.education || "",

            birthplace: {
              barangay: data.birthplace?.barangay || "",
              city: data.birthplace?.city || "",
              province: data.birthplace?.province || "",
              region: data.birthplace?.region || "",
            },

            motherName: {
              firstName: data.motherName?.firstName || "",
              middleName: data.motherName?.middleName || "",
              lastName: data.motherName?.lastName || "",
              extension: data.motherName?.extension || "",
            },
            fatherName: {
              firstName: data.fatherName?.firstName || "",
              middleName: data.fatherName?.middleName || "",
              lastName: data.fatherName?.lastName || "",
              extension: data.fatherName?.extension || "",
            },

            disabilityType: data.disabilityType || "",
            disabilityCause: data.disabilityCause || "",

            updatedBy: loggedInUser?.uli || "",
          });
        } catch (err) {
          console.error("Error fetching user data:", err);
        }
      }
    };

    fetchUserData();
  }, [open, uli]);

  const handleChange = (e) => {
    const { name, value } = e.target;

    // Handle nested object updates
    const updateNestedState = (path, val) => {
      const keys = path.split(".");
      setUserData((prev) => {
        const newState = { ...prev };
        let current = newState;

        for (let i = 0; i < keys.length - 1; i++) {
          current = current[keys[i]];
        }

        current[keys[keys.length - 1]] = val;
        return newState;
      });
    };

    // Check if the name contains a dot (for nested objects)
    if (name.includes(".")) {
      updateNestedState(name, value);
    } else {
      setUserData((prev) => ({
        ...prev,
        [name]: value,
      }));
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(userData);
  };

  const style = {
    position: "absolute",
    top: "50%",
    left: "50%",
    transform: "translate(-50%, -50%)",
    width: "95%",
    maxWidth: 1200,
    maxHeight: "95vh",
    overflowY: "auto",
    bgcolor: "background.paper",
    boxShadow: 24,
    p: 4,
  };

  // Render different sections based on active tab
  const renderPersonalInfo = () => (
    <Grid container spacing={2}>
      <Grid item xs={12} sm={3}>
        <TextField
          fullWidth
          label="First Name"
          name="name.firstName"
          value={userData.name.firstName}
          onChange={handleChange}
          required
        />
      </Grid>
      <Grid item xs={12} sm={3}>
        <TextField
          fullWidth
          label="Middle Name"
          name="name.middleName"
          value={userData.name.middleName}
          onChange={handleChange}
        />
      </Grid>
      <Grid item xs={12} sm={3}>
        <TextField
          fullWidth
          label="Last Name"
          name="name.lastName"
          value={userData.name.lastName}
          onChange={handleChange}
          required
        />
      </Grid>
      <Grid item xs={12} sm={3}>
        <TextField
          fullWidth
          label="Name Extension"
          name="name.extension"
          value={userData.name.extension}
          onChange={handleChange}
        />
      </Grid>

      <Grid item xs={12} sm={3}>
        <TextField
          fullWidth
          label="Nationality"
          name="nationality"
          value={userData.nationality}
          onChange={handleChange}
          required
        />
      </Grid>
      <Grid item xs={12} sm={3}>
        <FormControl fullWidth required>
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
      <Grid item xs={12} sm={3}>
        <FormControl fullWidth required>
          <InputLabel>Civil Status</InputLabel>
          <Select
            name="civilStatus"
            value={userData.civilStatus}
            label="Civil Status"
            onChange={handleChange}
          >
            {civilStatues.map((status) => (
              <MenuItem key={status} value={status}>
                {status}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
      </Grid>
      <Grid item xs={12} sm={3}>
        <TextField
          fullWidth
          label="Birthdate"
          name="birthdate"
          type="date"
          InputLabelProps={{ shrink: true }}
          value={userData.birthdate}
          onChange={handleChange}
          required
        />
      </Grid>
      <Grid item xs={12} sm={3}>
        <TextField
          fullWidth
          label="Age"
          name="age"
          type="number"
          value={userData.age}
          onChange={handleChange}
          required
        />
      </Grid>
      <Grid item xs={12} sm={3}>
        <FormControl fullWidth required>
          <InputLabel>Client Classification</InputLabel>
          <Select
            name="clientClassification"
            value={userData.clientClassification}
            label="Client Classification"
            onChange={handleChange}
          >
            {clientClassifications.map((classification) => (
              <MenuItem key={classification} value={classification}>
                {classification}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
      </Grid>
      {userData.clientClassification === "Others" && (
        <Grid item xs={12} sm={3}>
          <TextField
            fullWidth
            label="Other Classification"
            name="otherClientClassification"
            value={userData.otherClientClassification}
            onChange={handleChange}
            required
          />
        </Grid>
      )}
    </Grid>
  );

  const renderContactInfo = () => (
    <Grid container spacing={2}>
      <Grid item xs={12} sm={3}>
        <TextField
          fullWidth
          label="Email"
          name="contact.email"
          value={userData.contact.email}
          onChange={handleChange}
          required
          type="email"
        />
      </Grid>
      <Grid item xs={12} sm={3}>
        <TextField
          fullWidth
          label="Mobile Number"
          name="contact.mobileNumber"
          value={userData.contact.mobileNumber}
          onChange={handleChange}
          required
        />
      </Grid>
      <Grid item xs={12} sm={3}>
        <TextField
          fullWidth
          label="Telephone Number"
          name="contact.telephoneNumber"
          value={userData.contact.telephoneNumber}
          onChange={handleChange}
        />
      </Grid>
      <Grid item xs={12} sm={3}>
        <TextField
          fullWidth
          label="Fax"
          name="contact.fax"
          value={userData.contact.fax}
          onChange={handleChange}
        />
      </Grid>
      <Grid item xs={12} sm={3}>
        <TextField
          fullWidth
          label="Other Contact Info"
          name="contact.others"
          value={userData.contact.others}
          onChange={handleChange}
        />
      </Grid>
    </Grid>
  );

  const renderAddressInfo = () => (
    <Grid container spacing={2}>
      <Grid item xs={12} sm={3}>
        <TextField
          fullWidth
          label="Street"
          name="completeMailingAddress.street"
          value={userData.completeMailingAddress.street}
          onChange={handleChange}
          required
        />
      </Grid>
      <Grid item xs={12} sm={3}>
        <TextField
          fullWidth
          label="Barangay"
          name="completeMailingAddress.barangay"
          value={userData.completeMailingAddress.barangay}
          onChange={handleChange}
          required
        />
      </Grid>
      <Grid item xs={12} sm={3}>
        <TextField
          fullWidth
          label="District"
          name="completeMailingAddress.district"
          value={userData.completeMailingAddress.district}
          onChange={handleChange}
          required
        />
      </Grid>
      <Grid item xs={12} sm={3}>
        <TextField
          fullWidth
          label="City"
          name="completeMailingAddress.city"
          value={userData.completeMailingAddress.city}
          onChange={handleChange}
          required
        />
      </Grid>
      <Grid item xs={12} sm={3}>
        <TextField
          fullWidth
          label="Province"
          name="completeMailingAddress.province"
          value={userData.completeMailingAddress.province}
          onChange={handleChange}
          required
        />
      </Grid>
      <Grid item xs={12} sm={3}>
        <TextField
          fullWidth
          label="Region"
          name="completeMailingAddress.region"
          value={userData.completeMailingAddress.region}
          onChange={handleChange}
          required
        />
      </Grid>
      <Grid item xs={12} sm={3}>
        <TextField
          fullWidth
          label="Zip Code"
          name="completeMailingAddress.zipCode"
          value={userData.completeMailingAddress.zipCode}
          onChange={handleChange}
          required
        />
      </Grid>
    </Grid>
  );

  const renderEmploymentInfo = () => (
    <Grid container spacing={2}>
      <Grid item xs={12} sm={3}>
        <FormControl fullWidth required>
          <InputLabel>Employment Status</InputLabel>
          <Select
            name="employmentStatus"
            value={userData.employmentStatus}
            label="Employment Status"
            onChange={handleChange}
          >
            {employmentStatuses.map((status) => (
              <MenuItem key={status} value={status}>
                {status}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
      </Grid>
      <Grid item xs={12} sm={3}>
        <FormControl
          fullWidth
          disabled={
            !["Wage-Employed", "Underemployed"].includes(
              userData.employmentStatus
            )
          }
        >
          <InputLabel>Employment Type</InputLabel>
          <Select
            name="employmentType"
            value={userData.employmentType}
            label="Employment Type"
            onChange={handleChange}
          >
            {employmentTypes.map((type) => (
              <MenuItem key={type} value={type}>
                {type}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
      </Grid>
      <Grid item xs={12} sm={3}>
        <FormControl fullWidth required>
          <InputLabel>Education</InputLabel>
          <Select
            name="education"
            value={userData.education}
            label="Education"
            onChange={handleChange}
          >
            {educationalAttainments.map((edu) => (
              <MenuItem key={edu} value={edu}>
                {edu}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
      </Grid>
    </Grid>
  );

  const renderBirthplaceInfo = () => (
    <Grid container spacing={2}>
      <Grid item xs={12} sm={3}>
        <TextField
          fullWidth
          label="Birthplace Barangay"
          name="birthplace.barangay"
          value={userData.birthplace.barangay}
          onChange={handleChange}
          required
        />
      </Grid>
      <Grid item xs={12} sm={3}>
        <TextField
          fullWidth
          label="Birthplace City"
          name="birthplace.city"
          value={userData.birthplace.city}
          onChange={handleChange}
          required
        />
      </Grid>
      <Grid item xs={12} sm={3}>
        <TextField
          fullWidth
          label="Birthplace Province"
          name="birthplace.province"
          value={userData.birthplace.province}
          onChange={handleChange}
          required
        />
      </Grid>
      <Grid item xs={12} sm={3}>
        <TextField
          fullWidth
          label="Birthplace Region"
          name="birthplace.region"
          value={userData.birthplace.region}
          onChange={handleChange}
          required
        />
      </Grid>
    </Grid>
  );

  const renderParentInfo = () => (
    <Grid container spacing={2}>
      {/* Mother's Information */}
      <Grid item xs={12}>
        <Typography variant="h6">Mother's Information</Typography>
      </Grid>
      <Grid item xs={12} sm={3}>
        <TextField
          fullWidth
          label="Mother's First Name"
          name="motherName.firstName"
          value={userData.motherName.firstName}
          onChange={handleChange}
          required
        />
      </Grid>
      <Grid item xs={12} sm={3}>
        <TextField
          fullWidth
          label="Mother's Middle Name"
          name="motherName.middleName"
          value={userData.motherName.middleName}
          onChange={handleChange}
        />
      </Grid>
      <Grid item xs={12} sm={3}>
        <TextField
          fullWidth
          label="Mother's Last Name"
          name="motherName.lastName"
          value={userData.motherName.lastName}
          onChange={handleChange}
          required
        />
      </Grid>
      <Grid item xs={12} sm={3}>
        <TextField
          fullWidth
          label="Mother's Name Extension"
          name="motherName.extension"
          value={userData.motherName.extension}
          onChange={handleChange}
        />
      </Grid>

      {/* Father's Information */}
      <Grid item xs={12}>
        <Typography variant="h6">Father's Information</Typography>
      </Grid>
      <Grid item xs={12} sm={3}>
        <TextField
          fullWidth
          label="Father's First Name"
          name="fatherName.firstName"
          value={userData.fatherName.firstName}
          onChange={handleChange}
          required
        />
      </Grid>
      <Grid item xs={12} sm={3}>
        <TextField
          fullWidth
          label="Father's Middle Name"
          name="fatherName.middleName"
          value={userData.fatherName.middleName}
          onChange={handleChange}
        />
      </Grid>
      <Grid item xs={12} sm={3}>
        <TextField
          fullWidth
          label="Father's Last Name"
          name="fatherName.lastName"
          value={userData.fatherName.lastName}
          onChange={handleChange}
          required
        />
      </Grid>
      <Grid item xs={12} sm={3}>
        <TextField
          fullWidth
          label="Father's Name Extension"
          name="fatherName.extension"
          value={userData.fatherName.extension}
          onChange={handleChange}
        />
      </Grid>
    </Grid>
  );

  const renderAdditionalInfo = () => (
    <Grid container spacing={2}>
      {/* Role Selection (for admins) */}
      {loggedInUser?.role === "superadmin" && (
        <Grid item xs={12} sm={3}>
          <FormControl fullWidth>
            <InputLabel>User Role</InputLabel>
            <Select
              name="role"
              value={userData.role}
              label="User Role"
              onChange={handleChange}
            >
              <MenuItem value="client">Client</MenuItem>
              <MenuItem value="admin">Admin</MenuItem>
              <MenuItem value="superadmin">Superadmin</MenuItem>
            </Select>
          </FormControl>
        </Grid>
      )}

      <Grid item xs={12} sm={3}>
        <FormControl fullWidth>
          <InputLabel>Disability Type</InputLabel>
          <Select
            name="disabilityType"
            value={userData.disabilityType}
            label="Disability Type"
            onChange={handleChange}
          >
            {disabilityTypes.map((type) => (
              <MenuItem key={type} value={type}>
                {type}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
      </Grid>
      <Grid item xs={12} sm={3}>
        <FormControl fullWidth>
          <InputLabel>Disability Cause</InputLabel>
          <Select
            name="disabilityCause"
            value={userData.disabilityCause}
            label="Disability Cause"
            onChange={handleChange}
          >
            {disabilityCauses.map((cause) => (
              <MenuItem key={cause} value={cause}>
                {cause}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
      </Grid>
      <Grid item xs={12} sm={3}>
        <TextField
          fullWidth
          label="Updated By"
          name="updatedBy"
          value={userData.updatedBy}
          onChange={handleChange}
          disabled
        />
      </Grid>
      <Grid item xs={12} sm={3}>
        <TextField
          fullWidth
          label="ULI"
          name="uli"
          value={userData.uli}
          onChange={handleChange}
          disabled
        />
      </Grid>
    </Grid>
  );

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

        <Paper sx={{ borderBottom: 1, borderColor: "divider" }}>
          <Tabs
            value={activeTab}
            onChange={(e, newValue) => setActiveTab(newValue)}
            aria-label="user edit tabs"
            variant="scrollable"
            scrollButtons="auto"
          >
            <Tab label="Personal Info" />
            <Tab label="Contact Info" />
            <Tab label="Address" />
            <Tab label="Employment" />
            <Tab label="Birthplace" />
            <Tab label="Parents" />
            <Tab label="Additional Info" />
          </Tabs>
        </Paper>

        <Box sx={{ p: 3 }}>
          {activeTab === 0 && renderPersonalInfo()}
          {activeTab === 1 && renderContactInfo()}
          {activeTab === 2 && renderAddressInfo()}
          {activeTab === 3 && renderEmploymentInfo()}
          {activeTab === 4 && renderBirthplaceInfo()}
          {activeTab === 5 && renderParentInfo()}
          {activeTab === 6 && renderAdditionalInfo()}
        </Box>

        <Grid item xs={12} sx={{ mt: 2 }}>
          <Button type="submit" variant="contained" color="primary" fullWidth>
            Update User
          </Button>
        </Grid>
      </Box>
    </Modal>
  );
};

export default CompactUserEditModal;
