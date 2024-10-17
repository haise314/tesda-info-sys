import React from "react";
import { Card, CardContent, Typography, Chip, Box, Grid } from "@mui/material";
import {
  CalendarToday,
  AccessTime,
  Person,
  LocationOn,
} from "@mui/icons-material";

const TrainingProgramCard = ({ program }) => {
  return (
    <Card
      sx={{
        mb: 2,
        transition: "transform 0.2s, box-shadow 0.2s",
        "&:hover": {
          transform: "translateY(-4px)",
          boxShadow: 4,
        },
      }}
    >
      <CardContent>
        <Grid container spacing={2}>
          <Grid item xs={12} md={8}>
            <Typography variant="h6" component="h2" gutterBottom>
              {program.name}
            </Typography>
            <Typography variant="body2" color="text.secondary" paragraph>
              {program.description}
            </Typography>
            <Box sx={{ display: "flex", gap: 1, flexWrap: "wrap", mb: 2 }}>
              <Chip
                icon={<AccessTime />}
                label={`${program.duration} Hours`}
                size="small"
                color="primary"
                variant="outlined"
              />
              <Chip
                icon={<Person />}
                label={program.trainer}
                size="small"
                color="secondary"
                variant="outlined"
              />
              <Chip
                icon={<LocationOn />}
                label={program.location}
                size="small"
                color="info"
                variant="outlined"
              />
            </Box>
          </Grid>
          <Grid item xs={12} md={4}>
            <Box
              sx={{
                display: "flex",
                flexDirection: "column",
                gap: 1,
                alignItems: "flex-end",
              }}
            >
              <Chip
                label={`${program.slotsAvailable} slots available`}
                color={program.slotsAvailable > 5 ? "success" : "warning"}
              />
              {program.scholarshipAvailable && (
                <Chip label="Scholarship Available" color="secondary" />
              )}
              <Box
                sx={{ display: "flex", alignItems: "center", gap: 1, mt: 1 }}
              >
                <CalendarToday fontSize="small" color="action" />
                <Typography variant="body2" color="text.secondary">
                  {new Date(program.startDate).toLocaleDateString()} -{" "}
                  {new Date(program.endDate).toLocaleDateString()}
                </Typography>
              </Box>
            </Box>
          </Grid>
        </Grid>
      </CardContent>
    </Card>
  );
};

export default TrainingProgramCard;
