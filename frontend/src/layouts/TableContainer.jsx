import { styled } from "@mui/material/styles";
import { Box } from "@mui/material";

export const TableContainer = styled(Box)(({ theme }) => ({
  height: "calc(100vh - 200px)", // Adjust based on your layout
  width: "100%",
  "& .MuiDataGrid-root": {
    border: "none",
    backgroundColor: theme.palette.background.paper,
    "& .MuiDataGrid-cell": {
      borderBottom: `1px solid ${theme.palette.divider}`,
    },
    "& .MuiDataGrid-columnHeaders": {
      backgroundColor: theme.palette.background.default,
      borderBottom: `2px solid ${theme.palette.divider}`,
    },
    "& .MuiDataGrid-virtualScroller": {
      backgroundColor: theme.palette.background.paper,
    },
    // Make columns and cells responsive
    "& .MuiDataGrid-cell, & .MuiDataGrid-columnHeader": {
      overflow: "hidden",
      textOverflow: "ellipsis",
      whiteSpace: "nowrap",
      [theme.breakpoints.down("sm")]: {
        minWidth: "100px !important",
        maxWidth: "200px !important",
      },
    },
    // Toolbar responsiveness
    "& .MuiDataGrid-toolbarContainer": {
      padding: theme.spacing(2),
      gap: theme.spacing(1),
      flexWrap: "wrap",
      "& .MuiButton-root": {
        [theme.breakpoints.down("sm")]: {
          minWidth: "auto",
        },
      },
    },
  },
  // Dialog responsiveness
  "& .MuiDialog-paper": {
    [theme.breakpoints.down("sm")]: {
      margin: theme.spacing(2),
      width: `calc(100% - ${theme.spacing(4)})`,
      maxHeight: `calc(100% - ${theme.spacing(4)})`,
    },
  },
}));
