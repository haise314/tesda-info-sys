import React from "react";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { useAuth } from "../../context/AuthContext";
import {
  Card,
  CardContent,
  CardHeader,
  Typography,
  List,
  ListItem,
  Chip,
  CircularProgress,
  Box,
  Alert,
} from "@mui/material";

// Function to fetch user results
const fetchUserResults = async (uli) => {
  console.log("Fetching results for user:", uli);
  try {
    const response = await axios.get(`/api/results/getuser/${uli}`);
    console.log("API Response:", response);
    return response.data;
  } catch (error) {
    console.error("Error fetching results:", error);
    throw error;
  }
};

const UserTestResults = () => {
  const { user } = useAuth();
  const uli = user?.uli;

  const {
    data: results,
    isLoading,
    isError,
    error,
  } = useQuery({
    queryKey: ["userResults", uli],
    queryFn: () => fetchUserResults(uli),
    enabled: !!uli,
  });

  if (!user) {
    return <Alert severity="info">Please log in to view your results.</Alert>;
  }

  if (isLoading) {
    return (
      <Box
        display="flex"
        justifyContent="center"
        alignItems="center"
        height="200px"
      >
        <CircularProgress />
      </Box>
    );
  }

  if (isError) {
    return <Alert severity="error">Error: {error.message}</Alert>;
  }

  // Check if results is undefined or null
  if (!results) {
    return <Alert severity="warning">No results data available.</Alert>;
  }

  return (
    <Card>
      <CardHeader title="Your Test Results" />
      <CardContent>
        {results.length === 0 ? (
          <Typography>No test results found.</Typography>
        ) : (
          <List>
            {results.map((result, index) => (
              <ListItem key={index} divider>
                <Card variant="outlined" sx={{ width: "100%", mb: 2 }}>
                  <CardContent>
                    <Typography variant="h6" gutterBottom>
                      Test Code: {result.testCode}
                    </Typography>
                    <Typography variant="body1">
                      Score: {result.score} / {result.totalQuestions}
                    </Typography>
                    <Typography variant="body1">
                      Percentage:{" "}
                      {((result.score / result.totalQuestions) * 100).toFixed(
                        2
                      )}
                      %
                    </Typography>
                    {result.remarks && (
                      <Typography variant="body2" sx={{ mt: 1 }}>
                        <strong>Remarks:</strong> {result.remarks}
                      </Typography>
                    )}
                    <Box sx={{ mt: 2 }}>
                      <Chip
                        label={
                          result.score / result.totalQuestions >= 0.7
                            ? "Passed"
                            : "Failed"
                        }
                        color={
                          result.score / result.totalQuestions >= 0.7
                            ? "success"
                            : "error"
                        }
                      />
                    </Box>
                  </CardContent>
                </Card>
              </ListItem>
            ))}
          </List>
        )}
      </CardContent>
    </Card>
  );
};

export default UserTestResults;
