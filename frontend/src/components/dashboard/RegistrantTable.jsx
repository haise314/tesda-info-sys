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
  MenuItem,
} from "@mui/material";
import { useForm, Controller } from "react-hook-form";
import axios from "axios";

const API_URL = "http://localhost:5000/api/register";

const RegistrantTable = () => {
  const [open, setOpen] = useState(false);
  const [editingRegistrant, setEditingRegistrant] = useState(null);
  const queryClient = useQueryClient();
  const { control, handleSubmit, reset } = useForm();

  const { data: registrants, isLoading } = useQuery({
    queryKey: ["registrants"],
    queryFn: () => axios.get(API_URL).then((res) => res.data.data),
  });

  const createMutation = useMutation({
    mutationFn: (newRegistrant) => axios.post(API_URL, newRegistrant),
    onSuccess: () => {
      queryClient.invalidateQueries("registrants");
      handleClose();
    },
  });

  const updateMutation = useMutation({
    mutationFn: (updatedRegistrant) =>
      axios.put(`${API_URL}/${updatedRegistrant._id}`, updatedRegistrant),
    onSuccess: () => {
      queryClient.invalidateQueries("registrants");
      handleClose();
    },
  });

  const deleteMutation = useMutation({
    mutationFn: (id) => axios.delete(`${API_URL}/${id}`),
    onSuccess: () => queryClient.invalidateQueries("registrants"),
  });

  const handleOpen = (registrant = null) => {
    setEditingRegistrant(registrant);
    reset(registrant || {});
    setOpen(true);
  };

  const handleClose = () => {
    setEditingRegistrant(null);
    reset();
    setOpen(false);
  };

  const onSubmit = (data) => {
    if (editingRegistrant) {
      updateMutation.mutate({ ...data, _id: editingRegistrant._id });
    } else {
      createMutation.mutate(data);
    }
  };

  const columns = [
    {
      field: "name.firstName",
      headerName: "First Name",
      flex: 1,
      renderCell: (params) => params.row.name.firstName,
    },
    {
      field: "name.lastName",
      headerName: "Last Name",
      flex: 1,
      renderCell: (params) => params.row.name.lastName,
    },
    {
      field: "contact.email",
      headerName: "Email",
      flex: 1,
      renderCell: (params) => params.row.contact.email,
    },
    {
      field: "personalInformation.sex",
      headerName: "Sex",
      flex: 1,
      renderCell: (params) => params.row.personalInformation.sex,
    },
    { field: "employmentStatus", headerName: "Employment Status", flex: 1 },
    { field: "education", headerName: "Education", flex: 1 },
    {
      field: "clientClassification",
      headerName: "Client Classification",
      flex: 1,
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
      <Button onClick={() => handleOpen()}>Add Registrant</Button>
      <DataGrid
        rows={registrants}
        columns={columns}
        pageSize={5}
        rowsPerPageOptions={[5]}
        getRowId={(row) => row._id}
      />
      <Dialog open={open} onClose={handleClose}>
        <DialogTitle>
          {editingRegistrant ? "Edit Registrant" : "Add Registrant"}
        </DialogTitle>
        <form onSubmit={handleSubmit(onSubmit)}>
          <DialogContent>
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
            <Controller
              name="contact.email"
              control={control}
              defaultValue=""
              rules={{
                required: "This field is required",
                pattern: {
                  value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                  message: "Invalid email address",
                },
              }}
              render={({ field, fieldState: { error } }) => (
                <TextField
                  {...field}
                  label="Email"
                  fullWidth
                  margin="normal"
                  error={!!error}
                  helperText={error?.message}
                />
              )}
            />
            <Controller
              name="personalInformation.sex"
              control={control}
              defaultValue=""
              rules={{ required: "This field is required" }}
              render={({ field, fieldState: { error } }) => (
                <TextField
                  {...field}
                  select
                  label="Sex"
                  fullWidth
                  margin="normal"
                  error={!!error}
                  helperText={error?.message}
                >
                  <MenuItem value="Male">Male</MenuItem>
                  <MenuItem value="Female">Female</MenuItem>
                  <MenuItem value="Others">Others</MenuItem>
                </TextField>
              )}
            />
            <Controller
              name="employmentStatus"
              control={control}
              defaultValue=""
              rules={{ required: "This field is required" }}
              render={({ field, fieldState: { error } }) => (
                <TextField
                  {...field}
                  select
                  label="Employment Status"
                  fullWidth
                  margin="normal"
                  error={!!error}
                  helperText={error?.message}
                >
                  <MenuItem value="Employed">Employed</MenuItem>
                  <MenuItem value="Unemployed">Unemployed</MenuItem>
                  <MenuItem value="Self-Employed">Self-Employed</MenuItem>
                </TextField>
              )}
            />
            <Controller
              name="education"
              control={control}
              defaultValue=""
              rules={{ required: "This field is required" }}
              render={({ field, fieldState: { error } }) => (
                <TextField
                  {...field}
                  select
                  label="Education"
                  fullWidth
                  margin="normal"
                  error={!!error}
                  helperText={error?.message}
                >
                  <MenuItem value="Elementary">Elementary</MenuItem>
                  <MenuItem value="High School">High School</MenuItem>
                  <MenuItem value="College">College</MenuItem>
                  <MenuItem value="Postgraduate">Postgraduate</MenuItem>
                </TextField>
              )}
            />
            <Controller
              name="clientClassification"
              control={control}
              defaultValue=""
              rules={{ required: "This field is required" }}
              render={({ field, fieldState: { error } }) => (
                <TextField
                  {...field}
                  select
                  label="Client Classification"
                  fullWidth
                  margin="normal"
                  error={!!error}
                  helperText={error?.message}
                >
                  <MenuItem value="Student">Student</MenuItem>
                  <MenuItem value="Professional">Professional</MenuItem>
                  <MenuItem value="OFW">OFW</MenuItem>
                  <MenuItem value="Others">Others</MenuItem>
                </TextField>
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

export default RegistrantTable;
