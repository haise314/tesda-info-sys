import React, { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import AdminTestReview from "../../components/dashboard/AdminTestReview";
import TestResultView from "../../components/dashboard/TestResultView";
import {
  Box,
  Container,
  Paper,
  Typography,
  Tab,
  Tabs,
  TextField,
  Grid,
  Card,
  CardContent,
  CardActions,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Chip,
  LinearProgress,
  IconButton,
  InputAdornment,
} from "@mui/material";
import {
  Search as SearchIcon,
  FilterList as FilterIcon,
  Refresh as RefreshIcon,
} from "@mui/icons-material";

const TestReviewManagement = () => {
  const [selectedTab, setSelectedTab] = useState(0);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedStatus, setSelectedStatus] = useState("all");
  const [selectedTest, setSelectedTest] = useState(null);
  const [dialogOpen, setDialogOpen] = useState(false);

  // Fetch all test sessions
  const { data: testSessions, isLoading: isLoadingTestSessions } = useQuery({
    queryKey: ["testSessions"],
    queryFn: async () => {
      const response = await axios.get("/api/test-sessions", {
        params: {
          search: searchQuery,
          status: selectedStatus !== "all" ? selectedStatus : undefined,
        },
      });
      return response.data;
    },
  });

  // Fetch statistics
  const { data: statistics } = useQuery({
    queryKey: ["testStatistics"],
    queryFn: async () => {
      const response = await axios.get("/api/test-statistics");
      return response.data;
    },
  });

  const handleTabChange = (event, newValue) => {
    setSelectedTab(newValue);
  };

  const handleTestSelect = (test) => {
    setSelectedTest(test);
    setDialogOpen(true);
  };

  const handleCloseDialog = () => {
    setDialogOpen(false);
    setSelectedTest(null);
  };

  const getStatusColor = (status) => {
    const statusColors = {
      "in-progress": "info",
      completed: "success",
      reviewed: "primary",
      disputed: "warning",
    };
    return statusColors[status] || "default";
  };

  const renderDashboard = () => (
    <Box>
      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid item xs={12} md={3}>
          <Card>
            <CardContent>
              <Typography variant="h6">Total Tests</Typography>
              <Typography variant="h4">
                {statistics?.totalTests || 0}
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} md={3}>
          <Card>
            <CardContent>
              <Typography variant="h6">Pending Review</Typography>
              <Typography variant="h4">
                {statistics?.pendingReviews || 0}
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} md={3}>
          <Card>
            <CardContent>
              <Typography variant="h6">Average Score</Typography>
              <Typography variant="h4">
                {statistics?.averageScore || 0}%
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} md={3}>
          <Card>
            <CardContent>
              <Typography variant="h6">Disputed Tests</Typography>
              <Typography variant="h4">
                {statistics?.disputedTests || 0}
              </Typography>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Box>
  );

  const renderTestList = () => (
    <Box>
      <Box sx={{ mb: 3, display: "flex", gap: 2 }}>
        <TextField
          fullWidth
          variant="outlined"
          placeholder="Search by student name or ID..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <SearchIcon />
              </InputAdornment>
            ),
          }}
        />
        <Button
          variant="outlined"
          startIcon={<FilterIcon />}
          onClick={() => {
            /* Add filter dialog logic */
          }}
        >
          Filter
        </Button>
        <Button
          variant="outlined"
          startIcon={<RefreshIcon />}
          onClick={() => {
            /* Add refresh logic */
          }}
        >
          Refresh
        </Button>
      </Box>

      <Grid container spacing={2}>
        {isLoadingTestSessions ? (
          <Grid item xs={12}>
            <LinearProgress />
          </Grid>
        ) : (
          testSessions?.map((session) => (
            <Grid item xs={12} md={6} lg={4} key={session._id}>
              <Card>
                <CardContent>
                  <Box
                    sx={{
                      display: "flex",
                      justifyContent: "space-between",
                      mb: 2,
                    }}
                  >
                    <Typography variant="h6">{session.studentName}</Typography>
                    <Chip
                      label={session.status}
                      color={getStatusColor(session.status)}
                      size="small"
                    />
                  </Box>
                  <Typography variant="body2" color="text.secondary">
                    Test ID: {session.testId}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Submission Date:{" "}
                    {new Date(session.submittedAt).toLocaleDateString()}
                  </Typography>
                  <Typography variant="body1" sx={{ mt: 1 }}>
                    Score: {session.score}/{session.totalQuestions}
                  </Typography>
                </CardContent>
                <CardActions>
                  <Button
                    size="small"
                    onClick={() => handleTestSelect(session)}
                  >
                    Review
                  </Button>
                </CardActions>
              </Card>
            </Grid>
          ))
        )}
      </Grid>
    </Box>
  );

  return (
    <Container maxWidth="xl">
      <Box sx={{ mb: 4 }}>
        <Typography variant="h4" component="h1" gutterBottom>
          Test Review Management
        </Typography>
        <Paper sx={{ width: "100%", mb: 2 }}>
          <Tabs
            value={selectedTab}
            onChange={handleTabChange}
            indicatorColor="primary"
            textColor="primary"
          >
            <Tab label="Dashboard" />
            <Tab label="Test Reviews" />
          </Tabs>
        </Paper>

        {selectedTab === 0 && renderDashboard()}
        {selectedTab === 1 && renderTestList()}

        <Dialog
          open={dialogOpen}
          onClose={handleCloseDialog}
          maxWidth="lg"
          fullWidth
        >
          <DialogTitle>
            Test Review
            <IconButton
              aria-label="close"
              onClick={handleCloseDialog}
              sx={{ position: "absolute", right: 8, top: 8 }}
            >
              ×
            </IconButton>
          </DialogTitle>
          <DialogContent dividers>
            {selectedTest && (
              <Box>
                <AdminTestReview
                  answerSheetId={selectedTest.answerSheetId}
                  testSessionId={selectedTest._id}
                />
                <Box sx={{ mt: 4 }}>
                  <Typography variant="h6" gutterBottom>
                    Student View
                  </Typography>
                  <TestResultView
                    answerSheetId={selectedTest.answerSheetId}
                    testSessionId={selectedTest._id}
                    isAdmin={false}
                  />
                </Box>
              </Box>
            )}
          </DialogContent>
          <DialogActions>
            <Button onClick={handleCloseDialog}>Close</Button>
          </DialogActions>
        </Dialog>
      </Box>
    </Container>
  );
};

export default TestReviewManagement;
