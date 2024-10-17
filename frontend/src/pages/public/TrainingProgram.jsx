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
import TrainingProgramList from "./components/TrainingProgramList";
import { useTrainingPrograms } from "./components/useTrainingPrograms";

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
        <Box sx={{ textAlign: "center", mb: 4 }}>
          <Typography
            variant="h3"
            component="h1"
            gutterBottom
            sx={{
              fontWeight: "bold",
              background: "linear-gradient(45deg, #1976d2, #9c27b0)",
              backgroundClip: "text",
              WebkitBackgroundClip: "text",
              color: "transparent",
            }}
          >
            Provincial Training Center – Iba
          </Typography>
          <Typography variant="h6" color="text.secondary" gutterBottom>
            Accredited by TESDA
          </Typography>
          <Typography variant="body1" color="text.secondary">
            Palanginan, Iba, Zambales, Philippines
          </Typography>
          <Typography variant="body1" color="text.secondary">
            Tel: (047) 811-1338 / 0919-817-2078
          </Typography>
        </Box>

        <Divider sx={{ my: 4 }} />

        <Typography variant="h4" gutterBottom sx={{ mb: 4 }}>
          Available Training Programs
        </Typography>

        <TrainingProgramList programs={programs || []} />

        <Divider sx={{ my: 4 }} />

        <Box sx={{ mt: 4 }}>
          <Typography variant="h5" gutterBottom>
            Basic Requirements
          </Typography>
          <Box
            sx={{
              backgroundColor: "#f5f5f5",
              p: 3,
              borderRadius: 2,
              boxShadow: 1,
            }}
          >
            <ul style={{ paddingLeft: "20px" }}>
              <li>At least 18 years of age</li>
              <li>At least High School Graduate</li>
              <li>Copy of NSO Birth Certificate</li>
              <li>With good moral character</li>
              <li>Undergone a pre-training assessment</li>
              <li>Can communicate both orally and in written form</li>
            </ul>
          </Box>
        </Box>
      </Paper>
    </Container>
  );
};

export default TrainingProgram;
