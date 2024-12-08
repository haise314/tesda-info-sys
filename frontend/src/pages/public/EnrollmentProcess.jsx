import React from "react";
import {
  Container,
  Typography,
  Paper,
  Box,
  Divider,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
} from "@mui/material";
import CheckCircleOutlineIcon from "@mui/icons-material/CheckCircleOutline";

const TesdaProcesses = () => {
  const primaryColor = "#0038a8";

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
        <Typography
          variant="h4"
          component="h1"
          gutterBottom
          sx={{
            color: primaryColor,
            fontWeight: "bold",
            textAlign: "center",
            mb: 4,
          }}
        >
          TESDA Enrollment and Assessment Processes (2024)
        </Typography>

        {/* Enrollment Process Section */}
        <Box sx={{ mb: 4 }}>
          <Typography
            variant="h5"
            sx={{
              color: primaryColor,
              mb: 2,
              borderBottom: `2px solid ${primaryColor}`,
              pb: 1,
            }}
          >
            Enrollment Process
          </Typography>

          <Typography variant="body1" sx={{ mb: 2 }}>
            To enroll in TESDA courses, follow these general steps and
            requirements:
          </Typography>

          <List>
            <ListItem>
              <ListItemIcon>
                <CheckCircleOutlineIcon sx={{ color: primaryColor }} />
              </ListItemIcon>
              <ListItemText
                primary="Prepare Required Documents"
                secondary={
                  <>
                    <Typography
                      component="span"
                      variant="body2"
                      color="text.secondary"
                    >
                      • Photocopies of educational credentials (Diploma, TOR, or
                      Report Card for High School Graduates, ALS Certificate for
                      ALS Graduates)
                      <br />
                      • Birth certificate (from PSA)
                      <br />
                      • Barangay clearance and medical certificate (fitness for
                      training)
                      <br />
                      • 1x1 and passport-sized photos (specific quantities and
                      details vary by course)
                      <br />• Additional documents like NCAE results or marriage
                      certificate if applicable
                    </Typography>
                  </>
                }
              />
            </ListItem>

            <ListItem>
              <ListItemIcon>
                <CheckCircleOutlineIcon sx={{ color: primaryColor }} />
              </ListItemIcon>
              <ListItemText
                primary="Submit Documents"
                secondary="Visit the nearest TESDA center or accredited training institution with the completed requirements. Some centers may require a pre-enrollment assessment."
              />
            </ListItem>

            <ListItem>
              <ListItemIcon>
                <CheckCircleOutlineIcon sx={{ color: primaryColor }} />
              </ListItemIcon>
              <ListItemText
                primary="Complete Forms"
                secondary="Fill out the enrollment application form provided by TESDA."
              />
            </ListItem>

            <ListItem>
              <ListItemIcon>
                <CheckCircleOutlineIcon sx={{ color: primaryColor }} />
              </ListItemIcon>
              <ListItemText
                primary="Verification"
                secondary="TESDA staff will verify your submitted documents before confirming enrollment."
              />
            </ListItem>
          </List>
        </Box>

        <Divider sx={{ my: 3, backgroundColor: primaryColor }} />

        {/* Assessment Application Process Section */}
        <Box>
          <Typography
            variant="h5"
            sx={{
              color: primaryColor,
              mb: 2,
              borderBottom: `2px solid ${primaryColor}`,
              pb: 1,
            }}
          >
            Assessment Application Process
          </Typography>

          <Typography variant="body1" sx={{ mb: 2 }}>
            To apply for TESDA's National Certificate (NC) assessment:
          </Typography>

          <List>
            <ListItem>
              <ListItemIcon>
                <CheckCircleOutlineIcon sx={{ color: primaryColor }} />
              </ListItemIcon>
              <ListItemText
                primary="Gather Requirements"
                secondary={
                  <>
                    <Typography
                      component="span"
                      variant="body2"
                      color="text.secondary"
                    >
                      • Accomplished TESDA Application Form (TESDA-OP-CO-05-F26)
                      <br />
                      • Photocopy of Birth Certificate (PSA-issued)
                      <br />• Two passport-sized photos (white background,
                      collared shirt, no name tag)
                    </Typography>
                  </>
                }
              />
            </ListItem>

            <ListItem>
              <ListItemIcon>
                <CheckCircleOutlineIcon sx={{ color: primaryColor }} />
              </ListItemIcon>
              <ListItemText
                primary="Visit a TESDA Assessment Center"
                secondary="Submit your application and schedule an assessment."
              />
            </ListItem>

            <ListItem>
              <ListItemIcon>
                <CheckCircleOutlineIcon sx={{ color: primaryColor }} />
              </ListItemIcon>
              <ListItemText
                primary="Pay the Assessment Fee"
                secondary="Fees vary by program. Some scholarship programs may waive the fee."
              />
            </ListItem>

            <ListItem>
              <ListItemIcon>
                <CheckCircleOutlineIcon sx={{ color: primaryColor }} />
              </ListItemIcon>
              <ListItemText
                primary="Attend the Assessment"
                secondary="Once scheduled, attend the evaluation and demonstrate your skills to the assessors. Successful candidates will be awarded a National Certificate (NC)."
              />
            </ListItem>
          </List>
        </Box>
      </Paper>
    </Container>
  );
};

export default TesdaProcesses;
