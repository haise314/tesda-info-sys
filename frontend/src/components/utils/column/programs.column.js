// Function to format date
const formatDate = (dateString) => {
  if (!dateString) return "";
  const date = new Date(dateString);
  return date.toISOString().split("T")[0]; // This will return YYYY-MM-DD
};

export const programsColumns = [
  { field: "name", headerName: "Name", width: 160, editable: true },
  {
    field: "description",
    headerName: "Description",
    width: 240,
    editable: true,
  },
  {
    field: "duration",
    headerName: "Duration",
    type: "number",
    width: 80,
    editable: true,
  },
  {
    field: "qualificationLevel",
    headerName: "Qualification Level",
    width: 120,
    editable: true,
  },
  {
    field: "startDate",
    headerName: "Start Date",
    width: 120,
    editable: true,
    renderCell: (params) => formatDate(params.row.startDate),
  },
  {
    field: "endDate",
    headerName: "End Date",
    width: 120,
    editable: true,
    renderCell: (params) => formatDate(params.row.endDate),
  },
  { field: "location", headerName: "Location", width: 160, editable: true },
  { field: "trainer", headerName: "Trainer", width: 120, editable: true },
  {
    field: "slotsAvailable",
    headerName: "Slots Available",
    type: "number",
    width: 96,
    editable: true,
  },
  {
    field: "scholarshipAvailable",
    headerName: "Scholarship Available",
    type: "boolean",
    width: 120,
    editable: true,
    renderCell: (params) => {
      return params.value ? "Yes" : "No";
    },
  },
];
