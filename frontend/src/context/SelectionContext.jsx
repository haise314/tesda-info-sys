// src/context/SelectionsContext.jsx
import React, { createContext, useContext, useState } from "react";

const SelectionsContext = createContext();

export const SelectionsProvider = ({ children }) => {
  const [trainingCenters, setTrainingCenters] = useState([
    "Training Center A",
    "Training Center B",
    "Training Center C",
  ]);

  const [assessments, setAssessments] = useState([
    "Assessment A",
    "Assessment B",
    "Assessment C",
  ]);

  const [courses, setCourses] = useState(["Course A", "Course B", "Course C"]);

  const addTrainingCenter = (center) => {
    setTrainingCenters((prev) => [...prev, center]);
  };

  const removeTrainingCenter = (center) => {
    setTrainingCenters((prev) => prev.filter((c) => c !== center));
  };

  const addAssessment = (assessment) => {
    setAssessments((prev) => [...prev, assessment]);
  };

  const removeAssessment = (assessment) => {
    setAssessments((prev) => prev.filter((a) => a !== assessment));
  };

  const addCourse = (course) => {
    setCourses((prev) => [...prev, course]);
  };

  const removeCourse = (course) => {
    setCourses((prev) => prev.filter((c) => c !== course));
  };

  const value = {
    trainingCenters,
    assessments,
    courses,
    addTrainingCenter,
    removeTrainingCenter,
    addAssessment,
    removeAssessment,
    addCourse,
    removeCourse,
  };

  return (
    <SelectionsContext.Provider value={value}>
      {children}
    </SelectionsContext.Provider>
  );
};

export const useSelections = () => {
  const context = useContext(SelectionsContext);
  if (!context) {
    throw new Error("useSelections must be used within a SelectionsProvider");
  }
  return context;
};
