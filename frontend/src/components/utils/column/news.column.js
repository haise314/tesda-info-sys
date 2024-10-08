import React from "react"; // Import React to use createElement
import { formatDate } from "../dateFormatter";

export const newsColumns = [
  { field: "title", headerName: "Title", width: 160, editable: true },
  {
    field: "content",
    headerName: "Content",
    width: 240,
    editable: true,
    renderCell: (params) =>
      React.createElement(
        "div",
        { style: { whiteSpace: "normal", wordWrap: "break-word" } },
        params.value.length > 100
          ? params.value.substring(0, 100) + "..."
          : params.value
      ),
  },
  { field: "author", headerName: "Author", width: 120, editable: true },
  {
    field: "publishDate",
    headerName: "Publish Date",
    width: 120,
    editable: true,
    renderCell: (params) => formatDate(params.value),
  },
  {
    field: "tags",
    headerName: "Tags",
    width: 160,
    editable: true,
    renderCell: (params) => params.value.join(", "),
  },
];
