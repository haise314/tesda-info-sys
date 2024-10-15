import React, { useState, useEffect } from "react";
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
} from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import AddIcon from "@mui/icons-material/Add";
import {
  assessmentTypes,
  applicationStatuses,
} from "../utils/enums/applicant.enums.js";

const AssessmentEditDialog = ({ open, onClose, assessments, onSave }) => {
  const [editedAssessments, setEditedAssessments] = useState([]);

  useEffect(() => {
    console.log("Assessments received in dialog:", assessments);
    const formattedAssessments = Array.isArray(assessments)
      ? assessments.map((assessment) => ({
          _id: assessment._id,
          assessmentTitle: assessment.assessmentTitle || "",
          assessmentType: assessment.assessmentType || "",
          applicationStatus: assessment.applicationStatus || "For Approval",
        }))
      : [];
    console.log("Formatted assessments:", formattedAssessments);
    setEditedAssessments(formattedAssessments);
  }, [assessments]);

  const handleAssessmentChange = (index, field, value) => {
    const updatedAssessments = [...editedAssessments];
    updatedAssessments[index] = {
      ...updatedAssessments[index],
      [field]: value,
    };
    setEditedAssessments(updatedAssessments);
  };

  const handleAddAssessment = () => {
    setEditedAssessments([
      ...editedAssessments,
      {
        assessmentTitle: "",
        assessmentType: "",
        applicationStatus: "For Approval",
      },
    ]);
  };

  const handleDeleteAssessment = (index) => {
    const updatedAssessments = editedAssessments.filter((_, i) => i !== index);
    setEditedAssessments(updatedAssessments);
  };

  const handleSave = () => {
    console.log("Saving assessments:", editedAssessments);
    onSave(editedAssessments);
  };

  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="md"
      fullWidth
      PaperProps={{
        style: {
          maxHeight: "90vh", // Ensure dialog doesn't exceed screen height
          width: "100%",
        },
      }}
    >
      <DialogTitle>Edit Assessments</DialogTitle>
      <DialogContent
        dividers
        sx={{ padding: { xs: 1, sm: 3 }, maxHeight: "70vh", overflowY: "auto" }}
      >
        {editedAssessments.map((assessment, index) => (
          <Stack
            key={index}
            direction={{ xs: "column", sm: "row" }}
            spacing={2}
            sx={{
              mb: 2,
              p: 2,
              alignItems: { sm: "center" },
            }}
          >
            <TextField
              label="Assessment Title"
              value={assessment.assessmentTitle}
              onChange={(e) =>
                handleAssessmentChange(index, "assessmentTitle", e.target.value)
              }
              fullWidth
            />
            <FormControl fullWidth>
              <InputLabel>Assessment Type</InputLabel>
              <Select
                value={assessment.assessmentType}
                onChange={(e) =>
                  handleAssessmentChange(
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
              <InputLabel>Application Status</InputLabel>
              <Select
                value={assessment.applicationStatus}
                onChange={(e) =>
                  handleAssessmentChange(
                    index,
                    "applicationStatus",
                    e.target.value
                  )
                }
                label="Application Status"
              >
                {applicationStatuses.map((status) => (
                  <MenuItem key={status} value={status}>
                    {status}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
            <IconButton onClick={() => handleDeleteAssessment(index)}>
              <DeleteIcon />
            </IconButton>
          </Stack>
        ))}
        <Button startIcon={<AddIcon />} onClick={handleAddAssessment}>
          Add Assessment
        </Button>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Cancel</Button>
        <Button onClick={handleSave} color="primary">
          Save
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default AssessmentEditDialog;
