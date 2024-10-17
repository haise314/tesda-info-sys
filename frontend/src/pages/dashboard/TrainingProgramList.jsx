import React from "react";
import {
  Container,
  Typography,
  Paper,
  Box,
  Divider,
  Alert,
  CircularProgress,
} from "@mui/material";
import TrainingProgramList from "../../components/dashboard/subcomponent/TrainingProgramList";
import { useTrainingPrograms } from "../public/components/useTrainingPrograms";

const TrainingProgram = () => {
  const { data: programs, isLoading, error } = useTrainingPrograms();

  if (isLoading) {
    return (
      <Container sx={{ display: "flex", justifyContent: "center", py: 4 }}>
        <CircularProgress />
      </Container>
    );
  }

  if (error) {
    return (
      <Container sx={{ py: 4 }}>
        <Alert severity="error">Error loading programs: {error.message}</Alert>
      </Container>
    );
  }

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Paper
        elevation={3}
        sx={{
          p: 4,
          background: "linear-gradient(to right bottom, #ffffff, #f8f9fa)",
        }}
      >
        <TrainingProgramList programs={programs || []} />
      </Paper>
    </Container>
  );
};

export default TrainingProgram;
