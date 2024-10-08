// dateFormatter.js
export const formatDate = (dateString) => {
  if (!dateString) return "";

  const options = { year: "numeric", month: "long", day: "numeric" };
  const date = new Date(dateString);

  // Format the date according to your locale (e.g., 'en-US')
  return date.toLocaleDateString("en-US", options);
};
