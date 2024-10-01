import React from "react";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { Bar } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";
import {
  Container,
  Typography,
  Grid,
  CircularProgress,
  Box,
} from "@mui/material";

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);
const fetchFeedbackData = async () => {
  console.log("Fetching feedback data...");
  try {
    const response = await axios.get("http://localhost:5000/api/feedback");
    console.log("Received data:", response.data);
    return response.data.data; // Access the 'data' property of the response
  } catch (error) {
    console.error("Error fetching data:", error);
    throw error;
  }
};

const processFeedbackData = (feedbacks) => {
  console.log("Processing feedback data:", feedbacks);
  if (!feedbacks || feedbacks.length === 0) {
    console.log("No feedbacks to process");
    return [];
  }

  const questions =
    feedbacks[0]?.feedbackQuestions?.map((q) => q.question) || [];
  console.log("Questions:", questions);

  return questions.map((question, index) => {
    const ratings = { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 };
    feedbacks.forEach((feedback) => {
      const rating = feedback.feedbackQuestions[index]?.rating;
      if (rating) {
        ratings[rating]++;
      }
    });

    console.log(`Processed data for question "${question}":`, ratings);

    return {
      question,
      data: {
        labels: ["1", "2", "3", "4", "5"],
        datasets: [
          {
            label: "Number of Ratings",
            data: Object.values(ratings),
            backgroundColor: "rgba(75, 192, 192, 0.6)",
          },
        ],
      },
    };
  });
};

const options = {
  responsive: true,
  plugins: {
    legend: {
      position: "top",
    },
  },
  scales: {
    y: {
      beginAtZero: true,
      ticks: {
        stepSize: 1,
      },
    },
  },
};

const FeedbackCharts = () => {
  const {
    data: feedbackData,
    isLoading,
    isError,
    error,
  } = useQuery({
    queryKey: ["feedbackData"],
    queryFn: fetchFeedbackData,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });

  const chartData = React.useMemo(() => {
    console.log("Feedback data in useMemo:", feedbackData);
    return processFeedbackData(feedbackData);
  }, [feedbackData]);

  console.log("Rendered chart data:", chartData);

  if (isLoading) {
    return (
      <Container
        sx={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          height: "100vh",
        }}
      >
        <Box sx={{ textAlign: "center" }}>
          <CircularProgress size={60} />
          <Typography variant="h6" sx={{ mt: 2 }}>
            Loading Feedback Data...
          </Typography>
        </Box>
      </Container>
    );
  }

  if (isError) {
    return (
      <Container>
        <Typography color="error">Error: {error.message}</Typography>
        <Typography color="error">Stack: {error.stack}</Typography>
      </Container>
    );
  }

  return (
    <Container>
      <Typography variant="h4" gutterBottom align="center">
        Feedback Ratings
      </Typography>
      {chartData.length > 0 ? (
        <Grid container spacing={3}>
          {chartData.map((chart, index) => (
            <Grid item xs={12} md={6} key={index}>
              <Typography variant="h6" gutterBottom>
                {chart.question}
              </Typography>
              <Bar options={options} data={chart.data} />
            </Grid>
          ))}
        </Grid>
      ) : (
        <Typography align="center">
          No feedback data available. Raw data: {JSON.stringify(feedbackData)}
        </Typography>
      )}
    </Container>
  );
};

export default FeedbackCharts;
