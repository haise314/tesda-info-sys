import React, { useState, useEffect } from "react";
import {
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  FormHelperText,
} from "@mui/material";
import { Controller } from "react-hook-form";

const ProgramSelectField = ({ control, name, errors, rules }) => {
  const [programs, setPrograms] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPrograms = async () => {
      try {
        const response = await fetch("/api/programs");
        const data = await response.json();
        setPrograms(data);
      } catch (error) {
        console.error("Error fetching programs:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchPrograms();
  }, []);

  return (
    <Controller
      name={name}
      control={control}
      rules={rules}
      render={({ field }) => (
        <FormControl fullWidth error={!!errors?.courseName}>
          <InputLabel>Select Program</InputLabel>
          <Select {...field} label="Select Program" disabled={loading}>
            {programs.map((program) => (
              <MenuItem key={program._id} value={program.name}>
                {program.name}
              </MenuItem>
            ))}
          </Select>
          {errors?.courseName && (
            <FormHelperText>{errors.courseName.message}</FormHelperText>
          )}
        </FormControl>
      )}
    />
  );
};

export default ProgramSelectField;
