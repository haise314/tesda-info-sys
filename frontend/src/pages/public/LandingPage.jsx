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
  List,
  ListItem,
  ListItemAvatar,
  ListItemText,
  Divider,
} from "@mui/material";
import {
  AnnouncementOutlined,
  FeedbackOutlined,
  SchoolOutlined,
} from "@mui/icons-material";
import heroImage from "../../assets/banner.jpg";
import { Link } from "react-router-dom";
import programsImage from "../../assets/programs.jpg";
import enrollmentImage from "../../assets/enrollment.jpg";
import assessmentImage from "../../assets/assessment.jpg";
import featuredImage from "../../assets/program1.jpg";

const newsItems = [
  {
    title: "New Training Program: Web Development",
    content:
      "TESDA launches a new program in Web Development to meet growing industry demands.",
    date: "May 15, 2023",
  },
  {
    title: "TESDA Partners with Local Industries",
    content:
      "New partnerships aim to enhance job placement opportunities for TESDA graduates.",
    date: "May 10, 2023",
  },
  {
    title: "Upcoming Free Assessment Day",
    content:
      "TESDA announces a free assessment day for various NC II certifications.",
    date: "May 5, 2023",
  },
];

const cardItems = [
  {
    title: "Programs",
    description:
      "Explore TESDA-accredited programs and opportunities for skills development.",
    imageUrl: programsImage, // Replace with your image path
  },
  {
    title: "Enrollment",
    description: "Find out how to enroll in various TESDA training programs.",
    imageUrl: enrollmentImage, // Replace with your image path
  },
  {
    title: "Assessment",
    description: "Discover TESDA's assessment programs and certifications.",
    imageUrl: assessmentImage, // Replace with your image path
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
          height: { xs: "300px", md: "auto" }, // Added responsive height
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
            {" "}
            {/* Changed md={6} to xs={12} md={6} for mobile responsiveness */}
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
              {" "}
              {/* Changed md={4} to xs={12} sm={6} md={4} for better responsiveness */}
              <Card
                sx={{
                  height: "100%",
                  display: "flex",
                  flexDirection: "column",
                }}
              >
                {/* CardMedia for adding the image */}
                <CardMedia
                  component="img"
                  height="200" // You can adjust the height
                  image={item.imageUrl} // Image URL from the array
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

        {/* News Feed Section */}
        <Grid container spacing={4} sx={{ mb: 4 }}>
          <Grid item xs={12} md={8}>
            <Card>
              <CardContent>
                <Typography variant="h5" gutterBottom>
                  <AnnouncementOutlined
                    sx={{ mr: 1, verticalAlign: "middle" }}
                  />
                  Latest News and Updates
                </Typography>
                <List>
                  {newsItems.map((item, index) => (
                    <React.Fragment key={index}>
                      <ListItem alignItems="flex-start">
                        <ListItemAvatar>
                          <Avatar alt="News" />
                        </ListItemAvatar>
                        <ListItemText
                          primary={item.title}
                          secondary={
                            <React.Fragment>
                              <Typography
                                sx={{ display: "inline" }}
                                component="span"
                                variant="body2"
                                color="text.primary"
                              >
                                {item.date}
                              </Typography>
                              {` — ${item.content}`}
                            </React.Fragment>
                          }
                        />
                      </ListItem>
                      {index < newsItems.length - 1 && (
                        <Divider variant="inset" component="li" />
                      )}
                    </React.Fragment>
                  ))}
                </List>
              </CardContent>
            </Card>
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
        <Card sx={{ mb: 4 }}>
          <CardContent>
            <Typography variant="h5" gutterBottom>
              <FeedbackOutlined sx={{ mr: 1, verticalAlign: "middle" }} />
              We Value Your Feedback
            </Typography>
            <Typography variant="body1" paragraph>
              Your opinions and suggestions help us improve our services. Share
              your thoughts with us!
            </Typography>
            <Button
              component={Link}
              to="/feedback"
              variant="contained"
              color="primary"
            >
              Provide Feedback
            </Button>
          </CardContent>
        </Card>
      </Container>
    </Box>
  );
};

export default LandingPage;
