// Function to format date
const formatDate = (dateString) => {
  if (!dateString) return "";
  const date = new Date(dateString);
  return date.toISOString().split("T")[0]; // This will return YYYY-MM-DD
};

export const userColumns = [
  { field: "uli", headerName: "ULI", width: 180, editable: true },
  {
    field: "role",
    headerName: "Role",
    width: 120,
    editable: true,
    type: "singleSelect",
    valueOptions: ["client", "user", "admin", "superadmin"],
  },
  {
    field: "createdAt",
    headerName: "Created At",
    width: 180,
    editable: false,
    renderCell: (params) => formatDate(params.value),
  },
  {
    field: "updatedAt",
    headerName: "Updated At",
    width: 180,
    editable: false,
    renderCell: (params) => formatDate(params.value),
  },
];
