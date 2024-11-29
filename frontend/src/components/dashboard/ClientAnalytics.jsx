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
import PeopleIcon from "@mui/icons-material/People";
import AssignmentIcon from "@mui/icons-material/Assignment";
import TrendingUpIcon from "@mui/icons-material/TrendingUp";
import TrendingDownIcon from "@mui/icons-material/TrendingDown";
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

// Client Classifications List
export const clientClassifications = [
  "4Ps Beneficiary",
  "Displaced Worker",
  "Family Members of AFP and PNP Wounded in Action",
  "Industry Workers",
  "Out-Of-School Youth",
  "Rebel Returnees/Decommissioned Combatants",
  "TESDA Alumni",
  "Victim of Natural Disasters and Calamities",
  "Agrarian Reform Beneficiaries",
  "Drug Dependents Surenederers",
  "Farmers and Fishermen",
  "Inmates and Detainees",
  "Overseas Filipino Workers (OFW) Dependent",
  "Returning/Repatriated OFWs",
  "TVET Trainers",
  "Wounded-In-Action AFT and PNP Personnel",
  "Balik Probinsya",
  "Family Members of AFP and PNP Killed-in-Action",
  "MILF Beneficiary",
  "RCEF-RESP",
  "Student",
  "Uninformed Personnel",
  "Others",
];

