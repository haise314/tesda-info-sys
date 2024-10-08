import React, { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import axios from "axios";
import { useForm, Controller, useFieldArray } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Container,
  Grid,
  Typography,
  Card,
  CardContent,
  List,
  ListItem,
  ListItemText,
  Pagination,
  CircularProgress,
  Box,
  TextField,
  Button,
  FormControlLabel,
  Checkbox,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Tab,
  Tabs,
  Paper,
  Divider,
  Alert,
  Snackbar,
} from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import DeleteIcon from "@mui/icons-material/Delete";
import { testSchema } from "../../components/schema/test.schema";

const TestManagement = () => {
  const [page, setPage] = useState(1);
  const [activeTab, setActiveTab] = useState(0);
  const [openDialog, setOpenDialog] = useState(false);
  const [testCode, setTestCode] = useState("");
  const [deleteSnackbar, setDeleteSnackbar] = useState({
    open: false,
    message: "",
  });
  const queryClient = useQueryClient();

  // Fetch tests
  const { data: testsData, isLoading } = useQuery({
    queryKey: ["tests", page],
    queryFn: () =>
      axios.get(`/api/tests?page=${page}&limit=5`).then((res) => res.data),
    keepPreviousData: true,
  });

  // Delete mutation
  const deleteMutation = useMutation({
    mutationFn: (testId) => axios.delete(`/api/tests/${testId}`),
    onSuccess: () => {
      queryClient.invalidateQueries(["tests"]);
      setDeleteSnackbar({ open: true, message: "Test deleted successfully" });
    },
    onError: () => {
      setDeleteSnackbar({ open: true, message: "Failed to delete test" });
    },
  });

  // Create test form handling
  const {
    control,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm({
    resolver: zodResolver(testSchema),
    defaultValues: {
      subject: "",
      instruction: "",
      questions: [
        {
          questionText: "",
          options: [
            { text: "", isCorrect: false },
            { text: "", isCorrect: false },
            { text: "", isCorrect: false },
            { text: "", isCorrect: false },
          ],
        },
      ],
    },
  });

  const { fields, append, remove } = useFieldArray({
    control,
    name: "questions",
  });

  const createMutation = useMutation({
    mutationFn: (newTest) => axios.post("/api/tests", newTest),
    onSuccess: (data) => {
      setTestCode(data.data.testCode);
      setOpenDialog(true);
      reset();
      queryClient.invalidateQueries(["tests"]);
    },
  });

  const handleCreateTest = (data) => {
    createMutation.mutate(data);
  };

  const handleDelete = (testId) => {
    if (window.confirm("Are you sure you want to delete this test?")) {
      deleteMutation.mutate(testId);
    }
  };

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

  return (
    <Container maxWidth="lg">
      <Box sx={{ width: "100%", bgcolor: "background.paper", mb: 4 }}>
        <Tabs
          value={activeTab}
          onChange={(e, newValue) => setActiveTab(newValue)}
          centered
        >
          <Tab label="View Tests" />
          <Tab label="Create New Test" />
        </Tabs>
      </Box>

      {activeTab === 0 && (
        <Box>
          <Typography variant="h4" gutterBottom>
            Test List
          </Typography>
          <Grid container spacing={3}>
            {testsData.data.map((test) => (
              <Grid item xs={12} key={test._id}>
                <Paper elevation={3}>
                  <Card>
                    <CardContent>
                      <Box
                        display="flex"
                        justifyContent="space-between"
                        alignItems="center"
                      >
                        <Typography variant="h5">
                          Test Code: {test.testCode}
                        </Typography>
                        <IconButton
                          onClick={() => handleDelete(test._id)}
                          color="error"
                          aria-label="delete test"
                        >
                          <DeleteIcon />
                        </IconButton>
                      </Box>
                      <Typography
                        variant="h6"
                        color="textSecondary"
                        gutterBottom
                      >
                        Subject: {test.subject}
                      </Typography>
                      <Divider sx={{ my: 2 }} />
                      <Typography variant="body1" paragraph>
                        {test.instruction}
                      </Typography>
                      <Typography variant="h6" gutterBottom>
                        Questions:
                      </Typography>
                      <List>
                        {test.questions.map((question, index) => (
                          <ListItem key={index}>
                            <ListItemText
                              primary={`Q${index + 1}: ${
                                question.questionText
                              }`}
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
                </Paper>
              </Grid>
            ))}
          </Grid>
          <Box display="flex" justifyContent="center" mt={4} mb={4}>
            <Pagination
              count={Math.ceil(testsData.total / testsData.limit)}
              page={page}
              onChange={handlePageChange}
              color="primary"
            />
          </Box>
        </Box>
      )}

      {activeTab === 1 && (
        <Box component="form" onSubmit={handleSubmit(handleCreateTest)}>
          <Typography variant="h4" gutterBottom>
            Create New Test
          </Typography>
          <Paper elevation={3} sx={{ p: 3 }}>
            <Controller
              name="subject"
              control={control}
              render={({ field }) => (
                <TextField
                  {...field}
                  label="Subject"
                  error={!!errors.subject}
                  helperText={errors.subject?.message}
                  fullWidth
                  margin="normal"
                />
              )}
            />

            <Controller
              name="instruction"
              control={control}
              render={({ field }) => (
                <TextField
                  {...field}
                  label="Instruction"
                  error={!!errors.instruction}
                  helperText={errors.instruction?.message}
                  fullWidth
                  margin="normal"
                  multiline
                  rows={3}
                />
              )}
            />

            {fields.map((field, index) => (
              <Paper elevation={2} sx={{ p: 2, mt: 2 }} key={field.id}>
                <Typography variant="h6">Question {index + 1}</Typography>
                <Controller
                  name={`questions.${index}.questionText`}
                  control={control}
                  render={({ field }) => (
                    <TextField
                      {...field}
                      label="Question Text"
                      error={!!errors.questions?.[index]?.questionText}
                      helperText={
                        errors.questions?.[index]?.questionText?.message
                      }
                      fullWidth
                      margin="normal"
                    />
                  )}
                />
                <Grid container spacing={2}>
                  {field.options.map((option, optionIndex) => (
                    <Grid item xs={12} sm={6} key={optionIndex}>
                      <Controller
                        name={`questions.${index}.options.${optionIndex}.text`}
                        control={control}
                        render={({ field }) => (
                          <TextField
                            {...field}
                            label={`Option ${optionIndex + 1}`}
                            error={
                              !!errors.questions?.[index]?.options?.[
                                optionIndex
                              ]?.text
                            }
                            helperText={
                              errors.questions?.[index]?.options?.[optionIndex]
                                ?.text?.message
                            }
                            fullWidth
                            margin="normal"
                          />
                        )}
                      />
                      <Controller
                        name={`questions.${index}.options.${optionIndex}.isCorrect`}
                        control={control}
                        render={({ field }) => (
                          <FormControlLabel
                            control={<Checkbox {...field} />}
                            label="Correct Answer"
                          />
                        )}
                      />
                    </Grid>
                  ))}
                </Grid>
                <Box display="flex" justifyContent="flex-end">
                  <IconButton onClick={() => remove(index)} color="error">
                    <DeleteIcon />
                  </IconButton>
                </Box>
              </Paper>
            ))}

            <Box sx={{ mt: 2, mb: 2 }}>
              <Button
                startIcon={<AddIcon />}
                onClick={() =>
                  append({
                    questionText: "",
                    options: [
                      { text: "", isCorrect: false },
                      { text: "", isCorrect: false },
                      { text: "", isCorrect: false },
                      { text: "", isCorrect: false },
                    ],
                  })
                }
              >
                Add Question
              </Button>
            </Box>

            <Button
              type="submit"
              variant="contained"
              color="primary"
              size="large"
              disabled={createMutation.isPending}
            >
              {createMutation.isPending ? "Creating Test..." : "Create Test"}
            </Button>
          </Paper>
        </Box>
      )}

      <Dialog open={openDialog} onClose={() => setOpenDialog(false)}>
        <DialogTitle>Test Created Successfully</DialogTitle>
        <DialogContent>
          <Typography>Your test has been created. The test code is:</Typography>
          <Typography variant="h5" align="center">
            {testCode}
          </Typography>
          <Typography>
            Please save this code. You will need it to start test sessions.
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenDialog(false)}>Close</Button>
        </DialogActions>
      </Dialog>

      <Snackbar
        open={deleteSnackbar.open}
        autoHideDuration={6000}
        onClose={() => setDeleteSnackbar({ ...deleteSnackbar, open: false })}
      >
        <Alert
          onClose={() => setDeleteSnackbar({ ...deleteSnackbar, open: false })}
          severity={
            deleteSnackbar.message.includes("Failed") ? "error" : "success"
          }
        >
          {deleteSnackbar.message}
        </Alert>
      </Snackbar>
    </Container>
  );
};

export default TestManagement;
