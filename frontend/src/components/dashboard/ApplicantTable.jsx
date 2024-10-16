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
import AssessmentEditDialog from "./AssessmentEdit.jsx";

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
  const [selectedApplicant, setSelectedApplicant] = useState(null);
  const [isAssessmentDialogOpen, setIsAssessmentDialogOpen] = useState(false);

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

  const handleAssessmentEdit = (params) => {
    const applicant = rows.find((row) => row._id === params.id);
    if (applicant) {
      const applicantWithAssessments = {
        ...applicant,
        assessments: Array.isArray(applicant.assessments)
          ? applicant.assessments
          : [],
      };
      setSelectedApplicant(applicantWithAssessments);
      setIsAssessmentDialogOpen(true);
    }
  };

  const handleAssessmentDialogClose = () => {
    setIsAssessmentDialogOpen(false);
    setSelectedApplicant(null);
  };

  const handleAssessmentSave = async (updatedAssessments) => {
    if (selectedApplicant) {
      try {
        await updateApplicantMutation.mutateAsync({
          id: selectedApplicant._id,
          field: "assessments",
          value: updatedAssessments,
        });
        queryClient.invalidateQueries(["applicants"]);
      } catch (error) {
        console.error("Failed to update assessments:", error);
        // Handle error (e.g., show an error message to the user)
      }
    }
    handleAssessmentDialogClose();
  };

  // Modify the existing columns to add the onCellDoubleClick functionality for assessments
  const modifiedColumns = applicantColumns.map((column) => {
    if (column.field === "assessments") {
      return {
        ...column,
        editable: false, // Disable inline editing
      };
    }
    return column;
  });

  const updateApplicantMutation = useMutation({
    mutationFn: async (params) => {
      console.log("Update applicant params:", params);
      const { id, field, value } = params;

      const currentRow = apiRef.current?.getRow(id);
      if (!currentRow) {
        throw new Error("Could not find row data");
      }
      console.log("Applicant currentRow:", currentRow);

      let updatedRow;
      if (field === "assessments") {
        // For assessments, we want to replace the entire array
        updatedRow = { ...currentRow, assessments: value };
      } else {
        updatedRow = { ...currentRow, [field]: value };
      }
      console.log("Applicant updatedRow:", updatedRow);

      const unflattenedData = unflattenApplicantData(updatedRow);
      console.log("Applicant unflattenedData:", unflattenedData);

      const response = await axios.put(
        `/api/applicants/${id}`,
        unflattenedData
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
      const changedField = Object.keys(newRow).find(
        (key) => JSON.stringify(newRow[key]) !== JSON.stringify(oldRow[key])
      );

      if (!changedField) return oldRow; // No changes

      try {
        await updateApplicantMutation.mutateAsync({
          id: newRow._id,
          field: changedField,
          value: newRow[changedField],
        });
        return newRow;
      } catch (error) {
        return oldRow;
      }
    },
    [updateApplicantMutation]
  );

  const columns = [
    ...modifiedColumns,
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
        onCellDoubleClick={(params) => {
          console.log("Cell double click:", params);
          if (params.field === "assessments") {
            handleAssessmentEdit(params);
          }
        }}
        initialState={{
          columns: {
            columnVisibilityModel: {
              ...getDefaultColumnVisibility(applicantColumns),
              uli: true,
              fullName: true,
              assessments: true,
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
      {selectedApplicant && (
        <AssessmentEditDialog
          open={isAssessmentDialogOpen}
          onClose={handleAssessmentDialogClose}
          assessments={selectedApplicant.assessments}
          onSave={handleAssessmentSave}
        />
      )}
    </TableContainer>
  );
};

export default ApplicantTable;
