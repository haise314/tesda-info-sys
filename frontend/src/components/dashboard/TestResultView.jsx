import React from "react";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import {
  Box,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
} from "@mui/material";
import AdminTestReview from "./AdminTestReview";

const TestResultView = ({ answerSheetId, testSessionId, isAdmin }) => {
  const { data: answerSheet, isLoading: isLoadingAnswerSheet } = useQuery(
    ["answerSheet", answerSheetId],
    async () => {
      const response = await axios.get(`/api/answer-sheets/${answerSheetId}`);
      return response.data;
    }
  );

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

  const { data: testSession, isLoading: isLoadingTestSession } = useQuery(
    ["testSession", testSessionId],
    async () => {
      const response = await axios.get(`/api/test-sessions/${testSessionId}`);
      return response.data;
    }
  );

  if (isLoadingAnswerSheet || isLoadingTest || isLoadingTestSession) {
    return <Typography>Loading...</Typography>;
  }

  const score = answerSheet.answers.filter((answer) => {
    const question = test.questions.find((q) => q._id === answer.questionId);
    const correctOption = question.options.find((opt) => opt.isCorrect);
    return answer.selectedOption === correctOption._id;
  }).length;

  const commonView = (
    <Box>
      <Typography variant="h4" gutterBottom>
        Test Results
      </Typography>
      <Typography variant="h6">
        Score: {score} / {test.questions.length}
      </Typography>
      <TableContainer component={Paper} sx={{ marginBottom: 2 }}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Question</TableCell>
              <TableCell>Your Answer</TableCell>
              <TableCell>Correct Answer</TableCell>
              <TableCell>Result</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {test.questions.map((question) => {
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
                  <TableCell>
                    {userOption ? userOption.text : "Not answered"}
                  </TableCell>
                  <TableCell>{correctOption.text}</TableCell>
                  <TableCell>{isCorrect ? "Correct" : "Incorrect"}</TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </TableContainer>
      <Typography variant="h6">Status: {testSession.status}</Typography>
      {testSession.remark && (
        <Typography variant="body1">Remark: {testSession.remark}</Typography>
      )}
    </Box>
  );

  return (
    <Box>
      {commonView}
      {isAdmin && (
        <AdminTestReview
          answerSheetId={answerSheetId}
          testSessionId={testSessionId}
        />
      )}
    </Box>
  );
};

export default TestResultView;
