import fs from "fs";
import path from "path";
import htmlPdf from "html-pdf";
import { fileURLToPath } from "url";
import { dirname } from "path";
import User from "../models/user.model.js";
import Registrant from "../models/registrant.model.js";
import Applicant from "../models/applicant.model.js";
import ImageUpload from "../models/image.model.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Utility functions
const formatDate = (date) => {
  return new Date(date).toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
};

const getImageAsBase64 = async (imagePath) => {
  try {
    if (!imagePath) return null;
    if (!fs.existsSync(imagePath)) {
      console.warn(`Image file not found: ${imagePath}`);
      return null;
    }
    const imageBuffer = fs.readFileSync(imagePath);
    return imageBuffer.toString("base64");
  } catch (error) {
    console.warn(`Error reading image file: ${error.message}`);
    return null;
  }
};

const generateProfileImageHTML = async (imageData) => {
  if (!imageData) {
    return '<div class="profile-image">No Image Available</div>';
  }

  try {
    const base64Image = await getImageAsBase64(imageData.path);
    if (!base64Image) {
      return '<div class="profile-image">Image Not Available</div>';
    }
    return `
      <img src="data:${imageData.mimetype};base64,${base64Image}" 
           class="profile-image" 
           alt="Profile Photo">
    `;
  } catch (error) {
    console.warn(`Error generating image HTML: ${error.message}`);
    return '<div class="profile-image">Error Loading Image</div>';
  }
};

// Generate User Information Section
const generateUserInfoHTML = (userData) => {
  return `
    <div class="section user-info">
      <h2>Personal Information</h2>
      <div class="info-grid">
        <div class="info-item">
          <span class="label">Full Name:</span> 
          ${userData.name.firstName} 
          ${userData.name.middleName ? userData.name.middleName + " " : ""}
          ${userData.name.lastName}
          ${userData.name.extension ? userData.name.extension : ""}
        </div>
        <div class="info-item">
          <span class="label">Birth Date:</span> ${formatDate(
            userData.birthdate
          )}
        </div>
        <div class="info-item">
          <span class="label">Age:</span> ${userData.age}
        </div>
        <div class="info-item">
          <span class="label">Sex:</span> ${userData.sex}
        </div>
        <div class="info-item">
          <span class="label">Civil Status:</span> ${userData.civilStatus}
        </div>
        <div class="info-item">
          <span class="label">Nationality:</span> ${userData.nationality}
        </div>
        
        <div class="info-section">
          <h3>Birth Place</h3>
          <div class="info-item">
            <span class="label">City:</span> ${userData.birthplace.city}
          </div>
          <div class="info-item">
            <span class="label">Province:</span> ${userData.birthplace.province}
          </div>
          <div class="info-item">
            <span class="label">Region:</span> ${userData.birthplace.region}
          </div>
        </div>

        <div class="info-section">
          <h3>Contact Information</h3>
          <div class="info-item">
            <span class="label">Mobile:</span> ${userData.contact.mobileNumber}
          </div>
          <div class="info-item">
            <span class="label">Email:</span> ${userData.contact.email}
          </div>
          ${
            userData.contact.telephoneNumber
              ? `
          <div class="info-item">
            <span class="label">Telephone:</span> ${userData.contact.telephoneNumber}
          </div>
          `
              : ""
          }
        </div>

        <div class="info-section">
          <h3>Complete Mailing Address</h3>
          <div class="info-item">
            ${userData.completeMailingAddress.street}, 
            ${userData.completeMailingAddress.barangay}, 
            ${userData.completeMailingAddress.district}, 
            ${userData.completeMailingAddress.city}, 
            ${userData.completeMailingAddress.province}, 
            ${userData.completeMailingAddress.region} 
            ${userData.completeMailingAddress.zipCode}
          </div>
        </div>

        <div class="info-section">
          <h3>Employment & Education</h3>
          <div class="info-item">
            <span class="label">Employment Status:</span> ${
              userData.employmentStatus
            }
          </div>
          ${
            userData.employmentType
              ? `
          <div class="info-item">
            <span class="label">Employment Type:</span> ${userData.employmentType}
          </div>
          `
              : ""
          }
          <div class="info-item">
            <span class="label">Education:</span> ${userData.education}
          </div>
          <div class="info-item">
            <span class="label">Client Classification:</span> ${
              userData.clientClassification
            }
          </div>
        </div>
      </div>
    </div>
  `;
};

