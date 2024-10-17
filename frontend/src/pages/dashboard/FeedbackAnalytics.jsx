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
  Alert,
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

const ratingToNumber = (rating) => {
  const ratingMap = {
    "Strongly Agree": 5,
    Agree: 4,
    Neutral: 3,
    Disagree: 2,
    "Strongly Disagree": 1,
    "N/A": 0,
  };
  return ratingMap[rating] || 0;
};

const FeedbackAnalytics = () => {
  const theme = useTheme();
  const isXSmallScreen = useMediaQuery(theme.breakpoints.down("xs"));
  const isSmallScreen = useMediaQuery(theme.breakpoints.down("sm"));

  const {
    data: feedbackData,
    isLoading: feedbackLoading,
    error: feedbackError,
  } = useQuery({
    queryKey: ["feedbackData"],
    queryFn: async () => {
      const response = await axios.get("/api/feedback");
      return response.data.data;
    },
    refetchInterval: 30000,
    refetchOnWindowFocus: true,
    retry: 3,
    staleTime: 10000,
    onError: (error) => {
      console.error("Error fetching feedback data:", error);
    },
  });

  const {
    data: charterData,
    isLoading: charterLoading,
    error: charterError,
  } = useQuery({
    queryKey: ["citizenCharterData"],
    queryFn: async () => {
      const response = await axios.get("/api/citizens-charter");
      return response.data.data;
    },
    refetchInterval: 30000,
    refetchOnWindowFocus: true,
    retry: 3,
    staleTime: 10000,
    onError: (error) => {
      console.error("Error fetching charter data:", error);
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

    // Process charter data
    const charterAnalytics = charterData.reduce(
      (acc, charter) => {
        const date = new Date(charter.createdAt).toLocaleDateString();
        acc.feedbacksByDate[date] = (acc.feedbacksByDate[date] || 0) + 1;

        // Process service quality dimensions
        const dimensions = charter.serviceQualityDimensions;
        let totalRating = 0;
        let ratingCount = 0;

        Object.entries(dimensions).forEach(([dimension, rating]) => {
          if (rating !== "N/A") {
            const numericalRating = ratingToNumber(rating);
            totalRating += numericalRating;
            ratingCount++;

            acc.ratingDistribution[numericalRating] =
              (acc.ratingDistribution[numericalRating] || 0) + 1;
          }
        });

        acc.totalRatings += ratingCount;
        acc.averageRating += totalRating;

        // Track service types
        acc.serviceTypes[charter.serviceType] =
          (acc.serviceTypes[charter.serviceType] || 0) + 1;

        return acc;
      },
      {
        feedbacksByDate: {},
        totalRatings: 0,
        averageRating: 0,
        ratingDistribution: {},
        serviceTypes: {},
      }
    );

    // Calculate final averages
    feedbackAnalytics.averageRating /= feedbackAnalytics.totalRatings;
    charterAnalytics.averageRating /= charterAnalytics.totalRatings;

    // Combine timeline data
    const combinedTimelineData = {};
    Object.entries(feedbackAnalytics.feedbacksByDate).forEach(
      ([date, count]) => {
        combinedTimelineData[date] = (combinedTimelineData[date] || 0) + count;
      }
    );
    Object.entries(charterAnalytics.feedbacksByDate).forEach(
      ([date, count]) => {
        combinedTimelineData[date] = (combinedTimelineData[date] || 0) + count;
      }
    );

    const timelineData = Object.entries(combinedTimelineData)
      .map(([date, count]) => ({ date, count }))
      .sort((a, b) => new Date(a.date) - new Date(b.date));

    // Combine distribution data
    const combinedDistribution = {};
    Object.entries(feedbackAnalytics.ratingDistribution).forEach(
      ([rating, count]) => {
        combinedDistribution[rating] =
          (combinedDistribution[rating] || 0) + count;
      }
    );
    Object.entries(charterAnalytics.ratingDistribution).forEach(
      ([rating, count]) => {
        combinedDistribution[rating] =
          (combinedDistribution[rating] || 0) + count;
      }
    );

    const distributionData = Object.entries(combinedDistribution).map(
      ([rating, count]) => ({
        rating:
          {
            1: "Strongly Disagree",
            2: "Disagree",
            3: "Neutral",
            4: "Agree",
            5: "Strongly Agree",
          }[rating] || rating,
        count,
      })
    );

    return {
      timelineData,
      distributionData,
      feedbackAnalytics,
      charterAnalytics,
      combinedStats: {
        totalResponses:
          feedbackAnalytics.totalRatings + charterAnalytics.totalRatings,
        averageRating:
          (feedbackAnalytics.averageRating * feedbackAnalytics.totalRatings +
            charterAnalytics.averageRating * charterAnalytics.totalRatings) /
          (feedbackAnalytics.totalRatings + charterAnalytics.totalRatings),
        areasForImprovement: Object.entries(combinedDistribution)
          .filter(([rating]) => parseInt(rating) <= 2)
          .reduce((acc, [_, count]) => acc + count, 0),
      },
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

  if (feedbackError || charterError) {
    return (
      <Container>
        <Alert severity="error" sx={{ mt: 2 }}>
          Error loading data: {(feedbackError || charterError)?.message}
        </Alert>
      </Container>
    );
  }

  if (!analytics) {
    return (
      <Container>
        <Alert severity="warning" sx={{ mt: 2 }}>
          No data available for analysis
        </Alert>
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
                {analytics.combinedStats.totalResponses}
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
                {analytics.combinedStats.averageRating.toFixed(2)}
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
                {analytics.combinedStats.areasForImprovement}
              </Typography>
            </Box>
            <WarningIcon color="warning" sx={{ fontSize: 40 }} />
          </Paper>
        </Grid>
      </Grid>

      {/* Charts */}
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
