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
  Snackbar,
  Alert,
} from "@mui/material";

import { useAuth } from "../../context/AuthContext";

import { useQueries, useQueryClient } from "@tanstack/react-query";

import axios from "axios";

import ProfileImage from "../../components/dashboard/ProfileImage";

import ApplicantDetails from "../../components/dashboard/ApplicantDetails";

import RegistrantDetails from "../../components/dashboard/RegistrantDetails";

import TabPanel from "./TabPanel";

import CourseAssessmentList from "../../components/dashboard/CourseAssessmentList";

import ImageUploadForm from "../public/components/ImageUploadForm";

const fetchData = async (url) => {
  const { data } = await axios.get(url);

  return data;
};

const fetchImageByUli = async (uli) => {
  const response = await axios.get(`/api/image/uli/${uli}`);

  return response.data.data;
};

const handlePrintPDF = async (data) => {
  try {
    const response = await axios.post(
      "/api/generate-pdf",

      { data },

      {
        responseType: "blob",

        headers: {
          "Content-Type": "application/json",
        },
      }
    );

    // Create a blob from the PDF stream

    const blob = new Blob([response.data], { type: "application/pdf" });

    // Create a URL for the blob

    const url = window.URL.createObjectURL(blob);

    // Create a temporary link element

    const link = document.createElement("a");

    link.href = url;

    const fileName = `registrant-details-${data.uli}.pdf`;

    link.setAttribute("download", fileName);

    // Append to body, click programmatically and cleanup

    document.body.appendChild(link);

    link.click();

    // Cleanup

    document.body.removeChild(link);

    window.URL.revokeObjectURL(url);

    return true;
  } catch (error) {
    console.error("Error generating PDF:", error);

    throw new Error(error.response?.data?.message || "Error generating PDF");
  }
};

const Profile = () => {
  const { user } = useAuth();

  const [activeTab, setActiveTab] = useState(0);

  const [isPrinting, setIsPrinting] = useState(false);

  const [profileImage, setProfileImage] = useState(null);

  const [snackbar, setSnackbar] = useState({
    open: false,

    message: "",

    severity: "success",
  });

  const queryClient = useQueryClient();

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

      {
        queryKey: ["image", uli],

        queryFn: () => fetchImageByUli(uli),

        enabled: !!uli,

        staleTime: 1000 * 60 * 5,

        retry: 1,

        refetchOnWindowFocus: false,
      },
    ],
  });

  const applicantQuery = queries[0];

  const registrantQuery = queries[1];

  const imageQuery = queries[2];

  const handlePrintClick = async (data, type) => {
    setIsPrinting(true);

    try {
      const response = await axios.post(
        "/api/generate-pdf",

        {
          data: type === "applicant" ? data.data : data,

          uli,

          type,
        },

        {
          responseType: "blob",

          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      const blob = new Blob([response.data], { type: "application/pdf" });

      const url = window.URL.createObjectURL(blob);

      const link = document.createElement("a");

      link.href = url;

      const fileName = `${type}-details-${uli}.pdf`;

      link.setAttribute("download", fileName);

      document.body.appendChild(link);

      link.click();

      document.body.removeChild(link);

      window.URL.revokeObjectURL(url);

      setSnackbar({
        open: true,

        message: "PDF generated successfully",

        severity: "success",
      });
    } catch (error) {
      console.error("Error generating PDF:", error);

      setSnackbar({
        open: true,

        message: error.message || "Error generating PDF",

        severity: "error",
      });
    } finally {
      setIsPrinting(false);
    }
  };

  const handleImageSelect = (file) => {
    setProfileImage(file);
  };

  const handleImageUpload = (image) => {
    setProfileImage(image);

    queryClient.setQueryData(["image", uli], image);
  };

  const handleCloseSnackbar = () => {
    setSnackbar((prev) => ({ ...prev, open: false }));
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
            {imageQuery.data ? (
              <ProfileImage uli={uli} imageUrl={`${imageQuery.data.url}`} />
            ) : (
              <ImageUploadForm onImageUpload={handleImageUpload} />
            )}

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
                <>
                  <ApplicantDetails
                    data={applicantQuery.data}
                    handlePrintPDF={() =>
                      handlePrintClick(applicantQuery.data, "applicant")
                    }
                    isPrinting={isPrinting}
                  />

                  <CourseAssessmentList
                    type="assessments"
                    data={applicantQuery.data?.data}
                  />
                </>
              ) : (
                <Typography>No applicant data available.</Typography>
              )}
            </TabPanel>

            <TabPanel value={activeTab} index={2}>
              {registrantQuery.data ? (
                <>
                  <RegistrantDetails
                    data={registrantQuery.data.data}
                    handlePrintPDF={() =>
                      handlePrintClick(registrantQuery.data, "registrant")
                    }
                    isPrinting={isPrinting}
                  />

                  <CourseAssessmentList
                    type="courses"
                    data={registrantQuery.data?.data}
                  />
                </>
              ) : (
                <Typography>No registrant data available.</Typography>
              )}
            </TabPanel>
          </Paper>
        </Grid>
      </Grid>

      <Snackbar
        open={snackbar.open}
        autoHideDuration={6000}
        onClose={handleCloseSnackbar}
        anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
      >
        <Alert
          onClose={handleCloseSnackbar}
          severity={snackbar.severity}
          sx={{ width: "100%" }}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Container>
  );
};

export default Profile;
