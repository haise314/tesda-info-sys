import React, { useState, useEffect } from "react";
import {
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  FormHelperText,
  CircularProgress,
  Box,
} from "@mui/material";
import { Controller } from "react-hook-form";

const RequiredLabel = ({ children }) => (
  <span>
    {children} <span style={{ color: "red" }}>*</span>
  </span>
);

const TrainingCenterSelectField = ({
  control,
  errors,
  name = "trainingCenterName",
  required = true,
  index,
}) => {
  const [centers, setCenters] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCenters = async () => {
      try {
        const response = await fetch("/api/training-centers");
        const data = await response.json();
        setCenters(data.filter((center) => center.isActive));
      } catch (error) {
        console.error("Error fetching training centers:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchCenters();
  }, []);

  const getErrorMessage = () => {
    if (name.includes("[")) {
      const [arrayName, arrayIndex, field] = name.match(/([^\[\]]+)/g);
      return errors?.[arrayName]?.[arrayIndex]?.[field]?.message;
    }
    return errors?.[name]?.message;
  };

  const hasError = () => {
    if (name.includes("[")) {
      const [arrayName, arrayIndex, field] = name.match(/([^\[\]]+)/g);
      return !!errors?.[arrayName]?.[arrayIndex]?.[field];
    }
    return !!errors?.[name];
  };

  return (
    <Controller
      name={name}
      control={control}
      rules={{
        required: required ? "Training center selection is required" : false,
      }}
      render={({ field }) => (
        <FormControl fullWidth error={hasError()}>
          <InputLabel id={`training-center-select-label-${index || 0}`}>
            <RequiredLabel>Training Center Information</RequiredLabel>
          </InputLabel>
          <Select
            {...field}
            labelId={`training-center-select-label-${index || 0}`}
            label="Training Center"
            disabled={loading}
          >
            {loading ? (
              <MenuItem disabled>
                <Box display="flex" justifyContent="center" width="100%" py={1}>
                  <CircularProgress size={20} />
                </Box>
              </MenuItem>
            ) : (
              centers.map((center) => (
                <MenuItem key={center._id} value={center.name}>
                  {center.name} ({center.address} - Capacity: {center.capacity})
                </MenuItem>
              ))
            )}
          </Select>
          {hasError() && <FormHelperText>{getErrorMessage()}</FormHelperText>}
        </FormControl>
      )}
    />
  );
};

export default TrainingCenterSelectField;
