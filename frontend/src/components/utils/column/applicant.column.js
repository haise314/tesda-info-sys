import {
  applicationStatuses,
  civilStatues,
  employmentStatuses,
  highestEducationalAttainments,
} from "../enums/applicant.enums";

// Function to format date
const formatDate = (dateString) => {
  const date = new Date(dateString);
  return date.toISOString().split("T")[0]; // This will return YYYY-MM-DD
};

export const applicantColumns = [
  // ULI
  { field: "uli", headerName: "ULI", width: 100, editable: false },

  // Name fields
  { field: "firstName", headerName: "First Name", width: 150, editable: true },
  {
    field: "middleName",
    headerName: "Middle Name",
    width: 150,
    editable: true,
  },
  { field: "lastName", headerName: "Last Name", width: 150, editable: true },
  { field: "extension", headerName: "Extension", width: 100, editable: true },

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
  {
    field: "mailingZipCode",
    headerName: "Zip Code",
    width: 150,
    editable: true,
  },

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
      }, ${params.row.mailingZipCode || ""}`.trim(),
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
  {
    field: "mobileNumber",
    headerName: "Mobile No.",
    width: 110,
    editable: true,
  },

  // Personal Information
  {
    field: "sex",
    headerName: "Sex",
    width: 100,
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
    field: "birthdate",
    headerName: "Birthdate",
    width: 150,
    editable: true,
    renderCell: (params) => formatDate(params.row.birthdate),
  },
  { field: "age", headerName: "Age", width: 100, editable: true },

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
    field: "highestEducationalAttainment",
    headerName: "Educational Attainment",
    width: 200,
    editable: true,
    type: "singleSelect",
    valueOptions: highestEducationalAttainments,
  },

  // Work Experience
  {
    field: "workExperience",
    headerName: "Work Experience",
    width: 300,
    editable: true,
    renderCell: (params) =>
      params.row.workExperience
        .map((exp) =>
          `${exp.companyName || ""}, ${exp.position || ""} (${formatDate(
            exp.inclusiveDates?.from
          )} - ${formatDate(exp.inclusiveDates?.to)})`.trim()
        )
        .join("; "),
  },

  // Training Seminars
  {
    field: "trainingSeminarAttended",
    headerName: "Training/Seminars Attended",
    width: 300,
    renderCell: (params) =>
      params.row.trainingSeminarAttended
        .map((seminar) =>
          `${seminar.title || ""}, ${seminar.venue || ""} (${formatDate(
            seminar.inclusiveDates?.from
          )} - ${formatDate(seminar.inclusiveDates?.to)})`.trim()
        )
        .join("; "),
  },

  // Competency Assessments
  {
    field: "competencyAssessment",
    headerName: "Competency Assessment",
    width: 300,
    renderCell: (params) =>
      params.row.competencyAssessment
        .map((assessment) =>
          `${assessment.title || ""}, ${
            assessment.industrySector || ""
          } (${formatDate(assessment.dateIssued)} - ${formatDate(
            assessment.expirationDate
          )})`.trim()
        )
        .join("; "),
  },
  {
    field: "applicationStatus",
    headerName: "Applicant Status",
    width: 90,
    editable: true,
    type: "singleSelect",
    valueOptions: applicationStatuses,
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
