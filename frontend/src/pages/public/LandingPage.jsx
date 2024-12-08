import React from "react";
import {
  Box,
  Typography,
  Grid,
  Card,
  CardContent,
  CardMedia,
  Button,
  Container,
  Paper,
  Avatar,
  Stack,
} from "@mui/material";
import {
  SchoolOutlined,
  AssessmentOutlined,
  ListAltOutlined,
} from "@mui/icons-material";
import { Link } from "react-router-dom";

// Import images (ensure these paths are correct)
import heroImage from "../../assets/banner.jpg";
import programsImage from "../../assets/programs.jpg";
import enrollmentImage from "../../assets/enrollment.jpg";
import assessmentImage from "../../assets/assessment.jpg";
import skillsDevelopmentImage from "../../assets/skills.jpg";

// Import components
import NewsSection from "./components/NewsSection";
import FeedbackSection from "./components/FeedbackSection";

// Card configuration
const cardItems = [
  {
    title: "Training Programs",
    description:
      "Browse our comprehensive range of TESDA-accredited training programs across various industries and skill levels.",
    imageUrl: programsImage,
    link: "/programs",
    icon: <SchoolOutlined />,
  },
  {
    title: "Enrollment",
    description:
      "Start your skills journey with our streamlined online enrollment process. Quick, easy, and accessible.",
    imageUrl: enrollmentImage,
    link: "/enrollment-process",
    icon: <ListAltOutlined />,
  },
  {
    title: "Skills Assessment",
    description:
      "Get certified and validate your professional skills through our comprehensive assessment programs.",
    imageUrl: assessmentImage,
    link: "/assessments",
    icon: <AssessmentOutlined />,
  },
];

const LandingPage = () => {
  return (
    <Box sx={{ flexGrow: 1, bgcolor: "#f5f5f5", minHeight: "100vh" }}>
      {/* Hero Section */}
      <Paper
        sx={{
          position: "relative",
          backgroundColor: "grey.800",
          color: "#fff",
          mb: 4,
          backgroundSize: "cover",
          backgroundRepeat: "no-repeat",
          backgroundPosition: "center",
          backgroundImage: `url(${heroImage})`,
          height: { xs: "300px", md: "500px" },
        }}
      >
        <Box
          sx={{
            position: "absolute",
            top: 0,
            bottom: 0,
            right: 0,
            left: 0,
            backgroundColor: "rgba(0,0,0,.5)",
          }}
        />
        <Grid
          container
          alignItems="center"
          justifyContent="center"
          sx={{ height: "100%", position: "relative", zIndex: 1 }}
        >
          <Grid item xs={12} md={8} lg={6}>
            <Box
              sx={{
                textAlign: { xs: "center", md: "left" },
                p: { xs: 3, md: 6 },
              }}
            >
              <Typography
                component="h1"
                variant="h2"
                color="inherit"
                gutterBottom
                sx={{
                  fontWeight: "bold",
                  fontSize: { xs: "2.5rem", md: "3.5rem" },
                }}
              >
                Welcome to TESDA
              </Typography>
              <Typography
                variant="h5"
                color="inherit"
                paragraph
                sx={{
                  mb: 3,
                  fontSize: { xs: "1rem", md: "1.5rem" },
                }}
              >
                Empowering Filipinos with world-class technical education and
                skills development.
              </Typography>
              <Stack
                direction={{ xs: "column", sm: "row" }}
                spacing={2}
                justifyContent={{ xs: "center", md: "flex-start" }}
              >
                <Button
                  variant="contained"
                  color="primary"
                  size="large"
                  component={Link}
                  to="/programs"
                  sx={{
                    textTransform: "none",
                    px: 4,
                    py: 1.5,
                  }}
                >
                  Explore Programs
                </Button>
                <Button
                  variant="outlined"
                  color="inherit"
                  size="large"
                  component={Link}
                  to="/about"
                  sx={{
                    textTransform: "none",
                    px: 4,
                    py: 1.5,
                    color: "white",
                    borderColor: "white",
                    "&:hover": {
                      backgroundColor: "rgba(255,255,255,0.2)",
                    },
                  }}
                >
                  Learn More
                </Button>
              </Stack>
            </Box>
          </Grid>
        </Grid>
      </Paper>

      <Container maxWidth="lg">
        {/* Quick Access Section */}
        <Grid container spacing={4} sx={{ mb: 4 }}>
          {cardItems.map((item, index) => (
            <Grid item xs={12} sm={6} md={4} key={index}>
              <Card
                sx={{
                  height: "100%",
                  display: "flex",
                  flexDirection: "column",
                  transition: "transform 0.3s ease-in-out",
                  "&:hover": {
                    transform: "scale(1.05)",
                    boxShadow: 3,
                  },
                }}
              >
                <CardMedia
                  component="img"
                  height="200"
                  image={item.imageUrl}
                  alt={item.title}
                />
                <CardContent sx={{ flexGrow: 1 }}>
                  <Avatar sx={{ bgcolor: "primary.main", mb: 2 }}>
                    {item.icon}
                  </Avatar>
                  <Typography gutterBottom variant="h5" component="h2">
                    {item.title}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    {item.description}
                  </Typography>
                </CardContent>
                <Box sx={{ p: 2 }}>
                  <Button
                    component={Link}
                    to={item.link}
                    size="small"
                    color="primary"
                    variant="outlined"
                  >
                    Learn More
                  </Button>
                </Box>
              </Card>
            </Grid>
          ))}
        </Grid>

        {/* News and Design Section */}
        <Grid container spacing={4} sx={{ mb: 4 }}>
          <Grid
            item
            xs={12}
            md={8}
            sx={{
              display: "flex",
              alignItems: "stretch",
            }}
          >
            <NewsSection />
          </Grid>
          <Grid
            item
            xs={12}
            md={4}
            sx={{
              display: "flex",
              alignItems: "stretch",
            }}
          >
            <Card
              sx={{
                width: "100%",
                display: "flex",
                flexDirection: "column",
                transition: "transform 0.3s ease-in-out",
                "&:hover": {
                  transform: "scale(1.05)",
                  boxShadow: 3,
                },
              }}
            >
              <CardMedia
                component="img"
                height="200"
                image={skillsDevelopmentImage}
                alt="Skills Development"
              />
              <CardContent sx={{ flexGrow: 1 }}>
                <Typography
                  variant="h5"
                  component="h2"
                  color="primary"
                  gutterBottom
                >
                  Your Skills, Our Passion
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Transforming potential into professional excellence through
                  comprehensive skills development and personalized training
                  approaches.
                </Typography>
              </CardContent>
              <Box sx={{ p: 2 }}>
                <Button
                  component={Link}
                  to="/about"
                  size="small"
                  color="primary"
                  variant="outlined"
                >
                  Learn More
                </Button>
              </Box>
            </Card>
          </Grid>
        </Grid>

        {/* Feedback Section */}
        <Box sx={{ mb: 4 }}>
          <FeedbackSection />
        </Box>
      </Container>
    </Box>
  );
};

export default LandingPage;
