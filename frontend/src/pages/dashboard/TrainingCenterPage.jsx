import React, { useState, useEffect } from "react";
import axios from "axios";
import {
  Container,
  Paper,
  Typography,
  TextField,
  Button,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Grid,
  IconButton,
  Box,
} from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import AddIcon from "@mui/icons-material/Add";
import { styled } from "@mui/material/styles";

// Styled components without theme
const StyledPaper = styled(Paper)({
  padding: "24px",
  marginBottom: "24px",
});

const FormContainer = styled("form")({
  display: "flex",
  flexDirection: "column",
  gap: "24px",
});

const TrainingCenterPage = () => {
  const [centers, setCenters] = useState([]);
  const [newCenter, setNewCenter] = useState({
    name: "",
    address: "",
    capacity: "",
  });

  // Fetch centers
  const fetchCenters = async () => {
    try {
      const response = await axios.get("/api/training-centers/");
      setCenters(response.data);
    } catch (error) {
      console.error("Error fetching centers:", error);
    }
  };

  useEffect(() => {
    fetchCenters();
  }, []);

  // Add new center
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post("/api/training-centers/", newCenter);
      setNewCenter({ name: "", address: "", capacity: "" });
      fetchCenters();
    } catch (error) {
      console.error("Error adding center:", error);
    }
  };

  // Delete center
  const handleDelete = async (id) => {
    try {
      await axios.delete(`/api/training-centers/${id}`);
      fetchCenters();
    } catch (error) {
      console.error("Error deleting center:", error);
    }
  };

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      {/* Add New Training Center Form */}
      <StyledPaper elevation={3}>
        <Typography variant="h5" gutterBottom>
          Add New Training Center
        </Typography>
        <FormContainer onSubmit={handleSubmit}>
          <Grid container spacing={2}>
            <Grid item xs={12} md={4}>
              <TextField
                fullWidth
                label="Center Name"
                variant="outlined"
                value={newCenter.name}
                onChange={(e) =>
                  setNewCenter({ ...newCenter, name: e.target.value })
                }
                required
              />
            </Grid>
            <Grid item xs={12} md={4}>
              <TextField
                fullWidth
                label="Address"
                variant="outlined"
                value={newCenter.address}
                onChange={(e) =>
                  setNewCenter({ ...newCenter, address: e.target.value })
                }
                required
              />
            </Grid>
            <Grid item xs={12} md={4}>
              <TextField
                fullWidth
                label="Capacity"
                type="number"
                variant="outlined"
                value={newCenter.capacity}
                onChange={(e) =>
                  setNewCenter({ ...newCenter, capacity: e.target.value })
                }
                required
              />
            </Grid>
          </Grid>
          <Box sx={{ display: "flex", justifyContent: "flex-end" }}>
            <Button
              type="submit"
              variant="contained"
              startIcon={<AddIcon />}
              size="large"
            >
              Add Training Center
            </Button>
          </Box>
        </FormContainer>
      </StyledPaper>

      {/* Training Centers List */}
      <StyledPaper elevation={3}>
        <Typography variant="h5" gutterBottom>
          Training Centers List
        </Typography>
        <TableContainer>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Name</TableCell>
                <TableCell>Address</TableCell>
                <TableCell>Capacity</TableCell>
                <TableCell align="right">Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {centers.map((center) => (
                <TableRow key={center._id}>
                  <TableCell>{center.name}</TableCell>
                  <TableCell>{center.address}</TableCell>
                  <TableCell>{center.capacity}</TableCell>
                  <TableCell align="right">
                    <IconButton
                      color="error"
                      onClick={() => handleDelete(center._id)}
                      size="small"
                    >
                      <DeleteIcon />
                    </IconButton>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </StyledPaper>
    </Container>
  );
};

export default TrainingCenterPage;
