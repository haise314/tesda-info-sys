import React, { useState, useEffect } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import axios from "axios";
import {
  Box,
  Typography,
  TextField,
  Button,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
} from "@mui/material";

const AdminTestReview = ({ answerSheetId, testSessionId }) => {
  const [status, setStatus] = useState("");
  const [remark, setRemark] = useState("");
  const [score, setScore] = useState(0);

  // Fetch answer sheet data
  const { data: answerSheet, isLoading: isLoadingAnswerSheet } = useQuery(
    ["answerSheet", answerSheetId],
    async () => {
      const response = await axios.get(`/api/answer-sheets/${answerSheetId}`);
      return response.data;
    }
  );

  // Fetch test data
  const { data: test, isLoading: isLoadingTest } = useQuery(
    ["test", answerSheet?.testId],
    async () => {
      const response = await axios.get(`/api/tests/${answerSheet.testId}`);
      return response.data;
    },
    {
      enabled: !!answerSheet?.testId,
    }
  );

  // Fetch test session data
  const { data: testSession, isLoading: isLoadingTestSession } = useQuery(
    ["testSession", testSessionId],
    async () => {
      const response = await axios.get(`/api/test-sessions/${testSessionId}`);
      return response.data;
    }
  );

  // Update test session mutation
  const updateTestSessionMutation = useMutation(
    async (updatedData) => {
      const response = await axios.put(
        `/api/test-sessions/${testSessionId}`,
        updatedData
      );
      return response.data;
    },
    {
      onSuccess: () => {
        // You can add a success message or additional logic here
        console.log("Test session updated successfully");
      },
    }
  );

  useEffect(() => {
    if (testSession) {
      setStatus(testSession.status || "");
      setRemark(testSession.remark || "");
    }
  }, [testSession]);

  useEffect(() => {
    if (answerSheet && test) {
      const correctAnswers = answerSheet.answers.filter((answer) => {
        const question = test.questions.find(
          (q) => q._id === answer.questionId
        );
        const correctOption = question.options.find((opt) => opt.isCorrect);
        return answer.selectedOption === correctOption._id;
      });
      setScore(correctAnswers.length);
    }
  }, [answerSheet, test]);

  const handleStatusChange = (event) => {
    setStatus(event.target.value);
  };

  const handleRemarkChange = (event) => {
    setRemark(event.target.value);
  };

  const handleSubmit = () => {
    updateTestSessionMutation.mutate({ status, remark });
  };

  if (isLoadingAnswerSheet || isLoadingTest || isLoadingTestSession) {
    return <Typography>Loading...</Typography>;
  }

  return (
    <Box>
      <Typography variant="h4" gutterBottom>
        Test Review
      </Typography>
      <Typography variant="h6">
        Score: {score} / {test.questions.length}
      </Typography>
      <TableContainer component={Paper} sx={{ marginBottom: 2 }}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Question</TableCell>
              <TableCell>Correct Answer</TableCell>
              <TableCell>User's Answer</TableCell>
              <TableCell>Result</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {test.questions.map((question, index) => {
              const userAnswer = answerSheet.answers.find(
                (a) => a.questionId === question._id
              );
              const correctOption = question.options.find(
                (opt) => opt.isCorrect
              );
              const userOption = question.options.find(
                (opt) => opt._id === userAnswer?.selectedOption
              );
              const isCorrect =
                correctOption._id === userAnswer?.selectedOption;

              return (
                <TableRow key={question._id}>
                  <TableCell>{question.questionText}</TableCell>
                  <TableCell>{correctOption.text}</TableCell>
                  <TableCell>
                    {userOption ? userOption.text : "Not answered"}
                  </TableCell>
                  <TableCell>{isCorrect ? "Correct" : "Incorrect"}</TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </TableContainer>
      <FormControl fullWidth sx={{ marginBottom: 2 }}>
        <InputLabel>Status</InputLabel>
        <Select value={status} onChange={handleStatusChange}>
          <MenuItem value="in-progress">In Progress</MenuItem>
          <MenuItem value="completed">Completed</MenuItem>
          <MenuItem value="reviewed">Reviewed</MenuItem>
          <MenuItem value="disputed">Disputed</MenuItem>
        </Select>
      </FormControl>
      <TextField
        fullWidth
        multiline
        rows={4}
        label="Remark"
        value={remark}
        onChange={handleRemarkChange}
        sx={{ marginBottom: 2 }}
      />
      <Button variant="contained" onClick={handleSubmit}>
        Submit Review
      </Button>
    </Box>
  );
};

export default AdminTestReview;
