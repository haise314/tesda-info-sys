const API_BASE_URL =
  process.env.NODE_ENV === "production"
    ? "https://tesda-info-sys.onrender.com" // Your production API URL
    : "http://localhost:5000";

export default API_BASE_URL;