const ClientAnalytics = () => {
  const theme = useTheme();
  const isXSmallScreen = useMediaQuery(theme.breakpoints.down("xs"));
  const isSmallScreen = useMediaQuery(theme.breakpoints.down("sm"));

  const {
    data: registrantsData,
    isLoading: registrantsLoading,
    error: registrantsError,
  } = useQuery({
    queryKey: ["registrantsData"],
    queryFn: async () => {
      const response = await axios.get("/api/register");
      return response.data.data;
    },
    refetchInterval: 30000,
    refetchOnWindowFocus: true,
    retry: 3,
    staleTime: 10000,
  });

  const {
    data: applicantsData,
    isLoading: applicantsLoading,
    error: applicantsError,
  } = useQuery({
    queryKey: ["applicantsData"],
    queryFn: async () => {
      const response = await axios.get("/api/applicants");
      return response.data.data;
    },
    refetchInterval: 30000,
    refetchOnWindowFocus: true,
    retry: 3,
    staleTime: 10000,
  });

  const analytics = useMemo(() => {
    if (!registrantsData || !applicantsData) return null;

    // Process registrants data
    const registrantsByDate = {};
    const clientClassificationCounts = {};
    const assessmentTypes = {};

    // Initialize all classifications to 0
    clientClassifications.forEach((classification) => {
      clientClassificationCounts[classification] = 0;
    });

    // Process registrants
    registrantsData.forEach((registrant) => {
      const date = new Date(registrant.createdAt).toLocaleDateString();
      registrantsByDate[date] = (registrantsByDate[date] || 0) + 1;

      const classification = registrant.clientClassification;
      clientClassificationCounts[classification] =
        (clientClassificationCounts[classification] || 0) + 1;
    });

    // Process applicants data
    const applicantsByDate = {};
    applicantsData.forEach((applicant) => {
      const date = new Date(applicant.createdAt).toLocaleDateString();
      applicantsByDate[date] = (applicantsByDate[date] || 0) + 1;

      applicant.assessments.forEach((assessment) => {
        const type = assessment.assessmentType;
        assessmentTypes[type] = (assessmentTypes[type] || 0) + 1;
      });
    });

    // Combine timeline data
    const timelineData = [];
    const allDates = new Set([
      ...Object.keys(registrantsByDate),
      ...Object.keys(applicantsByDate),
    ]);

    Array.from(allDates)
      .sort()
      .forEach((date) => {
        timelineData.push({
          date,
          registrants: registrantsByDate[date] || 0,
          applicants: applicantsByDate[date] || 0,
        });
      });

    // Transform classification data for chart
    const classificationData = Object.entries(clientClassificationCounts)
      .map(([type, count]) => ({
        type,
        count,
      }))
      .filter((item) => item.count > 0) // Only show classifications with registrants
      .sort((a, b) => b.count - a.count); // Sort from highest to lowest

    // Transform assessment type data for chart
    const assessmentData = Object.entries(assessmentTypes).map(
      ([type, count]) => ({
        type,
        count,
      })
    );

    return {
      timelineData,
      classificationData,
      assessmentData,
      totalStats: {
        totalRegistrants: registrantsData.length,
        totalApplicants: applicantsData.length,
        trend:
          timelineData.length > 1
            ? timelineData[timelineData.length - 1].registrants +
                timelineData[timelineData.length - 1].applicants >
              timelineData[timelineData.length - 2].registrants +
                timelineData[timelineData.length - 2].applicants
            : true,
      },
    };
  }, [registrantsData, applicantsData]);

  if (registrantsLoading || applicantsLoading) {
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

  if (registrantsError || applicantsError) {
    return (
      <Container>
        <Alert severity="error" sx={{ mt: 2 }}>
          Error loading data: {(registrantsError || applicantsError)?.message}
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
        Registration Analytics Dashboard
      </Typography>

      {/* Summary Cards */}
      <Grid container spacing={2} sx={{ mb: 4 }}>
        <Grid item xs={12} sm={6} md={4}>
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
                Total Registrants
              </Typography>
              <Typography variant="h4">
                {analytics.totalStats.totalRegistrants}
              </Typography>
            </Box>
            <PeopleIcon color="primary" sx={{ fontSize: 40 }} />
          </Paper>
        </Grid>

        <Grid item xs={12} sm={6} md={4}>
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
                Total Applicants
              </Typography>
              <Typography variant="h4">
                {analytics.totalStats.totalApplicants}
              </Typography>
            </Box>
            <AssignmentIcon color="secondary" sx={{ fontSize: 40 }} />
          </Paper>
        </Grid>

        <Grid item xs={12} sm={6} md={4}>
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
                Overall Trend
              </Typography>
              <Typography variant="h4">
                {analytics.totalStats.trend ? "Up" : "Down"}
              </Typography>
            </Box>
            {analytics.totalStats.trend ? (
              <TrendingUpIcon color="success" sx={{ fontSize: 40 }} />
            ) : (
              <TrendingDownIcon color="error" sx={{ fontSize: 40 }} />
            )}
          </Paper>
        </Grid>
      </Grid>

      {/* Charts */}
      <Grid container spacing={2}>
        <Grid item xs={12}>
          <Paper elevation={3} sx={{ p: 2, mb: 2 }}>
            <Typography variant="h6" gutterBottom>
              Registration Timeline
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
                    dataKey="registrants"
                    stroke={theme.palette.primary.main}
                    name="Registrants"
                  />
                  <Line
                    type="monotone"
                    dataKey="applicants"
                    stroke={theme.palette.secondary.main}
                    name="Applicants"
                  />
                </LineChart>
              </ResponsiveContainer>
            </Box>
          </Paper>
        </Grid>

        <Grid item xs={12}>
          <Paper elevation={3} sx={{ p: 2 }}>
            <Typography variant="h6" gutterBottom>
              Client Classifications
            </Typography>
            <Box sx={{ height: 600, overflowX: "auto" }}>
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={analytics.classificationData}
                  layout="vertical"
                  margin={{ left: 20, right: 20, bottom: 5 }}
                >
                  <CartesianGrid strokeDasharray="3 3" horizontal />
                  <XAxis type="number" />
                  <YAxis
                    dataKey="type"
                    type="category"
                    width={250}
                    interval={0}
                  />
                  <Tooltip />
                  <Bar
                    dataKey="count"
                    fill={theme.palette.primary.main}
                    name="Number of Registrants"
                  />
                </BarChart>
              </ResponsiveContainer>
            </Box>
          </Paper>
        </Grid>

        <Grid item xs={12} md={6}>
          <Paper elevation={3} sx={{ p: 2 }}>
            <Typography variant="h6" gutterBottom>
              Assessment Types
            </Typography>
            <Box sx={{ height: 400 }}>
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={analytics.assessmentData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="type" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Bar
                    dataKey="count"
                    fill={theme.palette.secondary.main}
                    name="Number of Assessments"
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

export default ClientAnalytics;
