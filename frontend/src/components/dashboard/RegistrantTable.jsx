import React, { useState, useCallback } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import axios from "axios";
import { DataGrid, GridActionsCellItem, GridToolbar } from "@mui/x-data-grid";
import * as XLSX from "xlsx";
import jsPDF from "jspdf";
import "jspdf-autotable";
import {
  Box,
  Button,
  CircularProgress,
  Container,
  Stack,
  Typography,
} from "@mui/material";
import FileDownloadIcon from "@mui/icons-material/FileDownload";
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";
import { registrantColumns } from "../utils/column/registrant.column.jsx";
import RegistrantEditModal from "./subcomponent/RegistrantEditModal.jsx";
import { useAuth } from "../../context/AuthContext.jsx";

// Custom hooks
const useRegistrantQueries = () => {
  const queryClient = useQueryClient();
  const { user } = useAuth();

  const { data: registrants, isLoading } = useQuery({
    queryKey: ["registrants"],
    queryFn: async () => {
      const response = await axios.get("/api/register");
      return response.data.data;
    },
  });

  const createRegistrantMutation = useMutation({
    mutationFn: (registrantData) =>
      axios.post("/api/register", {
        ...registrantData,
        createdBy: user?.uli,
      }),
    onSuccess: () => {
      queryClient.invalidateQueries(["registrants"]);
    },
  });

  const updateRegistrantMutation = useMutation({
    mutationFn: ({ id, ...updateData }) =>
      axios.put(`/api/register/${id}`, {
        ...updateData,
        updatedBy: user?.uli,
      }),
    onSuccess: () => {
      queryClient.invalidateQueries(["registrants"]);
    },
  });

  const deleteRegistrantMutation = useMutation({
    mutationFn: (id) => axios.delete(`/api/register/${id}`),
    onSuccess: () => {
      queryClient.invalidateQueries(["registrants"]);
    },
  });

  return {
    registrants,
    isLoading,
    createRegistrantMutation,
    updateRegistrantMutation,
    deleteRegistrantMutation,
  };
};

const exportToExcel = (rows) => {
  const exportData = rows.map((row) => ({
    "Disability Type": row.disabilityType || "",
    "Disability Cause": row.disabilityCause || "",
    Courses: row.course?.map((c) => c.courseName).join(", ") || "",
    "Registration Status":
      row.course?.map((c) => c.registrationStatus).join(", ") || "",
    "Has Scholarship":
      row.course?.map((c) => (c.hasScholarType ? "Yes" : "No")).join(", ") ||
      "",
    "Scholarship Types":
      row.course
        ?.map((c) =>
          c.hasScholarType
            ? c.scholarType === "Others"
              ? c.otherScholarType
              : c.scholarType
            : ""
        )
        .filter(Boolean)
        .join(", ") || "",
  }));

  const worksheet = XLSX.utils.json_to_sheet(exportData);
  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, worksheet, "Registrants");
  XLSX.writeFile(workbook, "registrants_export.xlsx");
};

const exportToPDF = (rows) => {
  const doc = new jsPDF();
  const tableColumn = [
    "Disability Type",
    "Disability Cause",
    "Courses",
    "Registration Status",
    "Has Scholarship",
    "Scholarship Types",
  ];

  const tableRows = rows.map((row) => [
    row.disabilityType || "",
    row.disabilityCause || "",
    row.course?.map((c) => c.courseName).join(", ") || "",
    row.course?.map((c) => c.registrationStatus).join(", ") || "",
    row.course?.map((c) => (c.hasScholarType ? "Yes" : "No")).join(", ") || "",
    row.course
      ?.map((c) =>
        c.hasScholarType
          ? c.scholarType === "Others"
            ? c.otherScholarType
            : c.scholarType
          : ""
      )
      .filter(Boolean)
      .join(", ") || "",
  ]);

  doc.text("Registrants List", 14, 15);
  doc.autoTable({
    head: [tableColumn],
    body: tableRows,
    startY: 25,
    styles: { fontSize: 8 },
    margin: { top: 30 },
    columnStyles: {
      0: { cellWidth: 30 },
      1: { cellWidth: 30 },
      2: { cellWidth: 35 },
      3: { cellWidth: 30 },
      4: { cellWidth: 25 },
      5: { cellWidth: 40 },
    },
  });

  doc.save("registrants_export.pdf");
};

