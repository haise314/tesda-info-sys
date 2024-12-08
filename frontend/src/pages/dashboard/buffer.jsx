import React from "react";
import {
  Container,
  Typography,
  Paper,
  Box,
  Accordion,
  AccordionSummary,
  AccordionDetails,
} from "@mui/material";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";

const TesdaRequirements = () => {
  const primaryColor = "#0038a8";

  const requirementsData = {
    enrollment: [
      "Photocopy of Diploma or Report Card (High School Graduates)",
      "Photocopy of ALS Certification (ALS Graduates)",
      "Photocopy of Diploma or Transcript of Records (College Graduates)",
      "Photocopy of Birth Certificate",
      "Photocopy of Marriage Certificate (if applicable)",
      "Barangay Clearance",
      "Medical Certificate (Fit to Training)",
      "6 pcs 1x1 size picture",
      "2 pcs passport-size picture",
      "Photocopy of NCAE Result (if available)",
    ],
    assessment: [
      "Application Form (TESDA-OP-CO-05-F26)",
      "2 pcs passport-size picture (white background, with collar, photo studio shot/printed, without name tag)",
      "Photocopy of Birth Certificate",
    ],
  };

  return (
    <Container maxWidth="md" sx={{ py: 4 }}>
      <Paper
        elevation={3}
        sx={{
          p: 3,
          borderTop: `5px solid ${primaryColor}`,
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
            mb: 3,
          }}
        >
          TESDA Requirements
        </Typography>

        <Box sx={{ mb: 3 }}>
          <Accordion>
            <AccordionSummary
              expandIcon={<ExpandMoreIcon />}
              sx={{
                backgroundColor: `${primaryColor}10`,
                "&:hover": { backgroundColor: `${primaryColor}20` },
              }}
            >
              <Typography variant="h6" sx={{ color: primaryColor }}>
                Enrollment Requirements
              </Typography>
            </AccordionSummary>
            <AccordionDetails>
              {requirementsData.enrollment.map((req, index) => (
                <Typography
                  key={index}
                  variant="body1"
                  sx={{
                    mb: 1,
                    pl: 2,
                    borderLeft: `3px solid ${primaryColor}`,
                  }}
                >
                  • {req}
                </Typography>
              ))}
            </AccordionDetails>
          </Accordion>
        </Box>

        <Box>
          <Accordion>
            <AccordionSummary
              expandIcon={<ExpandMoreIcon />}
              sx={{
                backgroundColor: `${primaryColor}10`,
                "&:hover": { backgroundColor: `${primaryColor}20` },
              }}
            >
              <Typography variant="h6" sx={{ color: primaryColor }}>
                Assessment Application Requirements
              </Typography>
            </AccordionSummary>
            <AccordionDetails>
              {requirementsData.assessment.map((req, index) => (
                <Typography
                  key={index}
                  variant="body1"
                  sx={{
                    mb: 1,
                    pl: 2,
                    borderLeft: `3px solid ${primaryColor}`,
                  }}
                >
                  • {req}
                </Typography>
              ))}
            </AccordionDetails>
          </Accordion>
        </Box>
      </Paper>
    </Container>
  );
};

export default TesdaRequirements;
