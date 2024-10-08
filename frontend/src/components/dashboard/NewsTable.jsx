import React, { useState, useEffect } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import axios from "axios";
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
  Stack,
  Typography,
  useMediaQuery,
} from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import AddIcon from "@mui/icons-material/Add";
import { newsColumns } from "../utils/column/news.column";
import { TableContainer } from "../../layouts/TableContainer";
import { useTheme } from "@emotion/react";
import AddNewsDialog from "./AddNews";

const fetchNews = async () => {
  const response = await axios.get("/api/news");
  return response.data;
};

const getDefaultColumnVisibility = (columns) => {
  const visibility = {};
  columns.forEach((col) => {
    visibility[col.field] = false;
  });
  return visibility;
};

const NewsTable = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  const queryClient = useQueryClient();
  const apiRef = useGridApiRef();
  const [rows, setRows] = useState([]);
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);

  const {
    data: news,
    isLoading,
    error,
  } = useQuery({
    queryKey: ["news"],
    queryFn: fetchNews,
  });

  useEffect(() => {
    if (news) {
      // Ensure each row has a unique id field
      const rowsWithId = news.map((item) => ({
        ...item,
        id: item._id, // Use _id from MongoDB as the id field for DataGrid
      }));
      setRows(rowsWithId);
    }
  }, [news]);

  const updateNewsMutation = useMutation({
    mutationFn: async (params) => {
      const { id, ...updateData } = params;
      const response = await axios.put(`/api/news/${id}`, updateData);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries(["news"]);
    },
    onError: (error) => {
      console.error("Update error:", error);
      alert("Failed to update news. Please try again.");
    },
  });

  const deleteNewsMutation = useMutation({
    mutationFn: (id) => axios.delete(`/api/news/${id}`),
    onSuccess: () => {
      queryClient.invalidateQueries(["news"]);
    },
  });

  const handleDeleteClick = (id) => () => {
    if (window.confirm("Are you sure you want to delete this news item?")) {
      deleteNewsMutation.mutate(id);
    }
  };

  const processRowUpdate = React.useCallback(
    async (newRow) => {
      try {
        await updateNewsMutation.mutateAsync({
          id: newRow.id, // Use the id field here
          ...newRow,
        });
        return newRow;
      } catch (error) {
        throw error;
      }
    },
    [updateNewsMutation]
  );

  const columns = [
    ...newsColumns,
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
    setIsAddDialogOpen(true);
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
            Loading News Data...
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
          Add News
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
        processRowUpdate={processRowUpdate}
        onProcessRowUpdateError={(error) => {
          console.error("Error while saving:", error);
        }}
        initialState={{
          columns: {
            columnVisibilityModel: {
              ...getDefaultColumnVisibility(columns),
              title: true,
              content: !isMobile,
              author: !isMobile,
              publishDate: true,
              tags: !isMobile,
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
      <AddNewsDialog
        open={isAddDialogOpen}
        onClose={() => setIsAddDialogOpen(false)}
        onAddNews={() => queryClient.invalidateQueries(["news"])}
      />
    </TableContainer>
  );
};

export default NewsTable;
