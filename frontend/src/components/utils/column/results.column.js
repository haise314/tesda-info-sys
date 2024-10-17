// Function to format date
const formatDate = (dateString) => {
  if (!dateString) return "";
  const date = new Date(dateString);
  return date.toLocaleDateString();
};

export const resultsColumns = [
  {
    field: "uli",
    headerName: "ULI",
    width: 130,
  },
  {
    field: "testCode",
    headerName: "Test Code",
    width: 130,
  },
  {
    field: "subject", // Added subject column
    headerName: "Subject",
    width: 130,
  },
  {
    field: "score",
    headerName: "Score",
    width: 100,
    type: "number",
  },
  {
    field: "totalQuestions",
    headerName: "Total Questions",
    width: 130,
    type: "number",
  },
  {
    field: "remarks",
    headerName: "Remarks",
    width: 200,
    editable: true,
  },
  {
    field: "createdAt",
    headerName: "Created At",
    width: 120,
    editable: false,
    renderCell: (params) => formatDate(params.row.createdAt),
  },
  {
    field: "updatedAt",
    headerName: "Updated At",
    width: 120,
    editable: false,
    renderCell: (params) => formatDate(params.row.updatedAt),
  },
];
