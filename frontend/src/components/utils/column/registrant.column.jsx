// Function to format date
const formatDate = (dateString) => {
  if (!dateString) return "";
  const date = new Date(dateString);
  return date.toISOString().split("T")[0];
};

export const registrantColumns = [
  {
    field: "uli",
    headerName: "ULI",
    width: 180,
    editable: false,
  },
  {
    field: "disabilityType",
    headerName: "Disability Type",
    width: 150,
    editable: false,
    renderCell: (params) => params.row.disabilityType || "None",
  },
  {
    field: "disabilityCause",
    headerName: "Disability Cause",
    width: 150,
    editable: false,
    renderCell: (params) => params.row.disabilityCause || "None",
  },
  {
    field: "courses",
    headerName: "Courses",
    width: 300,
    editable: false,
    renderCell: (params) => {
      const courses = params.row.course || [];
      return (
        <div className="flex flex-col gap-1 py-1">
          {courses.map((course, index) => (
            <div key={index} className="flex items-center gap-2">
              <span>{course.courseName}</span>
              <span className="text-sm text-gray-500">
                ({course.registrationStatus})
                {course.hasScholarType &&
                  course.scholarType &&
                  ` - ${course.scholarType}`}
              </span>
            </div>
          ))}
        </div>
      );
    },
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
