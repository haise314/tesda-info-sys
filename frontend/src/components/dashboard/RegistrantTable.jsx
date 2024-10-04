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
} from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";
import AddIcon from "@mui/icons-material/Add";
import axios from "axios";
import { registrantColumns } from "../utils/registrant.column.js";
import flattenRegistrantData from "../utils/registrant.flatten.js";

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
      console.log("Sending update to server:", updatedRegistrant);
      const { _id, ...registrantData } = updatedRegistrant;
      return axios.put(`/api/register/${_id}`, registrantData);
    },
    onSuccess: (response, variables) => {
      console.log("Update successful. Server response:", response.data);
      queryClient.invalidateQueries(["registrants"]);
    },
    onError: (error, variables) => {
      console.error("Update failed:", error);
      alert("Failed to update registrant. Please try again.");
      // Implement user feedback here (e.g., show an error message)
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

    onError: (error) => {
      console.error("Error deleting registrant:", error);

      // Implement user feedback here (e.g., show an error message)
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
        cellClassName: "actions",

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
    // This is a placeholder. You'll need to implement the actual logic to add a new registrant
    console.log("Add new registrant");
  };

  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>Error loading data: {error.message}</div>;

  return (
    <Box sx={{ height: 400, width: "100%" }}>
      <Button startIcon={<AddIcon />} onClick={handleAddClick}>
        Add Registrant
      </Button>
      <DataGrid
        apiRef={apiRef}
        rows={rows}
        columns={columns}
        slots={{
          toolbar: GridToolbar,
        }}
        getRowId={(row) => row._id}
        initialState={{
          columns: {
            columnVisibilityModel: {
              ...getDefaultColumnVisibility(registrantColumns),
              uli: true,
              fullName: true,
              email: true,
              mobileNumber: true,
              clientClassification: true,
              course: true,
              hasScholarType: true,
              scholarType: true,
              createdAt: true,
              updatedAt: true,
              actions: true,
            },
          },
        }}
      />

      <Dialog open={openDialog} onClose={handleDialogClose}>
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
                value={selectedRow.clientClassification || ""}
                onChange={(e) =>
                  handleFieldChange("clientClassification", e.target.value)
                }
              />
              <TextField
                margin="dense"
                label="Course"
                fullWidth
                value={selectedRow.course || ""}
                onChange={(e) => handleFieldChange("course", e.target.value)}
              />
              <TextField
                margin="dense"
                label="has Scholar?"
                fullWidth
                value={selectedRow.hasScholarType || ""}
                onChange={(e) =>
                  handleFieldChange("hasScholarType", e.target.value)
                }
              />

              <TextField
                margin="dense"
                label="Scholar Type"
                fullWidth
                value={selectedRow.scholarType || ""}
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
    </Box>
  );
};

export default RegistrantTable;
