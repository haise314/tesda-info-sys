// Function to format date
const formatDate = (dateString) => {
  if (!dateString) return "";
  const date = new Date(dateString);
  return date.toLocaleString(); // Changed to include time as well
};

export const deletedApplicantColumns = [
  {
    field: "uli",
    headerName: "ULI",
    width: 120,
  },
  {
    field: "name",
    headerName: "Name",
    width: 200,
    renderCell: (params) => {
      const firstName = params.row?.name?.firstName || "Unknown";
      const lastName = params.row?.name?.lastName || "";
      return `${firstName} ${lastName}`.trim();
    },
  },
  {
    field: "trainingCenterName",
    headerName: "Training Center",
    width: 200,
  },
  {
    field: "assessmentTitle",
    headerName: "Assessment Title",
    width: 200,
  },
  {
    field: "assessmentType",
    headerName: "Assessment Type",
    width: 150,
  },
  {
    field: "clientType",
    headerName: "Client Type",
    width: 120,
  },
  {
    field: "birthdate",
    headerName: "Birthdate",
    width: 120,
    renderCell: (params) => formatDate(params.row?.birthdate),
  },
  {
    field: "age",
    headerName: "Age",
    type: "number",
    width: 80,
  },
  {
    field: "deletedAt",
    headerName: "Deleted At",
    width: 200, // Increased width to accommodate full datetime
    renderCell: (params) => formatDate(params.row?.deletedAt),
  },
  {
    field: "deletedBy",
    headerName: "Deleted By",
    width: 120,
  },
  {
    field: "isDeleted",
    headerName: "Is Deleted",
    type: "boolean",
    width: 100,
  },
];
