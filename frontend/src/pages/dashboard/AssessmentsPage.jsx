import React, { useState, useEffect } from "react";
import {
  Box,
  Button,
  Card,
  CardContent,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Grid,
  TextField,
  MenuItem,
  Typography,
  List,
  ListItem,
  ListItemText,
  ListItemSecondaryAction,
  IconButton,
} from "@mui/material";
import { Delete as DeleteIcon, Add as AddIcon } from "@mui/icons-material";

const AssessmentsPage = () => {
  const [assessments, setAssessments] = useState([]);
  const [openDialog, setOpenDialog] = useState(false);
  const [newAssessment, setNewAssessment] = useState({
    name: "",
    description: "",
    type: "",
    duration: "",
  });
  const [loading, setLoading] = useState(true);

  const assessmentTypes = ["Quiz", "Exam", "Project", "Assignment"];

  useEffect(() => {
    fetchAssessments();
  }, []);

  const fetchAssessments = async () => {
    try {
      const response = await fetch("/api/assessments");
      const data = await response.json();
      setAssessments(data);
    } catch (error) {
      console.error("Error fetching assessments:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateAssessment = async () => {
    try {
      const response = await fetch("/api/assessments", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(newAssessment),
      });

      if (response.ok) {
        setOpenDialog(false);
        setNewAssessment({
          name: "",
          description: "",
          type: "",
          duration: "",
        });
        fetchAssessments();
      }
    } catch (error) {
      console.error("Error creating assessment:", error);
    }
  };

  const handleDeleteAssessment = async (id) => {
    try {
      const response = await fetch(`/api/assessments/${id}`, {
        method: "DELETE",
      });

      if (response.ok) {
        fetchAssessments();
      }
    } catch (error) {
      console.error("Error deleting assessment:", error);
    }
  };

  return (
    <Box p={3}>
      <Grid container spacing={3}>
        <Grid item xs={12}>
          <Box
            display="flex"
            justifyContent="space-between"
            alignItems="center"
            mb={3}
          >
            <Typography variant="h4">Assessments Dashboard</Typography>
            <Button
              variant="contained"
              color="primary"
              startIcon={<AddIcon />}
              onClick={() => setOpenDialog(true)}
            >
              Add Assessment
            </Button>
          </Box>
        </Grid>

        <Grid item xs={12}>
          <Card>
            <CardContent>
              <List>
                {assessments.map((assessment) => (
                  <ListItem key={assessment._id} divider>
                    <ListItemText
                      primary={assessment.name}
                      secondary={
                        <>
                          <Typography
                            component="span"
                            variant="body2"
                            color="textPrimary"
                          >
                            {assessment.type}
                          </Typography>
                          {` - ${assessment.description} (${assessment.duration} hours)`}
                        </>
                      }
                    />
                    <ListItemSecondaryAction>
                      <IconButton
                        edge="end"
                        aria-label="delete"
                        onClick={() => handleDeleteAssessment(assessment._id)}
                      >
                        <DeleteIcon />
                      </IconButton>
                    </ListItemSecondaryAction>
                  </ListItem>
                ))}
              </List>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      <Dialog open={openDialog} onClose={() => setOpenDialog(false)}>
        <DialogTitle>Add New Assessment</DialogTitle>
        <DialogContent>
          <Box pt={2}>
            <Grid container spacing={2}>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Name"
                  value={newAssessment.name}
                  onChange={(e) =>
                    setNewAssessment({ ...newAssessment, name: e.target.value })
                  }
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Description"
                  value={newAssessment.description}
                  onChange={(e) =>
                    setNewAssessment({
                      ...newAssessment,
                      description: e.target.value,
                    })
                  }
                />
              </Grid>
              {/* <Grid item xs={12}>
                <TextField
                  fullWidth
                  select
                  label="Type"
                  value={newAssessment.type}
                  onChange={(e) =>
                    setNewAssessment({ ...newAssessment, type: e.target.value })
                  }
                >
                  {assessmentTypes.map((type) => (
                    <MenuItem key={type} value={type}>
                      {type}
                    </MenuItem>
                  ))}
                </TextField>
              </Grid> */}
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  type="number"
                  label="Duration (hours)"
                  value={newAssessment.duration}
                  onChange={(e) =>
                    setNewAssessment({
                      ...newAssessment,
                      duration: e.target.value,
                    })
                  }
                />
              </Grid>
            </Grid>
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenDialog(false)}>Cancel</Button>
          <Button
            onClick={handleCreateAssessment}
            color="primary"
            variant="contained"
          >
            Create
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default AssessmentsPage;
