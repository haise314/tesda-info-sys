import PDFDocument from "pdfkit";
import fs from "fs";
import path from "path";

const createRegistrantPDF = async (data, imagePath) => {
  const doc = new PDFDocument({ size: "A4" });

  // Add header
  doc.fontSize(20).text("Registrant Form", { align: "center" });
  doc.moveDown();

  // Add profile image if exists
  if (imagePath) {
    try {
      doc.image(imagePath, {
        fit: [150, 150],
        align: "center",
      });
      doc.moveDown();
    } catch (error) {
      console.error("Error adding image to PDF:", error);
    }
  }

  // Add registrant information
  doc.fontSize(12);

  // Personal Information
  doc.font("Helvetica-Bold").text("Personal Information");
  doc
    .font("Helvetica")
    .text(`ULI: ${data.uli}`)
    .text(
      `Name: ${data.name.firstName} ${data.name.middleName} ${data.name.lastName}`
    )
    .text(`Civil Status: ${data.personalInformation.civilStatus}`)
    .text(`Nationality: ${data.personalInformation.nationality}`)
    .text(
      `Birthdate: ${new Date(
        data.personalInformation.birthdate
      ).toLocaleDateString()}`
    )
    .text(`Age: ${data.personalInformation.age}`);
  doc.moveDown();

  // Contact Information
  doc.font("Helvetica-Bold").text("Contact Information");
  doc
    .font("Helvetica")
    .text(`Email: ${data.contact.email}`)
    .text(`Mobile: ${data.contact.mobileNumber}`);
  doc.moveDown();

  // Address
  doc.font("Helvetica-Bold").text("Complete Mailing Address");
  doc
    .font("Helvetica")
    .text(`Street: ${data.completeMailingAddress.street}`)
    .text(`Barangay: ${data.completeMailingAddress.barangay}`)
    .text(`City: ${data.completeMailingAddress.city}`)
    .text(`Province: ${data.completeMailingAddress.province}`)
    .text(`Region: ${data.completeMailingAddress.region}`);
  doc.moveDown();

  // Education and Employment
  doc.font("Helvetica-Bold").text("Education and Employment");
  doc
    .font("Helvetica")
    .text(`Education: ${data.education}`)
    .text(`Employment Status: ${data.employmentStatus}`)
    .text(`Course: ${data.course}`);

  return doc;
};

const createApplicantPDF = async (data, imagePath) => {
  const doc = new PDFDocument({ size: "A4" });

  // Add header
  doc.fontSize(20).text("Applicant Form", { align: "center" });
  doc.moveDown();

  // Add profile image if exists
  if (imagePath) {
    try {
      doc.image(imagePath, {
        fit: [150, 150],
        align: "center",
      });
      doc.moveDown();
    } catch (error) {
      console.error("Error adding image to PDF:", error);
    }
  }

  // Add applicant information
  doc.fontSize(12);

  // Personal Information
  doc.font("Helvetica-Bold").text("Personal Information");
  doc
    .font("Helvetica")
    .text(`ULI: ${data.uli}`)
    .text(
      `Name: ${data.name.firstName} ${data.name.middleName} ${data.name.lastName}`
    )
    .text(`Sex: ${data.sex}`)
    .text(`Civil Status: ${data.civilStatus}`)
    .text(`Birthdate: ${new Date(data.birthdate).toLocaleDateString()}`)
    .text(`Age: ${data.age}`);
  doc.moveDown();

  // Training Information
  doc.font("Helvetica-Bold").text("Training Information");
  doc
    .font("Helvetica")
    .text(`Training Center: ${data.trainingCenterName}`)
    .text(`Assessment Title: ${data.assessmentTitle}`)
    .text(`Assessment Type: ${data.assessmentType}`);
  doc.moveDown();

  // Address
  doc.font("Helvetica-Bold").text("Complete Mailing Address");
  doc
    .font("Helvetica")
    .text(`Street: ${data.completeMailingAddress.street}`)
    .text(`Barangay: ${data.completeMailingAddress.barangay}`)
    .text(`City: ${data.completeMailingAddress.city}`)
    .text(`Province: ${data.completeMailingAddress.province}`)
    .text(`Region: ${data.completeMailingAddress.region}`);

  // Add work experience if exists
  if (data.workExperience && data.workExperience.length > 0) {
    doc.moveDown();
    doc.font("Helvetica-Bold").text("Work Experience");
    data.workExperience.forEach((work) => {
      doc
        .font("Helvetica")
        .text(`Company: ${work.companyName}`)
        .text(`Position: ${work.position}`)
        .text(`Monthly Salary: ${work.monthlySalary}`)
        .text(`Years in Work: ${work.noOfYearsInWork}`);
      doc.moveDown(0.5);
    });
  }

  return doc;
};

export const generatePDF = async (type, data, imagePath) => {
  try {
    const doc =
      type === "registrant"
        ? await createRegistrantPDF(data, imagePath)
        : await createApplicantPDF(data, imagePath);

    return doc;
  } catch (error) {
    throw new Error(`Error generating PDF: ${error.message}`);
  }
};
