import React, { useState, useMemo } from "react";
import {
  Typography,
  Paper,
  Box,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  CircularProgress,
  FormControlLabel,
  Checkbox,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
} from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useAuth } from "../../context/AuthContext.jsx";
import ClientRegistrationForm from "../../components/dashboard/ClientRegistrationForm.jsx";

const Courses = () => {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [newCourse, setNewCourse] = useState({
    courseName: "",
    hasScholarType: false,
    scholarType: "",
    otherScholarType: "",
  });
  const queryClient = useQueryClient();
  const { user } = useAuth();
  const uli = useMemo(() => user?.uli, [user?.uli]);

  const {
    data: registrantData,
    isLoading,
    error,
  } = useQuery({
    queryKey: ["registrant", uli],
    queryFn: () => fetch(`/api/register/uli/${uli}`).then((res) => res.json()),
    enabled: !!uli,
    staleTime: 1000 * 60 * 5,
    retry: 1,
    refetchOnWindowFocus: false,
  });

  const addCourseMutation = useMutation({
    mutationFn: (newCourse) =>
      fetch(`/api/register/${uli}/course`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newCourse),
      }).then((res) => {
        if (!res.ok) {
          throw new Error("Failed to add course");
        }
        return res.json();
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["registrant", uli] });
      handleCloseDialog();
    },
    onError: (error) => {
      console.error("Failed to add course:", error);
    },
  });

  const handleOpenDialog = () => setIsDialogOpen(true);

  const handleCloseDialog = () => {
    setIsDialogOpen(false);
    setNewCourse({
      courseName: "",
      hasScholarType: false,
      scholarType: "",
      otherScholarType: "",
    });
  };

  const handleAddCourse = () => {
    addCourseMutation.mutate({
      ...newCourse,
      registrationStatus: "Pending",
    });
  };

  const scholarTypes = ["TWSP", "PESFA", "STEP", "Others"];

  if (!uli) return <Typography>Please log in to view courses.</Typography>;
  if (isLoading) return <CircularProgress />;
  if (error)
    return <Typography color="error">Error: {error.message}</Typography>;

  const courses = registrantData?.data?.course || [];

  // If there's no data, render the registration form instead
  if (!registrantData?.data || !courses.length) {
    return <ClientRegistrationForm />;
  }

  return (
    <Box sx={{ mt: 4 }}>
      <Typography variant="h6" gutterBottom>
        Courses
      </Typography>
      {courses.map((course, index) => (
        <Paper key={index} sx={{ p: 2, mb: 2 }}>
          <Typography variant="subtitle1">{course.courseName}</Typography>
          <Typography>Status: {course.registrationStatus}</Typography>
          {course.hasScholarType && (
            <Typography>
              Scholarship: {course.scholarType}
              {course.scholarType === "Others" &&
                ` - ${course.otherScholarType}`}
            </Typography>
          )}
        </Paper>
      ))}
      <Button
        startIcon={<AddIcon />}
        onClick={handleOpenDialog}
        variant="contained"
        color="primary"
        sx={{ mt: 2 }}
      >
        Add Course
      </Button>

      <Dialog open={isDialogOpen} onClose={handleCloseDialog}>
        <DialogTitle>Add New Course</DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            margin="dense"
            label="Course Name"
            fullWidth
            value={newCourse.courseName}
            onChange={(e) =>
              setNewCourse({ ...newCourse, courseName: e.target.value })
            }
          />
          <FormControlLabel
            control={
              <Checkbox
                checked={newCourse.hasScholarType}
                onChange={(e) =>
                  setNewCourse({
                    ...newCourse,
                    hasScholarType: e.target.checked,
                  })
                }
              />
            }
            label="Apply for Scholarship"
          />
          {newCourse.hasScholarType && (
            <>
              <FormControl fullWidth sx={{ mt: 2 }}>
                <InputLabel>Scholarship Type</InputLabel>
                <Select
                  value={newCourse.scholarType}
                  label="Scholarship Type"
                  onChange={(e) =>
                    setNewCourse({ ...newCourse, scholarType: e.target.value })
                  }
                >
                  {scholarTypes.map((type) => (
                    <MenuItem key={type} value={type}>
                      {type}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
              {newCourse.scholarType === "Others" && (
                <TextField
                  margin="dense"
                  label="Specify Other Scholarship"
                  fullWidth
                  value={newCourse.otherScholarType}
                  onChange={(e) =>
                    setNewCourse({
                      ...newCourse,
                      otherScholarType: e.target.value,
                    })
                  }
                />
              )}
            </>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog}>Cancel</Button>
          <Button
            onClick={handleAddCourse}
            color="primary"
            disabled={
              addCourseMutation.isPending ||
              !newCourse.courseName ||
              (newCourse.hasScholarType && !newCourse.scholarType) ||
              (newCourse.scholarType === "Others" &&
                !newCourse.otherScholarType)
            }
          >
            {addCourseMutation.isPending ? "Adding..." : "Add"}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default Courses;
