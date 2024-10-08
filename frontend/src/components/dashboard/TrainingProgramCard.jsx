import React from "react";
import { Box, Typography, Chip, Divider } from "@mui/material";
import { SchoolOutlined, PersonOutline } from "@mui/icons-material";

const TrainingProgramListItem = ({ program }) => {
  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
        p: 2,
        mb: 2,
        borderRadius: 1,
        bgcolor: "background.paper",
        boxShadow: 1,
        "&:hover": {
          boxShadow: 3,
          transition: "box-shadow 0.3s ease-in-out",
        },
      }}
    >
      <Box sx={{ flexGrow: 1, mr: 2 }}>
        <Typography variant="h6" component="div" gutterBottom>
          {program.name}
        </Typography>
        <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
          {program.description.length > 100
            ? `${program.description.substring(0, 100)}...`
            : program.description}
        </Typography>
        <Typography variant="body2" color="text.primary">
          <strong>Duration:</strong> {program.duration} hours
        </Typography>
      </Box>
      <Divider orientation="vertical" flexItem sx={{ mr: 2 }} />
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          minWidth: 120,
        }}
      >
        <Chip
          icon={<SchoolOutlined />}
          label={
            program.scholarshipAvailable ? "Scholarship" : "No Scholarship"
          }
          color={program.scholarshipAvailable ? "success" : "default"}
          sx={{ mb: 1, width: "100%" }}
        />
        <Chip
          icon={<PersonOutline />}
          label={`${program.slotsAvailable} Slots`}
          color={program.slotsAvailable > 0 ? "primary" : "error"}
          sx={{ width: "100%" }}
        />
      </Box>
    </Box>
  );
};

export default TrainingProgramListItem;
