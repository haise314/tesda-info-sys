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
    width: 160,
    editable: false,
  },
  {
    field: "testCode",
    headerName: "Test Code",
    width: 120,
    editable: false,
  },
  {
    field: "score",
    headerName: "Score",
    type: "number",
    width: 80,
    editable: false,
  },
  {
    field: "totalQuestions",
    headerName: "Total Questions",
    type: "number",
    width: 120,
    editable: false,
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
