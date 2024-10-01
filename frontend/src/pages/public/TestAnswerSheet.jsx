import React, { useState } from "react";
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
  Grid,
  Stack,
  Paper,
} from "@mui/material";

// Define the schema for the form
const answerSheetSchema = z.object({
  sessionId: z.string().min(1, "Session ID is required"),
  answers: z.array(
    z.object({
      questionId: z.string(),
      selectedOption: z.string(),
    })
  ),
});

const TestAnswerSheet = ({ registrantId }) => {
  const [testCode, setTestCode] = useState("");
  const [sessionId, setSessionId] = useState(null);

  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(answerSheetSchema),
    defaultValues: {
      sessionId: "",
      answers: [],
    },
  });

  const startSessionMutation = useMutation({
    mutationFn: (newSession) => {
      return axios.post(
        "http://localhost:5000/api/test-sessions/start",
        newSession
      );
    },
    onSuccess: (data) => {
      setSessionId(data.data.data.sessionId);
    },
  });

  const {
    data: testSession,
    isLoading,
    error,
  } = useQuery({
    queryKey: ["testSession", sessionId],
    queryFn: async () => {
      if (!sessionId) return null;
      const response = await axios.get(
        `http://localhost:5000/api/test-sessions/${sessionId}`
      );
      return response.data.data;
    },
    enabled: !!sessionId,
  });

  const submitAnswersMutation = useMutation({
    mutationFn: (answerSheet) => {
      return axios.post("http://localhost:5000/api/answer-sheets", answerSheet);
    },
  });

  const handleStartSession = async () => {
    await startSessionMutation.mutateAsync({ registrantId, testCode });
  };

  const onSubmit = (data) => {
    submitAnswersMutation.mutate(data);
  };

  if (!sessionId) {
    return (
      <Paper sx={{ padding: 3 }}>
        <Typography variant="body" gutterBottom>
          Enter the provided Test Code to start the test session
        </Typography>
        <Stack elevation={5} padding={2}>
          <TextField
            label="Test Code"
            value={testCode}
            onChange={(e) => setTestCode(e.target.value)}
          />
          <Button
            onClick={handleStartSession}
            disabled={startSessionMutation.isPending}
          >
            {startSessionMutation.isPending ? "Starting..." : "Start Test"}
          </Button>
        </Stack>
      </Paper>
    );
  }

  if (isLoading) return <Typography>Loading...</Typography>;
  if (error) return <Typography>Error: {error.message}</Typography>;

  const { registrant, test } = testSession;

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <Typography variant="h4" gutterBottom>
        Test Answer Sheet
      </Typography>

      <Typography variant="h6">Registrant Information</Typography>
      <Grid container spacing={2}>
        <Grid item xs={12} sm={4}>
          <TextField
            label="First Name"
            value={registrant.name.firstName}
            fullWidth
            InputProps={{ readOnly: true }}
          />
        </Grid>
        <Grid item xs={12} sm={4}>
          <TextField
            label="Last Name"
            value={registrant.name.lastName}
            fullWidth
            InputProps={{ readOnly: true }}
          />
        </Grid>
        <Grid item xs={12} sm={4}>
          <TextField
            label="Middle Name"
            value={registrant.name.middleName}
            fullWidth
            InputProps={{ readOnly: true }}
          />
        </Grid>
      </Grid>

      <Typography variant="h5" gutterBottom>
        Test Questions
      </Typography>

      <input
        type="hidden"
        {...control.register("sessionId")}
        value={sessionId}
      />

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
                {question.options.map((option, optionIndex) => (
                  <FormControlLabel
                    key={optionIndex}
                    value={option._id}
                    control={<Radio />}
                    label={option.text}
                  />
                ))}
              </RadioGroup>
            )}
          />
          <input
            type="hidden"
            {...control.register(`answers.${index}.questionId`)}
            value={question._id}
          />
        </FormControl>
      ))}

      <Button
        type="submit"
        variant="contained"
        color="primary"
        disabled={submitAnswersMutation.isPending}
        sx={{ mt: 2 }}
      >
        {submitAnswersMutation.isPending
          ? "Submitting..."
          : "Submit Answer Sheet"}
      </Button>
    </form>
  );
};

export default TestAnswerSheet;
