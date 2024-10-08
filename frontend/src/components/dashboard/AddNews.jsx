import React, { useState } from "react";
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  TextField,
  Box,
} from "@mui/material";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import axios from "axios";

const AddNewsDialog = ({ open, onClose, onAddNews }) => {
  const [newsData, setNewsData] = useState({
    title: "",
    content: "",
    author: "",
    tags: "",
  });

  const queryClient = useQueryClient();

  const addNewsMutation = useMutation({
    mutationFn: (newNews) => axios.post("/api/news", newNews),
    onSuccess: () => {
      queryClient.invalidateQueries(["news"]);
      onAddNews();
      onClose();
    },
    onError: (error) => {
      console.error("Add news error:", error);
      alert("Failed to add news. Please try again.");
    },
  });

  const handleInputChange = (event) => {
    const { name, value } = event.target;
    setNewsData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    const formattedData = {
      ...newsData,
      tags: newsData.tags.split(",").map((tag) => tag.trim()),
    };
    addNewsMutation.mutate(formattedData);
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle>Add New News</DialogTitle>
      <form onSubmit={handleSubmit}>
        <DialogContent>
          <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
            <TextField
              name="title"
              label="Title"
              fullWidth
              value={newsData.title}
              onChange={handleInputChange}
              required
            />
            <TextField
              name="content"
              label="Content"
              fullWidth
              multiline
              rows={4}
              value={newsData.content}
              onChange={handleInputChange}
              required
            />
            <TextField
              name="author"
              label="Author"
              fullWidth
              value={newsData.author}
              onChange={handleInputChange}
              required
            />
            <TextField
              name="tags"
              label="Tags (comma-separated)"
              fullWidth
              value={newsData.tags}
              onChange={handleInputChange}
            />
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={onClose}>Cancel</Button>
          <Button type="submit" variant="contained" color="primary">
            Add News
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  );
};

export default AddNewsDialog;
