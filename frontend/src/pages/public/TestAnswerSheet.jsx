import React, { useState, useCallback } from "react";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQuery } from "@tanstack/react-query";
import axios from "axios";
import { z } from "zod";
import {
  TextField,
  Button,
  FormControlLabel,
  Radio,
  RadioGroup,
  FormControl,
  FormLabel,
  Typography,
  Box,
  CircularProgress,
  Snackbar,
  Alert,
} from "@mui/material";

const answerSheetSchema = z.object({
  sessionId: z.string().min(1, "Session ID is required"),
  answers: z.array(
    z.object({
      questionId: z.string(),
      selectedOption: z.string(),
    })
  ),
});

const TestAnswerSheet = ({ uli }) => {
  const [testCode, setTestCode] = useState("");
  const [sessionId, setSessionId] = useState(null);
  const [snackbarOpen, setSnackbarOpen] = useState(false);

  const {
    control,
    handleSubmit,
    formState: { errors },
    setValue,
    reset,
  } = useForm({
    resolver: zodResolver(answerSheetSchema),
    defaultValues: {
      sessionId: "",
      answers: [],
    },
  });

  const resetForm = useCallback(() => {
    reset();
    setSessionId(null);
    setTestCode("");
  }, [reset]);

  // Start test session mutation
  const startSessionMutation = useMutation({
    mutationFn: async (newSession) => {
      const payload = {
        uli,
        testCode: newSession.testCode,
      };
      return axios.post("/api/test-sessions/start", payload);
    },
    onSuccess: (response) => {
      setSessionId(response.data.data.sessionId);
    },
    onError: (error) => {
      console.error("Error starting session:", error);
    },
  });

  // Fetch test session data
  const {
    data: testSession,
    isLoading: isLoadingSession,
    error: sessionError,
  } = useQuery({
    queryKey: ["testSession", sessionId],
    queryFn: async () => {
      if (!sessionId) return null;
      const response = await axios.get(`/api/test-sessions/${sessionId}`);
      return response.data.data;
    },
    enabled: !!sessionId,
  });

  // Submit answers mutation
  const submitAnswersMutation = useMutation({
    mutationFn: async (answerSheet) => {
      const answerSheetResponse = await axios.post("/api/answer-sheets", {
        ...answerSheet,
        uli,
        testId: testSession.test._id,
      });

      return answerSheetResponse.data;
    },
    onSuccess: (data) => {
      console.log("Answer sheet submitted successfully:", data);
      setSnackbarOpen(true);

      // Delay the reset to allow the Snackbar to be visible
      setTimeout(() => {
        resetForm();
      }, 2000); // 2 seconds delay
    },
    onError: (error) => {
      console.error("Error submitting answer sheet:", error);
    },
  });

  // Handle start session
  const handleStartSession = async () => {
    await startSessionMutation.mutateAsync({ testCode });
  };

  const onSubmit = (data) => {
    submitAnswersMutation.mutate(data);
  };

  // Set initial answers when test session data is loaded
  React.useEffect(() => {
    if (testSession && testSession.test) {
      setValue(
        "answers",
        testSession.test.questions.map((question) => ({
          questionId: question._id,
          selectedOption: "",
        }))
      );
      setValue("sessionId", sessionId);
    }
  }, [testSession, setValue, sessionId]);

  const handleCloseSnackbar = (event, reason) => {
    if (reason === "clickaway") {
      return;
    }
    setSnackbarOpen(false);
  };

  if (!sessionId) {
    return (
      <Box sx={{ padding: 3 }}>
        <Typography variant="h6" gutterBottom>
          Welcome, User (ULI: {uli})
        </Typography>
        <Typography variant="body1" gutterBottom>
          Enter the provided Test Code to start the test session
        </Typography>
        <Box sx={{ mt: 2 }}>
          <TextField
            label="Test Code"
            value={testCode}
            onChange={(e) => setTestCode(e.target.value)}
            fullWidth
          />
          <Button
            variant="contained"
            onClick={handleStartSession}
            disabled={startSessionMutation.isLoading}
            fullWidth
            sx={{ mt: 2 }}
          >
            {startSessionMutation.isLoading ? "Starting..." : "Start Test"}
          </Button>
        </Box>
      </Box>
    );
  }

  if (isLoadingSession) return <CircularProgress />;
  if (sessionError)
    return <Typography color="error">Error: {sessionError.message}</Typography>;

  const { test } = testSession;

  return (
    <>
      <form onSubmit={handleSubmit(onSubmit)}>
        <Typography variant="h4" gutterBottom>
          Test Answer Sheet
        </Typography>

        <Typography variant="h6">User Information</Typography>
        <TextField
          label="ULI"
          value={uli}
          fullWidth
          InputProps={{ readOnly: true }}
          sx={{ mb: 2 }}
        />

        <Typography variant="h5" gutterBottom sx={{ mt: 4 }}>
          Test Questions
        </Typography>

        {test.questions.map((question, index) => (
          <FormControl
            key={question._id}
            component="fieldset"
            margin="normal"
            fullWidth
          >
            <FormLabel component="legend">{`${index + 1}. ${
              question.questionText
            }`}</FormLabel>
            <Controller
              name={`answers.${index}.selectedOption`}
              control={control}
              defaultValue=""
              render={({ field }) => (
                <RadioGroup {...field}>
                  {question.options.map((option) => (
                    <FormControlLabel
                      key={option._id}
                      value={option._id}
                      control={<Radio />}
                      label={option.text}
                    />
                  ))}
                </RadioGroup>
              )}
            />
          </FormControl>
        ))}

        <Button
          type="submit"
          variant="contained"
          color="primary"
          disabled={submitAnswersMutation.isLoading}
          sx={{ mt: 2 }}
        >
          {submitAnswersMutation.isLoading
            ? "Submitting..."
            : "Submit Answer Sheet"}
        </Button>
      </form>

      <Snackbar
        open={snackbarOpen}
        autoHideDuration={2000}
        onClose={handleCloseSnackbar}
        anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
      >
        <Alert
          onClose={handleCloseSnackbar}
          severity="success"
          sx={{ width: "100%" }}
        >
          Test submitted successfully!
        </Alert>
      </Snackbar>
    </>
  );
};

export default TestAnswerSheet;
