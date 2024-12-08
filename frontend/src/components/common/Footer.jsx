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
import { Link as RouterLink } from "react-router-dom";

const Footer = ({
  facebookPageUrl = "https://www.facebook.com/TESDAOfficial",
}) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

  const quickLinks = [
    { name: "Courses", to: "/programs" },
    { name: "Assessments", to: "/assessments" },
    { name: "Register", to: "/registeruser" },
    { name: "Login", to: "/login" },
    { name: "Feedback", to: "/feedback" },
    { name: "News", to: "/news" },
    { name: "About", to: "/about" },
  ];

  const FooterSection = ({ title, children }) => (
    <Box sx={{ mb: { xs: 3, md: 0 } }}>
      <Typography
        variant="h6"
        gutterBottom
        sx={{
          fontWeight: 600,
          color: "white",
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
                  mb: 2,
                }}
              >
                ptciba@tesda.gov.ph
              </Link>
              <Typography variant="body2" sx={{ mb: 1 }}>
                Provincial Training Center - Iba
              </Typography>
              <Typography variant="body2">
                Tel: (047) 811-1338 / 0919-817-2078
              </Typography>
            </FooterSection>
          </Grid>

          <Grid item xs={12} sm={6} md={3}>
            <FooterSection title="Connect With Us">
              <Box sx={{ display: "flex", alignItems: "center" }}>
                <Link
                  href={facebookPageUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <IconButton
                    color="inherit"
                    aria-label="facebook"
                    sx={{
                      color: "white",
                      "&:hover": {
                        bgcolor: "rgba(255,255,255,0.1)",
                      },
                    }}
                  >
                    <FacebookIcon />
                  </IconButton>
                </Link>
                <Typography variant="body2" sx={{ ml: 1 }}>
                  Follow us on Facebook
                </Typography>
              </Box>
            </FooterSection>
          </Grid>
        </Grid>

        <Divider
          sx={{
            mt: 4,
            mb: 4,
            borderColor: "rgba(255, 255, 255, 0.1)",
          }}
        />

        <Typography
          variant="body2"
          align="center"
          sx={{
            opacity: 0.8,
            fontSize: "0.85rem",
            color: "white",
          }}
        >
          © {new Date().getFullYear()} TESDA Provincial Training Center - Iba.
          All Rights Reserved.
        </Typography>
      </Container>
    </Box>
  );
};

export default Footer;
