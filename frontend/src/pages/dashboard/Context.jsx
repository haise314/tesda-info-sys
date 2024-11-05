// src/components/dashboard/Context.jsx
import React, { useState } from "react";
import {
  Paper,
  Typography,
  TextField,
  Button,
  List,
  ListItem,
  ListItemText,
  ListItemSecondaryAction,
  IconButton,
  Grid,
  Divider,
} from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import { useSelections } from "../../context/SelectionContext";

const Context = () => {
  const {
    trainingCenters,
    assessments,
    courses,
    addTrainingCenter,
    removeTrainingCenter,
    addAssessment,
    removeAssessment,
    addCourse,
    removeCourse,
  } = useSelections();

  const [newTrainingCenter, setNewTrainingCenter] = useState("");
  const [newAssessment, setNewAssessment] = useState("");
  const [newCourse, setNewCourse] = useState("");

  const handleAddTrainingCenter = () => {
    if (newTrainingCenter.trim()) {
      addTrainingCenter(newTrainingCenter.trim());
      setNewTrainingCenter("");
    }
  };

  const handleAddAssessment = () => {
    if (newAssessment.trim()) {
      addAssessment(newAssessment.trim());
      setNewAssessment("");
    }
  };

  const handleAddCourse = () => {
    if (newCourse.trim()) {
      addCourse(newCourse.trim());
      setNewCourse("");
    }
  };

  const SelectionSection = ({
    title,
    items,
    newValue,
    setNewValue,
    handleAdd,
    handleRemove,
  }) => (
    <Grid item xs={12} md={4}>
      <Typography variant="h6" gutterBottom>
        {title}
      </Typography>
      <TextField
        fullWidth
        value={newValue}
        onChange={(e) => setNewValue(e.target.value)}
        placeholder={`Add new ${title.toLowerCase()}`}
        margin="normal"
      />
      <Button variant="contained" onClick={handleAdd} fullWidth sx={{ mb: 2 }}>
        Add {title}
      </Button>
      <List>
        {items.map((item) => (
          <ListItem key={item}>
            <ListItemText primary={item} />
            <ListItemSecondaryAction>
              <IconButton edge="end" onClick={() => handleRemove(item)}>
                <DeleteIcon />
              </IconButton>
            </ListItemSecondaryAction>
          </ListItem>
        ))}
      </List>
    </Grid>
  );

  return (
    <Paper elevation={3} sx={{ p: 4, m: 4 }}>
      <Typography variant="h4" gutterBottom>
        Manage Selections
      </Typography>
      <Divider sx={{ mb: 4 }} />

      <Grid container spacing={4}>
        <SelectionSection
          title="Training Centers"
          items={trainingCenters}
          newValue={newTrainingCenter}
          setNewValue={setNewTrainingCenter}
          handleAdd={handleAddTrainingCenter}
          handleRemove={removeTrainingCenter}
        />

        <SelectionSection
          title="Assessments"
          items={assessments}
          newValue={newAssessment}
          setNewValue={setNewAssessment}
          handleAdd={handleAddAssessment}
          handleRemove={removeAssessment}
        />

        <SelectionSection
          title="Courses"
          items={courses}
          newValue={newCourse}
          setNewValue={setNewCourse}
          handleAdd={handleAddCourse}
          handleRemove={removeCourse}
        />
      </Grid>
    </Paper>
  );
};

export default Context;
