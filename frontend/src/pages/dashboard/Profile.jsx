import React, { useState, useMemo } from "react";
import {
  Container,
  Typography,
  Grid,
  Paper,
  Tabs,
  Tab,
  CircularProgress,
  Box,
} from "@mui/material";
import { useAuth } from "../../context/AuthContext";
import { useMutation, useQueries } from "@tanstack/react-query";
import axios from "axios";
import ProfileImage from "../../components/dashboard/ProfileImage";
import ApplicantDetails from "../../components/dashboard/ApplicantDetails";
import RegistrantDetails from "../../components/dashboard/RegistrantDetails";
import TabPanel from "./TabPanel";

const fetchData = async (url) => {
  const { data } = await axios.get(url);
  return data;
};

const generatePDF = async ({ type, uli, data }) => {
  const response = await axios.post(
    "/api/generate-pdf",
    { type, uli, data },
    { responseType: "blob" }
  );
  return response.data;
};

const Profile = () => {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState(0);

  // Memoize the ULI to ensure it does not trigger unnecessary re-renders
  const uli = useMemo(() => user?.uli, [user?.uli]);

  const queries = useQueries({
    queries: [
      {
        queryKey: ["applicant", uli],
        queryFn: () => fetchData(`/api/applicants/uli/${uli}`),
        enabled: !!uli, // Fetch only if ULI exists
        staleTime: 1000 * 60 * 5, // Data stays fresh for 5 minutes
        retry: 1,
        refetchOnWindowFocus: false, // Do not refetch on window focus
      },
      {
        queryKey: ["registrant", uli],
        queryFn: () => fetchData(`/api/register/uli/${uli}`),
        enabled: !!uli, // Fetch only if ULI exists
        staleTime: 1000 * 60 * 5, // Data stays fresh for 5 minutes
        retry: 1,
        refetchOnWindowFocus: false, // Do not refetch on window focus
      },
    ],
  });

  const applicantQuery = queries[0];
  const registrantQuery = queries[1];

  const pdfMutation = useMutation({
    mutationFn: generatePDF,
    onSuccess: (data) => {
      const blob = new Blob([data], { type: "application/pdf" });
      const url = window.URL.createObjectURL(blob);
      window.open(url);
    },
    onError: (error) => {
      console.error("Error generating PDF:", error);
    },
  });

  const handlePrintPDF = (type, data) => {
    if (!data) {
      console.error("No data found for PDF generation");
      return;
    }

    pdfMutation.mutate({
      type,
      uli: user.uli,
      data,
    });
  };

  const isLoading = queries.some((query) => query.isLoading);
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
        <CircularProgress />
      </Container>
    );
  }

  return (
    <Container sx={{ padding: 4 }}>
      <Grid container spacing={3}>
        <Grid
          item
          xs={12}
          display="flex"
          justifyContent="center"
          alignItems="center"
        >
          <Box display="flex" flexDirection="column" alignItems="center">
            <ProfileImage uli={uli} />
            <Typography variant="h4" gutterBottom sx={{ mt: 2 }}>
              {uli || "User Name"}
            </Typography>
          </Box>
        </Grid>

        <Grid item xs={12}>
          <Paper sx={{ width: "100%", marginTop: 2 }}>
            <Tabs
              value={activeTab}
              onChange={(e, value) => setActiveTab(value)}
              centered
            >
              <Tab label="Basic Info" />
              <Tab label="Applicant Details" disabled={!applicantQuery.data} />
              <Tab
                label="Registrant Details"
                disabled={!registrantQuery.data}
              />
            </Tabs>

            <TabPanel value={activeTab} index={0}>
              <Box>
                <Typography variant="h6" gutterBottom>
                  User Details
                </Typography>
                <Typography>ULI: {uli}</Typography>
                <Typography>Role: {user?.role}</Typography>
              </Box>
            </TabPanel>

            <TabPanel value={activeTab} index={1}>
              {applicantQuery.data ? (
                <ApplicantDetails
                  data={applicantQuery.data}
                  handlePrintPDF={() =>
                    handlePrintPDF("applicant", applicantQuery.data)
                  }
                  isPrinting={pdfMutation.isLoading}
                />
              ) : (
                <Typography>No applicant data available.</Typography>
              )}
            </TabPanel>

            <TabPanel value={activeTab} index={2}>
              {registrantQuery.data ? (
                <RegistrantDetails
                  data={registrantQuery.data.data}
                  handlePrintPDF={() =>
                    handlePrintPDF("registrant", registrantQuery.data.data)
                  }
                  isPrinting={pdfMutation.isLoading}
                />
              ) : (
                <Typography>No registrant data available.</Typography>
              )}
            </TabPanel>
          </Paper>
        </Grid>
      </Grid>
    </Container>
  );
};

export default Profile;
