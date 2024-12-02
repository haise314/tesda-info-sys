import React, { useState, useEffect } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Box,
  Stack,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  TextField,
  Alert,
} from "@mui/material";
import {
  disabilityTypes,
  disabilityCauses,
  scholarTypes,
  registrationStatuses,
} from "../../utils/enums/registrant.enums";
import { useAuth } from "../../../context/AuthContext";

const CourseFormFields = ({
  course,
  index,
  handleCourseChange,
  removeCourse,
  courseList,
}) => {
  return (
    <Box className="p-4 border rounded mb-4">
      <Stack spacing={2}>
        <TextField
          fullWidth
          label="Course Name"
          value={course.courseName}
          onChange={(e) =>
            handleCourseChange(index, "courseName", e.target.value)
          }
          required
          error={!course.courseName}
          helperText={!course.courseName && "Course name is required"}
        />
        <FormControl fullWidth>
          <InputLabel>Registration Status</InputLabel>
          <Select
            value={course.registrationStatus || "Pending"}
            label="Registration Status"
            onChange={(e) =>
              handleCourseChange(index, "registrationStatus", e.target.value)
            }
            required
          >
            {registrationStatuses.map((status) => (
              <MenuItem key={status} value={status}>
                {status}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
        <FormControl fullWidth>
          <InputLabel>Has Scholarship</InputLabel>
          <Select
            value={course.hasScholarType}
            label="Has Scholarship"
            onChange={(e) =>
              handleCourseChange(index, "hasScholarType", e.target.value)
            }
          >
            <MenuItem value={true}>Yes</MenuItem>
            <MenuItem value={false}>No</MenuItem>
          </Select>
        </FormControl>
        {course.hasScholarType && (
          <FormControl fullWidth>
            <InputLabel>Scholarship Type</InputLabel>
            <Select
              value={course.scholarType || ""}
              label="Scholarship Type"
              onChange={(e) =>
                handleCourseChange(index, "scholarType", e.target.value)
              }
              required={course.hasScholarType}
              error={course.hasScholarType && !course.scholarType}
            >
              {scholarTypes.map((type) => (
                <MenuItem key={type} value={type}>
                  {type}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        )}
        {course.scholarType === "Others" && (
          <TextField
            fullWidth
            label="Other Scholarship Type"
            value={course.otherScholarType || ""}
            onChange={(e) =>
              handleCourseChange(index, "otherScholarType", e.target.value)
            }
            required
            error={!course.otherScholarType}
            helperText={
              !course.otherScholarType && "Please specify the scholarship type"
            }
          />
        )}
        {courseList.length > 1 && (
          <Button color="error" onClick={() => removeCourse(index)}>
            Remove Course
          </Button>
        )}
      </Stack>
    </Box>
  );
};

const RegistrantEditModal = ({
  open,
  onClose,
  onSubmit,
  initialData,
  editMode,
  error = null,
}) => {
  const { user } = useAuth();
  const [formData, setFormData] = useState({
    uli: user?.uli || "",
    disabilityType: "",
    disabilityCause: "",
    course: [
      {
        courseName: "",
        registrationStatus: "Pending",
        hasScholarType: false,
        scholarType: "",
        otherScholarType: "",
      },
    ],
    updatedBy: user?.uli || "",
  });

  const [formErrors, setFormErrors] = useState({});

  useEffect(() => {
    if (initialData) {
      setFormData({
        ...initialData,
        updatedBy: user?.uli || "",
      });
    } else {
      // Reset form when not in edit mode
      setFormData({
        uli: user?.uli || "",
        disabilityType: "",
        disabilityCause: "",
        course: [
          {
            courseName: "",
            registrationStatus: "Pending",
            hasScholarType: false,
            scholarType: "",
            otherScholarType: "",
          },
        ],
        updatedBy: user?.uli || "",
      });
    }
  }, [initialData, user, open]);

  const handleCourseChange = (index, field, value) => {
    const newCourses = [...formData.course];
    newCourses[index] = { ...newCourses[index], [field]: value };

    // Reset otherScholarType if scholarType is not "Others"
    if (field === "scholarType" && value !== "Others") {
      newCourses[index].otherScholarType = "";
    }

    setFormData({ ...formData, course: newCourses });
  };

  const addCourse = () => {
    setFormData({
      ...formData,
      course: [
        ...formData.course,
        {
          courseName: "",
          registrationStatus: "Pending",
          hasScholarType: false,
          scholarType: "",
          otherScholarType: "",
        },
      ],
    });
  };

  const removeCourse = (index) => {
    const newCourses = formData.course.filter((_, i) => i !== index);
    setFormData({ ...formData, course: newCourses });
  };

  const validateForm = () => {
    const errors = {};

    // Validate courses
    formData.course.forEach((course, index) => {
      if (!course.courseName) {
        errors[`course_${index}_name`] = "Course name is required";
      }

      if (course.hasScholarType && !course.scholarType) {
        errors[`course_${index}_scholarType`] = "Scholarship type is required";
      }

      if (course.scholarType === "Others" && !course.otherScholarType) {
        errors[`course_${index}_otherScholar`] =
          "Please specify other scholarship type";
      }
    });

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (validateForm()) {
      // Cleanup: Remove otherScholarType if not applicable
      const cleanedFormData = {
        ...formData,
        course: formData.course.map((course) => ({
          ...course,
          otherScholarType:
            course.scholarType === "Others"
              ? course.otherScholarType
              : undefined,
        })),
      };

      onSubmit(cleanedFormData);
    }
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
      <form onSubmit={handleSubmit}>
        <DialogTitle>
          {editMode ? "Edit Registrant" : "Add New Registrant"}
        </DialogTitle>
        <DialogContent>
          {error && (
            <Alert severity="error" className="mb-4">
              {error}
            </Alert>
          )}
          <Box className="mt-4">
            <Stack spacing={2}>
              <FormControl fullWidth>
                <InputLabel>Disability Type</InputLabel>
                <Select
                  value={formData.disabilityType || ""}
                  label="Disability Type"
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      disabilityType: e.target.value,
                      disabilityCause: e.target.value
                        ? formData.disabilityCause
                        : "",
                    })
                  }
                >
                  <MenuItem value="">None</MenuItem>
                  {disabilityTypes.map((type) => (
                    <MenuItem key={type} value={type}>
                      {type}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>

              {formData.disabilityType && (
                <FormControl fullWidth>
                  <InputLabel>Disability Cause</InputLabel>
                  <Select
                    value={formData.disabilityCause || ""}
                    label="Disability Cause"
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        disabilityCause: e.target.value,
                      })
                    }
                    required
                  >
                    {disabilityCauses.map((cause) => (
                      <MenuItem key={cause} value={cause}>
                        {cause}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              )}

              <Box>
                <Box
                  display="flex"
                  justifyContent="space-between"
                  alignItems="center"
                  mb={2}
                >
                  <h3>Courses</h3>
                  <Button variant="outlined" onClick={addCourse}>
                    Add Course
                  </Button>
                </Box>

                {formData.course.map((course, index) => (
                  <CourseFormFields
                    key={index}
                    course={course}
                    index={index}
                    handleCourseChange={handleCourseChange}
                    removeCourse={removeCourse}
                    courseList={formData.course}
                  />
                ))}
              </Box>
            </Stack>
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={onClose}>Cancel</Button>
          <Button type="submit" variant="contained">
            {editMode ? "Update" : "Create"}
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  );
};

export default RegistrantEditModal;
