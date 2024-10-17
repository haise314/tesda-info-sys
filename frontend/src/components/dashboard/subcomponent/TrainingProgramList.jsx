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
  Card,
  CardContent,
} from "@mui/material";
import { Search } from "@mui/icons-material";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import TrainingProgramCard from "./TrainingProgramCard";

const api = axios.create({
  baseURL: "/api",
});

const fetchTrainingPrograms = async () => {
  const { data } = await api.get("/programs/");
  return data;
};

const TrainingProgramList = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [filter, setFilter] = useState("all");

  const {
    data: programs,
    isLoading,
    error,
  } = useQuery({
    queryKey: ["trainingPrograms"],
    queryFn: fetchTrainingPrograms,
  });

  const filteredPrograms =
    programs?.filter((program) => {
      const matchesSearch =
        program.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        program.description?.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesFilter =
        filter === "all" ||
        (filter === "scholarship" && program.scholarshipAvailable) ||
        (filter === "available" && program.slotsAvailable > 0);
      return matchesSearch && matchesFilter;
    }) || [];

  if (isLoading) {
    return (
      <Box sx={{ display: "flex", justifyContent: "center", py: 4 }}>
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return (
      <Alert severity="error" sx={{ my: 2 }}>
        Error loading programs: {error.message}
      </Alert>
    );
  }

  return (
    <Box sx={{ p: 3 }}>
      <Card sx={{ mb: 3 }}>
        <CardContent>
          <Typography variant="h4" gutterBottom>
            Available Course/Qualifications
          </Typography>

          {/* Search and Filters */}
          <Grid container spacing={3} sx={{ mt: 1 }}>
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
                size="small"
              />
            </Grid>
            <Grid item xs={12} md={4}>
              <FormControl fullWidth size="small">
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
        </CardContent>
      </Card>

      {/* Programs List */}
      <Box sx={{ mt: 2 }}>
        {filteredPrograms.length === 0 ? (
          <Card sx={{ p: 4, textAlign: "center" }}>
            <Typography variant="body1" color="textSecondary">
              No training programs found matching your criteria.
            </Typography>
          </Card>
        ) : (
          <Grid container spacing={2}>
            {filteredPrograms.map((program) => (
              <Grid item xs={12} key={program._id}>
                <TrainingProgramCard program={program} />
              </Grid>
            ))}
          </Grid>
        )}
      </Box>
    </Box>
  );
};

export default TrainingProgramList;