// Generate Registrant Information Section
const generateRegistrantInfoHTML = (registrantData) => {
  return `
    <div class="section registrant-info">
      <h2>Registration Information</h2>
      
      ${
        registrantData.disabilityType
          ? `
        <div class="info-section">
          <h3>Disability Information</h3>
          <div class="info-item">
            <span class="label">Disability Type:</span> ${registrantData.disabilityType}
          </div>
          <div class="info-item">
            <span class="label">Disability Cause:</span> ${registrantData.disabilityCause}
          </div>
        </div>
      `
          : ""
      }

      <div class="info-section">
        <h3>Registered Courses</h3>
        <table>
          <tr>
            <th>Course Name</th>
            <th>Registration Status</th>
            <th>Scholar Type</th>
          </tr>
          ${registrantData.course
            .map(
              (course) => `
            <tr>
              <td>${course.courseName}</td>
              <td>${course.registrationStatus}</td>
              <td>${
                course.hasScholarType
                  ? course.scholarType +
                    (course.otherScholarType
                      ? ` - ${course.otherScholarType}`
                      : "")
                  : "N/A"
              }</td>
            </tr>
          `
            )
            .join("")}
        </table>
      </div>
    </div>
  `;
};

// Generate Applicant Information Section
const generateApplicantInfoHTML = (applicantData) => {
  return `
    <div class="section applicant-info">
      <h2>Application Information</h2>
      
      <div class="info-section">
        <h3>Training Center Details</h3>
        <div class="info-item">
          <span class="label">Training Center Name:</span> ${
            applicantData.trainingCenterName
          }
        </div>
        <div class="info-item">
          <span class="label">Address/Location:</span> ${
            applicantData.addressLocation
          }
        </div>
      </div>

      <div class="info-section">
        <h3>Assessments</h3>
        <table>
          <tr>
            <th>Assessment Title</th>
            <th>Assessment Type</th>
            <th>Status</th>
          </tr>
          ${applicantData.assessments
            .map(
              (assessment) => `
            <tr>
              <td>${assessment.assessmentTitle}</td>
              <td>${assessment.assessmentType}</td>
              <td>${assessment.applicationStatus}</td>
            </tr>
          `
            )
            .join("")}
        </table>
      </div>

      ${
        applicantData.workExperience && applicantData.workExperience.length > 0
          ? `
        <div class="info-section">
          <h3>Work Experience</h3>
          <table>
            <tr>
              <th>Company</th>
              <th>Position</th>
              <th>Inclusive Dates</th>
              <th>Monthly Salary</th>
              <th>Status</th>
            </tr>
            ${applicantData.workExperience
              .map(
                (work) => `
              <tr>
                <td>${work.companyName}</td>
                <td>${work.position}</td>
                <td>${formatDate(work.inclusiveDates.from)} - ${formatDate(
                  work.inclusiveDates.to
                )}</td>
                <td>${work.monthlySalary}</td>
                <td>${work.appointmentStatus}</td>
              </tr>
            `
              )
              .join("")}
          </table>
        </div>
      `
          : ""
      }
    </div>
  `;
};

