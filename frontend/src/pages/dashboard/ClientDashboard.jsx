import React, { useState, useMemo } from "react";
import { useAuth } from "../../context/AuthContext";
import { useQueries } from "@tanstack/react-query";
import axios from "axios";
import {
  Container,
  Typography,
  Grid,
  Paper,
  Tabs,
  Tab,
  CircularProgress,
  Box,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
} from "@mui/material";
import ProfileImage from "../../components/dashboard/ProfileImage";
import TabPanel from "./TabPanel";

const fetchData = async (url) => {
  const { data } = await axios.get(url);
  return data;
};

const ClientDashboard = () => {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState(0);
  const [openCourseDialog, setOpenCourseDialog] = useState(false);
  const [openAssessmentDialog, setOpenAssessmentDialog] = useState(false);
  const [newCourse, setNewCourse] = useState({
    courseName: "",
    registrationStatus: "Pending",
  });
  const [newAssessment, setNewAssessment] = useState({
    assessmentTitle: "",
    assessmentType: "",
    applicationStatus: "For Approval",
  });

  const uli = useMemo(() => user?.uli, [user?.uli]);

  const queries = useQueries({
    queries: [
      {
        queryKey: ["applicant", uli],
        queryFn: () => fetchData(`/api/applicants/uli/${uli}`),
        enabled: !!uli,
        staleTime: 1000 * 60 * 5,
        retry: 1,
        refetchOnWindowFocus: false,
      },
      {
        queryKey: ["registrant", uli],
        queryFn: () => fetchData(`/api/register/uli/${uli}`),
        enabled: !!uli,
        staleTime: 1000 * 60 * 5,
        retry: 1,
        refetchOnWindowFocus: false,
      },
    ],
  });

  const applicantQuery = queries[0];
  const registrantQuery = queries[1];

  const handleAddCourse = async () => {
    try {
      await axios.post(
        `/api/register/${registrantQuery.data.data._id}/courses`,
        newCourse
      );
      setOpenCourseDialog(false);
      registrantQuery.refetch();
    } catch (error) {
      console.error("Error adding course:", error);
    }
  };

  const handleAddAssessment = async () => {
    try {
      await axios.post(
        `/api/applicants/${applicantQuery.data.data._id}/assessments`,
        newAssessment
      );
      setOpenAssessmentDialog(false);
      applicantQuery.refetch();
    } catch (error) {
      console.error("Error adding assessment:", error);
    }
  };

  const isLoading = queries.some((query) => query.isLoading);
  if (isLoading) {
    return (
      <Container
        sx={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          height: "100vh",
        }}
      >
        <CircularProgress />
      </Container>
    );
  }

  return (
    <Container sx={{ padding: 4 }}>
      <Grid container spacing={3}>
        <Grid
          item
          xs={12}
          display="flex"
          justifyContent="center"
          alignItems="center"
        >
          <Box display="flex" flexDirection="column" alignItems="center">
            <ProfileImage uli={uli} />
            <Typography variant="h4" gutterBottom sx={{ mt: 2 }}>
              {uli || "User Name"}
            </Typography>
          </Box>
        </Grid>

        <Grid item xs={12}>
          <Paper sx={{ width: "100%", marginTop: 2 }}>
            <Tabs
              value={activeTab}
              onChange={(e, value) => setActiveTab(value)}
              centered
            >
              <Tab label="Courses" />
              <Tab label="Assessments" />
            </Tabs>

            <TabPanel value={activeTab} index={0}>
              <Box sx={{ mb: 2 }}>
                <Button
                  variant="contained"
                  onClick={() => setOpenCourseDialog(true)}
                >
                  Add Course
                </Button>
              </Box>
              {registrantQuery.data?.data?.course?.length > 0 ? (
                registrantQuery.data.data.course.map((course, index) => (
                  <Paper key={index} sx={{ p: 2, mb: 2 }}>
                    <Typography variant="h6">{course.courseName}</Typography>
                    <Typography>Status: {course.registrationStatus}</Typography>
                  </Paper>
                ))
              ) : (
                <Typography>No courses available.</Typography>
              )}
            </TabPanel>

            <TabPanel value={activeTab} index={1}>
              <Box sx={{ mb: 2 }}>
                <Button
                  variant="contained"
                  onClick={() => setOpenAssessmentDialog(true)}
                >
                  Add Assessment
                </Button>
              </Box>
              {applicantQuery.data?.data?.assessments?.length > 0 ? (
                applicantQuery.data.data.assessments.map(
                  (assessment, index) => (
                    <Paper key={index} sx={{ p: 2, mb: 2 }}>
                      <Typography variant="h6">
                        {assessment.assessmentTitle}
                      </Typography>
                      <Typography>Type: {assessment.assessmentType}</Typography>
                      <Typography>
                        Status: {assessment.applicationStatus}
                      </Typography>
                    </Paper>
                  )
                )
              ) : (
                <Typography>No assessments available.</Typography>
              )}
            </TabPanel>
          </Paper>
        </Grid>
      </Grid>

      {/* Add Course Dialog */}
      <Dialog
        open={openCourseDialog}
        onClose={() => setOpenCourseDialog(false)}
      >
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
          <FormControl fullWidth margin="dense">
            <InputLabel>Registration Status</InputLabel>
            <Select
              value={newCourse.registrationStatus}
              onChange={(e) =>
                setNewCourse({
                  ...newCourse,
                  registrationStatus: e.target.value,
                })
              }
            >
              <MenuItem value="Pending">Pending</MenuItem>
              <MenuItem value="Approved">Approved</MenuItem>
              <MenuItem value="Rejected">Rejected</MenuItem>
            </Select>
          </FormControl>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenCourseDialog(false)}>Cancel</Button>
          <Button onClick={handleAddCourse}>Add</Button>
        </DialogActions>
      </Dialog>

      {/* Add Assessment Dialog */}
      <Dialog
        open={openAssessmentDialog}
        onClose={() => setOpenAssessmentDialog(false)}
      >
        <DialogTitle>Add New Assessment</DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            margin="dense"
            label="Assessment Title"
            fullWidth
            value={newAssessment.assessmentTitle}
            onChange={(e) =>
              setNewAssessment({
                ...newAssessment,
                assessmentTitle: e.target.value,
              })
            }
          />
          <FormControl fullWidth margin="dense">
            <InputLabel>Assessment Type</InputLabel>
            <Select
              value={newAssessment.assessmentType}
              onChange={(e) =>
                setNewAssessment({
                  ...newAssessment,
                  assessmentType: e.target.value,
                })
              }
            >
              <MenuItem value="Written">Written</MenuItem>
              <MenuItem value="Practical">Practical</MenuItem>
              <MenuItem value="Interview">Interview</MenuItem>
            </Select>
          </FormControl>
          <FormControl fullWidth margin="dense">
            <InputLabel>Application Status</InputLabel>
            <Select
              value={newAssessment.applicationStatus}
              onChange={(e) =>
                setNewAssessment({
                  ...newAssessment,
                  applicationStatus: e.target.value,
                })
              }
            >
              <MenuItem value="For Approval">For Approval</MenuItem>
              <MenuItem value="Approved">Approved</MenuItem>
              <MenuItem value="Rejected">Rejected</MenuItem>
            </Select>
          </FormControl>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenAssessmentDialog(false)}>Cancel</Button>
          <Button onClick={handleAddAssessment}>Add</Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
};

export default ClientDashboard;
