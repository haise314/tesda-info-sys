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
    mutationFn: (id) => {
      if (!user || !user.uli) {
        throw new Error("User information is missing");
      }
      return axios.delete(`/api/register/${id}`, {
        headers: {
          "X-Deleted-By": user.uli,
        },
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries(["registrants"]);
      queryClient.invalidateQueries(["deletedRegistrants"]);
    },
    onError: (error) => {
      console.error("Deletion failed:", error);
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

const exportToExcel = (registrants) => {
  // Early return if no data
  if (!registrants || registrants.length === 0) return;

  const exportData = registrants.map((registrant) => {
    // Get first course if it exists
    const courseData = registrant.course?.[0] || {};

    return {
      ULI: registrant.uli || "",
      "Disability Type": registrant.disabilityType || "None",
      "Disability Cause": registrant.disabilityCause || "None",
      "Course Name": courseData.courseName || "No course",
      "Registration Status": courseData.registrationStatus || "None",
      Scholarship: courseData.hasScholarType
        ? courseData.scholarType === "Others"
          ? courseData.otherScholarType
          : courseData.scholarType
        : "None",
    };
  });

  try {
    const worksheet = XLSX.utils.json_to_sheet(exportData);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Registrants");
    XLSX.writeFile(workbook, "registrants_export.xlsx");
  } catch (error) {
    console.error("Error exporting to Excel:", error);
    // You might want to add a toast notification here
  }
};

const exportToPDF = (registrants) => {
  // Early return if no data
  if (!registrants || registrants.length === 0) return;

  try {
    const doc = new jsPDF("landscape", "mm", "a4");

    const tableColumn = [
      "ULI",
      "Disability Type",
      "Disability Cause",
      "Course Name",
      "Registration Status",
      "Scholarship",
    ];

    const tableRows = registrants.map((registrant) => {
      const courseData = registrant.course?.[0] || {};

      return [
        registrant.uli || "",
        registrant.disabilityType || "None",
        registrant.disabilityCause || "None",
        courseData.courseName || "No course",
        courseData.registrationStatus || "None",
        courseData.hasScholarType
          ? courseData.scholarType === "Others"
            ? courseData.otherScholarType
            : courseData.scholarType
          : "None",
      ];
    });

    doc.text("Registrants Report", 14, 15);

    doc.autoTable({
      head: [tableColumn],
      body: tableRows,
      startY: 20,
      styles: { fontSize: 8 },
      margin: { top: 20 },
      columnStyles: {
        0: { cellWidth: 35 }, // ULI
        1: { cellWidth: 35 }, // Disability Type
        2: { cellWidth: 35 }, // Disability Cause
        3: { cellWidth: 35 }, // Course Name
        4: { cellWidth: 35 }, // Registration Status
        5: { cellWidth: 35 }, // Scholarship
      },
      didDrawPage: function (data) {
        doc.text(
          `Page ${doc.internal.getNumberOfPages()}`,
          data.settings.margin.left,
          doc.internal.pageSize.height - 10
        );
      },
    });

    doc.save("registrants_report.pdf");
  } catch (error) {
    console.error("Error exporting to PDF:", error);
    // You might want to add a toast notification here
  }
};

export { exportToExcel, exportToPDF };

const RegistrantsTable = () => {
  const [openDialog, setOpenDialog] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [selectedRegistrant, setSelectedRegistrant] = useState(null);
  const [mutationError, setMutationError] = useState(null);
  const { user: loggedInUser } = useAuth();
  console.log("Logged in user:", loggedInUser);

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
      console.log("Delete registrant with ID:", id);
      if (window.confirm("Are you sure you want to delete this registrant?")) {
        deleteRegistrantMutation.mutate(id, {
          onError: (error) => {
            console.error(
              "Delete error:",
              error.response?.data || error.message
            );
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
