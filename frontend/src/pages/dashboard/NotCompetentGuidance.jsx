import React from "react";
import {
  Box,
  Typography,
  Paper,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Link,
  Alert,
} from "@mui/material";
import FeedbackIcon from "@mui/icons-material/Feedback";
import ReplayIcon from "@mui/icons-material/Replay";
import SchoolIcon from "@mui/icons-material/School";
import ContactSupportIcon from "@mui/icons-material/ContactSupport";
import SentimentDissatisfiedIcon from "@mui/icons-material/SentimentDissatisfied";

const NotCompetentGuidance = ({ assessment }) => {
  return (
    <Paper
      elevation={3}
      sx={{
        p: 3,
        mt: 2,
        backgroundColor: "background.default",
      }}
    >
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          mb: 2,
        }}
      >
        <SentimentDissatisfiedIcon color="error" sx={{ fontSize: 40, mr: 2 }} />
        <Typography variant="h6" color="error">
          Not Competent Assessment Result
        </Typography>
      </Box>

      <Typography variant="body1" paragraph>
        Your assessment for {assessment.assessmentTitle} resulted in a "Not
        Competent" rating. This means you did not meet all the required
        competency standards.
      </Typography>

      <List>
        <ListItem>
          <ListItemIcon>
            <FeedbackIcon color="primary" />
          </ListItemIcon>
          <ListItemText
            primary="Feedback from Assessors"
            secondary="Contact your assessor directly to understand specific areas where you did not meet the required competency standards."
          />
        </ListItem>

        <ListItem>
          <ListItemIcon>
            <ReplayIcon color="secondary" />
          </ListItemIcon>
          <ListItemText
            primary="Reassessment Opportunity"
            secondary="You can schedule a reassessment by visiting PTC Iba directly or emailing ptciba@tesda.gov.ph."
          />
        </ListItem>

        <ListItem>
          <ListItemIcon>
            <SchoolIcon color="success" />
          </ListItemIcon>
          <ListItemText
            primary="Skills Review"
            secondary="Conduct a thorough review of the areas where you fell short through additional training or self-study before retaking the assessment."
          />
        </ListItem>

        <ListItem>
          <ListItemIcon>
            <ContactSupportIcon color="info" />
          </ListItemIcon>
          <ListItemText
            primary="Inquiries and Support"
            secondary="For detailed guidance on reassessment schedules and additional requirements, contact PTC directly."
          />
        </ListItem>
      </List>

      <Alert severity="info" sx={{ mt: 2 }}>
        <Typography variant="body2">
          Reassessment involves reapplying and paying the necessary assessment
          fee. You may need to wait for the next available schedule.
        </Typography>
      </Alert>

      <Typography variant="body2" sx={{ mt: 2, fontStyle: "italic" }}>
        Remember: This result is not a failure, but an opportunity for growth
        and improvement.
      </Typography>

      <Box sx={{ mt: 2 }}>
        <Typography variant="body2">
          Contact Information:
          <br />
          Email:{" "}
          <Link href="mailto:ptciba@tesda.gov.ph">ptciba@tesda.gov.ph</Link>
        </Typography>
      </Box>
    </Paper>
  );
};

export default NotCompetentGuidance;
