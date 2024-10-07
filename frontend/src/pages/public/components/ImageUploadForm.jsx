import React, { useState } from "react";
import { IconButton, Typography, Paper, Avatar } from "@mui/material";
import { PhotoCamera } from "@mui/icons-material";
import { styled } from "@mui/material/styles";

const Input = styled("input")({
  display: "none",
});

const ImageUploadForm = ({ onImageSelect }) => {
  const [previewUrl, setPreviewUrl] = useState(null);

  const handleImageChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        setPreviewUrl(e.target.result);
        onImageSelect(file); // Pass the file object to the parent component
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <Paper
      elevation={2}
      sx={{
        padding: 1,
        maxWidth: 250,
        margin: "20px auto",
        textAlign: "center",
      }}
    >
      {previewUrl ? (
        <Avatar
          alt="Upload preview"
          src={previewUrl}
          variant="rounded"
          sx={{ width: 100, height: 100, margin: "10px auto 0" }}
        />
      ) : (
        <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
          No image selected
        </Typography>
      )}
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
          size="large"
        >
          <PhotoCamera fontSize="large" />
        </IconButton>
      </label>
    </Paper>
  );
};

export default ImageUploadForm;
