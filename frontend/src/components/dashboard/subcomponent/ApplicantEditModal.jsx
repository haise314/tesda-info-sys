import React, { useState, useEffect, useCallback } from "react";
import axios from "axios";
import { useAuth } from "../../../context/AuthContext.jsx"; // Adjust path as needed
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Box,
  IconButton,
  Stack,
  Typography,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Divider,
  Alert,
} from "@mui/material";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import DeleteIcon from "@mui/icons-material/Delete";
import AddIcon from "@mui/icons-material/Add";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import {
  assessmentTypes,
  applicationStatuses,
} from "../../utils/enums/applicant.enums.js";
import dayjs from "dayjs";

const ApplicantEditModal = ({ open, onClose, uli, onSubmit, error }) => {
  const { user: loggedInUser } = useAuth();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formError, setFormError] = useState("");
  const [editedData, setEditedData] = useState({
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

  // Fetch applicant data
  const fetchApplicantData = useCallback(async () => {
    if (open && uli) {
      try {
        const response = await axios.get(`/api/applicants/${uli}`);
        const data = response.data.data;
        console.log("Applicant data uli:", data.uli);
        setEditedData({
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
        setFormError("Error loading applicant data");
      }
    }
  }, [open, uli, loggedInUser]);

  useEffect(() => {
    fetchApplicantData();
  }, [fetchApplicantData]);

  // Generic handlers for array fields
  const handleAddItem = (field, defaultItem) => {
    setEditedData((prev) => ({
      ...prev,
      [field]: [...prev[field], defaultItem],
    }));
  };

  const handleDeleteItem = (field, index) => {
    setEditedData((prev) => ({
      ...prev,
      [field]: prev[field].filter((_, i) => i !== index),
    }));
  };

  const handleItemChange = (field, index, subfield, value) => {
    setEditedData((prev) => ({
      ...prev,
      [field]: prev[field].map((item, i) =>
        i === index ? { ...item, [subfield]: value } : item
      ),
    }));
  };

  // Basic field handlers
  const handleBasicFieldChange = (field, value) => {
    setEditedData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  // Submit handler
  const handleSubmit = async () => {
    setIsSubmitting(true);
    setFormError("");

    try {
      // Validate required fields
      if (!editedData.trainingCenterName || !editedData.addressLocation) {
        throw new Error(
          "Training center name and address location are required"
        );
      }

      // Validate assessments
      if (!editedData.assessments?.length) {
        throw new Error("At least one assessment is required");
      }
      console.log("Submitting edited data:", editedData);
      // Send update request
      const response = await axios.put(`/api/applicants/${uli}`, {
        ...editedData,
        updatedBy: loggedInUser?.uli,
      });

      if (response.data.success) {
        onSubmit?.(response.data.data);
        onClose();
      } else {
        throw new Error(response.data.message);
      }
    } catch (err) {
      console.error("Error updating applicant:", err);
      setFormError(err.message || "Error updating applicant");
    } finally {
      setIsSubmitting(false);
    }
  };

  const renderAssessments = () => (
    <Accordion defaultExpanded>
      <AccordionSummary expandIcon={<ExpandMoreIcon />}>
        <Typography variant="h6">Assessments</Typography>
      </AccordionSummary>
      <AccordionDetails>
        {editedData.assessments.map((assessment, index) => (
          <Stack key={index} spacing={2} sx={{ mb: 2 }}>
            <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
              <TextField
                label="Assessment Title"
                value={assessment.assessmentTitle}
                onChange={(e) =>
                  handleItemChange(
                    "assessments",
                    index,
                    "assessmentTitle",
                    e.target.value
                  )
                }
                fullWidth
              />
              <FormControl fullWidth>
                <InputLabel>Assessment Type</InputLabel>
                <Select
                  value={assessment.assessmentType}
                  onChange={(e) =>
                    handleItemChange(
                      "assessments",
                      index,
                      "assessmentType",
                      e.target.value
                    )
                  }
                  label="Assessment Type"
                >
                  {assessmentTypes.map((type) => (
                    <MenuItem key={type} value={type}>
                      {type}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
              <FormControl fullWidth>
                <InputLabel>Status</InputLabel>
                <Select
                  value={assessment.applicationStatus}
                  onChange={(e) =>
                    handleItemChange(
                      "assessments",
                      index,
                      "applicationStatus",
                      e.target.value
                    )
                  }
                  label="Status"
                >
                  {applicationStatuses.map((status) => (
                    <MenuItem key={status} value={status}>
                      {status}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
              <IconButton
                onClick={() => handleDeleteItem("assessments", index)}
              >
                <DeleteIcon />
              </IconButton>
            </Box>
          </Stack>
        ))}
        <Button
          startIcon={<AddIcon />}
          onClick={() =>
            handleAddItem("assessments", {
              assessmentTitle: "",
              assessmentType: "",
              applicationStatus: "For Approval",
            })
          }
        >
          Add Assessment
        </Button>
      </AccordionDetails>
    </Accordion>
  );

  const renderWorkExperience = () => (
    <Accordion>
      <AccordionSummary expandIcon={<ExpandMoreIcon />}>
        <Typography variant="h6">Work Experience</Typography>
      </AccordionSummary>
      <AccordionDetails>
        {editedData.workExperience.map((exp, index) => (
          <Stack key={index} spacing={2} sx={{ mb: 2 }}>
            <Box sx={{ display: "flex", alignItems: "flex-start", gap: 2 }}>
              <TextField
                label="Company Name"
                value={exp.companyName}
                onChange={(e) =>
                  handleItemChange(
                    "workExperience",
                    index,
                    "companyName",
                    e.target.value
                  )
                }
                fullWidth
              />
              <TextField
                label="Position"
                value={exp.position}
                onChange={(e) =>
                  handleItemChange(
                    "workExperience",
                    index,
                    "position",
                    e.target.value
                  )
                }
                fullWidth
              />
              <TextField
                label="Monthly Salary"
                type="number"
                value={exp.monthlySalary}
                onChange={(e) =>
                  handleItemChange(
                    "workExperience",
                    index,
                    "monthlySalary",
                    e.target.value
                  )
                }
                fullWidth
              />
              <IconButton
                onClick={() => handleDeleteItem("workExperience", index)}
              >
                <DeleteIcon />
              </IconButton>
            </Box>
            <Box sx={{ display: "flex", gap: 2 }}>
              <DatePicker
                label="From Date"
                value={
                  exp.inclusiveDates?.from
                    ? dayjs(exp.inclusiveDates?.from)
                    : null
                }
                onChange={(date) =>
                  handleItemChange("workExperience", index, "inclusiveDates", {
                    ...exp.inclusiveDates,
                    from: date ? date.toISOString() : null,
                  })
                }
              />
              <DatePicker
                label="To Date"
                value={
                  exp.inclusiveDates?.to ? dayjs(exp.inclusiveDates?.to) : null
                }
                onChange={(date) =>
                  handleItemChange("workExperience", index, "inclusiveDates", {
                    ...exp.inclusiveDates,
                    to: date ? date.toISOString() : null,
                  })
                }
              />

              <TextField
                label="Appointment Status"
                value={exp.appointmentStatus}
                onChange={(e) =>
                  handleItemChange(
                    "workExperience",
                    index,
                    "appointmentStatus",
                    e.target.value
                  )
                }
                fullWidth
              />
              <TextField
                label="Years in Work"
                type="number"
                value={exp.noOfYearsInWork}
                onChange={(e) =>
                  handleItemChange(
                    "workExperience",
                    index,
                    "noOfYearsInWork",
                    e.target.value
                  )
                }
                fullWidth
              />
            </Box>
          </Stack>
        ))}
        <Button
          startIcon={<AddIcon />}
          onClick={() =>
            handleAddItem("workExperience", {
              companyName: "",
              position: "",
              inclusiveDates: { from: null, to: null },
              monthlySalary: "",
              appointmentStatus: "",
              noOfYearsInWork: "",
            })
          }
        >
          Add Work Experience
        </Button>
      </AccordionDetails>
    </Accordion>
  );

  const renderTrainingSeminars = () => (
    <Accordion>
      <AccordionSummary expandIcon={<ExpandMoreIcon />}>
        <Typography variant="h6">Training & Seminars</Typography>
      </AccordionSummary>
      <AccordionDetails>
        {editedData.trainingSeminarAttended.map((training, index) => (
          <Stack key={index} spacing={2} sx={{ mb: 2 }}>
            <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
              <TextField
                label="Title"
                value={training.title}
                onChange={(e) =>
                  handleItemChange(
                    "trainingSeminarAttended",
                    index,
                    "title",
                    e.target.value
                  )
                }
                fullWidth
              />
              <TextField
                label="Venue"
                value={training.venue}
                onChange={(e) =>
                  handleItemChange(
                    "trainingSeminarAttended",
                    index,
                    "venue",
                    e.target.value
                  )
                }
                fullWidth
              />
              <TextField
                label="Hours"
                type="number"
                value={training.numberOfHours}
                onChange={(e) =>
                  handleItemChange(
                    "trainingSeminarAttended",
                    index,
                    "numberOfHours",
                    e.target.value
                  )
                }
                fullWidth
              />
              <IconButton
                onClick={() =>
                  handleDeleteItem("trainingSeminarAttended", index)
                }
              >
                <DeleteIcon />
              </IconButton>
            </Box>
            <Box sx={{ display: "flex", gap: 2 }}>
              <DatePicker
                label="From Date"
                value={
                  training.inclusiveDates?.from
                    ? dayjs(training.inclusiveDates?.from)
                    : null
                }
                onChange={(date) =>
                  handleItemChange(
                    "trainingSeminarAttended",
                    index,
                    "inclusiveDates",
                    {
                      ...training.inclusiveDates,
                      from: date ? date.toISOString() : null,
                    }
                  )
                }
              />
              <DatePicker
                label="To Date"
                value={
                  training.inclusiveDates?.to
                    ? dayjs(training.inclusiveDates?.to)
                    : null
                }
                onChange={(date) =>
                  handleItemChange(
                    "trainingSeminarAttended",
                    index,
                    "inclusiveDates",
                    {
                      ...training.inclusiveDates,
                      to: date ? date.toISOString() : null,
                    }
                  )
                }
              />
              <TextField
                label="Conducted By"
                value={training.conductedBy}
                onChange={(e) =>
                  handleItemChange(
                    "trainingSeminarAttended",
                    index,
                    "conductedBy",
                    e.target.value
                  )
                }
                fullWidth
              />
            </Box>
          </Stack>
        ))}
        <Button
          startIcon={<AddIcon />}
          onClick={() =>
            handleAddItem("trainingSeminarAttended", {
              title: "",
              venue: "",
              inclusiveDates: { from: null, to: null },
              numberOfHours: "",
              conductedBy: "",
            })
          }
        >
          Add Training/Seminar
        </Button>
      </AccordionDetails>
    </Accordion>
  );

  const renderLicensureExams = () => (
    <Accordion>
      <AccordionSummary expandIcon={<ExpandMoreIcon />}>
        <Typography variant="h6">Licensure Examinations</Typography>
      </AccordionSummary>
      <AccordionDetails>
        {editedData.licensureExaminationPassed.map((exam, index) => (
          <Stack key={index} spacing={2} sx={{ mb: 2 }}>
            <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
              <TextField
                label="Title"
                value={exam.title}
                onChange={(e) =>
                  handleItemChange(
                    "licensureExaminationPassed",
                    index,
                    "title",
                    e.target.value
                  )
                }
                fullWidth
              />
              <TextField
                label="Venue"
                value={exam.examinationVenue}
                onChange={(e) =>
                  handleItemChange(
                    "licensureExaminationPassed",
                    index,
                    "examinationVenue",
                    e.target.value
                  )
                }
                fullWidth
              />
              <TextField
                label="Rating"
                type="number"
                value={exam.rating}
                onChange={(e) =>
                  handleItemChange(
                    "licensureExaminationPassed",
                    index,
                    "rating",
                    e.target.value
                  )
                }
                fullWidth
              />
              <IconButton
                onClick={() =>
                  handleDeleteItem("licensureExaminationPassed", index)
                }
              >
                <DeleteIcon />
              </IconButton>
            </Box>
            <Box sx={{ display: "flex", gap: 2 }}>
              <DatePicker
                label="Date of Examination"
                value={
                  exam.dateOfExamination ? dayjs(exam.dateOfExamination) : null
                }
                onChange={(date) =>
                  handleItemChange(
                    "licensureExaminationPassed",
                    index,
                    "dateOfExamination",
                    date ? date.toISOString() : null
                  )
                }
              />
              <DatePicker
                label="Expiry Date"
                value={exam.expiryDate ? dayjs(exam.expiryDate) : null}
                onChange={(date) =>
                  handleItemChange(
                    "licensureExaminationPassed",
                    index,
                    "expiryDate",
                    date ? date.toISOString() : null
                  )
                }
              />
              <TextField
                label="Remarks"
                value={exam.remarks}
                onChange={(e) =>
                  handleItemChange(
                    "licensureExaminationPassed",
                    index,
                    "remarks",
                    e.target.value
                  )
                }
                fullWidth
              />
            </Box>
          </Stack>
        ))}
        <Button
          startIcon={<AddIcon />}
          onClick={() =>
            handleAddItem("licensureExaminationPassed", {
              title: "",
              dateOfExamination: null,
              examinationVenue: "",
              rating: "",
              remarks: "",
              expiryDate: null,
            })
          }
        >
          Add Licensure Examination
        </Button>
      </AccordionDetails>
    </Accordion>
  );

  const renderCompetencyAssessment = () => (
    <Accordion>
      <AccordionSummary expandIcon={<ExpandMoreIcon />}>
        <Typography variant="h6">Competency Assessment</Typography>
      </AccordionSummary>
      <AccordionDetails>
        {editedData.competencyAssessment.map((assessment, index) => (
          <Stack key={index} spacing={2} sx={{ mb: 2 }}>
            <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
              <TextField
                label="Title"
                value={assessment.title}
                onChange={(e) =>
                  handleItemChange(
                    "competencyAssessment",
                    index,
                    "title",
                    e.target.value
                  )
                }
                fullWidth
              />
              <TextField
                label="Qualification Level"
                value={assessment.qualificationLevel}
                onChange={(e) =>
                  handleItemChange(
                    "competencyAssessment",
                    index,
                    "qualificationLevel",
                    e.target.value
                  )
                }
                fullWidth
              />
              <TextField
                label="Industry Sector"
                value={assessment.industrySector}
                onChange={(e) =>
                  handleItemChange(
                    "competencyAssessment",
                    index,
                    "industrySector",
                    e.target.value
                  )
                }
                fullWidth
              />
              <IconButton
                onClick={() => handleDeleteItem("competencyAssessment", index)}
              >
                <DeleteIcon />
              </IconButton>
            </Box>
            <Box sx={{ display: "flex", gap: 2 }}>
              <TextField
                label="Certificate Number"
                value={assessment.certificateNumber}
                onChange={(e) =>
                  handleItemChange(
                    "competencyAssessment",
                    index,
                    "certificateNumber",
                    e.target.value
                  )
                }
                fullWidth
              />
              <DatePicker
                label="Date Issued"
                value={
                  assessment.dateIssued ? dayjs(assessment.dateIssued) : null
                }
                onChange={(date) =>
                  handleItemChange(
                    "competencyAssessment",
                    index,
                    "dateIssued",
                    date ? date.toISOString() : null
                  )
                }
              />
              <DatePicker
                label="Expiration Date"
                value={
                  assessment.expirationDate
                    ? dayjs(assessment.expirationDate)
                    : null
                }
                onChange={(date) =>
                  handleItemChange(
                    "competencyAssessment",
                    index,
                    "expirationDate",
                    date ? date.toISOString() : null
                  )
                }
              />
            </Box>
          </Stack>
        ))}
        <Button
          startIcon={<AddIcon />}
          onClick={() =>
            handleAddItem("competencyAssessment", {
              title: "",
              qualificationLevel: "",
              industrySector: "",
              certificateNumber: "",
              dateIssued: null,
              expirationDate: null,
            })
          }
        >
          Add Competency Assessment
        </Button>
      </AccordionDetails>
    </Accordion>
  );

  return (
    <Dialog open={open} onClose={onClose} maxWidth="lg" fullWidth>
      <DialogTitle>Edit Applicant Details</DialogTitle>
      <DialogContent>
        <Stack spacing={3} sx={{ mt: 2 }}>
          {(formError || error) && (
            <Alert severity="error">{formError || error}</Alert>
          )}

          <Box sx={{ display: "flex", gap: 2 }}>
            <TextField
              label="Training Center Name"
              value={editedData.trainingCenterName}
              onChange={(e) =>
                handleBasicFieldChange("trainingCenterName", e.target.value)
              }
              fullWidth
              required
            />
            <TextField
              label="Address Location"
              value={editedData.addressLocation}
              onChange={(e) =>
                handleBasicFieldChange("addressLocation", e.target.value)
              }
              fullWidth
              required
            />
          </Box>

          <Divider />
          {renderAssessments()}
          {renderWorkExperience()}
          {renderTrainingSeminars()}
          {renderLicensureExams()}
          {renderCompetencyAssessment()}
        </Stack>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Cancel</Button>
        <Button
          onClick={handleSubmit}
          variant="contained"
          disabled={isSubmitting}
        >
          Save Changes
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default ApplicantEditModal;
