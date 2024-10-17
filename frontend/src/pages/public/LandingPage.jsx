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
} from "@mui/material";
import { SchoolOutlined } from "@mui/icons-material";
import { Link } from "react-router-dom";
import heroImage from "../../assets/banner.jpg";
import programsImage from "../../assets/programs.jpg";
import enrollmentImage from "../../assets/enrollment.jpg";
import assessmentImage from "../../assets/assessment.jpg";
import featuredImage from "../../assets/program1.jpg";
import NewsSection from "./components/NewsSection";
import FeedbackSection from "./components/FeedbackSection";

const cardItems = [
  {
    title: "Programs",
    description:
      "Explore TESDA-accredited programs and opportunities for skills development.",
    imageUrl: programsImage,
  },
  {
    title: "Enrollment",
    description: "Find out how to enroll in various TESDA training programs.",
    imageUrl: enrollmentImage,
  },
  {
    title: "Assessment",
    description: "Discover TESDA's assessment programs and certifications.",
    imageUrl: assessmentImage,
  },
];

const LandingPage = () => {
  return (
    <Box sx={{ flexGrow: 1, bgcolor: "#f5f5f5" }}>
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
          height: { xs: "300px", md: "auto" },
        }}
      >
        <Box
          sx={{
            position: "absolute",
            top: 0,
            bottom: 0,
            right: 0,
            left: 0,
            backgroundColor: "rgba(0,0,0,.3)",
          }}
        />
        <Grid container>
          <Grid item xs={12} md={6}>
            <Box
              sx={{
                position: "relative",
                p: { xs: 3, md: 6 },
                pr: { md: 0 },
              }}
            >
              <Typography
                component="h1"
                variant="h3"
                color="inherit"
                gutterBottom
              >
                Welcome to TESDA
              </Typography>
              <Typography variant="h5" color="inherit" paragraph>
                Empowering Filipinos with world-class technical education and
                skills development.
              </Typography>
              <Button variant="contained" color="primary">
                Explore Programs
              </Button>
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
                    <SchoolOutlined />
                  </Avatar>
                  <Typography gutterBottom variant="h5" component="h2">
                    {item.title}
                  </Typography>
                  <Typography>{item.description}</Typography>
                </CardContent>
                <Box sx={{ p: 2 }}>
                  <Button
                    component={Link}
                    to="/programs"
                    size="small"
                    color="primary"
                  >
                    Learn More
                  </Button>
                </Box>
              </Card>
            </Grid>
          ))}
        </Grid>

        {/* News and Featured Program Section */}
        <Grid container spacing={4} sx={{ mb: 4 }}>
          <Grid item xs={12} md={8}>
            <NewsSection />
          </Grid>
          <Grid item xs={12} md={4}>
            <Card>
              <CardMedia
                component="img"
                height="200"
                image={featuredImage}
                alt="Featured Program"
              />
              <CardContent>
                <Typography gutterBottom variant="h5" component="div">
                  Featured Program
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Discover our latest program in Information Technology,
                  designed to meet the demands of the digital age.
                </Typography>
              </CardContent>
              <Box sx={{ p: 2 }}>
                <Button size="small" color="primary">
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
