import React from "react";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import Avatar from "@mui/material/Avatar";
import CircularProgress from "@mui/material/CircularProgress";
import Box from "@mui/material/Box";
import Alert from "@mui/material/Alert";

// Fetch image function using ULI
const fetchImageByUli = async ({ queryKey }) => {
  const [_, uli] = queryKey; // Destructure the queryKey
  const response = await axios.get(`/api/image/uli/${uli}`); // Ensure this endpoint matches your route

  if (response.data.success) {
    return response.data.data.url; // Adjust to return the full URL from the response
  } else {
    throw new Error("Image not found");
  }
};

const ProfileImage = ({ uli }) => {
  // Use React Query to fetch the image
  const {
    data: imagePath,
    error,
    isLoading,
  } = useQuery({
    queryKey: ["profileImage", uli],
    queryFn: fetchImageByUli,
    staleTime: 60000, // Cache the image for 1 minute
  });

  // Loading state
  if (isLoading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center">
        <CircularProgress />
      </Box>
    );
  }

  // Error handling
  if (error) {
    return (
      <Alert severity="error">Error fetching image: {error.message}</Alert>
    );
  }

  // Render the Avatar component with the fetched image
  return (
    <Avatar
      src={imagePath ? imagePath : ""} // Use the image URL
      alt="User Avatar"
      sx={{
        width: 100,
        height: 100,
        borderRadius: "50%",
      }}
    />
  );
};

export default ProfileImage;
