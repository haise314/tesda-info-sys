import React, { useState, useEffect } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import axios from "axios";
import {
  DataGrid,
  GridActionsCellItem,
  GridToolbar,
  useGridApiRef,
} from "@mui/x-data-grid";
import {
  Box,
  Button,
  CircularProgress,
  Container,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Stack,
  TextField,
  Typography,
  useMediaQuery,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Alert,
} from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";
import AddIcon from "@mui/icons-material/Add";
import { userColumns } from "../utils/column/users.column.js";

// Form Fields Component
const UserFormFields = ({ formData, setFormData, isEdit }) => {
  return (
    <Stack spacing={2}>
      {!isEdit && (
        <>
          <TextField
            fullWidth
            label="First Name"
            value={formData.name?.firstName || ""}
            onChange={(e) =>
              setFormData((prev) => ({
                ...prev,
                name: { ...prev.name, firstName: e.target.value },
              }))
            }
            required
          />
          <TextField
            fullWidth
            label="Last Name"
            value={formData.name?.lastName || ""}
            onChange={(e) =>
              setFormData((prev) => ({
                ...prev,
                name: { ...prev.name, lastName: e.target.value },
              }))
            }
            required
          />
          <TextField
            fullWidth
            label="Email"
            type="email"
            value={formData.contact?.email || ""}
            onChange={(e) =>
              setFormData((prev) => ({
                ...prev,
                contact: { ...prev.contact, email: e.target.value },
              }))
            }
            required
          />
          <TextField
            fullWidth
            label="Password"
            type="password"
            value={formData.password || ""}
            onChange={(e) =>
              setFormData((prev) => ({
                ...prev,
                password: e.target.value,
              }))
            }
            required
          />
        </>
      )}
      <FormControl fullWidth>
        <InputLabel>Role</InputLabel>
        <Select
          value={formData.role || ""}
          label="Role"
          onChange={(e) =>
            setFormData((prev) => ({ ...prev, role: e.target.value }))
          }
        >
          <MenuItem value="client">Client</MenuItem>
          <MenuItem value="admin">Admin</MenuItem>
          <MenuItem value="superadmin">Super Admin</MenuItem>
        </Select>
      </FormControl>
    </Stack>
  );
};

const UsersTable = () => {
  const [rows, setRows] = useState([]);
  const [openDialog, setOpenDialog] = useState(false);
  const [formData, setFormData] = useState({
    name: { firstName: "", lastName: "" },
    contact: { email: "" },
    password: "",
    role: "client",
  });
  const [editMode, setEditMode] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const [error, setError] = useState("");

  const queryClient = useQueryClient();
  const apiRef = useGridApiRef();

  // Fetch Users Query
  const { data: users, isLoading } = useQuery({
    queryKey: ["users"],
    queryFn: async () => {
      const response = await axios.post("/api/auth/users");
      return response.data;
    },
  });

  useEffect(() => {
    if (users) {
      setRows(users);
    }
  }, [users]);

  // Create User Mutation
  const createUserMutation = useMutation({
    mutationFn: async (userData) => {
      const response = await axios.post("/api/auth/register", userData);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries(["users"]);
      setOpenDialog(false);
      setFormData({
        name: { firstName: "", lastName: "" },
        contact: { email: "" },
        password: "",
        role: "client",
      });
    },
    onError: (error) => {
      setError(error.response?.data?.message || "Failed to create user");
    },
  });

  // Update User Mutation
  const updateUserMutation = useMutation({
    mutationFn: async ({ id, ...updateData }) => {
      const response = await axios.put(
        `/api/auth/users/update/${id}`,
        updateData
      );
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries(["users"]);
      setOpenDialog(false);
    },
    onError: (error) => {
      setError(error.response?.data?.message || "Failed to update user");
    },
  });

  // Delete User Mutation
  const deleteUserMutation = useMutation({
    mutationFn: (id) => axios.delete(`/api/auth/users/delete/${id}`),
    onSuccess: () => {
      queryClient.invalidateQueries(["users"]);
    },
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (editMode && selectedUser) {
      updateUserMutation.mutate({
        id: selectedUser.id,
        ...formData,
      });
    } else {
      createUserMutation.mutate(formData);
    }
  };

  const handleEditClick = (user) => {
    setSelectedUser(user);
    setFormData({
      ...user,
      password: "", // Don't populate password in edit mode
    });
    setEditMode(true);
    setOpenDialog(true);
  };

  const handleDeleteClick = (id) => {
    if (window.confirm("Are you sure you want to delete this user?")) {
      deleteUserMutation.mutate(id);
    }
  };

  const handleAddClick = () => {
    setEditMode(false);
    setSelectedUser(null);
    setFormData({
      name: { firstName: "", lastName: "" },
      contact: { email: "" },
      password: "",
      role: "client",
    });
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
    setError("");
  };

  const columns = [
    ...userColumns,
    {
      field: "actions",
      type: "actions",
      headerName: "Actions",
      width: 100,
      getActions: ({ row }) => [
        <GridActionsCellItem
          icon={<EditIcon />}
          label="Edit"
          onClick={() => handleEditClick(row)}
        />,
        <GridActionsCellItem
          icon={<DeleteIcon />}
          label="Delete"
          onClick={() => handleDeleteClick(row.id)}
        />,
      ],
    },
  ];

  if (isLoading) {
    return (
      <Container className="flex justify-center items-center h-screen">
        <Box className="text-center">
          <CircularProgress size={60} />
          <Typography variant="h6" className="mt-4">
            Loading User Data...
          </Typography>
        </Box>
      </Container>
    );
  }

  return (
    <div className="p-4">
      <Stack direction="row" spacing={2} className="mb-4">
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={handleAddClick}
        >
          Add User
        </Button>
      </Stack>

      <DataGrid
        apiRef={apiRef}
        rows={rows}
        columns={columns}
        slots={{
          toolbar: GridToolbar,
        }}
        slotProps={{
          toolbar: {
            showQuickFilter: true,
            quickFilterProps: { debounceMs: 500 },
          },
        }}
        initialState={{
          pagination: {
            paginationModel: { pageSize: 10 },
          },
        }}
        pageSizeOptions={[5, 10, 25, 50]}
        className="h-[600px]"
      />

      <Dialog
        open={openDialog}
        onClose={handleCloseDialog}
        maxWidth="sm"
        fullWidth
      >
        <form onSubmit={handleSubmit}>
          <DialogTitle>{editMode ? "Edit User" : "Add New User"}</DialogTitle>
          <DialogContent>
            {error && (
              <Alert variant="destructive" className="mb-4">
                {error}
              </Alert>
            )}
            <Box className="mt-4">
              <UserFormFields
                formData={formData}
                setFormData={setFormData}
                isEdit={editMode}
              />
            </Box>
          </DialogContent>
          <DialogActions>
            <Button onClick={handleCloseDialog}>Cancel</Button>
            <Button type="submit" variant="contained">
              {editMode ? "Update" : "Create"}
            </Button>
          </DialogActions>
        </form>
      </Dialog>
    </div>
  );
};

export default UsersTable;
