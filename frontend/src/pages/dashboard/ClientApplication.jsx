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
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  CircularProgress,
  Alert,
} from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { assessmentTypes } from "../../components/utils/enums/applicant.enums.js";
import { useAuth } from "../../context/AuthContext.jsx";
import ClientApplicationForm from "../../components/dashboard/ClientApplicationForm.jsx";

const Assessments = () => {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [newAssessment, setNewAssessment] = useState({
    assessmentTitle: "",
    assessmentType: "",
  });
  const [error, setError] = useState("");
  const queryClient = useQueryClient();
  const { user } = useAuth();
  const uli = useMemo(() => user?.uli, [user?.uli]);

  const {
    data: applicantData,
    isLoading,
    error: queryError,
  } = useQuery({
    queryKey: ["applicant", uli],
    queryFn: () =>
      fetch(`/api/applicants/uli/${uli}`).then((res) => res.json()),
    enabled: !!uli,
    staleTime: 1000 * 60 * 5,
    retry: 1,
    refetchOnWindowFocus: false,
  });

  const addAssessmentMutation = useMutation({
    mutationFn: (newAssessment) =>
      fetch(`/api/applicants/${uli}/assessment`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newAssessment),
      }).then((res) => {
        if (!res.ok) {
          throw new Error("Failed to add assessment");
        }
        return res.json();
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["applicant", uli] });
      handleCloseDialog();
      setError("");
    },
    onError: (error) => {
      setError(error.message);
    },
  });

  const handleOpenDialog = () => {
    setIsDialogOpen(true);
    setError("");
  };

  const handleCloseDialog = () => {
    setIsDialogOpen(false);
    setNewAssessment({
      assessmentTitle: "",
      assessmentType: "",
    });
    setError("");
  };

  const handleAddAssessment = () => {
    if (!newAssessment.assessmentTitle || !newAssessment.assessmentType) {
      setError("Please fill in all required fields");
      return;
    }

    addAssessmentMutation.mutate({
      ...newAssessment,
      applicationStatus: "For Approval",
    });
  };

  if (!uli) return <Typography>Please log in to view assessments.</Typography>;
  if (isLoading) return <CircularProgress />;
  if (queryError)
    return <Typography color="error">Error: {queryError.message}</Typography>;

  const assessments = applicantData?.data?.assessments || [];

  // If there's no data, render the application form instead
  if (!applicantData?.data || !assessments.length) {
    return <ClientApplicationForm />;
  }

  return (
    <Box sx={{ mt: 4 }}>
      <Typography variant="h6" gutterBottom>
        Assessments
      </Typography>
      {assessments.map((assessment, index) => (
        <Paper key={index} sx={{ p: 2, mb: 2 }}>
          <Typography variant="subtitle1">
            {assessment.assessmentTitle}
          </Typography>
          <Typography>Type: {assessment.assessmentType}</Typography>
          <Typography
            sx={{
              color:
                assessment.applicationStatus === "Approved"
                  ? "success.main"
                  : assessment.applicationStatus === "Rejected"
                  ? "error.main"
                  : "text.secondary",
            }}
          >
            Status: {assessment.applicationStatus}
          </Typography>
        </Paper>
      ))}
      <Button
        startIcon={<AddIcon />}
        onClick={handleOpenDialog}
        variant="contained"
        color="primary"
        sx={{ mt: 2 }}
      >
        Add Assessment
      </Button>

      <Dialog
        open={isDialogOpen}
        onClose={handleCloseDialog}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle>Add New Assessment</DialogTitle>
        <DialogContent>
          {error && (
            <Alert severity="error" sx={{ mb: 2 }}>
              {error}
            </Alert>
          )}
          <TextField
            autoFocus
            margin="dense"
            label="Assessment Title"
            fullWidth
            required
            value={newAssessment.assessmentTitle}
            onChange={(e) =>
              setNewAssessment({
                ...newAssessment,
                assessmentTitle: e.target.value,
              })
            }
          />
          <FormControl fullWidth sx={{ mt: 2 }} required>
            <InputLabel>Assessment Type</InputLabel>
            <Select
              value={newAssessment.assessmentType}
              onChange={(e) =>
                setNewAssessment({
                  ...newAssessment,
                  assessmentType: e.target.value,
                })
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
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog}>Cancel</Button>
          <Button
            onClick={handleAddAssessment}
            color="primary"
            disabled={
              addAssessmentMutation.isPending ||
              !newAssessment.assessmentTitle ||
              !newAssessment.assessmentType
            }
          >
            {addAssessmentMutation.isPending ? "Adding..." : "Add"}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default Assessments;
