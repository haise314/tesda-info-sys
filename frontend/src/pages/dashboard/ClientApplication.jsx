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
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  CircularProgress,
  Alert,
} from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { assessmentTypes } from "../../components/utils/enums/applicant.enums.js";
import { useAuth } from "../../context/AuthContext.jsx";
import ClientApplicationForm from "../../components/dashboard/ClientApplicationForm.jsx";
import AssessmentSelectField from "../../components/dashboard/subcomponent/AssessmentSelectField.jsx";
import { useForm, Controller } from "react-hook-form";
import NotCompetentGuidance from "./NotCompetentGuidance.jsx";

const Assessments = () => {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [selectedNotCompetentAssessment, setSelectedNotCompetentAssessment] =
    useState(null);
  const [error, setError] = useState("");
  const queryClient = useQueryClient();
  const { user } = useAuth();
  const uli = useMemo(() => user?.uli, [user?.uli]);

  const {
    control,
    handleSubmit,
    reset,
    formState: { errors },
    watch,
  } = useForm({
    defaultValues: {
      assessmentTitle: "",
      assessmentType: "",
    },
  });

  const formValues = watch();

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
    reset();
    setError("");
  };

  const handleOpenNotCompetentModal = (assessment) => {
    setSelectedNotCompetentAssessment(assessment);
  };

  const handleCloseNotCompetentModal = () => {
    setSelectedNotCompetentAssessment(null);
  };

  const onSubmit = (data) => {
    addAssessmentMutation.mutate({
      ...data,
      applicationStatus: "For Approval",
    });
  };

  if (!uli) return <Typography>Please log in to view assessments.</Typography>;
  if (isLoading) return <CircularProgress />;
  if (queryError)
    return <Typography color="error">Error: {queryError.message}</Typography>;

  const assessments = applicantData?.data?.assessments || [];

  if (!applicantData?.data || !assessments.length) {
    return <ClientApplicationForm />;
  }

  return (
    <Box sx={{ mt: 4 }}>
      <Typography variant="h6" gutterBottom>
        Assessments
      </Typography>
      {assessments.map((assessment, index) => (
        <React.Fragment key={index}>
          <Paper sx={{ p: 2, mb: 2 }}>
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
            {assessment.applicationStatus === "Not Competent" && (
              <Button
                variant="outlined"
                color="warning"
                onClick={() => handleOpenNotCompetentModal(assessment)}
                sx={{ mt: 1 }}
              >
                View Guidance
              </Button>
            )}
          </Paper>
        </React.Fragment>
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

      {/* Add Assessment Dialog */}
      <Dialog
        open={isDialogOpen}
        onClose={handleCloseDialog}
        maxWidth="sm"
        fullWidth
      >
        <form onSubmit={handleSubmit(onSubmit)}>
          <DialogTitle>Add New Assessment</DialogTitle>
          <DialogContent>
            {error && (
              <Alert severity="error" sx={{ mb: 2 }}>
                {error}
              </Alert>
            )}
            <AssessmentSelectField
              control={control}
              index={0}
              errors={errors}
              name="assessmentTitle"
              required={true}
            />
            <FormControl fullWidth sx={{ mt: 2 }} required>
              <InputLabel>Assessment Type</InputLabel>
              <Controller
                name="assessmentType"
                control={control}
                rules={{ required: true }}
                render={({ field }) => (
                  <Select
                    {...field}
                    label="Assessment Type"
                    error={!!errors.assessmentType}
                  >
                    {assessmentTypes.map((type) => (
                      <MenuItem key={type} value={type}>
                        {type}
                      </MenuItem>
                    ))}
                  </Select>
                )}
              />
            </FormControl>
          </DialogContent>
          <DialogActions>
            <Button onClick={handleCloseDialog}>Cancel</Button>
            <Button
              type="submit"
              color="primary"
              disabled={
                addAssessmentMutation.isPending ||
                !formValues.assessmentTitle ||
                !formValues.assessmentType
              }
            >
              {addAssessmentMutation.isPending ? "Adding..." : "Add"}
            </Button>
          </DialogActions>
        </form>
      </Dialog>

      {/* Not Competent Guidance Modal */}
      <Dialog
        open={!!selectedNotCompetentAssessment}
        onClose={handleCloseNotCompetentModal}
        maxWidth="md"
        fullWidth
      >
        <DialogTitle>Not Competent Guidance</DialogTitle>
        <DialogContent>
          {selectedNotCompetentAssessment && (
            <NotCompetentGuidance
              assessment={selectedNotCompetentAssessment}
              onRequestFeedback={() => {
                console.log(
                  "Requesting feedback for",
                  selectedNotCompetentAssessment
                );
                handleCloseNotCompetentModal();
              }}
              onRequestReassessment={() => {
                console.log(
                  "Scheduling reassessment for",
                  selectedNotCompetentAssessment
                );
                handleCloseNotCompetentModal();
              }}
            />
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseNotCompetentModal} color="primary">
            Close
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default Assessments;
