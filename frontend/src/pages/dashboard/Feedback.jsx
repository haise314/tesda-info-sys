import React from "react";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { Pie } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PieController,
  Title,
  Tooltip,
  Legend,
  ArcElement,
} from "chart.js";
import {
  Container,
  Typography,
  Grid,
  CircularProgress,
  Box,
  Divider,
  Paper,
} from "@mui/material";

ChartJS.register(
  CategoryScale,
  LinearScale,
  PieController,
  Title,
  Tooltip,
  Legend,
  ArcElement
);

const fetchFeedbackData = async () => {
  try {
    const response = await axios.get("/api/feedback");
    return response.data.data;
  } catch (error) {
    console.error("Error fetching data:", error);
    throw error;
  }
};

const processFeedbackData = (feedbacks) => {
  if (!feedbacks || feedbacks.length === 0) {
    return [];
  }

  const questions =
    feedbacks[0]?.feedbackQuestions?.map((q) => q.question) || [];

  return questions.map((question, index) => {
    const ratings = { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 };
    feedbacks.forEach((feedback) => {
      const rating = feedback.feedbackQuestions[index]?.rating;
      if (rating) {
        ratings[rating]++;
      }
    });

    return {
      question,
      data: {
        labels: ["1", "2", "3", "4", "5"],
        datasets: [
          {
            label: "Number of Ratings",
            data: Object.values(ratings),
            backgroundColor: [
              "#FF6384",
              "#36A2EB",
              "#FFCE56",
              "#4BC0C0",
              "#9966FF",
            ],
            hoverBackgroundColor: [
              "#FF6384",
              "#36A2EB",
              "#FFCE56",
              "#4BC0C0",
              "#9966FF",
            ],
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
    tooltip: {
      callbacks: {
        label: function (tooltipItem) {
          const dataset = tooltipItem.dataset;
          const total = dataset.data.reduce((a, b) => a + b, 0);
          const currentValue = dataset.data[tooltipItem.dataIndex];
          const percentage = Math.floor((currentValue / total) * 100 + 0.5);

          return `${
            dataset.labels[tooltipItem.dataIndex]
          }: ${percentage}% (${currentValue})`;
        },
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
    refetchOnMount: true, // Add this to refetch when component mounts
    refetchOnWindowFocus: true, // Add this to refetch when window gains focus
    cacheTime: 0, // Disable caching
    staleTime: 0, // Data is immediately considered stale
  });

  const chartData = React.useMemo(() => {
    return processFeedbackData(feedbackData);
  }, [feedbackData]);

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
            <Grid item xs={6} md={3} key={index}>
              <Paper
                sx={{
                  p: 2,
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  justifyContent: "center",
                  aspectRatio: "1/1",
                }}
                elevation={2}
              >
                <Typography
                  variant="label"
                  gutterBottom
                  sx={{
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    textAlign: "center",
                  }}
                >
                  {chart.question}
                </Typography>
                <Divider />
                <Pie options={options} data={chart.data} />
              </Paper>
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
