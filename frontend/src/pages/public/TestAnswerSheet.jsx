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
  Box,
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

  // Fetch registrant data using ULI
  const { data: registrantData, isLoading: isLoadingRegistrant } = useQuery({
    queryKey: ["registrant", uli],
    queryFn: async () => {
      try {
        console.log("Fetching registrant data for ULI:", uli);
        const response = await axios.get(`/api/register/uli/${uli}`);
        if (response.data.success) {
          return response.data.data;
        } else {
          throw new Error(
            response.data.message || "Failed to fetch registrant data"
          );
        }
      } catch (error) {
        console.error("Error fetching registrant:", error);
        throw error;
      }
    },
  });

  const startSessionMutation = useMutation({
    mutationFn: async (newSession) => {
      if (!registrantData?._id) {
        throw new Error("Registrant data not available");
      }

      const payload = {
        registrantId: registrantData._id,
        testCode: newSession.testCode,
      };

      console.log("Starting session with payload:", payload);
      return axios.post("/api/test-sessions/start", payload);
    },
    onSuccess: (response) => {
      console.log("Session started successfully:", response.data);
      setSessionId(response.data.data.sessionId);
    },
    onError: (error) => {
      console.error("Error starting session:", error);
    },
  });

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

  const submitAnswersMutation = useMutation({
    mutationFn: (answerSheet) => {
      return axios.post("/api/answer-sheets", {
        ...answerSheet,
        registrantId: registrantData._id,
      });
    },
  });

  const handleStartSession = async () => {
    if (!registrantData) {
      console.error("Registrant data not loaded");
      return;
    }
    await startSessionMutation.mutateAsync({ testCode });
  };

  const onSubmit = (data) => {
    submitAnswersMutation.mutate(data);
  };

  if (isLoadingRegistrant) {
    return <Typography>Loading registrant data...</Typography>;
  }

  if (!registrantData) {
    return <Typography>Error: Registrant not found</Typography>;
  }

  if (!sessionId) {
    return (
      <Box sx={{ padding: 3 }}>
        <Typography variant="h6" gutterBottom>
          Welcome, {registrantData.name.firstName}{" "}
          {registrantData.name.lastName}
        </Typography>
        <Typography variant="body1" gutterBottom>
          Enter the provided Test Code to start the test session
        </Typography>
        <Stack spacing={2} sx={{ mt: 2 }}>
          <TextField
            label="Test Code"
            value={testCode}
            onChange={(e) => setTestCode(e.target.value)}
            fullWidth
          />
          <Button
            variant="contained"
            onClick={handleStartSession}
            disabled={startSessionMutation.isPending}
            fullWidth
          >
            {startSessionMutation.isPending ? "Starting..." : "Start Test"}
          </Button>
        </Stack>
      </Box>
    );
  }

  if (isLoadingSession) return <Typography>Loading test session...</Typography>;
  if (sessionError)
    return <Typography>Error: {sessionError.message}</Typography>;

  const { test } = testSession;

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
            value={registrantData.name.firstName}
            fullWidth
            InputProps={{ readOnly: true }}
          />
        </Grid>
        <Grid item xs={12} sm={4}>
          <TextField
            label="Last Name"
            value={registrantData.name.lastName}
            fullWidth
            InputProps={{ readOnly: true }}
          />
        </Grid>
        <Grid item xs={12} sm={4}>
          <TextField
            label="Middle Name"
            value={registrantData.name.middleName || ""}
            fullWidth
            InputProps={{ readOnly: true }}
          />
        </Grid>
      </Grid>

      <Typography variant="h5" gutterBottom sx={{ mt: 4 }}>
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
