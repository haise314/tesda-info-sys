import React from "react";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";

import { CircularProgress } from "@mui/material";
import TestResults from "../../components/dashboard/TestResult";

const TestResultsPage = ({ uli, testId }) => {
  // Fetch answer sheet
  const { data: answersheet, isLoading: loadingAnswers } = useQuery({
    queryKey: ["answersheet", uli],
    queryFn: async () => {
      const response = await axios.get(`/api/answer-sheets/answers/${uli}`);
      return response.data;
    },
  });

  // Fetch test details
  const { data: test, isLoading: loadingTest } = useQuery({
    queryKey: ["test", testId],
    queryFn: async () => {
      const response = await axios.get(`/api/tests/code/${testId}`);
      return response.data;
    },
  });

  if (loadingAnswers || loadingTest) {
    return (
      <div className="flex justify-center items-center h-[400px]">
        <CircularProgress />
      </div>
    );
  }

  return <TestResults answersheet={answersheet} test={test} />;
};

export default TestResultsPage;
