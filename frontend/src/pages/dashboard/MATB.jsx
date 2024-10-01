import React, { useState } from "react";
import { useForm, Controller, useFieldArray } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "@tanstack/react-query";
import axios from "axios";
import {
  TextField,
  Button,
  FormControlLabel,
  Checkbox,
  Typography,
  IconButton,
  Container,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
} from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import DeleteIcon from "@mui/icons-material/Delete";
import { testSchema } from "../../components/schema/test.schema";

const MATB = () => {
  const [openDialog, setOpenDialog] = useState(false);
  const [testCode, setTestCode] = useState("");

  const {
    control,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm({
    resolver: zodResolver(testSchema),
    defaultValues: {
      subject: "",
      instruction: "",
      questions: [
        {
          questionText: "",
          options: [
            { text: "", isCorrect: false },
            { text: "", isCorrect: false },
            { text: "", isCorrect: false },
            { text: "", isCorrect: false },
          ],
        },
      ],
    },
  });

  const { fields, append, remove } = useFieldArray({
    control,
    name: "questions",
  });

  const mutation = useMutation({
    mutationFn: (newTest) => {
      return axios.post("http://localhost:5000/api/tests", newTest);
    },
    onSuccess: (data) => {
      setTestCode(data.data.testCode); // Assuming the server returns the generated test code
      setOpenDialog(true);
      reset(); // Reset the form after successful submission
    },
  });

  const onSubmit = (data) => {
    mutation.mutate(data);
  };

  return (
    <Container maxWidth="sm">
      <form onSubmit={handleSubmit(onSubmit)}>
        <Typography variant="h4" gutterBottom>
          Create Test
        </Typography>

        <Controller
          name="subject"
          control={control}
          render={({ field }) => (
            <TextField
              {...field}
              label="Subject"
              error={!!errors.subject}
              helperText={errors.subject?.message}
              fullWidth
              margin="normal"
            />
          )}
        />

        <Controller
          name="instruction"
          control={control}
          render={({ field }) => (
            <TextField
              {...field}
              label="Instruction"
              error={!!errors.instruction}
              helperText={errors.instruction?.message}
              fullWidth
              margin="normal"
              multiline
              rows={3}
            />
          )}
        />

        {fields.map((field, index) => (
          <div key={field.id}>
            <Typography variant="h6">Question {index + 1}</Typography>
            <Controller
              name={`questions.${index}.questionText`}
              control={control}
              render={({ field }) => (
                <TextField
                  {...field}
                  label="Question Text"
                  error={!!errors.questions?.[index]?.questionText}
                  helperText={errors.questions?.[index]?.questionText?.message}
                  fullWidth
                  margin="normal"
                />
              )}
            />
            {field.options.map((option, optionIndex) => (
              <div key={optionIndex}>
                <Controller
                  name={`questions.${index}.options.${optionIndex}.text`}
                  control={control}
                  render={({ field }) => (
                    <TextField
                      {...field}
                      label={`Option ${optionIndex + 1}`}
                      error={
                        !!errors.questions?.[index]?.options?.[optionIndex]
                          ?.text
                      }
                      helperText={
                        errors.questions?.[index]?.options?.[optionIndex]?.text
                          ?.message
                      }
                      fullWidth
                      margin="normal"
                    />
                  )}
                />
                <Controller
                  name={`questions.${index}.options.${optionIndex}.isCorrect`}
                  control={control}
                  render={({ field }) => (
                    <FormControlLabel
                      control={<Checkbox {...field} />}
                      label="Correct Answer"
                    />
                  )}
                />
              </div>
            ))}
            <IconButton onClick={() => remove(index)}>
              <DeleteIcon />
            </IconButton>
          </div>
        ))}

        <Button
          startIcon={<AddIcon />}
          onClick={() =>
            append({
              questionText: "",
              options: [
                { text: "", isCorrect: false },
                { text: "", isCorrect: false },
                { text: "", isCorrect: false },
                { text: "", isCorrect: false },
              ],
            })
          }
        >
          Add Question
        </Button>

        <Button
          type="submit"
          variant="contained"
          color="primary"
          disabled={mutation.isPending}
        >
          {mutation.isPending ? "Submitting..." : "Create Test"}
        </Button>
      </form>

      <Dialog open={openDialog} onClose={() => setOpenDialog(false)}>
        <DialogTitle>Test Created Successfully</DialogTitle>
        <DialogContent>
          <Typography>Your test has been created. The test code is:</Typography>
          <Typography variant="h5" align="center">
            {testCode}
          </Typography>
          <Typography>
            Please save this code. You will need it to start test sessions.
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenDialog(false)}>Close</Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
};

export default MATB;
