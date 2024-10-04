import React from "react";
import {
  Box,
  Container,
  Grid,
  Typography,
  Link,
  IconButton,
  useTheme,
  useMediaQuery,
  Divider,
  Stack,
} from "@mui/material";
import FacebookIcon from "@mui/icons-material/Facebook";
import TwitterIcon from "@mui/icons-material/Twitter";
import InstagramIcon from "@mui/icons-material/Instagram";
import LinkedInIcon from "@mui/icons-material/LinkedIn";
import { Link as RouterLink } from "react-router-dom";

const Footer = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

  const quickLinks = [
    { name: "Programs", to: "/programs" },
    { name: "Register", to: "/register" },
    { name: "Application", to: "/apply" },
    { name: "MATB", to: "/MATB" },
  ];

  const socialLinks = [
    { icon: <FacebookIcon />, href: "https://facebook.com", label: "Facebook" },
    { icon: <TwitterIcon />, href: "https://twitter.com", label: "Twitter" },
    {
      icon: <InstagramIcon />,
      href: "https://instagram.com",
      label: "Instagram",
    },
    { icon: <LinkedInIcon />, href: "https://linkedin.com", label: "LinkedIn" },
  ];

  const FooterSection = ({ title, children }) => (
    <Box sx={{ mb: { xs: 3, md: 0 } }}>
      <Typography
        variant="h6"
        gutterBottom
        sx={{
          fontWeight: 600,
          position: "relative",
          "&::after": {
            content: '""',
            position: "absolute",
            bottom: -4,
            left: 0,
            width: 40,
            height: 2,
            bgcolor: "primary.light",
          },
        }}
      >
        {title}
      </Typography>
      {children}
    </Box>
  );

  return (
    <Box
      component="footer"
      sx={{
        bgcolor: "#0038a8",
        color: "white",
        pt: { xs: 6, md: 8 },
        pb: { xs: 4, md: 6 },
      }}
    >
      <Container maxWidth="lg">
        <Grid container spacing={{ xs: 4, md: 6 }}>
          <Grid item xs={12} sm={6} md={3}>
            <FooterSection title="Quick Links">
              <Stack spacing={1}>
                {quickLinks.map((link) => (
                  <Link
                    key={link.name}
                    component={RouterLink}
                    to={link.to}
                    color="inherit"
                    sx={{
                      textDecoration: "none",
                      "&:hover": {
                        textDecoration: "underline",
                        color: "primary.light",
                      },
                      fontSize: "0.9rem",
                    }}
                  >
                    {link.name}
                  </Link>
                ))}
              </Stack>
            </FooterSection>
          </Grid>

          <Grid item xs={12} sm={6} md={3}>
            <FooterSection title="About TESDA">
              <Typography variant="body2" sx={{ lineHeight: 1.7 }}>
                TESDA, or the Technical Education and Skills Development
                Authority, is a Philippine government agency tasked with
                promoting and regulating technical-vocational education and
                training.
              </Typography>
            </FooterSection>
          </Grid>

          <Grid item xs={12} sm={6} md={3}>
            <FooterSection title="Contact Us">
              <Typography variant="body2" sx={{ mb: 1 }}>
                Have questions? Reach out to us:
              </Typography>
              <Link
                href="mailto:ptciba@tesda.gov.ph"
                color="inherit"
                sx={{
                  display: "block",
                  textDecoration: "none",
                  "&:hover": {
                    color: "primary.light",
                  },
                  fontSize: "0.9rem",
                }}
              >
                ptciba@tesda.gov.ph
              </Link>
            </FooterSection>
          </Grid>

          <Grid item xs={12} sm={6} md={3}>
            <FooterSection title="Follow Us">
              <Box sx={{ mt: 2 }}>
                <Stack
                  direction="row"
                  spacing={isMobile ? 3 : 2}
                  justifyContent={{ xs: "center", sm: "flex-start" }}
                >
                  {socialLinks.map((link) => (
                    <IconButton
                      key={link.label}
                      component="a"
                      href={link.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      aria-label={link.label}
                      sx={{
                        color: "white",
                        "&:hover": {
                          color: "primary.light",
                          transform: "translateY(-3px)",
                        },
                        transition: "all 0.2s",
                      }}
                    >
                      {link.icon}
                    </IconButton>
                  ))}
                </Stack>
              </Box>
            </FooterSection>
          </Grid>
        </Grid>

        <Divider
          sx={{ mt: 4, mb: 4, borderColor: "rgba(255, 255, 255, 0.1)" }}
        />

        <Typography
          variant="body2"
          align="center"
          sx={{
            opacity: 0.8,
            fontSize: "0.85rem",
          }}
        >
          © {new Date().getFullYear()} TESDA. All Rights Reserved.
        </Typography>
      </Container>
    </Box>
  );
};

export default Footer;
