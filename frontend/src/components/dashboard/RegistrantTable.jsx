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
  Select,
  MenuItem,
} from "@mui/material";
import { useTheme } from "@emotion/react";
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";
import AddIcon from "@mui/icons-material/Add";
import axios from "axios";
import { registrantColumns } from "../utils/column/registrant.column.js";
import { TableContainer } from "../../layouts/TableContainer";
import {
  unflattenRegistrantData,
  flattenRegistrantData,
} from "../utils/flatten/registrant.flatten.js";
import { registrationStatuses } from "../utils/enums/registrant.enums.js";
import CourseEditDialog from "./CourseEdit.jsx";

const fetchRegistrants = async () => {
  try {
    const response = await axios.get("/api/register");
    // console.log("Raw API response:", response);
    // console.log("Response data:", response.data);

    let flattenedData;
    if (Array.isArray(response.data.data)) {
      // console.log("Data is an array with length:", response.data.data.length);
      flattenedData = response.data.data.map((registrant) => {
        const flattened = flattenRegistrantData(registrant);
        return flattened;
      });
    } else {
      // console.log("Data is a single object");
      flattenedData = [flattenRegistrantData(response.data.data)];
    }

    // console.log("Final flattened data:", flattenedData);
    return flattenedData;
  } catch (error) {
    console.error("Error fetching registrants:", error);
    throw error;
  }
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
  const [selectedRegistrant, setSelectedRegistrant] = useState(null);
  const [isCourseDialogOpen, setIsCourseDialogOpen] = useState(false);

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

  const handleCourseEdit = (params) => {
    const registrant = rows.find((row) => row._id === params.id);
    console.log("Selected registrant:", registrant);
    if (registrant) {
      const registrantWithCourses = {
        ...registrant,
        courses: Array.isArray(registrant.courses) ? registrant.courses : [],
      };
      setSelectedRegistrant(registrantWithCourses);
      setIsCourseDialogOpen(true);
    }
  };

  const handleCourseDialogClose = () => {
    setIsCourseDialogOpen(false);
    setSelectedRegistrant(null);
  };

  const handleCourseSave = async (updatedCourses) => {
    if (selectedRegistrant) {
      try {
        await updateRegistrantMutation.mutateAsync({
          id: selectedRegistrant._id,
          field: "course",
          value: updatedCourses,
        });
        queryClient.invalidateQueries(["registrants"]);
      } catch (error) {
        console.error("Failed to update courses:", error);
        // Handle error (e.g., show an error message to the user)
      }
    }
    handleCourseDialogClose();
  };

  // Modify the existing courses column to add the onCellDoubleClick functionality
  const modifiedColumns = registrantColumns.map((column) => {
    if (column.field === "courses") {
      return {
        ...column,
        editable: false, // Disable inline editing
      };
    }
    return column;
  });

  const updateRegistrantMutation = useMutation({
    mutationFn: async (params) => {
      console.log("Update registrant params:", params);
      const { id, field, value } = params;

      const currentRow = apiRef.current?.getRow(id);
      if (!currentRow) {
        throw new Error("Could not find row data");
      }
      console.log("Registrant currentRow:", currentRow);

      const updatedRow = { ...currentRow, [field]: value };
      console.log("Registrant updatedRow:", updatedRow);

      const unflattedData = unflattenRegistrantData(updatedRow);
      console.log("Registrant unflattenedData:", unflattedData);
      const response = await axios.put(`/api/register/${id}`, unflattedData);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries(["registrants"]);
    },
    onError: (error) => {
      console.error("Update error:", error);
      alert("Failed to update registrant. Please try again.");
    },
  });

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

  const processRowUpdate = React.useCallback(
    async (newRow, oldRow) => {
      const changedField = Object.keys(newRow).find(
        (key) => JSON.stringify(newRow[key]) !== JSON.stringify(oldRow[key])
      );
      console.log("Changed field:", changedField);
      if (!changedField) return oldRow; // No changes

      try {
        await updateRegistrantMutation.mutateAsync({
          id: newRow._id,
          field: changedField,
          value: newRow[changedField],
        });
        return newRow;
      } catch (error) {
        return oldRow;
      }
    },
    [updateRegistrantMutation]
  );

  // Add the actions column
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
        processRowUpdate={processRowUpdate}
        onProcessRowUpdateError={(error) => {
          console.error("Error while saving:", error);
        }}
        onCellDoubleClick={(params) => {
          console.log("Cell double click:", params);
          if (params.field === "courses") {
            handleCourseEdit(params);
          }
        }}
        initialState={{
          columns: {
            columnVisibilityModel: {
              ...getDefaultColumnVisibility(registrantColumns),
              uli: true,
              fullName: true,
              email: !isMobile,
              clientClassification: !isMobile,
              courses: true,
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
      {selectedRegistrant && (
        <CourseEditDialog
          open={isCourseDialogOpen}
          onClose={handleCourseDialogClose}
          courses={selectedRegistrant.courses}
          onSave={handleCourseSave}
        />
      )}
    </TableContainer>
  );
};

export default RegistrantTable;
