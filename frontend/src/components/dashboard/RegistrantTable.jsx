import AddIcon from "@mui/icons-material/Add";
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";
import MenuBookIcon from "@mui/icons-material/MenuBook";
import {
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
  TextField,
  MenuItem,
  Alert,
  Card,
  CardContent,
  Typography,
  Box,
  IconButton,
} from "@mui/material";
import {
  DataGrid,
  GridActionsCellItem,
  GridToolbar,
  useGridApiRef,
} from "@mui/x-data-grid";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import axios from "axios";
import React, { useState, useEffect } from "react";

const columns = [
  { field: "uli", headerName: "ULI", width: 200 },
  {
    field: "courses",
    headerName: "Courses",
    width: 300,
    renderCell: (params) => (
      <Box sx={{ py: 1 }}>
        {params.value.map((course, index) => (
          <Typography key={index} variant="body2">
            {course.courseName} - {course.registrationStatus}
            {course.hasScholarType && ` (${course.scholarType})`}
          </Typography>
        ))}
      </Box>
    ),
  },
  { field: "disabilityType", headerName: "Disability Type", width: 150 },
  { field: "disabilityCause", headerName: "Disability Cause", width: 150 },
  {
    field: "createdAt",
    headerName: "Created At",
    width: 200,
    valueFormatter: (params) => new Date(params.value).toLocaleDateString(),
  },
];

