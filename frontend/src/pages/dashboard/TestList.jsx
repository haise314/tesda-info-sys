import React from "react";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import {
  Container,
  Typography,
  Card,
  CardContent,
  Grid,
  List,
  ListItem,
  ListItemText,
  Pagination,
  CircularProgress,
  Box,
} from "@mui/material";

const fetchTests = async (page = 1, limit = 5) => {
  const response = await axios.get(`/api/tests?page=${page}&limit=${limit}`);
  return response.data;
};

const TestList = () => {
  const [page, setPage] = React.useState(1);
  const { data, isLoading, isError, error } = useQuery({
    queryKey: ["tests", page],
    queryFn: () => fetchTests(page),
    keepPreviousData: true,
  });

  const handlePageChange = (event, value) => {
    setPage(value);
  };

  if (isLoading) {
    return (
      <Box
        display="flex"
        justifyContent="center"
        alignItems="center"
        minHeight="100vh"
      >
        <CircularProgress />
      </Box>
    );
  }

  if (isError) {
    return <Typography color="error">Error: {error.message}</Typography>;
  }

  return (
    <Container maxWidth="md">
      <Typography variant="h4" gutterBottom>
        Tests
      </Typography>
      {data.data.map((test) => (
        <Card key={test._id} sx={{ mb: 4, boxShadow: 3 }}>
          <CardContent>
            <Typography variant="h5" gutterBottom>
              Test Code: {test.testCode}
            </Typography>
            <Typography variant="h6" color="textSecondary" gutterBottom>
              Subject: {test.subject}
            </Typography>
            <Typography variant="body1" paragraph>
              Instruction: {test.instruction}
            </Typography>
            <Typography variant="h6" gutterBottom>
              Questions:
            </Typography>
            <List>
              {test.questions.map((question, index) => (
                <ListItem key={index}>
                  <ListItemText
                    primary={`Q${index + 1}: ${question.questionText}`}
                    secondary={
                      <Grid container spacing={1}>
                        {question.options.map((option, optIndex) => (
                          <Grid item xs={6} key={optIndex}>
                            <Typography variant="body2">
                              {String.fromCharCode(65 + optIndex)}.{" "}
                              {option.text}
                              {option.isCorrect && " (Correct)"}
                            </Typography>
                          </Grid>
                        ))}
                      </Grid>
                    }
                  />
                </ListItem>
              ))}
            </List>
          </CardContent>
        </Card>
      ))}
      <Box display="flex" justifyContent="center" mt={4} mb={4}>
        <Pagination
          count={Math.ceil(data.total / data.limit)}
          page={page}
          onChange={handlePageChange}
          color="primary"
        />
      </Box>
    </Container>
  );
};

export default TestList;
