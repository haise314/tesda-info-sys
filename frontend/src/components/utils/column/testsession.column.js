// Function to format date
const formatDate = (dateString) => {
  if (!dateString) return "";
  const date = new Date(dateString);
  return date.toISOString().split("T")[0]; // This will return YYYY-MM-DD
};

export const testSessionColumns = [
  {
    field: "uli",
    headerName: "ULI",
    width: 160,
    editable: true,
  },
  {
    field: "test",
    headerName: "Test ID",
    width: 220,
    editable: true,
    renderCell: (params) => {
      const test = params.row.test;
      if (!test) return "";
      return `${test._id} ${test.name || ""}`.trim(); // Add more test fields if needed
    },
  },
  {
    field: "testCode",
    headerName: "Test Code",
    width: 120,
    editable: true,
  },
  {
    field: "startTime",
    headerName: "Start Time",
    width: 160,
    editable: true,
    renderCell: (params) => formatDate(params.row.startTime),
  },
  {
    field: "status",
    headerName: "Status",
    width: 120,
    editable: true,
    type: "singleSelect",
    valueOptions: ["in-progress", "completed", "abandoned"],
  },
  {
    field: "createdAt",
    headerName: "Created At",
    width: 160,
    editable: false,
    renderCell: (params) => formatDate(params.row.createdAt),
  },
  {
    field: "updatedAt",
    headerName: "Updated At",
    width: 160,
    editable: false,
    renderCell: (params) => formatDate(params.row.updatedAt),
  },
];
