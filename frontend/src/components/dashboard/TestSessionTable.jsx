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
import { testSessionColumns } from "../utils/column/testsession.column";
import { TableContainer } from "../../layouts/TableContainer";
import { useTheme } from "@emotion/react";

const fetchTestSessions = async () => {
  const response = await axios.get("/api/test-sessions");
  return response.data;
};

const getDefaultColumnVisibility = (columns) => {
  const visibility = {};
  columns.forEach((col) => {
    visibility[col.field] = false;
  });
  return visibility;
};

const TestSessionTable = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  const queryClient = useQueryClient();
  const apiRef = useGridApiRef();
  const [rows, setRows] = useState([]);

  const {
    data: testSessions,
    isLoading,
    error,
  } = useQuery({
    queryKey: ["testSessions"],
    queryFn: fetchTestSessions,
  });

  useEffect(() => {
    if (testSessions) {
      setRows(testSessions);
    }
  }, [testSessions]);

  const updateTestSessionMutation = useMutation({
    mutationFn: async (params) => {
      const { id, ...updateData } = params;
      const response = await axios.put(`/api/test-sessions/${id}`, updateData);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries(["testSessions"]);
    },
    onError: (error) => {
      console.error("Update error:", error);
      alert("Failed to update test session. Please try again.");
    },
  });

  const deleteTestSessionMutation = useMutation({
    mutationFn: (id) => axios.delete(`/api/test-sessions/${id}`),
    onSuccess: () => {
      queryClient.invalidateQueries(["testSessions"]);
    },
  });

  const handleDeleteClick = (id) => () => {
    if (window.confirm("Are you sure you want to delete this test session?")) {
      deleteTestSessionMutation.mutate(id);
    }
  };

  const processRowUpdate = React.useCallback(
    async (newRow, oldRow) => {
      const changedField = Object.keys(newRow).find(
        (key) => newRow[key] !== oldRow[key]
      );
      if (!changedField) return oldRow;

      try {
        await updateTestSessionMutation.mutateAsync({
          id: newRow._id,
          [changedField]: newRow[changedField],
        });
        return newRow;
      } catch (error) {
        return oldRow;
      }
    },
    [updateTestSessionMutation]
  );

  const columns = [
    ...testSessionColumns,
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
    console.log("Add new test session");
    // Implement the logic to add a new test session
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
            Loading Test Session Data...
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
          Add Test Session
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
        getRowId={(row) => row._id}
        processRowUpdate={processRowUpdate}
        onProcessRowUpdateError={(error) => {
          console.error("Error while saving:", error);
        }}
        initialState={{
          columns: {
            columnVisibilityModel: {
              ...getDefaultColumnVisibility(columns),
              uli: true,
              testCode: true,
              status: true,
              startTime: !isMobile,
              test: !isMobile,
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

export default TestSessionTable;