// Generate Complete HTML
const generateHTML = async (type, userData, specificData, imageData) => {
  const baseStyles = `
    <style>
      body { 
        font-family: Arial, sans-serif; 
        padding: 20px;
        line-height: 1.6;
      }
      .header { 
        text-align: center; 
        margin-bottom: 20px;
        padding-bottom: 10px;
        border-bottom: 2px solid #333;
      }
      .section { 
        margin-bottom: 20px; 
        border: 1px solid #ddd; 
        padding: 15px; 
        border-radius: 5px;
        background-color: #fff;
      }
      .label { 
        font-weight: bold; 
        color: #444;
        min-width: 150px;
        display: inline-block;
      }
      .info-grid { 
        display: grid; 
        gap: 10px; 
      }
      .info-item { 
        margin-bottom: 5px;
        padding: 5px 0;
      }
      .info-section { 
        margin-top: 15px;
        padding: 10px;
        background-color: #f9f9f9;
        border-radius: 4px;
      }
      h2 { 
        color: #2c3e50; 
        border-bottom: 2px solid #eee; 
        padding-bottom: 5px;
        margin-top: 0;
      }
      h3 { 
        color: #34495e; 
        margin: 10px 0;
        font-size: 16px;
      }
      table { 
        width: 100%; 
        border-collapse: collapse; 
        margin-top: 10px;
        background-color: #fff;
      }
      th, td { 
        border: 1px solid #ddd; 
        padding: 8px; 
        text-align: left;
        font-size: 14px;
      }
      th { 
        background-color: #f5f5f5;
        font-weight: bold;
      }
      .profile-section { 
        display: flex; 
        gap: 20px; 
        align-items: start;
        margin-bottom: 20px;
      }
      .profile-image { 
        width: 150px; 
        height: 200px; 
        object-fit: cover; 
        border: 1px solid #ddd;
        background-color: #f5f5f5;
        display: flex;
        align-items: center;
        justify-content: center;
        text-align: center;
      }
      .profile-info { 
        flex: 1;
      }
      @media print {
        .section {
          break-inside: avoid;
        }
      }
    </style>
  `;

  const profileImageHTML = await generateProfileImageHTML(imageData);

  return `
    <!DOCTYPE html>
    <html>
    <head>
      ${baseStyles}
    </head>
    <body>
      <div class="header">
        <h1>${type === "registrant" ? "Registrant" : "Applicant"} Details</h1>
        <p>ULI: ${userData.uli}</p>
      </div>

      <div class="profile-section">
        ${profileImageHTML}
        <div class="profile-info">
          ${generateUserInfoHTML(userData)}
        </div>
      </div>

      ${
        type === "registrant"
          ? generateRegistrantInfoHTML(specificData)
          : generateApplicantInfoHTML(specificData)
      }
    </body>
    </html>
  `;
};

// Generate PDF for registrant
export const generateRegistrantPDF = async (req, res) => {
  try {
    const { uli } = req.body.data;

    // Fetch all required data
    const userData = await User.findOne({ uli });
    const registrantData = await Registrant.findOne({ uli });
    const imageData = await ImageUpload.findOne({ uli });

    if (!userData || !registrantData) {
      throw new Error("Required data not found");
    }

    const html = await generateHTML(
      "registrant",
      userData,
      registrantData,
      imageData
    );

    const options = {
      format: "A4",
      border: {
        top: "20mm",
        right: "20mm",
        bottom: "20mm",
        left: "20mm",
      },
    };

    htmlPdf.create(html, options).toBuffer((err, buffer) => {
      if (err) {
        console.error("PDF Generation Error:", err);
        res.status(500).json({ message: "Error generating PDF" });
        return;
      }
      res.type("application/pdf");
      res.send(buffer);
    });
  } catch (error) {
    console.error("Error:", error);
    res.status(500).json({
      message: "Error generating PDF",
      error: error.message,
    });
  }
};

// Generate PDF for applicant
export const generateApplicantPDF = async (req, res) => {
  try {
    const { uli } = req.body.data;

    // Fetch all required data
    const [userData, applicantData, imageData] = await Promise.all([
      User.findOne({ uli }),
      Applicant.findOne({ uli }),
      ImageUpload.findOne({ uli }),
    ]);

    if (!userData || !applicantData) {
      throw new Error("Required data not found");
    }

    const html = await generateHTML(
      "applicant",
      userData,
      applicantData,
      imageData
    );

    const options = {
      format: "A4",
      border: {
        top: "20mm",
        right: "20mm",
        bottom: "20mm",
        left: "20mm",
      },
    };

    htmlPdf.create(html, options).toBuffer((err, buffer) => {
      if (err) {
        console.error("PDF Generation Error:", err);
        res.status(500).json({ message: "Error generating PDF" });
        return;
      }
      res.type("application/pdf");
      res.send(buffer);
    });
  } catch (error) {
    console.error("Error:", error);
    res.status(500).json({
      message: "Error generating PDF",
      error: error.message,
    });
  }
};
