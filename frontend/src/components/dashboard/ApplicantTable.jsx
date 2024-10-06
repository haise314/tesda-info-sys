import React, { useState, useEffect } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  DataGrid,
  GridActionsCellItem,
  GridToolbar,
  useGridApiRef,
} from "@mui/x-data-grid";
import {
  Box,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  useMediaQuery,
  Stack,
  Container,
  CircularProgress,
  Typography,
} from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";
import AddIcon from "@mui/icons-material/Add";
import axios from "axios";
import { applicantColumns } from "../utils/column/applicant.column.js";
import {
  flattenApplicantData,
  unflattenApplicantData,
} from "../utils/flatten/applicant.flatten.js";
import { useTheme } from "@emotion/react";
import { TableContainer } from "../../layouts/TableContainer";

const fetchApplicants = async () => {
  const response = await axios.get("/api/applicants");
  return Array.isArray(response.data.data)
    ? response.data.data.map(flattenApplicantData)
    : [flattenApplicantData(response.data.data)];
};

const getDefaultColumnVisibility = (columns) => {
  const visibility = {};
  columns.forEach((col) => {
    visibility[col.field] = false;
  });
  return visibility;
};

const ApplicantTable = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  const queryClient = useQueryClient();
  const apiRef = useGridApiRef();
  const [rows, setRows] = useState([]);

  const {
    data: applicants,
    isLoading,
    error,
  } = useQuery({
    queryKey: ["applicants"],
    queryFn: fetchApplicants,
  });

  useEffect(() => {
    if (applicants) {
      setRows(applicants);
    }
  }, [applicants]);

  const updateApplicantMutation = useMutation({
    mutationFn: async (params) => {
      const { id, field, value } = params;

      const currentRow = apiRef.current?.getRow(id);
      if (!currentRow) {
        throw new Error("Row not found");
      }

      const updatedRow = { ...currentRow, [field]: value };

      const unFlattenedData = unflattenApplicantData(updatedRow);
      const response = await axios.put(
        `/api/applicants/${id}`,
        unFlattenedData
      );
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries(["applicants"]);
    },
    onError: (error) => {
      console.error("Update error:", error);
      alert("Failed to update applicant. Please try again.");
    },
  });

  const deleteApplicantMutation = useMutation({
    mutationFn: (id) => axios.delete(`/api/applicants/${id}`),
    onSuccess: () => {
      queryClient.invalidateQueries(["applicants"]);
    },
  });

  const handleDeleteClick = (id) => () => {
    if (window.confirm("Are you sure you want to delete this applicant?")) {
      deleteApplicantMutation.mutate(id);
    }
  };

  const processRowUpdate = React.useCallback(
    async (newRow, oldRow) => {
      const field = Object.keys(newRow).find(
        (key) => newRow[key] !== oldRow[key]
      );
      if (!field) return oldRow; // No changes

      try {
        await updateApplicantMutation.mutateAsync({
          id: newRow._id,
          field,
          value: newRow[field],
        });
        return newRow;
      } catch (error) {
        return oldRow;
      }
    },
    [updateApplicantMutation]
  );

  // Make all columns editable
  const editableColumns = applicantColumns.map((column) => ({
    ...column,
    editable: true,
  }));

  const columns = [
    ...editableColumns,
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
    console.log("Add new applicant");
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
            Loading Registrant Data...
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
          Add Applicant
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
              ...getDefaultColumnVisibility(applicantColumns),
              uli: true,
              fullName: true,
              email: !isMobile,
              mobileNumber: !isMobile,
              employmentStatus: !isMobile,
              highestEducationalAttainment: !isMobile,
              createdAt: !isMobile,
              applicationStatus: !isMobile,
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

export default ApplicantTable;
