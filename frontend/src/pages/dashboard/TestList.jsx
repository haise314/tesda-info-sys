import React from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import axios from "axios";
import DeleteIcon from "@mui/icons-material/Delete";
import ErrorIcon from "@mui/icons-material/Error";
import {
  Container,
  Typography,
  Card,
  CardContent,
  CardHeader,
  IconButton,
  Grid,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
  Button,
  Alert,
  CircularProgress,
  Box,
  Pagination,
} from "@mui/material";

const fetchTests = async ({ pageParam = 1, limit = 5 }) => {
  const response = await axios.get(
    `/api/tests?page=${pageParam}&limit=${limit}`
  );
  return response.data;
};

const deleteTest = async (id) => {
  const response = await axios.delete(`/api/tests/${id}`);
  return response.data;
};

const TestList = () => {
  const [page, setPage] = React.useState(1);
  const [deleteDialogOpen, setDeleteDialogOpen] = React.useState(false);
  const [testToDelete, setTestToDelete] = React.useState(null);
  const queryClient = useQueryClient();

  const { data, isLoading, isError, error } = useQuery({
    queryKey: ["tests", page],
    queryFn: () => fetchTests({ pageParam: page }),
    keepPreviousData: true,
  });

  const deleteMutation = useMutation({
    mutationFn: deleteTest,
    onSuccess: () => {
      queryClient.invalidateQueries(["tests"]);
      setDeleteDialogOpen(false);
      setTestToDelete(null);
    },
  });

  const handleDeleteClick = (test) => {
    setTestToDelete(test);
    setDeleteDialogOpen(true);
  };

  const confirmDelete = () => {
    if (testToDelete) {
      deleteMutation.mutate(testToDelete._id);
    }
  };

  const handlePageChange = (event, newPage) => {
    setPage(newPage);
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
    return (
      <Alert severity="error" icon={<ErrorIcon />}>
        <Typography variant="subtitle1">Error</Typography>
        <Typography variant="body2">{error.message}</Typography>
      </Alert>
    );
  }

  const totalPages = Math.ceil(data.total / data.limit);

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Typography variant="h4" gutterBottom>
        Tests
      </Typography>

      <Box sx={{ mb: 4 }}>
        {data.data.map((test) => (
          <Card key={test._id} sx={{ mb: 3 }}>
            <CardHeader
              action={
                <IconButton
                  color="error"
                  onClick={() => handleDeleteClick(test)}
                  size="small"
                >
                  <DeleteIcon />
                </IconButton>
              }
              title={`Test Code: ${test.testCode}`}
              subheader={`Subject: ${test.subject}`}
            />
            <CardContent>
              <Box sx={{ mb: 3 }}>
                <Typography variant="h6" gutterBottom>
                  Instruction:
                </Typography>
                <Typography variant="body1">{test.instruction}</Typography>
              </Box>

              {test.passages && test.passages.length > 0 && (
                <Box sx={{ mb: 3 }}>
                  <Typography variant="h6" gutterBottom>
                    Passages:
                  </Typography>
                  {test.passages.map((passage, idx) => (
                    <Box key={idx} sx={{ mb: 2 }}>
                      {passage.imageUrl && (
                        <Box sx={{ mb: 1 }}>
                          <img
                            src={passage.imageUrl}
                            alt={`Passage ${idx + 1}`}
                            style={{
                              maxWidth: "100%",
                              height: "auto",
                              borderRadius: "4px",
                            }}
                          />
                        </Box>
                      )}
                      <Typography variant="body1">{passage.content}</Typography>
                    </Box>
                  ))}
                </Box>
              )}

              <Typography variant="h6" gutterBottom>
                Questions:
              </Typography>
              <Box sx={{ mb: 2 }}>
                {test.questions.map((question, qIdx) => (
                  <Card key={qIdx} variant="outlined" sx={{ mb: 2, p: 2 }}>
                    <Box sx={{ mb: 2 }}>
                      <Typography variant="subtitle1">
                        Q{qIdx + 1}: {question.questionText}
                      </Typography>
                      {question.questionImageUrl && (
                        <Box sx={{ mt: 1 }}>
                          <img
                            src={question.questionImageUrl}
                            alt={`Question ${qIdx + 1}`}
                            style={{
                              maxWidth: "100%",
                              height: "auto",
                              borderRadius: "4px",
                            }}
                          />
                        </Box>
                      )}
                    </Box>
                    <Grid container spacing={2}>
                      {question.options.map((option, oIdx) => (
                        <Grid item xs={12} sm={6} key={oIdx}>
                          <Card
                            variant="outlined"
                            sx={{
                              p: 1,
                              bgcolor: option.isCorrect
                                ? "success.light"
                                : "background.paper",
                            }}
                          >
                            <Typography variant="body2">
                              {String.fromCharCode(65 + oIdx)}. {option.text}
                            </Typography>
                            {option.imageUrl && (
                              <Box sx={{ mt: 1 }}>
                                <img
                                  src={option.imageUrl}
                                  alt={`Option ${String.fromCharCode(
                                    65 + oIdx
                                  )}`}
                                  style={{
                                    maxWidth: "100%",
                                    height: "auto",
                                    borderRadius: "4px",
                                  }}
                                />
                              </Box>
                            )}
                          </Card>
                        </Grid>
                      ))}
                    </Grid>
                  </Card>
                ))}
              </Box>
            </CardContent>
          </Card>
        ))}
      </Box>

      <Box display="flex" justifyContent="center" mt={4} mb={2}>
        <Pagination
          count={totalPages}
          page={page}
          onChange={handlePageChange}
          color="primary"
          showFirstButton
          showLastButton
        />
      </Box>

      <Dialog
        open={deleteDialogOpen}
        onClose={() => setDeleteDialogOpen(false)}
      >
        <DialogTitle>Confirm Delete</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Are you sure you want to delete the test with code{" "}
            {testToDelete?.testCode}? This action cannot be undone.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDeleteDialogOpen(false)}>Cancel</Button>
          <Button onClick={confirmDelete} color="error" variant="contained">
            Delete
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
};

export default TestList;