const RegistrantTable = () => {
  const [rows, setRows] = useState([]);
  const [openDialog, setOpenDialog] = useState(false);
  const [openCourseDialog, setOpenCourseDialog] = useState(false);
  const [selectedRegistrant, setSelectedRegistrant] = useState(null);
  const [error, setError] = useState("");
  const [formData, setFormData] = useState({
    uli: "",
    disabilityType: "",
    disabilityCause: "",
    course: [],
  });
  const [courseData, setCourseData] = useState({
    courseName: "",
    registrationStatus: "Pending",
    hasScholarType: false,
    scholarType: "",
    otherScholarType: "",
  });

  const queryClient = useQueryClient();
  const apiRef = useGridApiRef();

  const { data: registrants, isLoading } = useQuery({
    queryKey: ["registrants"],
    queryFn: async () => {
      const response = await axios.get("/api/register");
      return response.data.data;
    },
  });

  useEffect(() => {
    if (registrants) {
      const formattedRows = registrants.map((reg) => ({
        ...reg,
        id: reg._id,
        courses: reg.course,
      }));
      setRows(formattedRows);
    }
  }, [registrants]);

  const createRegistrantMutation = useMutation({
    mutationFn: async (data) => {
      const response = await axios.post("/api/register", data);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries(["registrants"]);
      setOpenDialog(false);
      resetForm();
    },
    onError: (error) => {
      setError(error.response?.data?.message || "Failed to create registrant");
    },
  });

  const updateRegistrantMutation = useMutation({
    mutationFn: async ({ id, ...data }) => {
      const response = await axios.put(`/api/register/${id}`, data);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries(["registrants"]);
      setOpenDialog(false);
      resetForm();
    },
    onError: (error) => {
      setError(error.response?.data?.message || "Failed to update registrant");
    },
  });

  const deleteRegistrantMutation = useMutation({
    mutationFn: (id) => axios.delete(`/api/register/${id}`),
    onSuccess: () => {
      queryClient.invalidateQueries(["registrants"]);
    },
  });

  const addCourseMutation = useMutation({
    mutationFn: async ({ uli, courseData }) => {
      const response = await axios.post(
        `/api/register/${uli}/course`,
        courseData
      );
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries(["registrants"]);
      setOpenCourseDialog(false);
      setCourseData({
        courseName: "",
        registrationStatus: "Pending",
        hasScholarType: false,
        scholarType: "",
        otherScholarType: "",
      });
    },
  });

  const resetForm = () => {
    setFormData({
      uli: "",
      disabilityType: "",
      disabilityCause: "",
      course: [],
    });
    setSelectedRegistrant(null);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setError("");

    if (selectedRegistrant) {
      updateRegistrantMutation.mutate({
        id: selectedRegistrant.id,
        ...formData,
      });
    } else {
      createRegistrantMutation.mutate(formData);
    }
  };

  const handleAddCourse = (e) => {
    e.preventDefault();
    addCourseMutation.mutate({
      uli: selectedRegistrant.uli,
      courseData,
    });
  };

  const handleEdit = (registrant) => {
    setSelectedRegistrant(registrant);
    setFormData({
      uli: registrant.uli,
      disabilityType: registrant.disabilityType,
      disabilityCause: registrant.disabilityCause,
      course: registrant.courses,
    });
    setOpenDialog(true);
  };

  const handleDelete = (id) => {
    if (window.confirm("Are you sure you want to delete this registrant?")) {
      deleteRegistrantMutation.mutate(id);
    }
  };

  const handleAddCourseClick = (registrant) => {
    setSelectedRegistrant(registrant);
    setOpenCourseDialog(true);
  };

  const actionColumn = {
    field: "actions",
    headerName: "Actions",
    width: 150,
    renderCell: (params) => (
      <Box sx={{ display: "flex", gap: 1 }}>
        <IconButton size="small" onClick={() => handleEdit(params.row)}>
          <EditIcon />
        </IconButton>
        <IconButton
          size="small"
          onClick={() => handleAddCourseClick(params.row)}
        >
          <MenuBookIcon />
        </IconButton>
        <IconButton size="small" onClick={() => handleDelete(params.row.id)}>
          <DeleteIcon />
        </IconButton>
      </Box>
    ),
  };

  if (isLoading) {
    return (
      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          height: "100vh",
        }}
      >
        <Typography>Loading Registrant Data...</Typography>
      </Box>
    );
  }

  return (
    <Box sx={{ p: 4 }}>
      <Button
        variant="contained"
        startIcon={<AddIcon />}
        onClick={() => setOpenDialog(true)}
        sx={{ mb: 2 }}
      >
        Add Registrant
      </Button>

      <Card>
        <CardContent>
          <Typography variant="h6" sx={{ mb: 2 }}>
            Registrants
          </Typography>
          <DataGrid
            apiRef={apiRef}
            rows={rows}
            columns={[...columns, actionColumn]}
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
              pagination: { paginationModel: { pageSize: 10 } },
            }}
            pageSizeOptions={[5, 10, 25, 50]}
            sx={{ height: 600 }}
          />
        </CardContent>
      </Card>

      {/* Registrant Form Dialog */}
      <Dialog open={openDialog} onClose={() => setOpenDialog(false)}>
        <DialogTitle>
          {selectedRegistrant ? "Edit Registrant" : "Add New Registrant"}
        </DialogTitle>
        <form onSubmit={handleSubmit}>
          <DialogContent>
            {error && (
              <Alert severity="error" sx={{ mb: 2 }}>
                {error}
              </Alert>
            )}
            <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
              <TextField
                label="ULI"
                value={formData.uli}
                onChange={(e) =>
                  setFormData((prev) => ({ ...prev, uli: e.target.value }))
                }
                fullWidth
              />
              <TextField
                select
                label="Disability Type"
                value={formData.disabilityType}
                onChange={(e) =>
                  setFormData((prev) => ({
                    ...prev,
                    disabilityType: e.target.value,
                  }))
                }
                fullWidth
              >
                <MenuItem value="Physical">Physical</MenuItem>
                <MenuItem value="Mental">Mental</MenuItem>
                <MenuItem value="None">None</MenuItem>
              </TextField>
              <TextField
                select
                label="Disability Cause"
                value={formData.disabilityCause}
                onChange={(e) =>
                  setFormData((prev) => ({
                    ...prev,
                    disabilityCause: e.target.value,
                  }))
                }
                fullWidth
              >
                <MenuItem value="Congenital">Congenital</MenuItem>
                <MenuItem value="Illness">Illness</MenuItem>
                <MenuItem value="Accident">Accident</MenuItem>
                <MenuItem value="None">None</MenuItem>
              </TextField>
            </Box>
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setOpenDialog(false)}>Cancel</Button>
            <Button type="submit" variant="contained">
              {selectedRegistrant ? "Update" : "Create"}
            </Button>
          </DialogActions>
        </form>
      </Dialog>

      {/* Add Course Dialog */}
      <Dialog
        open={openCourseDialog}
        onClose={() => setOpenCourseDialog(false)}
      >
        <DialogTitle>Add Course</DialogTitle>
        <form onSubmit={handleAddCourse}>
          <DialogContent>
            <DialogContentText sx={{ mb: 2 }}>
              Add a new course for {selectedRegistrant?.uli}
            </DialogContentText>
            <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
              <TextField
                label="Course Name"
                value={courseData.courseName}
                onChange={(e) =>
                  setCourseData((prev) => ({
                    ...prev,
                    courseName: e.target.value,
                  }))
                }
                fullWidth
              />
              <TextField
                select
                label="Registration Status"
                value={courseData.registrationStatus}
                onChange={(e) =>
                  setCourseData((prev) => ({
                    ...prev,
                    registrationStatus: e.target.value,
                  }))
                }
                fullWidth
              >
                <MenuItem value="Pending">Pending</MenuItem>
                <MenuItem value="Approved">Approved</MenuItem>
                <MenuItem value="Rejected">Rejected</MenuItem>
              </TextField>
            </Box>
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setOpenCourseDialog(false)}>Cancel</Button>
            <Button type="submit" variant="contained">
              Add Course
            </Button>
          </DialogActions>
        </form>
      </Dialog>
    </Box>
  );
};

export default RegistrantTable;
