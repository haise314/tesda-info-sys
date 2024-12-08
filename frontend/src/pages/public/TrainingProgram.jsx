import React from "react";
import {
  Container,
  Typography,
  Paper,
  Box,
  Divider,
  Alert,
  CircularProgress,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
} from "@mui/material";
import CheckCircleOutlineIcon from "@mui/icons-material/CheckCircleOutline";
import TrainingProgramList from "./components/TrainingProgramList";
import { useTrainingPrograms } from "./components/useTrainingPrograms";

const TrainingProgram = () => {
  const primaryColor = "#0038a8";
  const { data: programs, isLoading, error } = useTrainingPrograms();

  if (isLoading) {
    return (
      <Container sx={{ display: "flex", justifyContent: "center", py: 4 }}>
        <CircularProgress sx={{ color: primaryColor }} />
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
    <Container maxWidth="md" sx={{ py: 4 }}>
      <Paper
        elevation={3}
        sx={{
          p: 4,
          borderTop: `6px solid ${primaryColor}`,
          borderRadius: 2,
        }}
      >
        <Box sx={{ textAlign: "center", mb: 4 }}>
          <Typography
            variant="h4"
            component="h1"
            gutterBottom
            sx={{
              color: primaryColor,
              fontWeight: "bold",
              textAlign: "center",
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

        <Divider sx={{ my: 3, backgroundColor: primaryColor }} />

        <Box sx={{ mt: 4 }}>
          <Typography
            variant="h5"
            sx={{
              color: primaryColor,
              mb: 2,
              borderBottom: `2px solid ${primaryColor}`,
              pb: 1,
            }}
          >
            Basic Requirements
          </Typography>

          <List>
            {[
              {
                primary: "Age Requirement",
                secondary: "At least 18 years of age",
              },
              {
                primary: "Educational Qualification",
                secondary: "At least High School Graduate",
              },
              {
                primary: "Documentation",
                secondary: "Copy of NSO Birth Certificate",
              },
              { primary: "Character", secondary: "With good moral character" },
              {
                primary: "Assessment",
                secondary: "Undergone a pre-training assessment",
              },
              {
                primary: "Communication Skills",
                secondary: "Can communicate both orally and in written form",
              },
            ].map((requirement, index) => (
              <ListItem key={index}>
                <ListItemIcon>
                  <CheckCircleOutlineIcon sx={{ color: primaryColor }} />
                </ListItemIcon>
                <ListItemText
                  primary={requirement.primary}
                  secondary={requirement.secondary}
                />
              </ListItem>
            ))}
          </List>
        </Box>

        <Divider sx={{ my: 3, backgroundColor: primaryColor }} />

        <Typography
          variant="h5"
          gutterBottom
          sx={{
            color: primaryColor,
            mb: 2,
            borderBottom: `2px solid ${primaryColor}`,
            pb: 1,
          }}
        >
          Available Training Programs
        </Typography>

        <TrainingProgramList programs={programs || []} />
      </Paper>
    </Container>
  );
};

export default TrainingProgram;
