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

const AssessmentSelectField = ({
  control,
  index,
  errors,
  name = `assessments[${index}].assessmentTitle`,
  required = true,
}) => {
  const [assessments, setAssessments] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAssessments = async () => {
      try {
        const response = await fetch("/api/assessments");
        const data = await response.json();
        setAssessments(data.filter((assessment) => assessment.isActive));
      } catch (error) {
        console.error("Error fetching assessments:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchAssessments();
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
        required: required ? "Assessment selection is required" : false,
      }}
      render={({ field }) => (
        <FormControl fullWidth error={hasError()}>
          <InputLabel id={`assessment-select-label-${index}`}>
            Assessment Title
          </InputLabel>
          <Select
            {...field}
            labelId={`assessment-select-label-${index}`}
            label="Assessment Title"
            disabled={loading}
          >
            {loading ? (
              <MenuItem disabled>
                <Box display="flex" justifyContent="center" width="100%" py={1}>
                  <CircularProgress size={20} />
                </Box>
              </MenuItem>
            ) : (
              assessments.map((assessment) => (
                <MenuItem key={assessment._id} value={assessment.name}>
                  {assessment.name} ({assessment.type} - {assessment.duration}{" "}
                  mins)
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

export default AssessmentSelectField;
