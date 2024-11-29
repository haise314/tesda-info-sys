// ../utils/formatters.js

/**
 * Formats a user's full name.
 * @param {Object} name - Name object with firstName, middleName, lastName, and extension.
 * @param {string} name.firstName - First name of the user.
 * @param {string} name.middleName - Middle name of the user (optional).
 * @param {string} name.lastName - Last name of the user.
 * @param {string} name.extension - Name extension (e.g., Jr., Sr.) (optional).
 * @returns {string} Formatted full name.
 */
export const formatName = (name = {}) => {
  const {
    firstName = "",
    middleName = "",
    lastName = "",
    extension = "",
  } = name;
  return [firstName, middleName, lastName, extension]
    .filter(Boolean)
    .join(" ")
    .trim();
};

/**
 * Formats a date value.
 * @param {string|Date} date - The date value to format.
 * @param {string} format - Format type ('full', 'short', etc.).
 * @returns {string} Formatted date string.
 */
export const formatDate = (date, format = "short") => {
  if (!date) return "N/A";
  const options =
    format === "full"
      ? {
          year: "numeric",
          month: "long",
          day: "numeric",
          hour: "2-digit",
          minute: "2-digit",
          second: "2-digit",
        }
      : { year: "numeric", month: "short", day: "numeric" };

  try {
    const formattedDate = new Intl.DateTimeFormat("en-US", options).format(
      new Date(date)
    );
    return formattedDate;
  } catch (error) {
    console.error("Error formatting date:", error);
    return "Invalid Date";
  }
};
