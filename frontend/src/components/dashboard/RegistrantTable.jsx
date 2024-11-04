import React, { useState, useEffect } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import axios from "axios";
import {
  DataGrid,
  GridActionsCellItem,
  GridToolbar,
  useGridApiRef,
} from "@mui/x-data-grid";
import {
  Box,
  Button,
  CircularProgress,
  Container,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Stack,
  TextField,
  Typography,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Alert,
  Chip,
} from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";
import AddIcon from "@mui/icons-material/Add";
import { registrantColumns } from "../utils/column/registrant.column.jsx";

// Form Fields Component for Course
const CourseFormFields = ({
  course,
  index,
  handleCourseChange,
  removeCourse,
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
        />
        <FormControl fullWidth>
          <InputLabel>Registration Status</InputLabel>
          <Select
            value={course.registrationStatus}
            label="Registration Status"
            onChange={(e) =>
              handleCourseChange(index, "registrationStatus", e.target.value)
            }
          >
            <MenuItem value="Pending">Pending</MenuItem>
            <MenuItem value="Approved">Approved</MenuItem>
            <MenuItem value="Rejected">Rejected</MenuItem>
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
              value={course.scholarType}
              label="Scholarship Type"
              onChange={(e) =>
                handleCourseChange(index, "scholarType", e.target.value)
              }
            >
              <MenuItem value="TWSP">TWSP</MenuItem>
              <MenuItem value="PESFA">PESFA</MenuItem>
              <MenuItem value="STEP">STEP</MenuItem>
              <MenuItem value="Others">Others</MenuItem>
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
          />
        )}
        <Button color="error" onClick={() => removeCourse(index)}>
          Remove Course
        </Button>
      </Stack>
    </Box>
  );
};

