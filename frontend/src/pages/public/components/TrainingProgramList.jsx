import React, { useState } from "react";
import {
  Box,
  Typography,
  TextField,
  InputAdornment,
  MenuItem,
  Select,
  FormControl,
  InputLabel,
  Grid,
  Alert,
  CircularProgress,
} from "@mui/material";
import { Search } from "@mui/icons-material";
import TrainingProgramCard from "./TrainingProgramCard";

const TrainingProgramList = ({ programs }) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [filter, setFilter] = useState("all");

  const filteredPrograms = programs.filter((program) => {
    const matchesSearch =
      program.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      program.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesFilter =
      filter === "all" ||
      (filter === "scholarship" && program.scholarshipAvailable) ||
      (filter === "available" && program.slotsAvailable > 0);
    return matchesSearch && matchesFilter;
  });

  return (
    <Box sx={{ py: 4 }}>
      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid item xs={12} md={8}>
          <TextField
            fullWidth
            variant="outlined"
            placeholder="Search programs..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <Search />
                </InputAdornment>
              ),
            }}
          />
        </Grid>
        <Grid item xs={12} md={4}>
          <FormControl fullWidth>
            <InputLabel>Filter Programs</InputLabel>
            <Select
              value={filter}
              label="Filter Programs"
              onChange={(e) => setFilter(e.target.value)}
            >
              <MenuItem value="all">All Programs</MenuItem>
              <MenuItem value="scholarship">With Scholarship</MenuItem>
              <MenuItem value="available">Available Slots</MenuItem>
            </Select>
          </FormControl>
        </Grid>
      </Grid>

      {filteredPrograms.length === 0 ? (
        <Typography
          variant="h6"
          textAlign="center"
          color="text.secondary"
          sx={{ mt: 4 }}
        >
          No programs found matching your criteria
        </Typography>
      ) : (
        filteredPrograms.map((program) => (
          <TrainingProgramCard key={program._id} program={program} />
        ))
      )}
    </Box>
  );
};

export default TrainingProgramList;
