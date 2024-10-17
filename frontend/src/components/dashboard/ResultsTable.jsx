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
import { resultsColumns } from "../utils/column/results.column.js";
import { TableContainer } from "../../layouts/TableContainer";
import { useTheme } from "@emotion/react";
import AutorenewIcon from "@mui/icons-material/Autorenew";

const fetchResults = async () => {
  const response = await axios.get("/api/results");
  return response.data.map((result) => ({
    ...result,
    id: `${result.uli}-${result.testCode}`, // Ensure each row has a unique id
  }));
};

const getDefaultColumnVisibility = (columns) => {
  const visibility = {};
  columns.forEach((col) => {
    visibility[col.field] = false;
  });
  return visibility;
};

function ResultsTable() {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  const queryClient = useQueryClient();
  const apiRef = useGridApiRef();
  const [rows, setRows] = useState([]);

  const {
    data: results,
    isLoading,
    error,
  } = useQuery({
    queryKey: ["results"],
    queryFn: fetchResults,
  });

  useEffect(() => {
    if (results) {
      setRows(results);
    }
  }, [results]);

  const generateResultsMutation = useMutation({
    mutationFn: async () => {
      const response = await axios.post("/api/results/calculate-all");
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries(["results"]);
      alert("Results generated successfully!");
    },
    onError: (error) => {
      console.error("Generation error:", error);
      alert("Failed to generate results. Please try again.");
    },
  });

  const updateRemarksMutation = useMutation({
    mutationFn: async ({ uli, testCode, remarks }) => {
      const response = await axios.patch(
        `/api/results/${uli}/${testCode}/remarks`,
        { remarks }
      );
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries(["results"]);
    },
    onError: (error) => {
      console.error("Update error:", error);
      alert("Failed to update remarks. Please try again.");
    },
  });

  const deleteResultMutation = useMutation({
    mutationFn: async ({ uli, testCode }) => {
      await axios.delete(`/api/results/${uli}/${testCode}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries(["results"]);
    },
    onError: (error) => {
      console.error("Delete error:", error);
      alert("Failed to delete result. Please try again.");
    },
  });

  const handleDeleteClick = (uli, testCode) => () => {
    if (window.confirm("Are you sure you want to delete this result?")) {
      deleteResultMutation.mutate({ uli, testCode });
    }
  };

  const processRowUpdate = React.useCallback(
    async (newRow, oldRow) => {
      if (newRow.remarks === oldRow.remarks) return oldRow;

      try {
        await updateRemarksMutation.mutateAsync({
          uli: newRow.uli,
          testCode: newRow.testCode,
          remarks: newRow.remarks,
        });
        return newRow;
      } catch (error) {
        return oldRow;
      }
    },
    [updateRemarksMutation]
  );

  const columns = [
    ...resultsColumns,
    {
      field: "actions",
      type: "actions",
      headerName: "Actions",
      width: 100,
      getActions: (params) => [
        <GridActionsCellItem
          icon={<DeleteIcon />}
          label="Delete"
          onClick={handleDeleteClick(params.row.uli, params.row.testCode)}
          color="inherit"
        />,
      ],
    },
  ];

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
            Loading Results Data...
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
      <Stack direction="row" spacing={2} sx={{ mb: 2 }}>
        <Button
          variant="contained"
          startIcon={<AutorenewIcon />}
          onClick={() => generateResultsMutation.mutate()}
          disabled={generateResultsMutation.isLoading}
        >
          {generateResultsMutation.isLoading
            ? "Generating..."
            : "Generate All Results"}
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
        getRowId={(row) => `${row.uli}-${row.testCode}`}
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
              score: true,
              totalQuestions: !isMobile,
              remarks: !isMobile,
              createdAt: !isMobile,
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
}

export default ResultsTable;
