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
    renderCell: (params) => {
      // Add null/undefined checks
      const firstName = params.row.name?.firstName || "N/A";
      const lastName = params.row.name?.lastName || "N/A";
      return `${firstName} ${lastName}`.trim();
    },
  },
  {
    field: "email",
    headerName: "Email",
    width: 200,
    renderCell: (params) => {
      // Add null/undefined checks
      return params.row.contact?.email || "N/A";
    },
  },
  {
    field: "mobileNumber",
    headerName: "Mobile Number",
    width: 150,
    renderCell: (params) => {
      // Add null/undefined checks
      return params.row.contact?.mobileNumber || "N/A";
    },
  },
  {
    field: "deletedBy",
    headerName: "Deleted By",
    width: 150,
    renderCell: (params) => params.row.deletedBy || "Unknown",
  },
  {
    field: "sex",
    headerName: "Sex",
    width: 100,
    renderCell: (params) => {
      // Add null/undefined checks
      return params.row.personalInformation?.sex || "N/A";
    },
  },
  {
    field: "birthdate",
    headerName: "Birthdate",
    width: 120,
    renderCell: (params) => {
      // Add null/undefined checks
      return formatDate(params.row.personalInformation?.birthdate);
    },
  },
  {
    field: "age",
    headerName: "Age",
    width: 80,
    renderCell: (params) => {
      // Add null/undefined checks
      return params.row.personalInformation?.age || "N/A";
    },
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
    field: "deletedAt",
    headerName: "Deleted At",
    width: 160,
    renderCell: (params) => formatDate(params.row.deletedAt),
  },
];
