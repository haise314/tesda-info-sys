import React, { useState, useEffect } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  DataGrid,
  GridActionsCellItem,
  GridToolbar,
  useGridApiRef,
} from "@mui/x-data-grid";
import * as XLSX from "xlsx";
import jsPDF from "jspdf";
import "jspdf-autotable";
import {
  Box,
  Button,
  Container,
  CircularProgress,
  Typography,
  useMediaQuery,
  Stack,
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
import ApplicantEditModal from "./subcomponent/ApplicantEditModal.jsx"; // Import the new modal
import FileDownloadIcon from "@mui/icons-material/FileDownload";
import { useAuth } from "../../context/AuthContext.jsx";

const fetchApplicants = async () => {
  const response = await axios.get("/api/applicants");
  const processedData = Array.isArray(response.data.data)
    ? response.data.data.map(flattenApplicantData)
    : [flattenApplicantData(response.data.data)];

  // Add debugging logs
  console.log("Raw response data:", response.data.data);
  console.log("Processed applicants:", processedData);

  return processedData;
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
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const { user: loggedInUser } = useAuth();
  console.log("Logged in user:", loggedInUser);

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
      console.log("Applicants data:", applicants);
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

  const deleteApplicantMutation = useMutation({
    mutationFn: (id) =>
      axios.delete(`/api/applicants/${id}`, {
        data: { deletedBy: loggedInUser.uli }, // Pass the ULI dynamically
      }),
    onSuccess: () => {
      queryClient.invalidateQueries(["applicants"]);
    },
  });

  const handleDeleteClick = (id) => () => {
    if (window.confirm("Are you sure you want to delete this applicant?")) {
      deleteApplicantMutation.mutate(id);
      console.log("Deleting applicant with ID:", id);
    }
  };

  // Add edit action to columns
  const columns = [
    ...applicantColumns,
    {
      field: "actions",
      type: "actions",
      headerName: "Actions",
      width: 120,
      getActions: ({ id, row }) => [
        <GridActionsCellItem
          icon={<EditIcon />}
          label="Edit"
          onClick={() => {
            setSelectedApplicant(row);
            setIsEditModalOpen(true);
          }}
          color="inherit"
        />,
        <GridActionsCellItem
          icon={<DeleteIcon />}
          label="Delete"
          onClick={handleDeleteClick(id)}
          color="inherit"
        />,
      ],
    },
  ];

  const debugFormatAddress = (addressLocation) => {
    console.log("Input addressLocation:", addressLocation);
    return addressLocation || "";
  };

  const handleExportExcel = () => {
    console.log("Starting Excel export");
    console.log("Number of rows:", rows.length);

    const exportData = rows.map((row, index) => {
      console.log(`Processing row ${index}:`, row);

      const mappedRow = {
        ULI: row.uli || "",
        "Training Center": row.trainingCenterName || "",
        "Address Location": debugFormatAddress(
          row.addressLocation || row.completeMailingAddress
        ),
        "Number of Assessments": Array.isArray(row.assessments)
          ? row.assessments.length
          : 0,
        "Created At": row.createdAt
          ? new Date(row.createdAt).toLocaleDateString()
          : "",
        "Updated By": row.updatedBy || "",
      };

      console.log(`Mapped row ${index}:`, mappedRow);
      return mappedRow;
    });

    const worksheet = XLSX.utils.json_to_sheet(exportData);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Applicants");
    XLSX.writeFile(workbook, "applicants_export.xlsx");
  };

  const handleExportPDF = () => {
    console.log("Starting PDF export");

    const doc = new jsPDF();
    const relevantColumns = [
      "uli",
      "trainingCenterName",
      "addressLocation",
      "assessments",
      "createdAt",
      "updatedBy",
    ];
    const tableColumn = [
      "ULI",
      "Training Center",
      "Address Location",
      "Assessments",
      "Created At",
      "Updated By",
    ];

    const tableRows = rows.map((row, index) => {
      console.log(`Processing PDF row ${index}:`, row);

      return relevantColumns.map((key) => {
        if (key === "assessments") {
          return Array.isArray(row[key]) ? row[key].length.toString() : "0";
        }
        if (key === "addressLocation") {
          return debugFormatAddress(row[key] || row.completeMailingAddress);
        }
        if (key === "createdAt") {
          return row[key] ? new Date(row[key]).toLocaleDateString() : "";
        }
        return row[key]?.toString() || "";
      });
    });

    doc.text("Applicants List", 14, 15);
    doc.autoTable({
      head: [tableColumn],
      body: tableRows,
      startY: 25,
      styles: { fontSize: 8 },
      margin: { top: 30 },
    });
    doc.save("applicants_export.pdf");
  };

  const handleEditModalClose = () => {
    setIsEditModalOpen(false);
    setSelectedApplicant(null);
  };

  const handleEditModalSubmit = async (applicantData) => {
    try {
      if (selectedApplicant) {
        // Update existing applicant
        await updateApplicantMutation.mutateAsync({
          id: selectedApplicant._id,
          field: "all",
          value: applicantData,
        });
      } else {
        // Create new applicant
        await createApplicantMutation.mutateAsync(applicantData);
      }
      handleEditModalClose();
    } catch (error) {
      console.error("Error in edit/create:", error);
    }
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
      <Stack direction="row" spacing={2} sx={{ mb: 2 }}>
        <Button
          variant="contained"
          color="success"
          startIcon={<FileDownloadIcon />}
          onClick={handleExportExcel}
        >
          Export to Excel
        </Button>
        <Button
          variant="contained"
          color="error"
          startIcon={<FileDownloadIcon />}
          onClick={handleExportPDF}
        >
          Export to PDF
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
        onCellDoubleClick={(params) => {
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
              addressLocation: true,
              createdAt: !isMobile,
              updatedBy: !isMobile,
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
        <>
          {console.log("Selected Applicant:", selectedApplicant.uli)}
          <ApplicantEditModal
            open={isEditModalOpen}
            onClose={handleEditModalClose}
            uli={selectedApplicant?.uli}
            initialData={selectedApplicant}
            onSubmit={handleEditModalSubmit}
          />
        </>
      )}
    </TableContainer>
  );
};

export default ApplicantTable;
