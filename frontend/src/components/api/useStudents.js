// useStudents.js
import { useQuery } from "@tanstack/react-query";
// import api from "./api";
import axios from "axios";

const fetchStudents = async () => {
  const { data } = await axios.get("https:localhost:5000/api/register/"); // Adjust the endpoint as needed
  return data;
};

export const useStudents = () => {
  return useQuery("students", fetchStudents);
};
