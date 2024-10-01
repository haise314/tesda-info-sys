import React from "react";
import {
  Box,
  Container,
  Grid,
  Typography,
  Link,
  IconButton,
  useTheme,
} from "@mui/material";
import FacebookIcon from "@mui/icons-material/Facebook";
import TwitterIcon from "@mui/icons-material/Twitter";
import InstagramIcon from "@mui/icons-material/Instagram";
import LinkedInIcon from "@mui/icons-material/LinkedIn";
import { Link as RouterLink } from "react-router-dom";

const Footer = () => {
  const theme = useTheme();

  const quickLinks = [
    { name: "Programs", to: "/programs" },
    { name: "Register", to: "/register" },
    { name: "Application", to: "/apply" },
    { name: "MATB", to: "/MATB" },
  ];

  const socialLinks = [
    { icon: <FacebookIcon />, href: "https://facebook.com" },
    { icon: <TwitterIcon />, href: "https://twitter.com" },
    { icon: <InstagramIcon />, href: "https://instagram.com" },
    { icon: <LinkedInIcon />, href: "https://linkedin.com" },
  ];

  return (
    <Box
      component="footer"
      sx={{
        bgcolor: "#0038a8",
        color: "white",
        py: 6,
        [theme.breakpoints.up("md")]: {
          py: 8,
        },
      }}
    >
      <Container maxWidth="lg">
        <Grid container spacing={4}>
          <Grid item xs={12} sm={6} md={3}>
            <Typography variant="h6" gutterBottom>
              Quick Links
            </Typography>
            {quickLinks.map((link) => (
              <Typography variant="body2" key={link.name}>
                <Link
                  component={RouterLink}
                  to={link.to}
                  color="inherit"
                  underline="hover"
                >
                  {link.name}
                </Link>
              </Typography>
            ))}
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <Typography variant="h6" gutterBottom>
              About TESDA
            </Typography>
            <Typography variant="body2">
              TESDA, or the Technical Education and Skills Development
              Authority, is a Philippine government agency tasked with promoting
              and regulating technical-vocational education and training.
            </Typography>
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <Typography variant="h6" gutterBottom>
              Contact Us
            </Typography>
            <Typography variant="body2">
              Email:{" "}
              <Link href="mailto:ptciba@tesda.gov.ph" color="inherit">
                ptciba@tesda.gov.ph
              </Link>
            </Typography>
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <Typography variant="h6" gutterBottom>
              Follow Us
            </Typography>
            <Box>
              {socialLinks.map((link, index) => (
                <IconButton
                  key={index}
                  component="a"
                  href={link.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  sx={{
                    color: "white",
                    "&:hover": { color: "rgba(255, 255, 255, 0.8)" },
                  }}
                >
                  {link.icon}
                </IconButton>
              ))}
            </Box>
          </Grid>
        </Grid>
        <Typography variant="body2" align="center" sx={{ mt: 4 }}>
          © {new Date().getFullYear()} TESDA. All Rights Reserved.
        </Typography>
      </Container>
    </Box>
  );
};

export default Footer;
