import React, { useMemo } from "react";
import { CheckCircle2, XCircle, AlertCircle } from "lucide-react";
import {
  Alert,
  AlertTitle,
  Card,
  CardContent,
  CardHeader,
  Table,
  TableHead,
  TableRow,
} from "@mui/material";

const TestResults = ({ answersheet, test }) => {
  const results = useMemo(() => {
    if (!answersheet || !test) return null;

    const totalQuestions = test.questions.length;
    let correctAnswers = 0;

    // Calculate correct answers and create detailed analysis
    const detailedResults = answersheet.answers.map((answer) => {
      const question = test.questions.find((q) => q._id === answer.questionId);
      const selectedOption = question?.options.find(
        (opt) => opt._id === answer.selectedOption
      );
      const correctOption = question?.options.find((opt) => opt.isCorrect);

      const isCorrect = selectedOption?._id === correctOption?._id;
      if (isCorrect) correctAnswers++;

      return {
        questionText: question?.questionText,
        selectedAnswer: selectedOption?.text,
        correctAnswer: correctOption?.text,
        isCorrect,
      };
    });

    const score = (correctAnswers / totalQuestions) * 100;
    let remarks = "";
    let alertType = "";

    // Determine remarks based on score
    if (score >= 90) {
      remarks =
        "Excellent performance! Outstanding grasp of the subject matter.";
      alertType = "success";
    } else if (score >= 80) {
      remarks = "Very good! Strong understanding of the material.";
      alertType = "success";
    } else if (score >= 70) {
      remarks =
        "Good job! Shows decent comprehension with room for improvement.";
      alertType = "success";
    } else if (score >= 60) {
      remarks =
        "Fair. Additional study recommended to strengthen understanding.";
      alertType = "warning";
    } else {
      remarks =
        "Needs improvement. Consider reviewing the material and retaking the test.";
      alertType = "error";
    }

    return {
      score,
      correctAnswers,
      totalQuestions,
      remarks,
      alertType,
      detailedResults,
    };
  }, [answersheet, test]);

  if (!results) return <div>Loading results...</div>;

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader className="pb-2">
          <div className="flex justify-between items-center">
            <h2 className="text-2xl font-bold">Test Results</h2>
            <div className="text-lg font-semibold">
              Score: {results.score.toFixed(1)}%
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex justify-between text-sm text-muted-foreground">
              <span>Subject: {test.subject}</span>
              <span>Test Code: {test.testCode}</span>
              <span>ULI: {answersheet.uli}</span>
            </div>

            <Alert
              variant={
                results.alertType === "error" ? "destructive" : "default"
              }
            >
              <AlertCircle className="h-4 w-4" />
              <AlertTitle>Performance Analysis</AlertTitle>
              <AlertDescription>
                {results.remarks}
                <div className="mt-2">
                  Correct Answers: {results.correctAnswers} out of{" "}
                  {results.totalQuestions}
                </div>
              </AlertDescription>
            </Alert>

            <div className="mt-6">
              <h3 className="text-lg font-semibold mb-4">
                Detailed Question Analysis
              </h3>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Question</TableHead>
                    <TableHead>Your Answer</TableHead>
                    <TableHead>Correct Answer</TableHead>
                    <TableHead className="w-[100px]">Status</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {results.detailedResults.map((result, index) => (
                    <TableRow key={index}>
                      <TableCell>{result.questionText}</TableCell>
                      <TableCell>{result.selectedAnswer}</TableCell>
                      <TableCell>{result.correctAnswer}</TableCell>
                      <TableCell>
                        {result.isCorrect ? (
                          <CheckCircle2 className="h-5 w-5 text-green-500" />
                        ) : (
                          <XCircle className="h-5 w-5 text-red-500" />
                        )}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default TestResults;
