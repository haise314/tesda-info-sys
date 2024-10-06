import React, { useState, useEffect } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  DataGrid,
  GridActionsCellItem,
  GridToolbar,
  useGridApiRef,
} from "@mui/x-data-grid";
import {
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  useMediaQuery,
  Stack,
  Container,
  Box,
  CircularProgress,
  Typography,
} from "@mui/material";
import { useTheme } from "@emotion/react";
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";
import AddIcon from "@mui/icons-material/Add";
import axios from "axios";
import { registrantColumns } from "../utils/column/registrant.column.js";
import flattenRegistrantData from "../utils/flatten/registrant.flatten.js";
import { TableContainer } from "../../layouts/TableContainer";

const fetchRegistrants = async () => {
  const response = await axios.get("/api/register");
  return Array.isArray(response.data.data)
    ? response.data.data.map(flattenRegistrantData)
    : [flattenRegistrantData(response.data.data)];
};

const getDefaultColumnVisibility = (columns) => {
  const visibility = {};
  columns.forEach((col) => {
    visibility[col.field] = false;
  });
  return visibility;
};

const RegistrantTable = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  const queryClient = useQueryClient();
  const apiRef = useGridApiRef();
  const [rows, setRows] = useState([]);
  const [openDialog, setOpenDialog] = useState(false);
  const [selectedRow, setSelectedRow] = useState(null);

  const {
    data: registrants,
    isLoading,
    error,
  } = useQuery({
    queryKey: ["registrants"],
    queryFn: fetchRegistrants,
  });

  useEffect(() => {
    if (registrants) {
      setRows(registrants);
    }
  }, [registrants]);

  const updateRegistrantMutation = useMutation({
    mutationFn: (updatedRegistrant) => {
      const { _id, ...registrantData } = updatedRegistrant;
      return axios.put(`/api/register/${_id}`, registrantData);
    },
    onSuccess: () => {
      queryClient.invalidateQueries(["registrants"]);
    },
    onError: (error) => {
      alert("Failed to update registrant. Please try again.");
    },
  });

  const handleEditClick = (id) => () => {
    const rowToEdit = registrants.find((row) => row._id === id);
    setSelectedRow(rowToEdit);
    setOpenDialog(true);
  };

  const handleDialogClose = () => {
    setOpenDialog(false);
    setSelectedRow(null);
  };

  const handleDialogSave = () => {
    if (selectedRow) {
      updateRegistrantMutation.mutate(selectedRow);
      handleDialogClose();
    }
  };

  const handleFieldChange = (field, value) => {
    setSelectedRow((prev) => {
      const newRow = { ...prev };
      const fields = field.split(".");
      let current = newRow;
      for (let i = 0; i < fields.length - 1; i++) {
        if (!current[fields[i]]) current[fields[i]] = {};
        current = current[fields[i]];
      }
      current[fields[fields.length - 1]] = value;
      return newRow;
    });
  };

  const deleteRegistrantMutation = useMutation({
    mutationFn: (id) => axios.delete(`/api/register/${id}`),
    onSuccess: () => {
      queryClient.invalidateQueries(["registrants"]);
    },
  });

  const handleDeleteClick = (id) => () => {
    if (window.confirm("Are you sure you want to delete this registrant?")) {
      deleteRegistrantMutation.mutate(id);
    }
  };

  const columns = React.useMemo(
    () => [
      ...registrantColumns.map((col) => ({
        ...col,
        editable: false,
      })),
      {
        field: "actions",
        type: "actions",
        headerName: "Actions",
        width: 100,
        getActions: ({ id }) => [
          <GridActionsCellItem
            icon={<EditIcon />}
            label="Edit"
            onClick={handleEditClick(id)}
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
    ],
    []
  );

  const handleAddClick = () => {
    console.log("Add new registrant");
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
  if (error) return <div>Error loading data: {error.message}</div>;

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
          Add Registrant
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
        initialState={{
          columns: {
            columnVisibilityModel: {
              ...getDefaultColumnVisibility(registrantColumns),
              uli: true,
              fullName: true,
              email: !isMobile,
              mobileNumber: !isMobile,
              clientClassification: !isMobile,
              course: !isMobile,
              hasScholarType: !isMobile,
              scholarType: !isMobile,
              registrationStatus: !isMobile,
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

      <Dialog
        open={openDialog}
        onClose={handleDialogClose}
        fullScreen={isMobile}
        maxWidth="md"
        fullWidth
      >
        <DialogTitle>Edit Registrant</DialogTitle>
        <DialogContent>
          {selectedRow && (
            <>
              <TextField
                margin="dense"
                label="First Name"
                fullWidth
                value={selectedRow?.firstName || ""}
                onChange={(e) => handleFieldChange("firstName", e.target.value)}
              />
              <TextField
                margin="dense"
                label="Middle Name"
                fullWidth
                value={selectedRow?.middleName || ""}
                onChange={(e) =>
                  handleFieldChange("middleName", e.target.value)
                }
              />
              <TextField
                margin="dense"
                label="Last Name"
                fullWidth
                value={selectedRow?.lastName || ""}
                onChange={(e) => handleFieldChange("lastName", e.target.value)}
              />
              <TextField
                margin="dense"
                label="Extension"
                fullWidth
                value={selectedRow?.extension || ""}
                onChange={(e) => handleFieldChange("extension", e.target.value)}
              />
              <TextField
                margin="dense"
                label="Email"
                fullWidth
                value={selectedRow?.email || ""}
                onChange={(e) => handleFieldChange("email", e.target.value)}
              />
              <TextField
                margin="dense"
                label="Mobile Number"
                fullWidth
                value={selectedRow?.mobileNumber || ""}
                onChange={(e) =>
                  handleFieldChange("mobileNumber", e.target.value)
                }
              />
              <TextField
                margin="dense"
                label="Client Classification"
                fullWidth
                value={selectedRow?.clientClassification || ""}
                onChange={(e) =>
                  handleFieldChange("clientClassification", e.target.value)
                }
              />
              <TextField
                margin="dense"
                label="Course"
                fullWidth
                value={selectedRow?.course || ""}
                onChange={(e) => handleFieldChange("course", e.target.value)}
              />
              <TextField
                margin="dense"
                label="Has Scholar?"
                fullWidth
                value={selectedRow?.hasScholarType || ""}
                onChange={(e) =>
                  handleFieldChange("hasScholarType", e.target.value)
                }
              />
              <TextField
                margin="dense"
                label="Scholar Type"
                fullWidth
                value={selectedRow?.scholarType || ""}
                onChange={(e) =>
                  handleFieldChange("scholarType", e.target.value)
                }
              />
            </>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={handleDialogClose}>Cancel</Button>
          <Button onClick={handleDialogSave}>Save</Button>
        </DialogActions>
      </Dialog>
    </TableContainer>
  );
};

export default RegistrantTable;
