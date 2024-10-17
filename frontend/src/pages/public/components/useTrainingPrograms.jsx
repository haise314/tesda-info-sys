import { useQuery } from "@tanstack/react-query";
import axios from "axios";

export const useTrainingPrograms = () => {
  return useQuery({
    queryKey: ["programs"],
    queryFn: async () => {
      const { data } = await axios.get("/api/programs");
      return data;
    },
  });
};

export const useTrainingProgram = (id) => {
  return useQuery({
    queryKey: ["programs", id],
    queryFn: async () => {
      const { data } = await axios.get(`/api/programs/${id}`);
      return data;
    },
    enabled: !!id,
  });
};
