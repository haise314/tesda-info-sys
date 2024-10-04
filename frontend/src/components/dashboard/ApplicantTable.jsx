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
import { applicantColumns } from "../utils/applicant.column.js";
import flattenApplicantData from "../utils/applicant.flatten.js";

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
  const queryClient = useQueryClient();
  const apiRef = useGridApiRef();
  const [rows, setRows] = useState([]);
  const [openDialog, setOpenDialog] = useState(false);
  const [selectedRow, setSelectedRow] = useState(null);
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
    mutationFn: (updatedApplicant) => {
      const { _id, ...applicantData } = updatedApplicant;
      return axios.put(`/api/applicants/${_id}`, applicantData);
    },
    onSuccess: () => {
      queryClient.invalidateQueries(["applicants"]);
    },
    onError: (error) => {
      alert("Failed to update applicant. Please try again.");
    },
  });

  const handleEditClick = (id) => () => {
    const rowToEdit = applicants.find((row) => row._id === id);
    setSelectedRow(rowToEdit);
    setOpenDialog(true);
  };

  const handleDialogClose = () => {
    setOpenDialog(false);
    setSelectedRow(null);
  };

  const handleDialogSave = () => {
    if (selectedRow) {
      updateApplicantMutation.mutate(selectedRow);
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

  const columns = React.useMemo(
    () => [
      ...applicantColumns.map((col) => ({
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
    console.log("Add new applicant");
  };

  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>Error loading data: {error.message}</div>;

  return (
    <Box sx={{ height: 400, width: "100%" }}>
      <Button startIcon={<AddIcon />} onClick={handleAddClick}>
        Add Applicant
      </Button>
      <DataGrid
        apiRef={apiRef}
        rows={rows}
        columns={columns}
        slots={{ toolbar: GridToolbar }}
        getRowId={(row) => row._id}
        initialState={{
          columns: {
            columnVisibilityModel: {
              ...getDefaultColumnVisibility(applicantColumns),
              uli: true,
              fullName: true,
              email: true,
              mobileNumber: true,
              createdAt: true,
              updatedAt: true,
              actions: true,
            },
          },
        }}
      />

      <Dialog open={openDialog} onClose={handleDialogClose}>
        <DialogTitle>Edit Applicant</DialogTitle>

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
                label="Last Name"
                fullWidth
                value={selectedRow?.lastName || ""}
                onChange={(e) => handleFieldChange("lastName", e.target.value)}
              />
              <TextField
                margin="dense"
                label="Email"
                fullWidth
                value={selectedRow?.email || ""}
                onChange={(e) =>
                  handleFieldChange("contact.email", e.target.value)
                }
              />
              <TextField
                margin="dense"
                label="Mobile Number"
                fullWidth
                value={selectedRow?.mobileNumber || ""}
                onChange={(e) =>
                  handleFieldChange("contact.mobileNumber", e.target.value)
                }
              />
              <TextField
                margin="dense"
                label="Employment Status"
                fullWidth
                value={selectedRow?.employmentStatus || ""}
                onChange={(e) =>
                  handleFieldChange("employmentStatus", e.target.value)
                }
              />
              <TextField
                margin="dense"
                label="Highest Educational Attainment"
                fullWidth
                value={selectedRow?.highestEducationalAttainment || ""}
                onChange={(e) =>
                  handleFieldChange(
                    "highestEducationalAttainment",
                    e.target.value
                  )
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

export default ApplicantTable;
