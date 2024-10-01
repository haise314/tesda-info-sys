import { useRouteError } from "react-router-dom";
import { Container, Typography, Button, Box } from "@mui/material";

export default function ErrorPage() {
  const error = useRouteError();
  console.error(error);

  return (
    <Container maxWidth="md" sx={{ mt: 8, flexGrow: 1 }}>
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          textAlign: "center",
          p: 4,
          border: "1px solid #e0e0e0",
          borderRadius: "8px",
          boxShadow: 2,
          bgcolor: "#f9f9f9",
        }}
      >
        <Typography variant="h3" gutterBottom>
          Oops!
        </Typography>
        <Typography variant="h5" gutterBottom>
          Sorry, an unexpected error has occurred.
        </Typography>
        <Typography
          variant="body1"
          color="textSecondary"
          paragraph
          sx={{ fontStyle: "italic", mb: 4 }}
        >
          <i>{error.statusText || error.message}</i>
        </Typography>
        <Button
          variant="contained"
          color="primary"
          href="/"
          sx={{
            borderRadius: "20px",
            paddingX: 4,
            "&:hover": {
              bgcolor: "primary.dark",
            },
          }}
        >
          Back to Home
        </Button>
      </Box>
    </Container>
  );
}
