import React, { useMemo } from "react";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import {
  Container,
  Typography,
  Grid,
  Paper,
  Box,
  CircularProgress,
  useTheme,
  useMediaQuery,
} from "@mui/material";
import TrendingUpIcon from "@mui/icons-material/TrendingUp";
import TrendingDownIcon from "@mui/icons-material/TrendingDown";
import PeopleIcon from "@mui/icons-material/People";
import StarIcon from "@mui/icons-material/Star";
import WarningIcon from "@mui/icons-material/Warning";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  BarChart,
  Bar,
} from "recharts";

const FeedbackAnalytics = () => {
  const theme = useTheme();
  const isXSmallScreen = useMediaQuery(theme.breakpoints.down("xs"));
  const isSmallScreen = useMediaQuery(theme.breakpoints.down("sm"));

  const { data: feedbackData, isLoading: feedbackLoading } = useQuery({
    queryKey: ["feedbackData"],
    queryFn: async () => {
      const response = await axios.get("/api/feedback");
      return response.data.data;
    },
  });

  const { data: charterData, isLoading: charterLoading } = useQuery({
    queryKey: ["citizenCharterData"],
    queryFn: async () => {
      const response = await axios.get("/api/citizens-charter");
      return response.data.data;
    },
  });

  const analytics = useMemo(() => {
    if (!feedbackData || !charterData) return null;

    // Process feedback data
    const feedbackAnalytics = feedbackData.reduce(
      (acc, feedback) => {
        const date = new Date(feedback.createdAt).toLocaleDateString();
        acc.feedbacksByDate[date] = (acc.feedbacksByDate[date] || 0) + 1;

        feedback.feedbackQuestions.forEach((q) => {
          acc.totalRatings += 1;
          acc.averageRating += q.rating;
          acc.ratingDistribution[q.rating] =
            (acc.ratingDistribution[q.rating] || 0) + 1;
        });

        return acc;
      },
      {
        feedbacksByDate: {},
        totalRatings: 0,
        averageRating: 0,
        ratingDistribution: {},
      }
    );

    // Calculate final averages
    feedbackAnalytics.averageRating /= feedbackAnalytics.totalRatings;

    // Transform data for charts
    const timelineData = Object.entries(feedbackAnalytics.feedbacksByDate)
      .map(([date, count]) => ({ date, count }))
      .sort((a, b) => new Date(a.date) - new Date(b.date));

    const distributionData = Object.entries(
      feedbackAnalytics.ratingDistribution
    ).map(([rating, count]) => ({
      rating: {
        1: "Strongly Disagree",
        2: "Disagree",
        3: "Neutral",
        4: "Agree",
        5: "Strongly Agree",
      }[rating],
      count,
    }));

    return {
      timelineData,
      distributionData,
      feedbackAnalytics,
    };
  }, [feedbackData, charterData]);

  if (feedbackLoading || charterLoading) {
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

  if (!analytics) {
    return (
      <Container>
        <Typography color="error" variant="h6">
          Error loading analytics data
        </Typography>
      </Container>
    );
  }

  return (
    <Container maxWidth="lg" sx={{ py: 2 }}>
      <Typography variant="h5" gutterBottom align="center" sx={{ mb: 4 }}>
        Feedback Analytics Dashboard
      </Typography>

      {/* Summary Cards */}
      <Grid container spacing={2} sx={{ mb: 4 }}>
        <Grid item xs={12} sm={6} md={3}>
          <Paper
            elevation={3}
            sx={{
              p: 2,
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
            }}
          >
            <Box>
              <Typography variant="subtitle2" color="textSecondary">
                Total Responses
              </Typography>
              <Typography variant="h4">
                {analytics.feedbackAnalytics.totalRatings}
              </Typography>
            </Box>
            <PeopleIcon color="primary" sx={{ fontSize: 40 }} />
          </Paper>
        </Grid>

        <Grid item xs={12} sm={6} md={3}>
          <Paper
            elevation={3}
            sx={{
              p: 2,
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
            }}
          >
            <Box>
              <Typography variant="subtitle2" color="textSecondary">
                Average Rating
              </Typography>
              <Typography variant="h4">
                {analytics.feedbackAnalytics.averageRating.toFixed(2)}
              </Typography>
            </Box>
            <StarIcon
              sx={{ fontSize: 40, color: theme.palette.warning.main }}
            />
          </Paper>
        </Grid>

        <Grid item xs={12} sm={6} md={3}>
          <Paper
            elevation={3}
            sx={{
              p: 2,
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
            }}
          >
            <Box>
              <Typography variant="subtitle2" color="textSecondary">
                Trend
              </Typography>
              <Typography variant="h4">
                {analytics.timelineData.length > 1 &&
                analytics.timelineData[analytics.timelineData.length - 1]
                  .count >
                  analytics.timelineData[analytics.timelineData.length - 2]
                    .count
                  ? "Up"
                  : "Down"}
              </Typography>
            </Box>
            {analytics.timelineData.length > 1 &&
            analytics.timelineData[analytics.timelineData.length - 1].count >
              analytics.timelineData[analytics.timelineData.length - 2]
                .count ? (
              <TrendingUpIcon color="success" sx={{ fontSize: 40 }} />
            ) : (
              <TrendingDownIcon color="error" sx={{ fontSize: 40 }} />
            )}
          </Paper>
        </Grid>

        <Grid item xs={12} sm={6} md={3}>
          <Paper
            elevation={3}
            sx={{
              p: 2,
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
            }}
          >
            <Box>
              <Typography variant="subtitle2" color="textSecondary">
                Areas for Improvement
              </Typography>
              <Typography variant="h4">
                {Object.entries(analytics.feedbackAnalytics.ratingDistribution)
                  .filter(([rating]) => parseInt(rating) <= 2)
                  .reduce((acc, [_, count]) => acc + count, 0)}
              </Typography>
            </Box>
            <WarningIcon color="warning" sx={{ fontSize: 40 }} />
          </Paper>
        </Grid>
      </Grid>

      {/* Timeline Chart */}
      <Grid container spacing={2}>
        <Grid item xs={12}>
          <Paper elevation={3} sx={{ p: 2, mb: 2 }}>
            <Typography variant="h6" gutterBottom>
              Response Timeline
            </Typography>
            <Box sx={{ height: 400 }}>
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={analytics.timelineData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="date" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Line
                    type="monotone"
                    dataKey="count"
                    stroke={theme.palette.primary.main}
                    name="Responses"
                  />
                </LineChart>
              </ResponsiveContainer>
            </Box>
          </Paper>
        </Grid>

        {/* Rating Distribution */}
        <Grid item xs={12}>
          <Paper elevation={3} sx={{ p: 2 }}>
            <Typography variant="h6" gutterBottom>
              Rating Distribution
            </Typography>
            <Box sx={{ height: 400 }}>
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={analytics.distributionData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="rating" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Bar
                    dataKey="count"
                    fill={theme.palette.primary.main}
                    name="Number of Ratings"
                  />
                </BarChart>
              </ResponsiveContainer>
            </Box>
          </Paper>
        </Grid>
      </Grid>
    </Container>
  );
};

export default FeedbackAnalytics;
