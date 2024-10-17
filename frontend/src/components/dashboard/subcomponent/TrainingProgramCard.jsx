import React from "react";
import {
  Card,
  CardContent,
  Typography,
  Chip,
  Box,
  Grid,
  IconButton,
  Tooltip,
} from "@mui/material";
import {
  CalendarToday,
  AccessTime,
  Person,
  LocationOn,
  Edit,
  Delete,
} from "@mui/icons-material";

const TrainingProgramCard = ({ program }) => {
  return (
    <Card
      sx={{
        width: "100%",
        transition: "transform 0.2s, box-shadow 0.2s",
        "&:hover": {
          transform: "translateY(-2px)",
          boxShadow: 3,
        },
      }}
    >
      <CardContent>
        <Grid container spacing={2}>
          <Grid item xs={12} md={8}>
            <Box
              sx={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "flex-start",
              }}
            >
              <Typography variant="h6" component="h2" gutterBottom>
                {program.name}
              </Typography>
              {/* <Box>
                <Tooltip title="Edit Program">
                  <IconButton size="small" sx={{ mr: 1 }}>
                    <Edit fontSize="small" />
                  </IconButton>
                </Tooltip>
                <Tooltip title="Delete Program">
                  <IconButton size="small" color="error">
                    <Delete fontSize="small" />
                  </IconButton>
                </Tooltip>
              </Box> */}
            </Box>

            <Typography variant="body2" color="text.secondary" paragraph>
              {program.description}
            </Typography>

            <Box sx={{ display: "flex", gap: 1, flexWrap: "wrap", mb: 2 }}>
              <Chip
                icon={<AccessTime sx={{ fontSize: "0.9rem" }} />}
                label={`${program.duration} Hours`}
                size="small"
                color="primary"
                variant="outlined"
              />
              <Chip
                icon={<Person sx={{ fontSize: "0.9rem" }} />}
                label={program.trainer}
                size="small"
                color="secondary"
                variant="outlined"
              />
              {program.location && (
                <Chip
                  icon={<LocationOn sx={{ fontSize: "0.9rem" }} />}
                  label={program.location}
                  size="small"
                  color="info"
                  variant="outlined"
                />
              )}
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
                size="small"
              />
              {program.scholarshipAvailable && (
                <Chip
                  label="Scholarship Available"
                  color="secondary"
                  size="small"
                />
              )}
              {program.startDate && program.endDate && (
                <Box
                  sx={{ display: "flex", alignItems: "center", gap: 1, mt: 1 }}
                >
                  <CalendarToday sx={{ fontSize: "0.9rem" }} color="action" />
                  <Typography variant="body2" color="text.secondary">
                    {new Date(program.startDate).toLocaleDateString()} -
                    {new Date(program.endDate).toLocaleDateString()}
                  </Typography>
                </Box>
              )}
            </Box>
          </Grid>
        </Grid>
      </CardContent>
    </Card>
  );
};

export default TrainingProgramCard;