// Main Form Fields Component
const RegistrantFormFields = ({ formData, setFormData }) => {
  const handleCourseChange = (index, field, value) => {
    const newCourses = [...formData.course];
    newCourses[index] = { ...newCourses[index], [field]: value };
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

  return (
    <Stack spacing={2}>
      <FormControl fullWidth>
        <InputLabel>Disability Type</InputLabel>
        <Select
          value={formData.disabilityType || ""}
          label="Disability Type"
          onChange={(e) =>
            setFormData({ ...formData, disabilityType: e.target.value })
          }
        >
          <MenuItem value="">None</MenuItem>
          <MenuItem value="Visual">Visual</MenuItem>
          <MenuItem value="Hearing">Hearing</MenuItem>
          <MenuItem value="Physical">Physical</MenuItem>
          <MenuItem value="Mental">Mental</MenuItem>
        </Select>
      </FormControl>

      {formData.disabilityType && (
        <FormControl fullWidth>
          <InputLabel>Disability Cause</InputLabel>
          <Select
            value={formData.disabilityCause || ""}
            label="Disability Cause"
            onChange={(e) =>
              setFormData({ ...formData, disabilityCause: e.target.value })
            }
          >
            <MenuItem value="Congenital">Congenital</MenuItem>
            <MenuItem value="Illness">Illness</MenuItem>
            <MenuItem value="Accident">Accident</MenuItem>
          </Select>
        </FormControl>
      )}

      <Typography variant="h6" className="mt-4">
        Courses
      </Typography>

      {formData.course.map((course, index) => (
        <CourseFormFields
          key={index}
          course={course}
          index={index}
          handleCourseChange={handleCourseChange}
          removeCourse={removeCourse}
        />
      ))}

      <Button variant="outlined" onClick={addCourse}>
        Add Course
      </Button>
    </Stack>
  );
};

const RegistrantsTable = () => {
  const [rows, setRows] = useState([]);
  const [openDialog, setOpenDialog] = useState(false);
  const [formData, setFormData] = useState({
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
  });
  const [editMode, setEditMode] = useState(false);
  const [selectedRegistrant, setSelectedRegistrant] = useState(null);
  const [error, setError] = useState("");

  const queryClient = useQueryClient();
  const apiRef = useGridApiRef();

  // Fetch Registrants Query
  const { data: registrants, isLoading } = useQuery({
    queryKey: ["registrants"],
    queryFn: async () => {
      const response = await axios.get("/api/register");
      return response.data.data;
    },
  });

  useEffect(() => {
    if (registrants) {
      setRows(registrants);
    }
  }, [registrants]);

  // Create Registrant Mutation
  const createRegistrantMutation = useMutation({
    mutationFn: async (registrantData) => {
      const response = await axios.post("/api/register", registrantData);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries(["registrants"]);
      setOpenDialog(false);
      setFormData({
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
      });
    },
    onError: (error) => {
      setError(error.response?.data?.message || "Failed to create registrant");
    },
  });

  // Update Registrant Mutation
  const updateRegistrantMutation = useMutation({
    mutationFn: async ({ id, ...updateData }) => {
      const response = await axios.put(`/api/register/${id}`, updateData);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries(["registrants"]);
      setOpenDialog(false);
    },
    onError: (error) => {
      setError(error.response?.data?.message || "Failed to update registrant");
    },
  });

  // Delete Registrant Mutation
  const deleteRegistrantMutation = useMutation({
    mutationFn: (id) => axios.delete(`/api/register/${id}`),
    onSuccess: () => {
      queryClient.invalidateQueries(["registrants"]);
    },
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (editMode && selectedRegistrant) {
      updateRegistrantMutation.mutate({
        id: selectedRegistrant._id,
        ...formData,
      });
    } else {
      createRegistrantMutation.mutate(formData);
    }
  };

  const handleEditClick = (registrant) => {
    setSelectedRegistrant(registrant);
    setFormData({
      ...registrant,
    });
    setEditMode(true);
    setOpenDialog(true);
  };

  const handleDeleteClick = (id) => {
    if (window.confirm("Are you sure you want to delete this registrant?")) {
      deleteRegistrantMutation.mutate(id);
    }
  };

  const columns = [
    ...registrantColumns,
    {
      field: "actions",
      type: "actions",
      headerName: "Actions",
      width: 100,
      getActions: ({ row }) => [
        <GridActionsCellItem
          icon={<EditIcon />}
          label="Edit"
          onClick={() => handleEditClick(row)}
        />,
        <GridActionsCellItem
          icon={<DeleteIcon />}
          label="Delete"
          onClick={() => handleDeleteClick(row._id)}
        />,
      ],
    },
  ];

  if (isLoading) {
    return (
      <Container className="flex justify-center items-center h-screen">
        <Box className="text-center">
          <CircularProgress size={60} />
          <Typography variant="h6" className="mt-4">
            Loading Registrant Data...
          </Typography>
        </Box>
      </Container>
    );
  }

  return (
    <div className="p-4">
      <Stack direction="row" spacing={2} className="mb-4">
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={() => {
            setEditMode(false);
            setSelectedRegistrant(null);
            setFormData({
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
            });
            setOpenDialog(true);
          }}
        >
          Add Registrant
        </Button>
      </Stack>

      <DataGrid
        apiRef={apiRef}
        rows={rows}
        columns={columns}
        getRowId={(row) => row._id}
        slots={{
          toolbar: GridToolbar,
        }}
        slotProps={{
          toolbar: {
            showQuickFilter: true,
            quickFilterProps: { debounceMs: 500 },
          },
        }}
        initialState={{
          pagination: {
            paginationModel: { pageSize: 10 },
          },
        }}
        pageSizeOptions={[5, 10, 25, 50]}
        className="h-[600px]"
      />

      <Dialog
        open={openDialog}
        onClose={() => {
          setOpenDialog(false);
          setError("");
        }}
        maxWidth="md"
        fullWidth
      >
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
              <RegistrantFormFields
                formData={formData}
                setFormData={setFormData}
              />
            </Box>
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setOpenDialog(false)}>Cancel</Button>
            <Button type="submit" variant="contained">
              {editMode ? "Update" : "Create"}
            </Button>
          </DialogActions>
        </form>
      </Dialog>
    </div>
  );
};

export default RegistrantsTable;
