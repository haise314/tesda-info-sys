import React from "react";
import {
  Typography,
  Card,
  CardContent,
  Grid,
  Button,
  Box,
} from "@mui/material";
import { FeedbackOutlined, AssessmentOutlined } from "@mui/icons-material";
import { Link } from "react-router-dom";

const FeedbackSection = () => {
  return (
    <Grid container spacing={4}>
      <Grid item xs={12} md={6}>
        <Card sx={{ height: "100%" }}>
          <CardContent>
            <Box sx={{ mb: 2 }}>
              <FeedbackOutlined sx={{ fontSize: 40, color: "primary.main" }} />
            </Box>
            <Typography variant="h5" gutterBottom>
              Share Your Feedback
            </Typography>
            <Typography variant="body1" paragraph>
              Your opinions and suggestions are valuable to us. Help us improve
              our services by sharing your thoughts and experiences.
            </Typography>
            <Button
              component={Link}
              to="/feedback"
              variant="contained"
              color="primary"
              fullWidth
            >
              Provide Feedback
            </Button>
          </CardContent>
        </Card>
      </Grid>
      <Grid item xs={12} md={6}>
        <Card sx={{ height: "100%" }}>
          <CardContent>
            <Box sx={{ mb: 2 }}>
              <AssessmentOutlined
                sx={{ fontSize: 40, color: "primary.main" }}
              />
            </Box>
            <Typography variant="h5" gutterBottom>
              Client Satisfaction Survey
            </Typography>
            <Typography variant="body1" paragraph>
              Take our satisfaction measurement survey to help us understand how
              well we're meeting your needs and where we can improve.
            </Typography>
            <Button
              component={Link}
              to="/citizens-charter"
              variant="contained"
              color="primary"
              fullWidth
            >
              Take Survey
            </Button>
          </CardContent>
        </Card>
      </Grid>
    </Grid>
  );
};

export default FeedbackSection;
