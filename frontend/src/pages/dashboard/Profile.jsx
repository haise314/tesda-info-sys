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
import { useQueries } from "@tanstack/react-query";
import axios from "axios";
import ProfileImage from "../../components/dashboard/ProfileImage";
import ApplicantDetails from "../../components/dashboard/ApplicantDetails";
import RegistrantDetails from "../../components/dashboard/RegistrantDetails";
import TabPanel from "./TabPanel";

const fetchData = async (url) => {
  const { data } = await axios.get(url);
  return data;
};

const handlePrintPDF = async (data) => {
  try {
    const response = await axios.post(
      "/api/generate-pdf",
      { data },
      {
        responseType: "blob",
      }
    );

    const blob = new Blob([response.data], { type: "application/pdf" });
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.setAttribute("download", "registrant-details.pdf");
    document.body.appendChild(link);
    link.click();
    link.remove();
    window.URL.revokeObjectURL(url);
  } catch (error) {
    console.error("Error generating PDF:", error);
  }
};

const handlePrintPDFApplicant = async (data) => {
  try {
    const response = await axios.post(
      "/api/generate-pdf-applicant",
      { data },
      {
        responseType: "blob",
      }
    );

    const blob = new Blob([response.data], { type: "application/pdf" });
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.setAttribute("download", "registrant-details.pdf");
    document.body.appendChild(link);
    link.click();
    link.remove();
    window.URL.revokeObjectURL(url);
  } catch (error) {
    console.error("Error generating PDF:", error);
  }
};

const Profile = () => {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState(0);
  const [isPrinting, setIsPrinting] = useState(false);

  const uli = useMemo(() => user?.uli, [user?.uli]);

  const queries = useQueries({
    queries: [
      {
        queryKey: ["applicant", uli],
        queryFn: () => fetchData(`/api/applicants/uli/${uli}`),
        enabled: !!uli,
        staleTime: 1000 * 60 * 5,
        retry: 1,
        refetchOnWindowFocus: false,
      },
      {
        queryKey: ["registrant", uli],
        queryFn: () => fetchData(`/api/register/uli/${uli}`),
        enabled: !!uli,
        staleTime: 1000 * 60 * 5,
        retry: 1,
        refetchOnWindowFocus: false,
      },
    ],
  });

  const applicantQuery = queries[0];
  const registrantQuery = queries[1];

  const handlePrintClick = async (data) => {
    setIsPrinting(true);
    try {
      await handlePrintPDF(data);
    } finally {
      setIsPrinting(false);
    }
  };

  const handlePrintClickApplicant = async (data) => {
    setIsPrinting(true);
    try {
      await handlePrintPDFApplicant(data);
    } finally {
      setIsPrinting(false);
    }
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
            {console.log(
              "ApplicantQuery.data.data",
              applicantQuery?.data?.data
            )}
            <TabPanel value={activeTab} index={1}>
              {applicantQuery.data ? (
                <ApplicantDetails
                  data={applicantQuery.data}
                  handlePrintPDF={() =>
                    handlePrintClickApplicant(applicantQuery.data?.data)
                  }
                  isPrinting={isPrinting}
                />
              ) : (
                <Typography>No applicant data available.</Typography>
              )}
            </TabPanel>
            {console.log("RegistrantQuery.data", registrantQuery?.data?.data)}
            <TabPanel value={activeTab} index={2}>
              {registrantQuery.data ? (
                <RegistrantDetails
                  data={registrantQuery.data.data}
                  handlePrintPDF={() =>
                    handlePrintClick(registrantQuery.data.data)
                  }
                  isPrinting={isPrinting}
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
