// Function to format date
const formatDate = (dateString) => {
  if (!dateString) return "";
  const date = new Date(dateString);
  return date.toISOString().split("T")[0]; // This will return YYYY-MM-DD
};

export const userColumns = [
  { field: "id", headerName: "ID", width: 220, editable: false },
  { field: "uli", headerName: "ULI", width: 180, editable: true },
  {
    field: "role",
    headerName: "Role",
    width: 120,
    editable: true,
    type: "singleSelect",
    valueOptions: ["client", "admin", "superadmin"],
  },
  { field: "firstName", headerName: "First Name", width: 150, editable: true },
  { field: "lastName", headerName: "Last Name", width: 150, editable: true },
  { field: "email", headerName: "Email", width: 250, editable: true },
  {
    field: "mobileNumber",
    headerName: "Mobile Number",
    width: 180,
    editable: true,
  },
  {
    field: "employmentStatus",
    headerName: "Employment Status",
    width: 180,
    editable: true,
  },
  { field: "education", headerName: "Education", width: 180, editable: true },
  { field: "sex", headerName: "Sex", width: 100, editable: true },
  {
    field: "civilStatus",
    headerName: "Civil Status",
    width: 150,
    editable: true,
  },
  {
    field: "birthdate",
    headerName: "Birthdate",
    width: 150,
    editable: true,
    renderCell: (params) => formatDate(params.value),
  },
  { field: "age", headerName: "Age", width: 100, editable: true },
  {
    field: "nationality",
    headerName: "Nationality",
    width: 150,
    editable: true,
  },
  {
    field: "clientClassification",
    headerName: "Client Classification",
    width: 200,
    editable: true,
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
  {
    field: "updatedBy",
    headerName: "Updated By",
    width: 150,
    editable: false,
  },
];
