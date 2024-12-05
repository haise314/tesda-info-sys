import React from "react";
import {
  Box,
  Typography,
  Grid,
  Button,
  Divider,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
} from "@mui/material";

const ApplicantInformation = ({ applicantData, onGeneratePDF }) => {
  if (!applicantData) {
    return <Typography>No applicant information available</Typography>;
  }

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h6" gutterBottom>
        Applicant Details
      </Typography>
      <Divider sx={{ mb: 2 }} />

      <Grid container spacing={2}>
        <Grid item xs={12} sm={6}>
          <Typography variant="subtitle1">Training Center</Typography>
          <Typography>{applicantData.trainingCenterName}</Typography>
          <Typography>{applicantData.addressLocation}</Typography>
        </Grid>

        <Grid item xs={12}>
          <Typography variant="subtitle1">Work Experience</Typography>
          <TableContainer component={Paper}>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Company</TableCell>
                  <TableCell>Position</TableCell>
                  <TableCell>Dates</TableCell>
                  <TableCell>Salary</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {applicantData.workExperience?.map((exp, index) => (
                  <TableRow key={index}>
                    <TableCell>{exp.companyName}</TableCell>
                    <TableCell>{exp.position}</TableCell>
                    <TableCell>
                      {new Date(exp.inclusiveDates.from).toLocaleDateString()} -
                      {new Date(exp.inclusiveDates.to).toLocaleDateString()}
                    </TableCell>
                    <TableCell>{exp.monthlySalary}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </Grid>

        <Grid item xs={12}>
          <Typography variant="subtitle1">Training & Seminars</Typography>
          <TableContainer component={Paper}>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Title</TableCell>
                  <TableCell>Venue</TableCell>
                  <TableCell>Dates</TableCell>
                  <TableCell>Hours</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {applicantData.trainingSeminarAttended?.map(
                  (seminar, index) => (
                    <TableRow key={index}>
                      <TableCell>{seminar.title}</TableCell>
                      <TableCell>{seminar.venue}</TableCell>
                      <TableCell>
                        {new Date(
                          seminar.inclusiveDates.from
                        ).toLocaleDateString()}{" "}
                        -
                        {new Date(
                          seminar.inclusiveDates.to
                        ).toLocaleDateString()}
                      </TableCell>
                      <TableCell>{seminar.numberOfHours}</TableCell>
                    </TableRow>
                  )
                )}
              </TableBody>
            </Table>
          </TableContainer>
        </Grid>
      </Grid>

      <Box sx={{ mt: 3, display: "flex", justifyContent: "flex-end" }}>
        <Button variant="contained" color="primary" onClick={onGeneratePDF}>
          Generate Applicant Info PDF
        </Button>
      </Box>
    </Box>
  );
};

export default ApplicantInformation;
