// Function to format date
const formatDate = (dateString) => {
  const date = new Date(dateString);
  return date.toISOString().split("T")[0]; // This will return YYYY-MM-DD
};

export const registrantColumns = [
  // ULI
  { field: "uli", headerName: "ULI", width: 100 },
  // Name fields
  { field: "firstName", headerName: "First Name", width: 150 },
  { field: "middleName", headerName: "Middle Name", width: 150 },
  { field: "lastName", headerName: "Last Name", width: 150 },
  { field: "extension", headerName: "Extension", width: 100 },
  // Full Name
  {
    field: "fullName",
    headerName: "Full Name",
    width: 200,
    hide: true,
    renderCell: (params) =>
      `${params.row.firstName || ""} ${params.row.middleName || ""} ${
        params.row.lastName || ""
      } ${params.row.extension || ""}`.trim(),
  },

  // Complete Mailing Address
  { field: "mailingStreet", headerName: "Street", width: 200 },
  { field: "mailingBarangay", headerName: "Barangay", width: 150 },
  { field: "mailingDistrict", headerName: "District", width: 150 },
  { field: "mailingCity", headerName: "City", width: 150 },
  { field: "mailingProvince", headerName: "Province", width: 150 },
  { field: "mailingRegion", headerName: "Region", width: 150 },

  // Combined Mailing Address
  {
    field: "mailingAddress",
    headerName: "Mailing Address",
    width: 400,
    renderCell: (params) =>
      `${params.row.mailingStreet || ""}, ${
        params.row.mailingBarangay || ""
      }, ${params.row.mailingDistrict || ""}, ${
        params.row.mailingCity || ""
      }, ${params.row.mailingProvince || ""}, ${
        params.row.mailingRegion || ""
      }`.trim(),
  },

  // Contact Information
  { field: "email", headerName: "Email", width: 150, editable: true },
  { field: "mobileNumber", headerName: "Mobile No.", width: 110 },

  // Personal Information
  { field: "sex", headerName: "Sex", width: 100 },
  { field: "civilStatus", headerName: "Civil Status", width: 150 },
  { field: "nationality", headerName: "Nationality", width: 150 },
  {
    field: "birthdate",
    headerName: "Birthdate",
    width: 150,
    renderCell: (params) => formatDate(params.row.birthdate),
  },
  { field: "age", headerName: "Age", width: 100 },

  // Birthplace
  { field: "birthplaceCity", headerName: "Birthplace City", width: 150 },
  {
    field: "birthplaceProvince",
    headerName: "Birthplace Province",
    width: 150,
  },
  { field: "birthplaceRegion", headerName: "Birthplace Region", width: 150 },

  // Combined Birthplace
  {
    field: "birthplace",
    headerName: "Birthplace",
    width: 300,
    renderCell: (params) =>
      `${params.row.birthplaceCity || ""}, ${
        params.row.birthplaceProvince || ""
      }, ${params.row.birthplaceRegion || ""}`.trim(),
  },

  // Employment Information
  { field: "employmentStatus", headerName: "Employment Status", width: 200 },
  { field: "employmentType", headerName: "Employment Type", width: 200 },

  // Education
  { field: "education", headerName: "Education", width: 200 },

  // Parent Information
  { field: "parentFirstName", headerName: "Parent First Name", width: 150 },
  { field: "parentMiddleName", headerName: "Parent Middle Name", width: 150 },
  { field: "parentLastName", headerName: "Parent Last Name", width: 150 },

  // Combined Parent Name
  {
    field: "parentFullName",
    headerName: "Parent Full Name",
    width: 300,
    renderCell: (params) =>
      `${params.row.parentFirstName || ""} ${
        params.row.parentMiddleName || ""
      } ${params.row.parentLastName || ""}`.trim(),
  },

  {
    field: "parentMailingStreet",
    headerName: "Parent Mailing Street",
    width: 200,
  },
  {
    field: "parentMailingBarangay",
    headerName: "Parent Mailing Barangay",
    width: 150,
  },
  {
    field: "parentMailingDistrict",
    headerName: "Parent Mailing District",
    width: 150,
  },
  { field: "parentMailingCity", headerName: "Parent Mailing City", width: 150 },
  {
    field: "parentMailingProvince",
    headerName: "Parent Mailing Province",
    width: 150,
  },
  {
    field: "parentMailingRegion",
    headerName: "Parent Mailing Region",
    width: 150,
  },

  // Combined Parent Mailing Address
  {
    field: "parentMailingAddress",
    headerName: "Parent Mailing Address",
    width: 400,
    renderCell: (params) =>
      `${params.row.parentMailingStreet || ""}, ${
        params.row.parentMailingBarangay || ""
      }, ${params.row.parentMailingDistrict || ""}, ${
        params.row.parentMailingCity || ""
      }, ${params.row.parentMailingProvince || ""}, ${
        params.row.parentMailingRegion || ""
      }`.trim(),
  },

  // Client Classification
  {
    field: "clientClassification",
    headerName: "Client Classification",
    width: 170,
  },

  // Disability Information
  { field: "disabilityType", headerName: "Disability Type", width: 200 },
  { field: "disabilityCause", headerName: "Disability Cause", width: 200 },

  // Course Information
  { field: "course", headerName: "Course", width: 100 },

  // Scholar Information
  { field: "hasScholarType", headerName: "Scholar", width: 70 },
  { field: "scholarType", headerName: "Scholar Type", width: 100 },
  {
    field: "registrationStatus",
    headerName: "Registration Status",
    width: 80,
  },

  // Created and Updated At
  {
    field: "createdAt",
    headerName: "Created At",
    width: 90,
    renderCell: (params) => formatDate(params.row.createdAt),
  },
  {
    field: "updatedAt",
    headerName: "Updated At",
    width: 90,
    renderCell: (params) => formatDate(params.row.updatedAt),
  },
];
