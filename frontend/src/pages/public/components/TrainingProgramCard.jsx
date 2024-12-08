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
  const primaryColor = "#0038a8";

  return (
    <Card
      sx={{
        width: "100%",
        transition: "transform 0.2s, box-shadow 0.2s",
        border: `1px solid ${primaryColor}`,
        borderRadius: 2,
        "&:hover": {
          transform: "translateY(-2px)",
          boxShadow: 3,
        },
        margin: "10px 0",
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
                borderBottom: `1px solid ${primaryColor}`,
                pb: 1,
                mb: 2,
              }}
            >
              <Typography
                variant="h6"
                component="h2"
                sx={{
                  color: primaryColor,
                  fontWeight: 600,
                }}
              >
                {program.name}
              </Typography>
            </Box>

            <Typography variant="body2" color="text.secondary" paragraph>
              {program.description}
            </Typography>

            <Box sx={{ display: "flex", gap: 1, flexWrap: "wrap", mb: 2 }}>
              <Chip
                icon={<AccessTime sx={{ fontSize: "0.9rem" }} />}
                label={`${program.duration} Hours`}
                size="small"
                sx={{
                  backgroundColor: `${primaryColor}10`,
                  color: primaryColor,
                  borderColor: primaryColor,
                }}
                variant="outlined"
              />
              <Chip
                icon={<Person sx={{ fontSize: "0.9rem" }} />}
                label={program.trainer}
                size="small"
                sx={{
                  backgroundColor: `${primaryColor}10`,
                  color: primaryColor,
                  borderColor: primaryColor,
                }}
                variant="outlined"
              />
              {program.location && (
                <Chip
                  icon={<LocationOn sx={{ fontSize: "0.9rem" }} />}
                  label={program.location}
                  size="small"
                  sx={{
                    backgroundColor: `${primaryColor}10`,
                    color: primaryColor,
                    borderColor: primaryColor,
                  }}
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
                sx={{
                  backgroundColor:
                    program.slotsAvailable > 5
                      ? `${primaryColor}10`
                      : "rgba(255, 152, 0, 0.1)",
                  color:
                    program.slotsAvailable > 5
                      ? primaryColor
                      : "rgb(255, 152, 0)",
                  borderColor:
                    program.slotsAvailable > 5
                      ? primaryColor
                      : "rgb(255, 152, 0)",
                }}
                variant="outlined"
                size="small"
              />
              {program.scholarshipAvailable && (
                <Chip
                  label="Scholarship Available"
                  sx={{
                    backgroundColor: `rgba(156, 39, 176, 0.1)`,
                    color: "rgb(156, 39, 176)",
                    borderColor: "rgb(156, 39, 176)",
                  }}
                  variant="outlined"
                  size="small"
                />
              )}
              {program.startDate && program.endDate && (
                <Box
                  sx={{
                    display: "flex",
                    alignItems: "center",
                    gap: 1,
                    mt: 1,
                    color: "text.secondary",
                  }}
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
