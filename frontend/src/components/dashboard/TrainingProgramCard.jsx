import { Card, CardContent, CardMedia, Typography, Box } from "@mui/material";

const TrainingProgramCard = ({ program }) => {
  return (
    <Card sx={{ display: "flex", mb: 2, boxShadow: 3, borderRadius: 2 }}>
      <CardMedia
        component="img"
        sx={{ width: 160, objectFit: "cover" }}
        image={program.image || "https://via.placeholder.com/160"} // Placeholder image
        alt={program.name}
      />
      <Box sx={{ display: "flex", flexDirection: "column", flexGrow: 1 }}>
        <CardContent>
          <Typography variant="h6" component="div" gutterBottom>
            {program.name}
          </Typography>
          <Typography variant="body2" color="text.secondary">
            {program.description.length > 100
              ? `${program.description.substring(0, 100)}...`
              : program.description}
          </Typography>
          <Typography variant="body2" color="text.primary" sx={{ mt: 1 }}>
            <strong>Duration:</strong> {program.duration} hours
          </Typography>
          <Typography variant="body2" color="text.primary" sx={{ mt: 1 }}>
            <strong>Slots Available:</strong> {program.slotsAvailable}
          </Typography>
          <Typography variant="body2" color="text.primary" sx={{ mt: 1 }}>
            <strong>Scholarship Available:</strong>{" "}
            {program.scholarshipAvailable ? "Yes" : "No"}
          </Typography>
        </CardContent>
      </Box>
    </Card>
  );
};

export default TrainingProgramCard;
