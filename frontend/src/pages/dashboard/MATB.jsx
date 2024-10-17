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
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Card,
  CardContent,
  Alert,
} from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import DeleteIcon from "@mui/icons-material/Delete";
import ImageIcon from "@mui/icons-material/Image";

const MATB = () => {
  const [openDialog, setOpenDialog] = useState(false);
  const [testCode, setTestCode] = useState("");

  const {
    control,
    handleSubmit,
    formState: { errors },
    reset,
    watch,
    setError,
    clearErrors,
  } = useForm({
    defaultValues: {
      subject: "",
      instruction: "",
      passages: [
        {
          content: "",
          imageUrl: "",
        },
      ],
      questions: [
        {
          questionText: "",
          questionImageUrl: "",
          passageIndex: -1,
          options: [
            { text: "", imageUrl: "", isCorrect: false },
            { text: "", imageUrl: "", isCorrect: false },
            { text: "", imageUrl: "", isCorrect: false },
            { text: "", imageUrl: "", isCorrect: false },
          ],
        },
      ],
    },
  });

  const {
    fields: questionFields,
    append: appendQuestion,
    remove: removeQuestion,
  } = useFieldArray({
    control,
    name: "questions",
  });

  const {
    fields: passageFields,
    append: appendPassage,
    remove: removePassage,
  } = useFieldArray({
    control,
    name: "passages",
  });

  const mutation = useMutation({
    mutationFn: (newTest) => {
      return axios.post("/api/tests", newTest);
    },
    onSuccess: (data) => {
      setTestCode(data.data.testCode);
      setOpenDialog(true);
      reset();
    },
  });

  const validateCorrectAnswers = (data) => {
    let isValid = true;
    data.questions.forEach((question, questionIndex) => {
      const hasCorrectAnswer = question.options.some(
        (option) => option.isCorrect
      );
      if (!hasCorrectAnswer) {
        setError(`questions.${questionIndex}.options`, {
          type: "custom",
          message: "At least one correct answer must be selected",
        });
        isValid = false;
      }
    });
    return isValid;
  };

  const onSubmit = (data) => {
    // Validate correct answers
    if (!validateCorrectAnswers(data)) {
      return;
    }

    // Filter out empty passages
    const filteredData = {
      ...data,
      passages: data.passages.filter((p) => p.content || p.imageUrl),
    };
    mutation.mutate(filteredData);
  };

  // Watch all options to clear validation errors when a correct answer is selected
  const questions = watch("questions");
  React.useEffect(() => {
    questions.forEach((question, questionIndex) => {
      if (question.options.some((option) => option.isCorrect)) {
        clearErrors(`questions.${questionIndex}.options`);
      }
    });
  }, [questions, clearErrors]);

  const renderPassageSection = () => (
    <div className="mb-8">
      <Typography variant="h5" gutterBottom>
        Reading Passages
      </Typography>
      {passageFields.map((field, index) => (
        <Card key={field.id} className="mb-4 p-4">
          <CardContent>
            <Typography variant="h6">Passage {index + 1}</Typography>
            <Controller
              name={`passages.${index}.content`}
              control={control}
              render={({ field }) => (
                <TextField
                  {...field}
                  label="Passage Content"
                  multiline
                  rows={4}
                  fullWidth
                  margin="normal"
                />
              )}
            />
            <Controller
              name={`passages.${index}.imageUrl`}
              control={control}
              render={({ field }) => (
                <TextField
                  {...field}
                  label="Passage Image URL"
                  fullWidth
                  margin="normal"
                  InputProps={{
                    endAdornment: field.value && (
                      <img
                        src={field.value}
                        alt="passage preview"
                        style={{ height: "40px", marginLeft: "8px" }}
                      />
                    ),
                  }}
                />
              )}
            />
            <IconButton onClick={() => removePassage(index)}>
              <DeleteIcon />
            </IconButton>
          </CardContent>
        </Card>
      ))}
      <Button
        startIcon={<AddIcon />}
        onClick={() => appendPassage({ content: "", imageUrl: "" })}
      >
        Add Passage
      </Button>
    </div>
  );

  const renderQuestionSection = () => (
    <div>
      <Typography variant="h5" gutterBottom>
        Questions
      </Typography>
      {questionFields.map((field, index) => (
        <Card key={field.id} className="mb-4 p-4">
          <CardContent>
            <Typography variant="h6">Question {index + 1}</Typography>

            <Controller
              name={`questions.${index}.passageIndex`}
              control={control}
              render={({ field }) => (
                <FormControl fullWidth margin="normal">
                  <InputLabel>Related Passage</InputLabel>
                  <Select {...field} label="Related Passage">
                    <MenuItem value={-1}>No Passage</MenuItem>
                    {passageFields.map((passage, pIndex) => (
                      <MenuItem key={pIndex} value={pIndex}>
                        Passage {pIndex + 1}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              )}
            />

            <Controller
              name={`questions.${index}.questionText`}
              control={control}
              render={({ field }) => (
                <TextField
                  {...field}
                  label="Question Text"
                  fullWidth
                  margin="normal"
                />
              )}
            />

            <Controller
              name={`questions.${index}.questionImageUrl`}
              control={control}
              render={({ field }) => (
                <TextField
                  {...field}
                  label="Question Image URL"
                  fullWidth
                  margin="normal"
                  InputProps={{
                    endAdornment: field.value && (
                      <img
                        src={field.value}
                        alt="question preview"
                        style={{ height: "40px", marginLeft: "8px" }}
                      />
                    ),
                  }}
                />
              )}
            />

            {errors.questions?.[index]?.options && (
              <Alert severity="error" className="mt-2 mb-2">
                {errors.questions[index].options.message}
              </Alert>
            )}

            {field.options.map((option, optionIndex) => (
              <div key={optionIndex} className="ml-4">
                <Controller
                  name={`questions.${index}.options.${optionIndex}.text`}
                  control={control}
                  render={({ field }) => (
                    <TextField
                      {...field}
                      label={`Option ${optionIndex + 1} Text`}
                      fullWidth
                      margin="normal"
                    />
                  )}
                />

                <Controller
                  name={`questions.${index}.options.${optionIndex}.imageUrl`}
                  control={control}
                  render={({ field }) => (
                    <TextField
                      {...field}
                      label={`Option ${optionIndex + 1} Image URL`}
                      fullWidth
                      margin="normal"
                      InputProps={{
                        endAdornment: field.value && (
                          <img
                            src={field.value}
                            alt="option preview"
                            style={{ height: "40px", marginLeft: "8px" }}
                          />
                        ),
                      }}
                    />
                  )}
                />

                <FormControlLabel
                  control={
                    <Controller
                      name={`questions.${index}.options.${optionIndex}.isCorrect`}
                      control={control}
                      render={({ field }) => <Checkbox {...field} />}
                    />
                  }
                  label="Correct Answer"
                />
              </div>
            ))}
            <IconButton onClick={() => removeQuestion(index)}>
              <DeleteIcon />
            </IconButton>
          </CardContent>
        </Card>
      ))}

      <Button
        startIcon={<AddIcon />}
        onClick={() =>
          appendQuestion({
            questionText: "",
            questionImageUrl: "",
            passageIndex: -1,
            options: [
              { text: "", imageUrl: "", isCorrect: false },
              { text: "", imageUrl: "", isCorrect: false },
              { text: "", imageUrl: "", isCorrect: false },
              { text: "", imageUrl: "", isCorrect: false },
            ],
          })
        }
      >
        Add Question
      </Button>
    </div>
  );

  return (
    <Container maxWidth="md">
      <form onSubmit={handleSubmit(onSubmit)}>
        <Typography variant="h4" gutterBottom>
          Create Test
        </Typography>

        <Controller
          name="subject"
          control={control}
          render={({ field }) => (
            <TextField {...field} label="Subject" fullWidth margin="normal" />
          )}
        />

        <Controller
          name="instruction"
          control={control}
          render={({ field }) => (
            <TextField
              {...field}
              label="Instruction"
              fullWidth
              margin="normal"
              multiline
              rows={3}
            />
          )}
        />

        {renderPassageSection()}
        {renderQuestionSection()}

        <Button
          type="submit"
          variant="contained"
          color="primary"
          disabled={mutation.isPending}
          className="mt-4"
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
