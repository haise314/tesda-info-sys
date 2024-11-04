import React, { useState, useEffect, useMemo } from "react";
import {
  Box,
  Button,
  IconButton,
  Typography,
  Paper,
  Avatar,
  Snackbar,
  Alert,
} from "@mui/material";
import { PhotoCamera, Delete } from "@mui/icons-material";
import { styled } from "@mui/material/styles";
import axios from "axios";
import { useAuth } from "../../../context/AuthContext";

const Input = styled("input")({
  display: "none",
});

const ImageUploadForm = () => {
  const { user } = useAuth();
  const uli = useMemo(() => user?.uli, [user?.uli]);
  const [previewUrl, setPreviewUrl] = useState(null);
  const [file, setFile] = useState(null);
  const [imageData, setImageData] = useState(null);
  const [isUploading, setIsUploading] = useState(false);
  const [showSnackbar, setShowSnackbar] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");
  const [snackbarSeverity, setSnackbarSeverity] = useState("success");

  // Move fetchImage outside useEffect so it can be reused after upload
  const fetchImage = async () => {
    try {
      const response = await axios.get(`/api/images/uli/${uli}`);
      setImageData(response.data.data);
      setPreviewUrl(response.data.data.url);
    } catch (error) {
      console.error("Error fetching image:", error);
    }
  };

  useEffect(() => {
    if (uli) {
      fetchImage();
    }
  }, [uli]);

  const handleImageChange = (event) => {
    const selectedFile = event.target.files[0];
    if (selectedFile) {
      const reader = new FileReader();
      reader.onload = (e) => {
        setPreviewUrl(e.target.result);
        setFile(selectedFile);
      };
      reader.readAsDataURL(selectedFile);
    }
  };

  const handleImageUpload = async () => {
    try {
      setIsUploading(true);
      const formData = new FormData();
      formData.append("image", file);
      formData.append("uli", uli);
      await axios.post(`/api/images/uli/${uli}`, formData);

      setSnackbarMessage("Image uploaded successfully!");
      setSnackbarSeverity("success");
      setShowSnackbar(true);

      // Refetch the image after successful upload
      fetchImage();
    } catch (error) {
      console.error("Error uploading image:", error);
      setSnackbarMessage("Error uploading image. Please try again.");
      setSnackbarSeverity("error");
      setShowSnackbar(true);
    } finally {
      setIsUploading(false);
    }
  };

  const handleDeleteImage = async () => {
    try {
      await axios.delete(`/api/images/uli/${uli}`);
      setImageData(null);
      setPreviewUrl(null);
      setSnackbarMessage("Image deleted successfully!");
      setSnackbarSeverity("success");
      setShowSnackbar(true);
    } catch (error) {
      console.error("Error deleting image:", error);
      setSnackbarMessage("Error deleting image. Please try again.");
      setSnackbarSeverity("error");
      setShowSnackbar(true);
    }
  };

  const handleSnackbarClose = (event, reason) => {
    if (reason === "clickaway") {
      return;
    }
    setShowSnackbar(false);
  };

  return (
    <Paper
      elevation={2}
      sx={{
        padding: 2,
        maxWidth: 300,
        margin: "20px 0",
        textAlign: "center",
      }}
    >
      <Box mb={2}>
        {previewUrl ? (
          <Avatar
            alt="Upload preview"
            src={previewUrl}
            variant="rounded"
            sx={{ width: 100, height: 100, margin: "0 auto" }}
          />
        ) : (
          <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
            No image selected
          </Typography>
        )}
      </Box>
      <Box mb={2}>
        <label htmlFor="icon-button-file">
          <Input
            accept="image/*"
            id="icon-button-file"
            type="file"
            onChange={handleImageChange}
          />
          <IconButton
            color="primary"
            aria-label="upload picture"
            component="span"
            size="medium"
          >
            <PhotoCamera fontSize="medium" />
          </IconButton>
        </label>
      </Box>
      <Box mb={2}>
        {imageData ? (
          <Button
            variant="contained"
            color="error"
            onClick={handleDeleteImage}
            disabled={isUploading}
            startIcon={<Delete />}
            size="small"
          >
            Delete Image
          </Button>
        ) : (
          <Button
            variant="contained"
            color="primary"
            onClick={handleImageUpload}
            disabled={isUploading || !file}
            size="small"
          >
            Upload Image
          </Button>
        )}
      </Box>

      <Snackbar
        open={showSnackbar}
        autoHideDuration={6000}
        onClose={handleSnackbarClose}
        anchorOrigin={{ vertical: "bottom", horizontal: "left" }}
      >
        <Alert
          onClose={handleSnackbarClose}
          severity={snackbarSeverity}
          sx={{ width: "100%" }}
        >
          {snackbarMessage}
        </Alert>
      </Snackbar>
    </Paper>
  );
};

export default ImageUploadForm;
