import React, { useState, useEffect } from "react";
import {
  Container,
  Typography,
  Paper,
  Box,
  Divider,
  Alert,
  CircularProgress,
  Grid,
  Card,
  CardContent,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
} from "@mui/material";
import CheckCircleOutlineIcon from "@mui/icons-material/CheckCircleOutline";
import AccessTimeIcon from "@mui/icons-material/AccessTime";

const AssessmentsPageLP = () => {
  const primaryColor = "#0038a8";
  const [assessments, setAssessments] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedAssessment, setSelectedAssessment] = useState(null);

  useEffect(() => {
    const fetchAssessments = async () => {
      try {
        const response = await fetch("/api/assessments");
        if (!response.ok) {
          throw new Error("Failed to fetch assessments");
        }
        const data = await response.json();
        setAssessments(data.filter((assessment) => assessment.isActive));
      } catch (err) {
        setError(err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchAssessments();
  }, []);

  const handleTakeAssessment = (assessment) => {
    setSelectedAssessment(assessment);
  };

  const handleCloseDialog = () => {
    setSelectedAssessment(null);
  };

  const assessmentRequirements = [
    { primary: "Application Form", secondary: "(TESDA-OP-CO-05-F26)" },
    {
      primary: "Identification Photos",
      secondary: "2 passport-size pictures (white background, with collar)",
    },
    {
      primary: "Birth Certificate",
      secondary: "Photocopy of original document",
    },
  ];

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
        <Alert severity="error">
          Error loading assessments: {error.message}
        </Alert>
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
            Available Assessments
          </Typography>
          <Typography variant="body1" color="text.secondary">
            Demonstrate your skills through professional assessments
          </Typography>
        </Box>

        <Divider sx={{ my: 3, backgroundColor: primaryColor }} />

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
            Assessment Requirements
          </Typography>
          <List>
            {assessmentRequirements.map((requirement, index) => (
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

        {assessments.length === 0 ? (
          <Alert severity="info">
            No active assessments available at the moment.
          </Alert>
        ) : (
          <Grid container spacing={3}>
            {assessments.map((assessment) => (
              <Grid item xs={12} md={6} key={assessment._id}>
                <Card
                  variant="outlined"
                  sx={{
                    height: "100%",
                    display: "flex",
                    flexDirection: "column",
                    borderColor: primaryColor,
                  }}
                >
                  <CardContent sx={{ flexGrow: 1 }}>
                    <Typography
                      variant="h6"
                      component="div"
                      sx={{
                        color: primaryColor,
                        mb: 2,
                        fontWeight: "bold",
                      }}
                    >
                      {assessment.name}
                    </Typography>
                    <Typography
                      variant="body2"
                      color="text.secondary"
                      paragraph
                    >
                      {assessment.description}
                    </Typography>
                    <Box
                      sx={{
                        display: "flex",
                        alignItems: "center",
                        mt: 1,
                      }}
                    >
                      <AccessTimeIcon
                        sx={{
                          mr: 1,
                          color: primaryColor,
                        }}
                      />
                      <Typography variant="body2">
                        Duration: {assessment.duration} hours
                      </Typography>
                    </Box>
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>
        )}
      </Paper>

      {selectedAssessment && (
        <Dialog
          open={!!selectedAssessment}
          onClose={handleCloseDialog}
          aria-labelledby="assessment-dialog-title"
          maxWidth="md"
        >
          <DialogTitle
            id="assessment-dialog-title"
            sx={{ color: primaryColor }}
          >
            {selectedAssessment.name}
          </DialogTitle>
          <DialogContent>
            <Typography variant="body1" gutterBottom>
              {selectedAssessment.description}
            </Typography>
            <Box sx={{ display: "flex", alignItems: "center", mt: 2 }}>
              <AccessTimeIcon sx={{ mr: 1, color: primaryColor }} />
              <Typography variant="body2">
                Duration: {selectedAssessment.duration} hours
              </Typography>
            </Box>

            <Box sx={{ mt: 3 }}>
              <Typography
                variant="h5"
                sx={{
                  color: primaryColor,
                  mb: 2,
                  borderBottom: `2px solid ${primaryColor}`,
                  pb: 1,
                }}
              >
                Assessment Requirements
              </Typography>
              <List>
                {assessmentRequirements.map((requirement, index) => (
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
          </DialogContent>
          <DialogActions>
            <Button onClick={handleCloseDialog} color="primary">
              Cancel
            </Button>
            <Button
              variant="contained"
              color="primary"
              onClick={() => {
                // TODO: Implement assessment start logic
                console.log("Starting assessment:", selectedAssessment);
              }}
            >
              Start Assessment
            </Button>
          </DialogActions>
        </Dialog>
      )}
    </Container>
  );
};

export default AssessmentsPageLP;
