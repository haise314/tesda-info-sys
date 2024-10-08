import { Box, Typography, CircularProgress, Alert } from "@mui/material";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import TrainingProgramListItem from "../../components/dashboard/TrainingProgramCard";

// Axios instance to interact with the backend
const api = axios.create({
  baseURL: "/api", // assuming your backend is running on '/api'
});

// Function to fetch training programs from the backend
const fetchTrainingPrograms = async () => {
  const { data } = await api.get("/programs/");
  return data;
};

const TrainingProgramList = () => {
  // Use React Query to fetch data
  const { data, isLoading, error } = useQuery({
    queryKey: ["trainingPrograms"],
    queryFn: fetchTrainingPrograms,
  });

  if (isLoading) {
    return <CircularProgress />;
  }

  if (error) {
    return <Alert severity="error">Error loading programs</Alert>;
  }

  return (
    <Box sx={{ maxWidth: 800, mx: "auto", mt: 4 }}>
      <Typography variant="h4" gutterBottom>
        Available Training Programs
      </Typography>

      {/* Render list of Training Programs */}
      {data.length > 0 ? (
        data.map((program) => (
          <TrainingProgramListItem key={program._id} program={program} />
        ))
      ) : (
        <Typography variant="body1" color="textSecondary">
          No training programs available.
        </Typography>
      )}
    </Box>
  );
};

export default TrainingProgramList;
