// Function to format date
const formatDate = (dateString) => {
  if (!dateString) return "";
  const date = new Date(dateString);
  return date.toISOString().split("T")[0]; // This will return YYYY-MM-DD
};

export const deletedRegistrantColumns = [
  { field: "uli", headerName: "ULI", width: 120 },
  {
    field: "name",
    headerName: "Name",
    width: 200,
    renderCell: (params) =>
      `${params.row.name.firstName} ${params.row.name.lastName}`,
  },
  {
    field: "email",
    headerName: "Email",
    width: 200,
    renderCell: (params) => params.row.contact.email,
  },
  {
    field: "mobileNumber",
    headerName: "Mobile Number",
    width: 150,
    renderCell: (params) => params.row.contact.mobileNumber,
  },
  {
    field: "sex",
    headerName: "Sex",
    width: 100,
    renderCell: (params) => params.row.personalInformation.sex,
  },
  {
    field: "birthdate",
    headerName: "Birthdate",
    width: 120,
    renderCell: (params) =>
      formatDate(params.row.personalInformation.birthdate),
  },
  {
    field: "age",
    headerName: "Age",
    width: 80,
    renderCell: (params) => params.row.personalInformation.age,
  },
  { field: "employmentStatus", headerName: "Employment Status", width: 180 },
  { field: "education", headerName: "Education", width: 200 },
  {
    field: "clientClassification",
    headerName: "Client Classification",
    width: 180,
  },
  { field: "course", headerName: "Course", width: 200 },
  {
    field: "scholarType",
    headerName: "Scholar Type",
    width: 150,
    renderCell: (params) =>
      params.row.hasScholarType ? params.row.scholarType : "N/A",
  },
  {
    field: "registrationStatus",
    headerName: "Registration Status",
    width: 160,
  },
  {
    field: "deletedAt",
    headerName: "Deleted At",
    width: 160,
    renderCell: (params) => formatDate(params.row.deletedAt),
  },
];
