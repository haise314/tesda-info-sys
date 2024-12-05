import React from "react";
import {
  Box,
  Typography,
  Grid,
  Paper,
  List,
  ListItem,
  ListItemText,
  Divider,
} from "@mui/material";

const DocumentSection = ({ userData, applicantData }) => {
  const documents = [
    {
      name: "Licensure Exams",
      items:
        applicantData?.licensureExaminationPassed?.map((exam) => ({
          title: `${exam.title} (${exam.rating})`,
          date: new Date(exam.dateOfExamination).toLocaleDateString(),
        })) || [],
    },
    {
      name: "Competency Assessments",
      items:
        applicantData?.competencyAssessment?.map((assessment) => ({
          title: `${assessment.title} (${assessment.qualificationLevel})`,
          date: new Date(assessment.dateIssued).toLocaleDateString(),
        })) || [],
    },
  ];

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h6" gutterBottom>
        Documents & Certifications
      </Typography>
      <Divider sx={{ mb: 2 }} />

      <Grid container spacing={2}>
        {documents.map((docSection, index) => (
          <Grid item xs={12} md={6} key={index}>
            <Paper elevation={2} sx={{ p: 2 }}>
              <Typography variant="subtitle1">{docSection.name}</Typography>
              {docSection.items.length > 0 ? (
                <List dense>
                  {docSection.items.map((item, itemIndex) => (
                    <ListItem key={itemIndex}>
                      <ListItemText
                        primary={item.title}
                        secondary={`Issued: ${item.date}`}
                      />
                    </ListItem>
                  ))}
                </List>
              ) : (
                <Typography variant="body2" color="text.secondary">
                  No documents found
                </Typography>
              )}
            </Paper>
          </Grid>
        ))}
      </Grid>
    </Box>
  );
};

export default DocumentSection;
