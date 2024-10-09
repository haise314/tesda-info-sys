import {
  civilStatues,
  clientClassifications,
  disabilityCauses,
  disabilityTypes,
  educationalAttainments,
  employmentStatuses,
  employmentTypes,
  registrationStatuses,
  scholarTypes,
} from "../enums/registrant.enums";

// Function to format date
const formatDate = (dateString) => {
  const date = new Date(dateString);
  return date.toISOString().split("T")[0]; // This will return YYYY-MM-DD
};

export const registrantColumns = [
  // ULI
  { field: "uli", headerName: "ULI", width: 100, editable: false },
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
    editable: false,
    renderCell: (params) =>
      `${params.row.firstName || ""} ${params.row.middleName || ""} ${
        params.row.lastName || ""
      } ${params.row.extension || ""}`.trim(),
  },

  // Complete Mailing Address
  { field: "mailingStreet", headerName: "Street", width: 200, editable: true },
  {
    field: "mailingBarangay",
    headerName: "Barangay",
    width: 150,
    editable: true,
  },
  {
    field: "mailingDistrict",
    headerName: "District",
    width: 150,
    editable: true,
  },
  { field: "mailingCity", headerName: "City", width: 150, editable: true },
  {
    field: "mailingProvince",
    headerName: "Province",
    width: 150,
    editable: true,
  },
  { field: "mailingRegion", headerName: "Region", width: 150, editable: true },

  // Combined Mailing Address
  {
    field: "mailingAddress",
    headerName: "Mailing Address",
    width: 400,
    editable: false,
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
  {
    field: "email",
    headerName: "Email",
    width: 150,
    editable: true,
    preProcessEditCellProps: (params) => {
      const isValid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(params.props.value);
      return { ...params.props, error: !isValid };
    },
  },
  { field: "mobileNumber", headerName: "Mobile No.", width: 110 },

  // Personal Information
  {
    field: "sex",
    headerName: "Sex",
    width: 100,
    editable: true,
    type: "singleSelect",
    valueOptions: ["Male", "Female", "Others"],
  },
  {
    field: "civilStatus",
    headerName: "Civil Status",
    width: 150,
    editable: true,
    type: "singleSelect",
    valueOptions: civilStatues,
  },
  {
    field: "nationality",
    headerName: "Nationality",
    width: 150,
    editable: true,
  },
  {
    field: "birthdate",
    headerName: "Birthdate",
    width: 150,
    editable: true,
    renderCell: (params) => formatDate(params.row.birthdate),
  },
  { field: "age", headerName: "Age", width: 100, editable: true },

  // Birthplace
  {
    field: "birthplaceCity",
    headerName: "Birthplace City",
    width: 150,
    editable: true,
  },
  {
    field: "birthplaceProvince",
    headerName: "Birthplace Province",
    width: 150,
    editable: true,
  },
  {
    field: "birthplaceRegion",
    headerName: "Birthplace Region",
    width: 150,
    editable: true,
  },

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
  {
    field: "employmentStatus",
    headerName: "Employment Status",
    width: 200,
    editable: true,
    type: "singleSelect",
    valueOptions: employmentStatuses,
  },
  {
    field: "employmentType",
    headerName: "Employment Type",
    width: 200,
    editable: true,
    type: "singleSelect",
    valueOptions: employmentTypes,
  },

  // Education
  {
    field: "education",
    headerName: "Education",
    width: 200,
    editable: true,
    type: "singleSelect",
    valueOptions: educationalAttainments,
  },

  // Parent Information
  {
    field: "parentFirstName",
    headerName: "Parent First Name",
    width: 150,
    editable: true,
  },
  {
    field: "parentMiddleName",
    headerName: "Parent Middle Name",
    width: 150,
    editable: true,
  },
  {
    field: "parentLastName",
    headerName: "Parent Last Name",
    width: 150,
    editable: true,
  },

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
    editable: true,
  },
  {
    field: "parentMailingBarangay",
    headerName: "Parent Mailing Barangay",
    width: 150,
    editable: true,
  },
  {
    field: "parentMailingDistrict",
    headerName: "Parent Mailing District",
    width: 150,
    editable: true,
  },
  {
    field: "parentMailingCity",
    headerName: "Parent Mailing City",
    width: 150,
    editable: true,
  },
  {
    field: "parentMailingProvince",
    headerName: "Parent Mailing Province",
    width: 150,
    editable: true,
  },
  {
    field: "parentMailingRegion",
    headerName: "Parent Mailing Region",
    width: 150,
    editable: true,
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
    editable: true,
    type: "singleSelect",
    valueOptions: clientClassifications,
  },

  // Disability Information
  {
    field: "disabilityType",
    headerName: "Disability Type",
    width: 200,
    editable: true,
    type: "singleSelect",
    valueOptions: disabilityTypes,
  },
  {
    field: "disabilityCause",
    headerName: "Disability Cause",
    width: 200,
    editable: true,
    type: "singleSelect",
    valueOptions: disabilityCauses,
  },

  // Course Information
  {
    field: "course",
    headerName: "Course/Qualifications",
    width: 100,
    editable: true,
  },

  // Scholar Information
  {
    field: "hasScholarType",
    headerName: "Scholar",
    width: 70,
    editable: true,
    type: "boolean",
    // Optional: customize how the boolean is displayed
    renderCell: (params) => {
      return params.value ? "Yes" : "No";
    },
  },
  {
    field: "scholarType",
    headerName: "Scholar Type",
    width: 100,
    editable: true,
    type: "singleSelect",
    valueOptions: scholarTypes, // Add appropriate scholar types here
  },
  {
    field: "registrationStatus",
    headerName: "Registration Status",
    width: 80,
    editable: true,
    type: "singleSelect",
    valueOptions: registrationStatuses,
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
