// UsersTable.jsx
import React, { useState, useEffect } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import axios from "axios";
import * as XLSX from "xlsx";
import jsPDF from "jspdf";
import "jspdf-autotable";
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
  Typography,
  Stack,
  useMediaQuery,
} from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";
import FileDownloadIcon from "@mui/icons-material/FileDownload";
import { userColumns } from "../utils/column/users.column.js";
import UserEditModal from "./subcomponent/UserEditModal.jsx"; // Import the new modal
import { useTheme } from "@emotion/react";

const getDefaultColumnVisibility = (columns) => {
  const visibility = {};
  columns.forEach((col) => {
    visibility[col.field] = false;
  });
  return visibility;
};

const UsersTable = () => {
  const [rows, setRows] = useState([]);
  const theme = useTheme();
  const [openDialog, setOpenDialog] = useState(false);
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  const [selectedUli, setSelectedUli] = useState(null);
  const [error, setError] = useState("");

  const queryClient = useQueryClient();
  const apiRef = useGridApiRef();

  // Fetch Users Query
  const { data: users, isLoading } = useQuery({
    queryKey: ["users"],
    queryFn: async () => {
      const response = await axios.post("/api/auth/users");
      console.log("Response Data: ", response.data);
      return response.data;
    },
  });

  useEffect(() => {
    if (users) {
      setRows(users);
    }
  }, [users]);

  // Update User Mutation
  const updateUserMutation = useMutation({
    mutationFn: async ({ uli, ...updateData }) => {
      const userResponse = await axios.get(`/api/auth/${uli}`);
      const fullUserData = userResponse.data;

      const response = await axios.put(`/api/auth/users/update/${uli}`, {
        ...fullUserData,
        ...updateData,
      });
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries(["users"]);
      setOpenDialog(false);
      setSelectedUli(null);
    },
    onError: (error) => {
      setError(error.response?.data?.message || "Failed to update user");
    },
  });

  // Delete User Mutation
  const deleteUserMutation = useMutation({
    mutationFn: (uli) => axios.delete(`/api/auth/users/delete/${uli}`),
    onSuccess: () => {
      queryClient.invalidateQueries(["users"]);
    },
  });

  const handleEditClick = (uli) => {
    setSelectedUli(uli);
    setOpenDialog(true);
  };

  const handleDeleteClick = (uli) => {
    if (window.confirm("Are you sure you want to delete this user?")) {
      deleteUserMutation.mutate(uli);
    }
  };

  const handleUpdateUser = (updatedUser) => {
    updateUserMutation.mutate({
      uli: selectedUli,
      ...updatedUser,
    });
  };

  // Export to Excel
  const handleExportExcel = () => {
    const worksheet = XLSX.utils.json_to_sheet(rows);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Users");
    XLSX.writeFile(workbook, "users_export.xlsx");
  };

  // Export to PDF
  const handleExportPDF = () => {
    const doc = new jsPDF();
    const relevantColumns = [
      "uli",
      "firstName",
      "lastName",
      "email",
      "mobileNumber",
    ];
    const tableColumn = [
      "ULI",
      "First Name",
      "Last Name",
      "Email",
      "Mobile Number",
    ];
    const tableRows = rows.map((row) =>
      relevantColumns.map((key) =>
        key.includes(".")
          ? key.split(".").reduce((acc, part) => acc?.[part], row)
          : row[key] || ""
      )
    );

    doc.text("Users List", 14, 15);
    doc.autoTable({
      head: [tableColumn],
      body: tableRows,
      startY: 25,
      styles: { fontSize: 8 },
    });
    doc.save("users_export.pdf");
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
          onClick={() => handleEditClick(row.uli)}
        />,
        <GridActionsCellItem
          icon={<DeleteIcon />}
          label="Delete"
          onClick={() => handleDeleteClick(row.uli)}
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
        // initialState={{
        //   pagination: {
        //     paginationModel: { pageSize: 10 },
        //   },
        // }}
        pageSizeOptions={[5, 10, 25, 50]}
        className="h-[600px]"
        initialState={{
          columns: {
            columnVisibilityModel: {
              ...getDefaultColumnVisibility(userColumns),
              uli: true,
              role: true,
              firstName: true,
              lastName: true,
              clientClassification: true,
              createdAt: !isMobile,
              updatedAt: !isMobile,
              updatedBy: !isMobile,
              actions: true,
            },
          },
          pagination: {
            paginationModel: { pageSize: isMobile ? 5 : 10 },
          },
        }}
      />

      <UserEditModal
        open={openDialog}
        onClose={() => {
          setOpenDialog(false);
          setSelectedUli(null);
          setError("");
        }}
        uli={selectedUli}
        onSubmit={handleUpdateUser}
        error={error}
      />
    </div>
  );
};

export default UsersTable;
