import React from "react";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { Doughnut } from "react-chartjs-2";
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from "chart.js";
import {
  Container,
  Typography,
  Grid,
  CircularProgress,
  Box,
  Paper,
  useTheme,
  useMediaQuery,
} from "@mui/material";

ChartJS.register(ArcElement, Tooltip, Legend);

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

const FeedbackCharts = () => {
  const theme = useTheme();
  const isXSmallScreen = useMediaQuery(theme.breakpoints.down("xs"));
  const isSmallScreen = useMediaQuery(theme.breakpoints.down("sm"));

  const {
    data: feedbackData,
    isLoading,
    isError,
    error,
  } = useQuery({
    queryKey: ["feedbackData"],
    queryFn: fetchFeedbackData,
    refetchOnMount: true,
    refetchOnWindowFocus: true,
    cacheTime: 0,
    staleTime: 0,
  });

  const chartData = React.useMemo(() => {
    return processFeedbackData(feedbackData);
  }, [feedbackData]);

  const chartOptions = React.useMemo(
    () => ({
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: {
          position: isXSmallScreen ? "bottom" : "right",
          labels: {
            boxWidth: 10,
            padding: isXSmallScreen ? 5 : 10,
            font: {
              size: isXSmallScreen ? 10 : 12,
            },
          },
        },
        tooltip: {
          callbacks: {
            label: function (tooltipItem) {
              const dataset = tooltipItem.dataset;
              const total = dataset.data.reduce((a, b) => a + b, 0);
              const currentValue = dataset.data[tooltipItem.dataIndex];
              const percentage = Math.floor((currentValue / total) * 100 + 0.5);
              return `${tooltipItem.label}: ${percentage}% (${currentValue})`;
            },
          },
        },
      },
    }),
    [isXSmallScreen]
  );

  if (isLoading) {
    return (
      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          height: "100vh",
        }}
      >
        <CircularProgress />
      </Box>
    );
  }

  if (isError) {
    return (
      <Container>
        <Typography color="error" variant="h6">
          Error: {error.message}
        </Typography>
      </Container>
    );
  }

  return (
    <Container maxWidth="lg" sx={{ py: 2 }}>
      <Typography variant="h5" gutterBottom align="center" sx={{ mb: 2 }}>
        Feedback Ratings
      </Typography>
      <Grid container spacing={2}>
        {chartData.map((chart, index) => (
          <Grid item xs={12} sm={6} md={3} key={index}>
            <Paper
              elevation={3}
              sx={{
                p: 1,
                height: isXSmallScreen ? 300 : isSmallScreen ? 350 : 400,
              }}
            >
              <Typography variant="subtitle2" align="center" sx={{ mb: 1 }}>
                {chart.question}
              </Typography>
              <Box
                sx={{
                  height: isXSmallScreen ? "85%" : "90%",
                  position: "relative",
                }}
              >
                <Doughnut data={chart.data} options={chartOptions} />
              </Box>
            </Paper>
          </Grid>
        ))}
      </Grid>
    </Container>
  );
};

export default FeedbackCharts;
