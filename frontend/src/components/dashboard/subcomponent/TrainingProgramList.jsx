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
  Paper,
  Container,
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
  const primaryColor = "#0038a8";
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
      <Container sx={{ display: "flex", justifyContent: "center", py: 4 }}>
        <CircularProgress sx={{ color: primaryColor }} />
      </Container>
    );
  }

  if (error) {
    return (
      <Container sx={{ py: 4 }}>
        <Alert severity="error">Error loading programs: {error.message}</Alert>
      </Container>
    );
  }

  return (
    <Container maxWidth="md" sx={{ py: 4 }}>
      <Paper
        elevation={3}
        sx={{
          p: 4,
          borderTop: `6px solid ${primaryColor}`,
          borderRadius: 2,
        }}
      >
        <Typography
          variant="h5"
          gutterBottom
          sx={{
            color: primaryColor,
            mb: 2,
            borderBottom: `2px solid ${primaryColor}`,
            pb: 1,
          }}
        >
          Available Course/Qualifications
        </Typography>

        {/* Search and Filters */}
        <Grid container spacing={3} sx={{ mb: 3 }}>
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
                    <Search sx={{ color: primaryColor }} />
                  </InputAdornment>
                ),
              }}
              size="small"
              sx={{
                "& .MuiOutlinedInput-root": {
                  "&.Mui-focused fieldset": {
                    borderColor: primaryColor,
                  },
                },
              }}
            />
          </Grid>
          <Grid item xs={12} md={4}>
            <FormControl fullWidth size="small">
              <InputLabel>Filter Programs</InputLabel>
              <Select
                value={filter}
                label="Filter Programs"
                onChange={(e) => setFilter(e.target.value)}
                sx={{
                  "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
                    borderColor: primaryColor,
                  },
                }}
              >
                <MenuItem value="all">All Programs</MenuItem>
                <MenuItem value="scholarship">With Scholarship</MenuItem>
                <MenuItem value="available">Available Slots</MenuItem>
              </Select>
            </FormControl>
          </Grid>
        </Grid>

        {/* Programs List */}
        <Box sx={{ mt: 2 }}>
          {filteredPrograms.length === 0 ? (
            <Box
              sx={{
                p: 4,
                textAlign: "center",
                backgroundColor: "#f5f5f5",
                border: `1px solid ${primaryColor}`,
                borderRadius: 2,
              }}
            >
              <Typography variant="body1" color="textSecondary">
                No training programs found matching your criteria.
              </Typography>
            </Box>
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
      </Paper>
    </Container>
  );
};

export default TrainingProgramList;
