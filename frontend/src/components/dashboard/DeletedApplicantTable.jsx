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
import { deletedApplicantColumns } from "../utils/column/deletedApplicant.column";

const fetchDeletedApplicants = async () => {
  const response = await axios.get("/api/deleted-applicants");
  return response.data;
};

const getDefaultColumnVisibility = (columns) => {
  const visibility = {};
  columns.forEach((col) => {
    visibility[col.field] = false;
  });
  return visibility;
};

const DeletedApplicantTable = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  const apiRef = useGridApiRef();
  const [rows, setRows] = useState([]);

  const {
    data: deletedApplicants,
    isLoading,
    error,
  } = useQuery({
    queryKey: ["deletedApplicants"],
    queryFn: fetchDeletedApplicants,
  });

  useEffect(() => {
    if (deletedApplicants) {
      setRows(deletedApplicants);
    }
  }, [deletedApplicants]);

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
            Loading Deleted Applicant Data...
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
        columns={deletedApplicantColumns}
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
              ...getDefaultColumnVisibility(deletedApplicantColumns),
              uli: true,
              name: true,
              trainingCenterName: !isMobile,
              assessmentTitle: !isMobile,
              deletedAt: true,
              deletedBy: true,
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

export default DeletedApplicantTable;
