import React, { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { DataGrid } from "@mui/x-data-grid";
import {
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
} from "@mui/material";
import { useForm, Controller } from "react-hook-form";
import axios from "axios";

const ApplicantTable = () => {
  const [open, setOpen] = useState(false);
  const [editingApplicant, setEditingApplicant] = useState(null);
  const queryClient = useQueryClient();
  const { control, handleSubmit, reset } = useForm();

  const { data: applicants, isLoading } = useQuery({
    queryKey: ["applicants"],
    queryFn: () => axios.get("/api/applicants").then((res) => res.data.data),
  });

  const createMutation = useMutation({
    mutationFn: (newApplicant) => axios.post("/api/applicants", newApplicant),
    onSuccess: () => {
      queryClient.invalidateQueries("applicants");
      handleClose();
    },
  });

  const updateMutation = useMutation({
    mutationFn: (updatedApplicant) =>
      axios.put(
        `${"/api/applicants"}/${updatedApplicant._id}`,
        updatedApplicant
      ),
    onSuccess: () => {
      queryClient.invalidateQueries("applicants");
      handleClose();
    },
  });

  const deleteMutation = useMutation({
    mutationFn: (id) => axios.delete(`${"/api/applicants"}/${id}`),
    onSuccess: () => queryClient.invalidateQueries("applicants"),
  });

  const handleOpen = (applicant = null) => {
    setEditingApplicant(applicant);
    reset(applicant || {});
    setOpen(true);
  };

  const handleClose = () => {
    setEditingApplicant(null);
    reset();
    setOpen(false);
  };

  const onSubmit = (data) => {
    if (editingApplicant) {
      updateMutation.mutate({ ...data, _id: editingApplicant._id });
    } else {
      createMutation.mutate(data);
    }
  };

  const columns = [
    { field: "trainingCenterName", headerName: "Training Center", flex: 1 },
    { field: "assessmentTitle", headerName: "Assessment Title", flex: 1 },
    { field: "assessmentType", headerName: "Assessment Type", flex: 1 },
    { field: "clientType", headerName: "Client Type", flex: 1 },
    {
      field: "name",
      headerName: "Full Name",
      flex: 1,
      renderCell: (params) => {
        return `${params.row?.name?.firstName} ${params.row?.name?.lastName}`;
      },
    },
    {
      field: "actions",
      headerName: "Actions",
      flex: 1,
      renderCell: (params) => (
        <>
          <Button onClick={() => handleOpen(params.row)}>Edit</Button>
          <Button onClick={() => deleteMutation.mutate(params.row._id)}>
            Delete
          </Button>
        </>
      ),
    },
  ];

  if (isLoading) return <div>Loading...</div>;

  return (
    <div style={{ height: 400, width: "100%" }}>
      <Button onClick={() => handleOpen()}>Add Applicant</Button>
      <DataGrid
        rows={applicants}
        columns={columns}
        pageSize={5}
        rowsPerPageOptions={[5]}
        getRowId={(row) => row._id}
      />
      <Dialog open={open} onClose={handleClose}>
        <DialogTitle>
          {editingApplicant ? "Edit Applicant" : "Add Applicant"}
        </DialogTitle>
        <form onSubmit={handleSubmit(onSubmit)}>
          <DialogContent>
            <Controller
              name="trainingCenterName"
              control={control}
              defaultValue=""
              rules={{ required: "This field is required" }}
              render={({ field, fieldState: { error } }) => (
                <TextField
                  {...field}
                  label="Training Center Name"
                  fullWidth
                  margin="normal"
                  error={!!error}
                  helperText={error?.message}
                />
              )}
            />
            <Controller
              name="assessmentTitle"
              control={control}
              defaultValue=""
              rules={{ required: "This field is required" }}
              render={({ field, fieldState: { error } }) => (
                <TextField
                  {...field}
                  label="Assessment Title"
                  fullWidth
                  margin="normal"
                  error={!!error}
                  helperText={error?.message}
                />
              )}
            />
            <Controller
              name="assessmentType"
              control={control}
              defaultValue=""
              rules={{ required: "This field is required" }}
              render={({ field, fieldState: { error } }) => (
                <TextField
                  {...field}
                  label="Assessment Type"
                  fullWidth
                  margin="normal"
                  error={!!error}
                  helperText={error?.message}
                />
              )}
            />
            <Controller
              name="clientType"
              control={control}
              defaultValue=""
              rules={{ required: "This field is required" }}
              render={({ field, fieldState: { error } }) => (
                <TextField
                  {...field}
                  label="Client Type"
                  fullWidth
                  margin="normal"
                  error={!!error}
                  helperText={error?.message}
                />
              )}
            />
            <Controller
              name="name.firstName"
              control={control}
              defaultValue=""
              rules={{ required: "This field is required" }}
              render={({ field, fieldState: { error } }) => (
                <TextField
                  {...field}
                  label="First Name"
                  fullWidth
                  margin="normal"
                  error={!!error}
                  helperText={error?.message}
                />
              )}
            />
            <Controller
              name="name.lastName"
              control={control}
              defaultValue=""
              rules={{ required: "This field is required" }}
              render={({ field, fieldState: { error } }) => (
                <TextField
                  {...field}
                  label="Last Name"
                  fullWidth
                  margin="normal"
                  error={!!error}
                  helperText={error?.message}
                />
              )}
            />
          </DialogContent>
          <DialogActions>
            <Button onClick={handleClose}>Cancel</Button>
            <Button type="submit">Save</Button>
          </DialogActions>
        </form>
      </Dialog>
    </div>
  );
};

export default ApplicantTable;
