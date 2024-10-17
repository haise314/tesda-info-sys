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
  Paper,
  Container,
  Card,
  CardContent,
  Divider,
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

  const renderQuestions = (questions, startIndex) => {
    return questions.map((question, index) => (
      <QuestionComponent
        key={question._id}
        question={question}
        index={startIndex + index} // Use the cumulative index
        control={control}
        totalQuestions={test.questions.length} // Total questions in the entire test
      />
    ));
  };

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
      setTimeout(() => {
        resetForm();
      }, 2000);
    },
    onError: (error) => {
      console.error("Error submitting answer sheet:", error);
    },
  });

  const handleStartSession = async () => {
    await startSessionMutation.mutateAsync({ testCode });
  };

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
      <Container maxWidth="sm">
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
      </Container>
    );
  }

  if (isLoadingSession) return <CircularProgress />;
  if (sessionError)
    return <Typography color="error">Error: {sessionError.message}</Typography>;

  const { test } = testSession;

  // Group questions by passage
  const questionsByPassage = test.questions.reduce((acc, question) => {
    const passageIndex = question.passageIndex;
    if (passageIndex >= 0) {
      if (!acc[passageIndex]) {
        acc[passageIndex] = [];
      }
      acc[passageIndex].push(question);
    } else {
      if (!acc[-1]) {
        acc[-1] = [];
      }
      acc[-1].push(question);
    }
    return acc;
  }, {});

  return (
    <Container maxWidth="lg">
      <form
        onSubmit={handleSubmit((data) => submitAnswersMutation.mutate(data))}
      >
        <Card sx={{ mb: 3 }}>
          <CardContent>
            <Typography variant="h4" gutterBottom>
              Test Answer Sheet
            </Typography>
            <Box sx={{ mb: 2 }}>
              <Typography variant="subtitle1">
                Subject: {test.subject}
              </Typography>
              <Typography variant="subtitle1">
                Test Code: {test.testCode}
              </Typography>
              <Typography variant="subtitle1">ULI: {uli}</Typography>
            </Box>
            <Paper sx={{ p: 2, bgcolor: "grey.50", mb: 2 }}>
              <Typography variant="h6" gutterBottom>
                Instructions
              </Typography>
              <Typography variant="body1">{test.instruction}</Typography>
            </Paper>
          </CardContent>
        </Card>

        {/* Track the cumulative question count */}
        {(() => {
          let questionIndex = 0;

          return (
            <>
              {/* Independent questions (not associated with any passage) */}
              {questionsByPassage[-1] && questionsByPassage[-1].length > 0 && (
                <Paper sx={{ p: 3, mb: 4 }}>
                  <Typography variant="h5" gutterBottom>
                    General Questions
                  </Typography>
                  {renderQuestions(questionsByPassage[-1], questionIndex)}
                  {/* Update questionIndex */}
                  {(() => {
                    questionIndex += questionsByPassage[-1].length;
                    return null;
                  })()}
                </Paper>
              )}

              {/* Passages and their associated questions */}
              {test.passages.map((passage, passageIndex) => {
                if (!questionsByPassage[passageIndex]) return null;

                return (
                  <Paper key={passageIndex} sx={{ p: 3, mb: 4 }}>
                    {/* Passage Section */}
                    <Box sx={{ mb: 4 }}>
                      <Typography variant="h5" gutterBottom>
                        Passage {passageIndex + 1}
                      </Typography>
                      <Typography variant="body1" paragraph>
                        {passage.content}
                      </Typography>
                      {passage.imageUrl && (
                        <Box sx={{ mt: 2, textAlign: "center" }}>
                          <img
                            src={passage.imageUrl}
                            alt={`Passage ${passageIndex + 1} illustration`}
                            style={{ maxWidth: "100%", height: "auto" }}
                          />
                        </Box>
                      )}
                    </Box>

                    <Divider sx={{ my: 3 }} />

                    {/* Questions for this passage */}
                    <Box>
                      <Typography variant="h6" gutterBottom>
                        Questions for Passage {passageIndex + 1}
                      </Typography>
                      {renderQuestions(
                        questionsByPassage[passageIndex],
                        questionIndex
                      )}
                      {/* Update questionIndex */}
                      {(() => {
                        questionIndex +=
                          questionsByPassage[passageIndex].length;
                        return null;
                      })()}
                    </Box>
                  </Paper>
                );
              })}
            </>
          );
        })()}

        <Box sx={{ mt: 3, mb: 4, display: "flex", justifyContent: "flex-end" }}>
          <Button
            type="submit"
            variant="contained"
            color="primary"
            disabled={submitAnswersMutation.isLoading}
            size="large"
          >
            {submitAnswersMutation.isLoading
              ? "Submitting..."
              : "Submit Answer Sheet"}
          </Button>
        </Box>
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
    </Container>
  );
};

// Extracted Question Component for better organization
const QuestionComponent = ({ question, index, control, totalQuestions }) => (
  <FormControl
    component="fieldset"
    margin="normal"
    fullWidth
    sx={{
      mb: index === totalQuestions - 1 ? 0 : 3,
      p: 2,
      bgcolor: "grey.50",
      borderRadius: 1,
    }}
  >
    <FormLabel component="legend">
      <Typography variant="body1" sx={{ fontWeight: "medium" }}>
        {index + 1}. {question.questionText}
      </Typography>
    </FormLabel>

    {question.questionImageUrl && (
      <Box sx={{ mt: 2, mb: 2, textAlign: "center" }}>
        <img
          src={question.questionImageUrl}
          alt={`Question ${index + 1} illustration`}
          style={{ maxWidth: "100%", height: "auto" }}
        />
      </Box>
    )}

    <Controller
      name={`answers.${index}.selectedOption`}
      control={control}
      defaultValue=""
      render={({ field }) => (
        <RadioGroup
          {...field}
          name={`question-${question._id}`} // Add unique name for each question
          sx={{ mt: 1 }}
        >
          {question.options.map((option) => (
            <Box key={option._id} sx={{ mb: option.imageUrl ? 2 : 0 }}>
              <FormControlLabel
                value={option._id}
                control={<Radio />}
                label={option.text}
              />
              {option.imageUrl && (
                <Box sx={{ pl: 4, mt: 1 }}>
                  <img
                    src={option.imageUrl}
                    alt={`Option illustration`}
                    style={{ maxWidth: "100%", height: "auto" }}
                  />
                </Box>
              )}
            </Box>
          ))}
        </RadioGroup>
      )}
    />
  </FormControl>
);

export default TestAnswerSheet;
