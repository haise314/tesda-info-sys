import React, { useState, useEffect, useCallback } from "react";
import {
  Modal,
  Box,
  Typography,
  TextField,
  Button,
  Grid,
  Tabs,
  Tab,
  Paper,
  IconButton,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
} from "@mui/material";
import { Add as AddIcon, Delete as DeleteIcon } from "@mui/icons-material";
import axios from "axios";
import { useAuth } from "../../../context/AuthContext";
import {
  applicationStatuses,
  assessmentTypes,
} from "../../utils/enums/applicant.enums";

const ApplicantEditModal = ({ open, onClose, uli, onSubmit, error }) => {
  const { user: loggedInUser } = useAuth();
  const [activeTab, setActiveTab] = useState(0);
  const [applicantData, setApplicantData] = useState({
    uli: "",
    trainingCenterName: "",
    addressLocation: "",
    updatedBy: "",
    assessments: [],
    workExperience: [],
    trainingSeminarAttended: [],
    licensureExaminationPassed: [],
    competencyAssessment: [],
  });

  // Improved fetch applicant data
  const fetchApplicantData = useCallback(async () => {
    if (open && uli) {
      try {
        const response = await axios.get(`/api/applicants/${uli}`);
        const data = response.data.data;

        setApplicantData({
          uli: data.uli || "",
          trainingCenterName: data.trainingCenterName || "",
          addressLocation: data.addressLocation || "",
          updatedBy: loggedInUser?.uli || "",
          assessments: data.assessments || [],
          workExperience: data.workExperience || [],
          trainingSeminarAttended: data.trainingSeminarAttended || [],
          licensureExaminationPassed: data.licensureExaminationPassed || [],
          competencyAssessment: data.competencyAssessment || [],
        });
      } catch (err) {
        console.error("Error fetching applicant data:", err);
      }
    }
  }, [open, uli, loggedInUser]);

  useEffect(() => {
    fetchApplicantData();
  }, [fetchApplicantData]);

  // Simplified direct field update
  const handleBasicChange = (e) => {
    const { name, value } = e.target;
    setApplicantData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // Generic method for updating array items
  const updateArrayItem = (fieldName, index, updates) => {
    setApplicantData((prev) => {
      const newArray = [...prev[fieldName]];
      newArray[index] = { ...newArray[index], ...updates };
      return { ...prev, [fieldName]: newArray };
    });
  };

  // Generic method for handling nested field changes
  const handleNestedChange = (e) => {
    const { name, value } = e.target;
    const [field, indexStr, nestedField] = name.split(".");
    const index = parseInt(indexStr, 10);

    setApplicantData((prev) => {
      const newArray = [...prev[field]];
      newArray[index] = {
        ...newArray[index],
        [nestedField]: value,
      };
      return { ...prev, [field]: newArray };
    });
  };

  // Add item to any array
  const addArrayItem = (fieldName, newItem) => {
    setApplicantData((prev) => ({
      ...prev,
      [fieldName]: [...prev[fieldName], newItem],
    }));
  };

  // Remove item from any array
  const removeArrayItem = (fieldName, index) => {
    setApplicantData((prev) => ({
      ...prev,
      [fieldName]: prev[fieldName].filter((_, i) => i !== index),
    }));
  };

  // Comprehensive submit handler with validation
  const handleSubmit = (e) => {
    e.preventDefault();

    // Basic validation
    const requiredFields = ["uli", "trainingCenterName", "addressLocation"];
    const missingFields = requiredFields.filter(
      (field) => !applicantData[field]
    );

    if (missingFields.length > 0) {
      console.error("Missing required fields:", missingFields);
      return;
    }

    console.log("Submitting applicant data:", applicantData);

    try {
      // Final validation and cleanup before submission
      const sanitizedData = { ...applicantData };

      // Remove empty arrays or null values if needed
      Object.keys(sanitizedData).forEach((key) => {
        if (
          Array.isArray(sanitizedData[key]) &&
          sanitizedData[key].length === 0
        ) {
          delete sanitizedData[key];
        }
      });

      onSubmit(sanitizedData);
    } catch (submitError) {
      console.error("Submission failed:", submitError);
      // Potentially set an error state to show to the user
    }
  };

  // Render method for Assessments
  const renderAssessments = () => (
    <Grid container spacing={2}>
      <Grid item xs={12}>
        <Typography variant="h6">Assessments</Typography>
      </Grid>
      {applicantData.assessments.map((assessment, index) => (
        <Grid container item xs={12} spacing={2} key={index}>
          <Grid item xs={12} sm={4}>
            <TextField
              fullWidth
              label="Assessment Title"
              name={`assessments.${index}.assessmentTitle`}
              value={assessment.assessmentTitle || ""}
              onChange={handleNestedChange}
            />
          </Grid>
          <Grid item xs={12} sm={4}>
            <FormControl fullWidth>
              <InputLabel>Assessment Type</InputLabel>
              <Select
                name={`assessments.${index}.assessmentType`}
                value={assessment.assessmentType || ""}
                label="Assessment Type"
                onChange={handleNestedChange}
              >
                {assessmentTypes.map((type) => (
                  <MenuItem key={type} value={type}>
                    {type}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>
          <Grid item xs={12} sm={4}>
            <FormControl fullWidth>
              <InputLabel>Application Status</InputLabel>
              <Select
                name={`assessments.${index}.applicationStatus`}
                value={assessment.applicationStatus || "For Approval"}
                label="Application Status"
                onChange={handleNestedChange}
              >
                {applicationStatuses.map((status) => (
                  <MenuItem key={status} value={status}>
                    {status}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>
          <Grid item xs={12}>
            <IconButton
              color="error"
              onClick={() => removeArrayItem("assessments", index)}
            >
              <DeleteIcon />
            </IconButton>
          </Grid>
        </Grid>
      ))}
      <Grid item xs={12}>
        <Button
          startIcon={<AddIcon />}
          onClick={() =>
            addArrayItem("assessments", {
              assessmentTitle: "",
              assessmentType: "",
              applicationStatus: "For Approval",
            })
          }
        >
          Add Assessment
        </Button>
      </Grid>
    </Grid>
  );

  // Render method for Work Experience
  const renderWorkExperience = () => (
    <Grid container spacing={2}>
      <Grid item xs={12}>
        <Typography variant="h6">Work Experience</Typography>
      </Grid>
      {applicantData.workExperience.map((experience, index) => (
        <Grid container item xs={12} spacing={2} key={index}>
          <Grid item xs={12} sm={4}>
            <TextField
              fullWidth
              label="Company Name"
              name={`workExperience.${index}.companyName`}
              value={experience.companyName || ""}
              onChange={handleNestedChange}
            />
          </Grid>
          <Grid item xs={12} sm={4}>
            <TextField
              fullWidth
              label="Position"
              name={`workExperience.${index}.position`}
              value={experience.position || ""}
              onChange={handleNestedChange}
            />
          </Grid>
          <Grid item xs={12} sm={4}>
            <TextField
              fullWidth
              label="Duration"
              name={`workExperience.${index}.duration`}
              value={experience.duration || ""}
              onChange={handleNestedChange}
            />
          </Grid>
          <Grid item xs={12}>
            <IconButton
              color="error"
              onClick={() => removeArrayItem("workExperience", index)}
            >
              <DeleteIcon />
            </IconButton>
          </Grid>
        </Grid>
      ))}
      <Grid item xs={12}>
        <Button
          startIcon={<AddIcon />}
          onClick={() =>
            addArrayItem("workExperience", {
              companyName: "",
              position: "",
              duration: "",
            })
          }
        >
          Add Work Experience
        </Button>
      </Grid>
    </Grid>
  );

  // Render method for Training Seminars
  const renderTrainingSeminars = () => (
    <Grid container spacing={2}>
      <Grid item xs={12}>
        <Typography variant="h6">Training Seminars</Typography>
      </Grid>
      {applicantData.trainingSeminarAttended.map((seminar, index) => (
        <Grid container item xs={12} spacing={2} key={index}>
          <Grid item xs={12} sm={4}>
            <TextField
              fullWidth
              label="Seminar Name"
              name={`trainingSeminarAttended.${index}.seminarName`}
              value={seminar.seminarName || ""}
              onChange={handleNestedChange}
            />
          </Grid>
          <Grid item xs={12} sm={4}>
            <TextField
              fullWidth
              label="Date Attended"
              name={`trainingSeminarAttended.${index}.dateAttended`}
              type="date"
              InputLabelProps={{ shrink: true }}
              value={seminar.dateAttended || ""}
              onChange={handleNestedChange}
            />
          </Grid>
          <Grid item xs={12}>
            <IconButton
              color="error"
              onClick={() => removeArrayItem("trainingSeminarAttended", index)}
            >
              <DeleteIcon />
            </IconButton>
          </Grid>
        </Grid>
      ))}
      <Grid item xs={12}>
        <Button
          startIcon={<AddIcon />}
          onClick={() =>
            addArrayItem("trainingSeminarAttended", {
              seminarName: "",
              dateAttended: "",
            })
          }
        >
          Add Training Seminar
        </Button>
      </Grid>
    </Grid>
  );

  // Render method for Licensure Examinations
  const renderLicensureExams = () => (
    <Grid container spacing={2}>
      <Grid item xs={12}>
        <Typography variant="h6">Licensure Examinations</Typography>
      </Grid>
      {applicantData.licensureExaminationPassed.map((exam, index) => (
        <Grid container item xs={12} spacing={2} key={index}>
          <Grid item xs={12} sm={4}>
            <TextField
              fullWidth
              label="Exam Name"
              name={`licensureExaminationPassed.${index}.examName`}
              value={exam.examName || ""}
              onChange={handleNestedChange}
            />
          </Grid>
          <Grid item xs={12} sm={4}>
            <TextField
              fullWidth
              label="License Number"
              name={`licensureExaminationPassed.${index}.licenseNumber`}
              value={exam.licenseNumber || ""}
              onChange={handleNestedChange}
            />
          </Grid>
          <Grid item xs={12}>
            <IconButton
              color="error"
              onClick={() =>
                removeArrayItem("licensureExaminationPassed", index)
              }
            >
              <DeleteIcon />
            </IconButton>
          </Grid>
        </Grid>
      ))}
      <Grid item xs={12}>
        <Button
          startIcon={<AddIcon />}
          onClick={() =>
            addArrayItem("licensureExaminationPassed", {
              examName: "",
              licenseNumber: "",
            })
          }
        >
          Add Licensure Exam
        </Button>
      </Grid>
    </Grid>
  );

  // Render method for Competency Assessment
  const renderCompetencyAssessment = () => (
    <Grid container spacing={2}>
      <Grid item xs={12}>
        <Typography variant="h6">Competency Assessment</Typography>
      </Grid>
      {applicantData.competencyAssessment.map((assessment, index) => (
        <Grid container item xs={12} spacing={2} key={index}>
          <Grid item xs={12} sm={4}>
            <TextField
              fullWidth
              label="Competency Name"
              name={`competencyAssessment.${index}.competencyName`}
              value={assessment.competencyName || ""}
              onChange={handleNestedChange}
            />
          </Grid>
          <Grid item xs={12} sm={4}>
            <TextField
              fullWidth
              label="Assessment Date"
              name={`competencyAssessment.${index}.assessmentDate`}
              type="date"
              InputLabelProps={{ shrink: true }}
              value={assessment.assessmentDate || ""}
              onChange={handleNestedChange}
            />
          </Grid>
          <Grid item xs={12}>
            <IconButton
              color="error"
              onClick={() => removeArrayItem("competencyAssessment", index)}
            >
              <DeleteIcon />
            </IconButton>
          </Grid>
        </Grid>
      ))}
      <Grid item xs={12}>
        <Button
          startIcon={<AddIcon />}
          onClick={() =>
            addArrayItem("competencyAssessment", {
              competencyName: "",
              assessmentDate: "",
            })
          }
        >
          Add Competency Assessment
        </Button>
      </Grid>
    </Grid>
  );

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

  return (
    <Modal
      open={open}
      onClose={onClose}
      aria-labelledby="applicant-edit-modal-title"
    >
      <Box sx={style} component="form" onSubmit={handleSubmit}>
        <Typography
          id="applicant-edit-modal-title"
          variant="h6"
          component="h2"
          sx={{ mb: 3 }}
        >
          Edit Applicant: {uli}
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
            aria-label="applicant edit tabs"
            variant="scrollable"
            scrollButtons="auto"
          >
            <Tab label="Basic Info" />
            <Tab label="Assessments" />
            <Tab label="Work Experience" />
            <Tab label="Training Seminars" />
            <Tab label="Licensure Exams" />
            <Tab label="Competency Assessment" />
          </Tabs>
        </Paper>

        <Box sx={{ p: 3 }}>
          {activeTab === 0 && (
            <Grid container spacing={2}>
              <Grid item xs={12} sm={4}>
                <TextField
                  fullWidth
                  label="ULI"
                  name="uli"
                  value={applicantData.uli}
                  onChange={handleBasicChange}
                  required
                />
              </Grid>
              <Grid item xs={12} sm={4}>
                <TextField
                  fullWidth
                  label="Training Center Name"
                  name="trainingCenterName"
                  value={applicantData.trainingCenterName}
                  onChange={handleBasicChange}
                  required
                />
              </Grid>
              <Grid item xs={12} sm={4}>
                <TextField
                  fullWidth
                  label="Address Location"
                  name="addressLocation"
                  value={applicantData.addressLocation}
                  onChange={handleBasicChange}
                  required
                />
              </Grid>
            </Grid>
          )}
          {activeTab === 1 && renderAssessments()}
          {activeTab === 2 && renderWorkExperience()}
          {activeTab === 3 && renderTrainingSeminars()}
          {activeTab === 4 && renderLicensureExams()}
          {activeTab === 5 && renderCompetencyAssessment()}
        </Box>

        <Grid item xs={12} sx={{ mt: 2 }}>
          <Button type="submit" variant="contained" color="primary" fullWidth>
            Update Applicant
          </Button>
        </Grid>
      </Box>
    </Modal>
  );
};

export default ApplicantEditModal;
