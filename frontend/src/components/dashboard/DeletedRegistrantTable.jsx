import React, { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { DataGrid, GridToolbar, useGridApiRef } from "@mui/x-data-grid";
import {
  Box,
  CircularProgress,
  Container,
  Typography,
  useMediaQuery,
} from "@mui/material";
import { useTheme } from "@emotion/react";
import { TableContainer } from "../../layouts/TableContainer";
import { deletedRegistrantColumns } from "../utils/column/deletedRegistrant.column";
import { useAuth } from "../../context/AuthContext"; // Assuming you have an AuthContext

const fetchDeletedRegistrants = async () => {
  const response = await axios.get("/api/deleted-registrants");
  return response.data;
};

const getDefaultColumnVisibility = (columns) => {
  const visibility = {};
  columns.forEach((col) => {
    visibility[col.field] = false;
  });
  return visibility;
};

const DeletedRegistrantTable = () => {
  const { user: loggedInUser } = useAuth(); // Get logged-in user from context
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  const apiRef = useGridApiRef();
  const [rows, setRows] = useState([]);

  const {
    data: deletedRegistrants,
    isLoading,
    error,
  } = useQuery({
    queryKey: ["deletedRegistrants"],
    queryFn: fetchDeletedRegistrants,
    // Optional: Add retry and error handling
    retry: 1,
    refetchOnWindowFocus: false,
  });

  useEffect(() => {
    if (deletedRegistrants) {
      setRows(deletedRegistrants);
    }
  }, [deletedRegistrants]);

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
            Loading Deleted Registrant Data...
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
      <DataGrid
        apiRef={apiRef}
        rows={rows}
        columns={deletedRegistrantColumns}
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
        initialState={{
          columns: {
            columnVisibilityModel: {
              ...getDefaultColumnVisibility(deletedRegistrantColumns),
              uli: true,
              name: true,
              email: !isMobile,
              mobileNumber: !isMobile,
              registrationStatus: true,
              deletedAt: true,
              deletedBy: true, // Add new column
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

export default DeletedRegistrantTable;