const RegistrantsTable = () => {
  const [openDialog, setOpenDialog] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [selectedRegistrant, setSelectedRegistrant] = useState(null);
  const [mutationError, setMutationError] = useState(null);

  const {
    registrants = [],
    isLoading,
    createRegistrantMutation,
    updateRegistrantMutation,
    deleteRegistrantMutation,
  } = useRegistrantQueries();

  const handleEditClick = useCallback((registrant) => {
    setSelectedRegistrant(registrant);
    setEditMode(true);
    setOpenDialog(true);
  }, []);

  const handleDeleteClick = useCallback(
    (id) => {
      if (window.confirm("Are you sure you want to delete this registrant?")) {
        deleteRegistrantMutation.mutate(id, {
          onError: (error) => {
            setMutationError(error.response?.data?.message || "Delete failed");
          },
        });
      }
    },
    [deleteRegistrantMutation]
  );

  const handleSubmit = useCallback(
    (formData) => {
      setMutationError(null);

      if (editMode && selectedRegistrant) {
        // Update existing registrant
        updateRegistrantMutation.mutate(
          {
            id: selectedRegistrant._id,
            ...formData,
          },
          {
            onSuccess: () => {
              setOpenDialog(false);
              setEditMode(false);
              setSelectedRegistrant(null);
            },
            onError: (error) => {
              setMutationError(
                error.response?.data?.message || "Update failed"
              );
            },
          }
        );
      } else {
        // Create new registrant
        createRegistrantMutation.mutate(formData, {
          onSuccess: () => {
            setOpenDialog(false);
            setEditMode(false);
          },
          onError: (error) => {
            setMutationError(
              error.response?.data?.message || "Creation failed"
            );
          },
        });
      }
    },
    [
      editMode,
      selectedRegistrant,
      updateRegistrantMutation,
      createRegistrantMutation,
    ]
  );

  const handleCloseDialog = useCallback(() => {
    setOpenDialog(false);
    setEditMode(false);
    setSelectedRegistrant(null);
    setMutationError(null);
  }, []);

  if (isLoading) {
    return (
      <Container className="flex justify-center items-center h-screen">
        <Box className="text-center">
          <CircularProgress size={60} />
          <Typography variant="h6" className="mt-4">
            Loading Registrant Data...
          </Typography>
        </Box>
      </Container>
    );
  }

  // Define columns with actions
  const columns = [
    ...registrantColumns,
    {
      field: "actions",
      type: "actions",
      headerName: "Actions",
      width: 100,
      getActions: ({ row }) => [
        <GridActionsCellItem
          key="edit"
          icon={<EditIcon />}
          label="Edit"
          onClick={() => handleEditClick(row)}
        />,
        <GridActionsCellItem
          key="delete"
          icon={<DeleteIcon />}
          label="Delete"
          onClick={() => handleDeleteClick(row._id)}
        />,
      ],
    },
  ];

  return (
    <div className="p-4">
      <Stack direction="row" spacing={2} sx={{ mb: 2 }}>
        <Button
          variant="contained"
          color="success"
          startIcon={<FileDownloadIcon />}
          onClick={() => exportToExcel(registrants)}
        >
          Export to Excel
        </Button>
        <Button
          variant="contained"
          color="error"
          startIcon={<FileDownloadIcon />}
          onClick={() => exportToPDF(registrants)}
        >
          Export to PDF
        </Button>
      </Stack>

      <DataGrid
        rows={registrants}
        columns={columns}
        getRowId={(row) => row._id}
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

      <RegistrantEditModal
        open={openDialog}
        onClose={handleCloseDialog}
        onSubmit={handleSubmit}
        initialData={selectedRegistrant}
        editMode={editMode}
        error={mutationError}
      />
    </div>
  );
};

export default RegistrantsTable;
