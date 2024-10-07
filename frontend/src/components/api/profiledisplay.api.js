import axios from "axios";

export const fetchRegistrant = async (uli) => {
  if (!uli) return null;
  const response = await axios.get("/api/register");
  const registrant = response.data.data.find((r) => r.uli === uli);
  return registrant || null; // Return null instead of undefined if no registrant is found
};

export const fetchApplicant = async (uli) => {
  if (!uli) return null;
  const response = await axios.get("/api/applicants");
  const applicant = response.data.data.find((a) => a.uli === uli);
  return applicant || null; // Return null instead of undefined if no applicant is found
};

export const fetchProfileImage = async (uli) => {
  if (!uli) {
    console.log("No ULI provided");
    return null;
  }

  try {
    const response = await axios.get(`/api/images/${uli}`);
    console.log("from client API:", response.data);
    console.log("success from client API:", response.data.success);
    console.log("path from client API:", response.data.path);

    if (response.data.success && response.data.path) {
      const baseUrl = process.env.REACT_APP_API_URL || window.location.origin;
      const fullImageUrl = `${baseUrl}${response.data.path}`;
      console.log("Full image URL:", fullImageUrl);
      return fullImageUrl;
    } else {
      console.log("No image path found in response");
      return null;
    }
  } catch (error) {
    if (error.response?.status === 404) {
      console.log("Image not found (404)");
      return null;
    }
    console.error("Error fetching profile image:", error);
    throw error;
  }
};

export const generatePDF = async ({ type, uli, profileImage, data }) => {
  if (!uli || !data)
    throw new Error("Missing required data for PDF generation");

  const response = await axios.post(
    `/api/generate-pdf/${type}`,
    {
      uli,
      profileImage,
      data,
    },
    {
      responseType: "blob",
    }
  );
  return response.data;
};
