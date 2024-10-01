import React from "react";
import { Container, Grid, Paper, Typography } from "@mui/material";

const Dashboard = () => {
  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
      <Grid container spacing={3}>
        {/* Chart */}
        <Grid item xs={12} md={8} lg={9}>
          <Paper
            sx={{ p: 2, display: "flex", flexDirection: "column", height: 240 }}
          >
            <Typography variant="h6" gutterBottom>
              Chart
            </Typography>
            {/* Chart component goes here */}
          </Paper>
        </Grid>
        {/* Recent Deposits */}
        <Grid item xs={12} md={4} lg={3}>
          <Paper
            sx={{ p: 2, display: "flex", flexDirection: "column", height: 240 }}
          >
            <Typography variant="h6" gutterBottom>
              Recent Deposits
            </Typography>
            {/* Recent Deposits component goes here */}
          </Paper>
        </Grid>
        {/* Recent Orders */}
        <Grid item xs={12}>
          <Paper sx={{ p: 2, display: "flex", flexDirection: "column" }}>
            <Typography variant="h6" gutterBottom>
              Recent Orders
            </Typography>
            {/* Recent Orders component goes here */}
          </Paper>
        </Grid>
      </Grid>
    </Container>
  );
};

export default Dashboard;
