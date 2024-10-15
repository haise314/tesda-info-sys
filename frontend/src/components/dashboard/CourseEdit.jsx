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
  FormControlLabel,
  Checkbox,
  IconButton,
  Stack,
} from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import AddIcon from "@mui/icons-material/Add";
import {
  registrationStatuses,
  scholarTypes,
} from "../utils/enums/registrant.enums";

const CourseEditDialog = ({ open, onClose, courses, onSave }) => {
  const [editedCourses, setEditedCourses] = useState([]);

  useEffect(() => {
    console.log("Courses received in dialog:", courses);
    // Ensure we're working with an array and set default values if needed
    const formattedCourses = Array.isArray(courses)
      ? courses.map((course) => ({
          _id: course._id,
          courseName: course.courseName || "",
          registrationStatus: course.registrationStatus || "Pending",
          hasScholarType: !!course.scholarType,
          scholarType: course.scholarType || "",
        }))
      : [];
    console.log("Formatted courses:", formattedCourses);
    setEditedCourses(formattedCourses);
  }, [courses]);

  const handleCourseChange = (index, field, value) => {
    const newCourses = [...editedCourses];
    newCourses[index] = { ...newCourses[index], [field]: value };

    // If hasScholarType is set to false, clear the scholarType
    if (field === "hasScholarType" && value === false) {
      newCourses[index].scholarType = "";
    }

    setEditedCourses(newCourses);
  };

  const handleAddCourse = () => {
    setEditedCourses([
      ...editedCourses,
      {
        courseName: "",
        registrationStatus: "Pending",
        hasScholarType: false,
        scholarType: "",
      },
    ]);
  };

  const handleDeleteCourse = (index) => {
    const newCourses = editedCourses.filter((_, i) => i !== index);
    setEditedCourses(newCourses);
  };

  const handleSave = () => {
    // Filter out empty scholarType when hasScholarType is false
    const sanitizedCourses = editedCourses.map((course) => ({
      ...course,
      scholarType: course.hasScholarType ? course.scholarType : undefined,
    }));
    console.log("Saving courses:", sanitizedCourses);
    onSave(sanitizedCourses);
  };

  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="md"
      fullWidth
      PaperProps={{
        style: {
          maxHeight: "90vh", // Ensure the dialog doesn't exceed screen height
          width: "100%",
        },
      }}
    >
      <DialogTitle>Edit Courses</DialogTitle>
      <DialogContent
        dividers
        sx={{ padding: { xs: 1, sm: 3 }, maxHeight: "70vh", overflowY: "auto" }}
      >
        {editedCourses.map((course, index) => (
          <Stack
            key={index}
            direction={{ xs: "column", sm: "row" }}
            spacing={2}
            sx={{
              mb: 2,
              alignItems: { sm: "center" },
            }}
          >
            <TextField
              label="Course Name"
              value={course.courseName}
              onChange={(e) =>
                handleCourseChange(index, "courseName", e.target.value)
              }
              fullWidth
            />
            <Select
              value={course.registrationStatus}
              onChange={(e) =>
                handleCourseChange(index, "registrationStatus", e.target.value)
              }
              fullWidth
            >
              {registrationStatuses.map((status) => (
                <MenuItem key={status} value={status}>
                  {status}
                </MenuItem>
              ))}
            </Select>
            <FormControlLabel
              control={
                <Checkbox
                  checked={course.hasScholarType}
                  onChange={(e) =>
                    handleCourseChange(
                      index,
                      "hasScholarType",
                      e.target.checked
                    )
                  }
                />
              }
              label="Scholar"
            />
            {course.hasScholarType && (
              <Select
                value={course.scholarType}
                onChange={(e) =>
                  handleCourseChange(index, "scholarType", e.target.value)
                }
                fullWidth
              >
                {scholarTypes.map((type) => (
                  <MenuItem key={type} value={type}>
                    {type}
                  </MenuItem>
                ))}
              </Select>
            )}
            <IconButton onClick={() => handleDeleteCourse(index)}>
              <DeleteIcon />
            </IconButton>
          </Stack>
        ))}
        <Button startIcon={<AddIcon />} onClick={handleAddCourse}>
          Add Course
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

export default CourseEditDialog;
