import React from "react";
import {
  Container,
  Typography,
  Grid,
  Paper,
  Box,
  Divider,
  Avatar,
} from "@mui/material";
import heroImage from "../../assets/banner.jpg";
import programsImage from "../../assets/programs.jpg";
import enrollmentImage from "../../assets/enrollment.jpg";
import assessmentImage from "../../assets/assessment.jpg";
import featuredImage from "../../assets/program1.jpg";
import responsibilitiesImage from "../../assets/responsibilities.jpg";

// Centralized image configuration for easy replacement
const IMAGES = {
  hero: heroImage,
  mandate: programsImage,
  vision: enrollmentImage,
  mission: assessmentImage,
  values: featuredImage,
  responsibilities: responsibilitiesImage,
};

const TesdaAboutPage = () => {
  const sectionStyle = {
    padding: "32px 0",
    backgroundColor: "#f4f4f4",
  };

  const paperStyle = {
    padding: "24px",
    height: "100%",
    display: "flex",
    flexDirection: "column",
    justifyContent: "space-between",
  };

  const mainSectionImageContainerStyle = {
    position: "relative",
    width: "100%",
    paddingTop: "66.66%", // 3:2 aspect ratio
    overflow: "hidden",
    borderRadius: 2,
  };

  const mainSectionImageStyle = {
    position: "absolute",
    top: 0,
    left: 0,
    width: "100%",
    height: "100%",
    objectFit: "cover",
    objectPosition: "center",
  };

  const missionVisionValuesImageStyle = {
    width: "200px",
    height: "200px",
    objectFit: "cover",
    objectPosition: "center",
  };

  return (
    <Box>
      {/* Hero Section remains unchanged */}
      <Box
        sx={{
          backgroundImage: `url(${IMAGES.hero})`,
          backgroundSize: "cover",
          backgroundPosition: "center",
          color: "white",
          py: 10,
          textAlign: "center",
          position: "relative",
          "&::before": {
            content: '""',
            position: "absolute",
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: "rgba(0,0,0,0.5)",
          },
        }}
      >
        <Container maxWidth="md" sx={{ position: "relative", zIndex: 1 }}>
          <Typography variant="h2" gutterBottom>
            Technical Education and Skills Development Authority
          </Typography>
          <Typography variant="h5">
            Empowering the Filipino Workforce through Quality Skills Development
          </Typography>
        </Container>
      </Box>

      {/* Mandate Section */}
      <Box sx={sectionStyle}>
        <Container maxWidth="lg">
          <Grid container spacing={4} alignItems="center">
            <Grid item xs={12} md={6}>
              <Typography variant="h4" gutterBottom>
                Our Mandate
              </Typography>
              <Typography variant="body1" paragraph>
                TESDA is the government agency tasked to manage and supervise
                technical education and skills development (TESD) in the
                Philippines. Created by Republic Act 7796 in 1994, TESDA
                integrated the functions of the National Manpower and Youth
                Council, Bureau of Technical-Vocational Education, and the
                Office of Apprenticeship.
              </Typography>
            </Grid>
            <Grid item xs={12} md={6}>
              <Box sx={mainSectionImageContainerStyle}>
                <Box
                  component="img"
                  src={IMAGES.mandate}
                  alt="TESDA Mandate"
                  sx={mainSectionImageStyle}
                />
              </Box>
            </Grid>
          </Grid>
        </Container>
      </Box>

      {/* Vision, Mission, Values Grid */}
      <Box sx={{ py: 6, backgroundColor: "white" }}>
        <Container maxWidth="lg">
          <Grid container spacing={4}>
            {[
              {
                image: IMAGES.vision,
                title: "Vision",
                content:
                  "The transformational leader in the technical education and skills development of the Filipino workforce.",
              },
              {
                image: IMAGES.mission,
                title: "Mission",
                content:
                  "Sets direction, promulgates relevant standards, and implements programs geared towards a quality-assured and inclusive technical education and skills development and certification system.",
              },
              {
                image: IMAGES.values,
                title: "Core Values",
                content: (
                  <Box
                    component="ul"
                    sx={{
                      pl: 2,
                      textAlign: "center",
                      listStylePosition: "inside",
                    }}
                  >
                    <li>Demonstrated Competence</li>
                    <li>Institutional Integrity</li>
                    <li>Personal Commitment</li>
                    <li>Culture of Innovativeness</li>
                    <li>Deep Sense of Nationalism</li>
                  </Box>
                ),
              },
            ].map(({ image, title, content }) => (
              <Grid item xs={12} md={4} key={title}>
                <Paper elevation={3} sx={paperStyle}>
                  <Box
                    sx={{ display: "flex", justifyContent: "center", mb: 2 }}
                  >
                    <Avatar
                      variant="rounded"
                      sx={{
                        width: 200,
                        height: 200,
                        overflow: "hidden",
                        display: "flex",
                        justifyContent: "center",
                        alignItems: "center",
                      }}
                    >
                      <Box
                        component="img"
                        src={image}
                        alt={title}
                        sx={missionVisionValuesImageStyle}
                      />
                    </Avatar>
                  </Box>
                  <Typography
                    variant="h5"
                    color="primary"
                    gutterBottom
                    textAlign="center"
                  >
                    {title}
                  </Typography>
                  <Typography variant="body1" textAlign="center">
                    {content}
                  </Typography>
                </Paper>
              </Grid>
            ))}
          </Grid>
        </Container>
      </Box>

      {/* Key Responsibilities */}
      <Box sx={sectionStyle}>
        <Container maxWidth="lg">
          <Grid container spacing={4} alignItems="center">
            <Grid item xs={12} md={6}>
              <Typography variant="h4" gutterBottom>
                Key Responsibilities
              </Typography>
              <Grid container spacing={2}>
                <Grid item xs={12} md={6}>
                  <Typography variant="h6">Mandated Functions</Typography>
                  <Box component="ul" sx={{ pl: 2 }}>
                    <li>Integrate skills development programs</li>
                    <li>Promote middle-level manpower</li>
                    <li>Approve skills standards</li>
                    <li>Develop accreditation system</li>
                    <li>Fund skills development programs</li>
                  </Box>
                </Grid>
                <Grid item xs={12} md={6}>
                  <Typography variant="h6">Strategic Expectations</Typography>
                  <Box component="ul" sx={{ pl: 2 }}>
                    <li>Devolve training functions</li>
                    <li>Reform apprenticeship programs</li>
                    <li>Involve industry in training</li>
                    <li>Formulate skills plans</li>
                    <li>Organize skills competitions</li>
                  </Box>
                </Grid>
              </Grid>
            </Grid>
            <Grid item xs={12} md={6}>
              <Box sx={mainSectionImageContainerStyle}>
                <Box
                  component="img"
                  src={IMAGES.responsibilities}
                  alt="TESDA Responsibilities"
                  sx={mainSectionImageStyle}
                />
              </Box>
            </Grid>
          </Grid>
        </Container>
      </Box>

      {/* Quality Policy */}
      <Box sx={{ py: 6, backgroundColor: "white" }}>
        <Container maxWidth="md" sx={{ textAlign: "center" }}>
          <Typography variant="h4" gutterBottom color="primary">
            Quality Policy
          </Typography>
          <Typography variant="h6" gutterBottom>
            "We measure our worth by the satisfaction of the customers we serve"
          </Typography>
          <Divider sx={{ my: 3 }} />
          <Typography variant="body1">
            We commit to comply with applicable requirements and continually
            improve our systems and processes through Strategic Decisions,
            Effectiveness, Responsiveness, Value Added Performance, Integrity,
            Citizen Focus, and Efficiency.
          </Typography>
        </Container>
      </Box>
    </Box>
  );
};

export default TesdaAboutPage;
