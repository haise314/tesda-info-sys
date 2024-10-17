import React from "react";
import { Typography, Paper, Box } from "@mui/material";

const CourseAssessmentList = ({ type, data }) => {
  const items = type === "courses" ? data?.course : data?.assessments;
  const title = type === "courses" ? "Courses" : "Assessments";

  return (
    <Box sx={{ mt: 4 }}>
      <Typography variant="h6" gutterBottom>
        {title}
      </Typography>
      {items?.length > 0 ? (
        items.map((item, index) => (
          <Paper key={index} sx={{ p: 2, mb: 2 }}>
            <Typography variant="subtitle1">
              {type === "courses" ? item.courseName : item.assessmentTitle}
            </Typography>
            <Typography>
              {type === "courses"
                ? `Status: ${item.registrationStatus}`
                : `Type: ${item.assessmentType}`}
            </Typography>
            {type === "assessments" && (
              <Typography>Status: {item.applicationStatus}</Typography>
            )}
          </Paper>
        ))
      ) : (
        <Typography>No {title.toLowerCase()} available.</Typography>
      )}
    </Box>
  );
};

export default CourseAssessmentList;
