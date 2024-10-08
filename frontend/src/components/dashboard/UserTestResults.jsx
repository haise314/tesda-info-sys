import React from "react";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { useAuth } from "../../context/AuthContext";
import {
  Typography,
  Paper,
  CircularProgress,
  List,
  ListItem,
  ListItemText,
  Divider,
  Alert,
  Box,
  Container,
  Card,
  CardContent,
  Chip,
  useTheme,
  useMediaQuery,
} from "@mui/material";
import { styled } from "@mui/system";

const StyledCard = styled(Card)(({ theme }) => ({
  marginBottom: theme.spacing(2),
  transition: "0.3s",
  "&:hover": {
    boxShadow: theme.shadows[4],
  },
}));

const ScoreChip = styled(Chip)(({ theme, score, total }) => ({
  backgroundColor:
    score / total >= 0.7
      ? theme.palette.success.main
      : score / total >= 0.4
      ? theme.palette.warning.main
      : theme.palette.error.main,
  color: theme.palette.common.white,
  fontWeight: "bold",
}));

const fetchUserResults = async (uli) => {
  try {
    const response = await axios.post(`/api/results/getuser/${uli}`);
    return response.data;
  } catch (error) {
    if (error.response && error.response.status === 404) {
      return [];
    }
    throw error;
  }
};

const UserResultsList = () => {
  const { user } = useAuth();
  const uli = user?.uli;
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

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

  if (!uli) {
    return (
      <Container maxWidth="sm">
        <Alert severity="info" sx={{ mt: 2 }}>
          Please log in to view your results.
        </Alert>
      </Container>
    );
  }

  if (isLoading) {
    return (
      <Box
        display="flex"
        justifyContent="center"
        alignItems="center"
        minHeight="200px"
      >
        <CircularProgress />
      </Box>
    );
  }

  if (isError) {
    return (
      <Container maxWidth="sm">
        <Alert severity="error" sx={{ mt: 2 }}>
          Error loading your results: {error.message}
        </Alert>
      </Container>
    );
  }

  return (
    <Container maxWidth="md">
      <Paper elevation={3} sx={{ p: 3, mt: 4 }}>
        <Typography variant="h4" gutterBottom color="primary" align="center">
          Your Test Results
        </Typography>
        {results.length === 0 ? (
          <Alert severity="info" sx={{ mt: 2 }}>
            No results found for your ULI ({uli}). You may not have taken any
            tests yet.
          </Alert>
        ) : (
          <List>
            {results.map((result, index) => (
              <React.Fragment key={result._id}>
                {index > 0 && <Divider sx={{ my: 2 }} />}
                <StyledCard>
                  <CardContent>
                    <Box
                      display="flex"
                      justifyContent="space-between"
                      alignItems="center"
                      flexWrap="wrap"
                    >
                      <Typography variant="h6" component="div" gutterBottom>
                        Test Code: {result.testCode}
                      </Typography>
                      <ScoreChip
                        label={`Score: ${result.score}/${result.totalQuestions}`}
                        score={result.score}
                        total={result.totalQuestions}
                      />
                    </Box>
                    {result.remarks && (
                      <Typography
                        variant="body2"
                        color="text.secondary"
                        sx={{ mt: 1 }}
                      >
                        Remarks: {result.remarks}
                      </Typography>
                    )}
                    <Typography
                      variant="body2"
                      color="text.secondary"
                      sx={{ mt: 1 }}
                    >
                      Date: {new Date(result.createdAt).toLocaleDateString()}
                    </Typography>
                  </CardContent>
                </StyledCard>
              </React.Fragment>
            ))}
          </List>
        )}
      </Paper>
    </Container>
  );
};

export default UserResultsList;
