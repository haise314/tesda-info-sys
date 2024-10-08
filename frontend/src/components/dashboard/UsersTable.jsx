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
  Stack,
  Typography,
  useMediaQuery,
} from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import AddIcon from "@mui/icons-material/Add";
import { userColumns } from "../utils/column/users.column.js";
import { TableContainer } from "../../layouts/TableContainer";
import { useTheme } from "@emotion/react";

const fetchUsersForTable = async () => {
  const response = await axios.post("/api/auth/users");
  return response.data;
};

const UsersTable = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  const queryClient = useQueryClient();
  const apiRef = useGridApiRef();
  const [rows, setRows] = useState([]);

  const {
    data: users,
    isLoading,
    error,
  } = useQuery({
    queryKey: ["users-for-table"],
    queryFn: fetchUsersForTable,
  });

  useEffect(() => {
    if (users) {
      setRows(users);
    }
  }, [users]);

  const updateUserMutation = useMutation({
    mutationFn: async (params) => {
      const { id, ...updateData } = params;
      const response = await axios.put(`/api/auth/users/${id}`, updateData);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries(["users-for-table"]);
    },
    onError: (error) => {
      console.error("Update error:", error);
      alert("Failed to update user. Please try again.");
    },
  });

  const deleteUserMutation = useMutation({
    mutationFn: (id) => axios.delete(`/api/auth/users/${id}`),
    onSuccess: () => {
      queryClient.invalidateQueries(["users-for-table"]);
    },
  });

  const handleDeleteClick = (id) => () => {
    if (window.confirm("Are you sure you want to delete this user?")) {
      deleteUserMutation.mutate(id);
    }
  };

  const processRowUpdate = React.useCallback(
    async (newRow, oldRow) => {
      const changedField = Object.keys(newRow).find(
        (key) => newRow[key] !== oldRow[key]
      );
      if (!changedField) return oldRow; // No changes

      try {
        await updateUserMutation.mutateAsync({
          id: newRow.id,
          [changedField]: newRow[changedField],
        });
        return newRow;
      } catch (error) {
        return oldRow;
      }
    },
    [updateUserMutation]
  );

  const columns = [
    ...userColumns,
    {
      field: "actions",
      type: "actions",
      headerName: "Actions",
      width: 100,
      getActions: ({ id }) => [
        <GridActionsCellItem
          icon={<DeleteIcon />}
          label="Delete"
          onClick={handleDeleteClick(id)}
          color="inherit"
        />,
      ],
    },
  ];

  const handleAddClick = () => {
    console.log("Add new user");
    // Implement the logic to add a new user
  };

  if (isLoading) {
    return (
      <Container
        sx={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          height: "100vh",
        }}
      >
        <Box sx={{ textAlign: "center" }}>
          <CircularProgress size={60} />
          <Typography variant="h6" sx={{ mt: 2 }}>
            Loading User Data...
          </Typography>
        </Box>
      </Container>
    );
  }

  if (error) {
    return (
      <Container>
        <Typography color="error" variant="h6">
          Error loading data: {error.message}
        </Typography>
      </Container>
    );
  }

  return (
    <TableContainer>
      <Stack
        direction={{ xs: "column", sm: "row" }}
        spacing={2}
        sx={{ mb: 2 }}
        alignItems={{ xs: "stretch", sm: "center" }}
      >
        <Button
          fullWidth={isMobile}
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
        processRowUpdate={processRowUpdate}
        onProcessRowUpdateError={(error) => {
          console.error("Error while saving:", error);
        }}
        initialState={{
          columns: {
            columnVisibilityModel: {
              uli: true,
              role: true,
              createdAt: !isMobile,
              updatedAt: !isMobile,
              actions: true,
            },
          },
          pagination: {
            paginationModel: { pageSize: isMobile ? 5 : 10 },
          },
        }}
        pageSizeOptions={isMobile ? [5, 10] : [10, 25, 50]}
        density={isMobile ? "compact" : "standard"}
      />
    </TableContainer>
  );
};

export default UsersTable;
