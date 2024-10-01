import React from "react";
import {
  Container,
  Typography,
  Paper,
  Box,
  Grid,
  List,
  ListItem,
  ListItemText,
  Divider,
} from "@mui/material";

const TrainingProgram = () => {
  const courses = [
    {
      title: "Domestic Work NC II",
      duration: "811 Hours (Including 80 Hours SIL)",
      trainer: "Trini Gay N. Castillo",
    },
    {
      title: "Community-Based Trainers Methodology Course",
      duration: "48 hours",
      trainer: "Eugene I. Peñaranda / Jonathan A Alvior",
    },
    {
      title: "Barangay Health Services NC II",
      duration: "463 hours",
      trainer: "Maria Fe D. Dilag",
    },
    {
      title: "Facilitate eLearning Sessions",
      duration: "40 hours",
      trainer: "Rommel A. Perona / Jeac D. Caguineman",
    },
    {
      title: "Organic Agriculture Production NC II",
      duration: "232 Hours",
      trainer: "Christopher D. Domulot",
    },
    {
      title: "Contact Tracing Level II",
      duration: "120 Hours",
      trainer: "Nino B. Garcia / Shaira M. Fontecha / Charles Bulayungan",
    },
    {
      title: "Produce Organic Concoctions and Extracts",
      duration: "102 Hours",
      trainer: "Christopher D. Domulot / Mary Dianne Dumlao",
    },
    {
      title: "Process Food by Fermentation and Pickling",
      duration: "120 Hours",
      trainer: "Lucille E. Paglingayen / Novelia Camba",
    },
    {
      title: "PV Systems Installation NC II",
      duration: "284 Hours",
      trainer: "Rommel A. Perona",
    },
    {
      title: "Trainers Methodology Level I",
      duration: "264 hours",
      trainer: "Eugene I. Peñaranda / Jonathan A. Alvior / Teodoro G. Gea",
    },
    {
      title: "Driving NC II",
      duration: "118 Hours",
      trainer: "Nelson M. Dela Cruz / Edmark Tomanan",
    },
    {
      title: "Solar Powered Irrigation and Maintenance",
      duration: "80 Hours",
      trainer: "Rommel A. Perona, Jeac Caguineman",
    },
    {
      title: "Shielded Metal Arc Welding (SMAW) NC II",
      duration: "304 Hours",
      trainer: "Rommell M. Florita / Mary Ann E. De Guzman",
    },
    {
      title: "Electronics Products Assembly and Servicing NC II",
      duration: "260 hours",
      trainer: "Teodoro G. Gea / Gilbert M. Velano",
    },
    {
      title: "Shielded Metal Arc Welding (SMAW) NC I",
      duration: "268 hours",
      trainer: "Rommell M. Florita / Mary Ann E. De Guzman",
    },
    {
      title: "Electrical Installation and Maintenance NC III",
      duration: "160 hours",
      trainer: "Rommel A. Perona",
    },
    {
      title: "Electrical Installation and Maintenance NC II",
      duration: "196 hours",
      trainer: "Rommel A. Perona / Jeac D. Caguineman",
    },
  ];

  return (
    <Container sx={{ flexGrow: 1, mt: 4 }}>
      <Paper elevation={3} sx={{ p: 4 }}>
        <Typography variant="h4" align="center" gutterBottom>
          Provincial Training Center – Iba
        </Typography>
        <Typography variant="subtitle1" align="center" gutterBottom>
          Accredited by TESDA
        </Typography>
        <Typography variant="body1" align="center">
          Address: Palanginan, Iba, Zambales, Philippines
        </Typography>
        <Typography variant="body1" align="center" gutterBottom>
          Telephone Number: (047) 811-1338 / 0919-817-2078
        </Typography>

        <Divider sx={{ my: 3 }} />

        <Typography variant="h5" gutterBottom>
          TESDA Approved Programs
        </Typography>
        <List>
          {courses.map((course, index) => (
            <ListItem key={index}>
              <ListItemText
                primary={course.title}
                secondary={
                  <Typography variant="body2" color="text.secondary">
                    {course.duration} - Trainer: {course.trainer}
                  </Typography>
                }
              />
            </ListItem>
          ))}
        </List>

        <Divider sx={{ my: 3 }} />

        <Typography variant="h6" gutterBottom>
          Basic Requirements for TESDA Courses:
        </Typography>
        <Box component="ul">
          <List>
            <ListItem>
              <ListItemText primary="At least 18 years of age" />
            </ListItem>
            <ListItem>
              <ListItemText primary="At least High School Graduate" />
            </ListItem>
            <ListItem>
              <ListItemText primary="Copy of NSO Birth Certificate" />
            </ListItem>
            <ListItem>
              <ListItemText primary="With good moral character" />
            </ListItem>
            <ListItem>
              <ListItemText primary="Undergone a pre-training assessment" />
            </ListItem>
            <ListItem>
              <ListItemText primary="Can communicate both orally and in written form" />
            </ListItem>
          </List>
        </Box>

        <Divider sx={{ my: 3 }} />

        <Typography variant="h6" gutterBottom>
          Training Fees and Schedule
        </Typography>
        <Typography variant="body1">
          The cost of training and tuition fees may vary depending upon the
          specific course of interest and the school offering the training.
          Training centers also may have slightly different syllabus to teach to
          students in a class.
        </Typography>
        <Typography variant="body1" gutterBottom>
          For inquiries, tuition fees, enrollment procedures, class schedule and
          other concerns, it would be better to visit their school/training
          center and inquire for other documents they may need.
        </Typography>

        <Divider sx={{ my: 3 }} />

        <Typography variant="h6" gutterBottom>
          Location and Contact Information
        </Typography>
        <Typography variant="body1">
          For further information, please contact the school directly at
          telephone number (047) 811-1338 / 0919-817-2078. You can also visit
          Provincial Training Center – Zambales. The assessment center is
          located at Palanginan, Iba, Zambales, Philippines.
        </Typography>
      </Paper>
    </Container>
  );
};

export default TrainingProgram;
