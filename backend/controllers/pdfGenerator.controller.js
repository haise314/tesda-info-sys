import path from "path";
import { fileURLToPath } from "url";
import pdf from "html-pdf";
import fs from "fs/promises";
import moment from "moment";
import User from "../models/user.model.js";
import Applicant from "../models/applicant.model.js";

// Get __dirname equivalent in ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export const fgeneratePDF = async (req, res) => {
  try {
    const { uli, type } = req.body;

    // Fetch documents based on type
    const userInfo = await User.findOne({ uli });
    const applicantInfo = await Applicant.findOne({ uli });

    if (!userInfo || !applicantInfo) {
      return res
        .status(404)
        .json({ message: "User or applicant information not found" });
    }

    // Read the appropriate HTML template based on type
    const templatePath =
      type === "applicant"
        ? path.join(__dirname, "../template/application_form.template.html")
        : path.join(__dirname, "../template/registrant_form.template.html");

    let htmlTemplate = await fs.readFile(templatePath, "utf8");

    // Map the data to the template
    const mappedData = {
      uli: userInfo.uli,
      referenceNumber: "", // Generate if needed
      trainingCenterName: applicantInfo.trainingCenterName,
      addressLocation: applicantInfo.addressLocation,

      // Personal Information
      lastName: userInfo.name.lastName,
      firstName: userInfo.name.firstName,
      middleName: userInfo.name.middleName,
      extension: userInfo.name.extension,

      // Address
      street: userInfo.completeMailingAddress.street,
      barangay: userInfo.completeMailingAddress.barangay,
      district: userInfo.completeMailingAddress.district,
      city: userInfo.completeMailingAddress.city,
      province: userInfo.completeMailingAddress.province,
      region: userInfo.completeMailingAddress.region,
      zipCode: userInfo.completeMailingAddress.zipCode,

      // Parent Information
      motherLastName: userInfo.motherName.lastName,
      motherFirstName: userInfo.motherName.firstName,
      motherMiddleName: userInfo.motherName.middleName,
      fatherLastName: userInfo.fatherName.lastName,
      fatherFirstName: userInfo.fatherName.firstName,
      fatherMiddleName: userInfo.fatherName.middleName,

      // Contact Information
      telephoneNumber: userInfo.contact.telephoneNumber,
      mobileNumber: userInfo.contact.mobileNumber,
      email: userInfo.contact.email,
      fax: userInfo.contact.fax,

      // Personal Details
      birthMonth: moment(userInfo.birthdate).format("MM"),
      birthDay: moment(userInfo.birthdate).format("DD"),
      birthYear: moment(userInfo.birthdate).format("YY"),
      birthPlace: `${userInfo.birthplace.barangay}, ${userInfo.birthplace.city}, ${userInfo.birthplace.province}`,
      age: userInfo.age,

      // Format work experience, training seminars, etc.
      workExperience: formatWorkExperience(applicantInfo.workExperience),
      trainingSeminars: formatTrainingSeminars(
        applicantInfo.trainingSeminarAttended
      ),
      licensureExams: formatLicensureExams(
        applicantInfo.licensureExaminationPassed
      ),
      competencyAssessments: formatCompetencyAssessments(
        applicantInfo.competencyAssessment
      ),

      // Application details
      applicationDate: moment().format("MM/DD/YYYY"),

      // Admission slip details
      admissionSlipName: `${userInfo.name.lastName}, ${userInfo.name.firstName} ${userInfo.name.middleName}`,
      admissionSlipTel:
        userInfo.contact.telephoneNumber || userInfo.contact.mobileNumber,
      admissionSlipAssessment:
        applicantInfo.assessments[0]?.assessmentTitle || "",
      assessmentDate: moment().add(7, "days").format("MM/DD/YYYY"), // Example: schedule a week ahead
    };

    // Replace placeholders in template with actual data
    Object.keys(mappedData).forEach((key) => {
      const regex = new RegExp(`\\{#${key}\\}[^>]*>`, "g");
      const value = mappedData[key] || "";

      console.log(`Key: ${key}`);
      console.log(`Original template section: ${htmlTemplate.match(regex)}`);
      console.log(`Replacing with value: ${value}`);
      htmlTemplate = htmlTemplate.replace(regex, `{#${key}}>${value}`);
    });
    // Handle checkboxes
    htmlTemplate = setCheckboxValue(htmlTemplate, "sex", userInfo.sex);
    htmlTemplate = setCheckboxValue(
      htmlTemplate,
      "civilStatus",
      userInfo.civilStatus
    );
    htmlTemplate = setCheckboxValue(
      htmlTemplate,
      "employmentStatus",
      userInfo.employmentStatus
    );
    htmlTemplate = setCheckboxValue(
      htmlTemplate,
      "education",
      userInfo.education
    );

    const options = {
      format: "A4",
      orientation: "portrait",
      border: "10mm",
    };

    // Promisify the pdf.create method
    const createPDF = (html, options) => {
      return new Promise((resolve, reject) => {
        pdf.create(html, options).toBuffer((err, buffer) => {
          if (err) reject(err);
          else resolve(buffer);
        });
      });
    };

    // Generate PDF buffer
    const pdfBuffer = await createPDF(htmlTemplate, options);

    res.setHeader("Content-Type", "application/pdf");
    res.setHeader(
      "Content-Disposition",
      `attachment; filename=application_${uli}.pdf`
    );
    res.send(pdfBuffer);
  } catch (error) {
    console.error("Error generating PDF:", error);
    res
      .status(500)
      .json({ message: "Error generating PDF", error: error.message });
  }
};

// Helper functions for formatting data
const formatWorkExperience = (workExp) => {
  if (!workExp || !workExp.length) return "";
  return workExp
    .map(
      (exp) => `
        <tr>
            <td>${exp.companyName}</td>
            <td>${exp.position}</td>
            <td>${moment(exp.inclusiveDates.from).format(
              "MM/DD/YYYY"
            )} - ${moment(exp.inclusiveDates.to).format("MM/DD/YYYY")}</td>
            <td>${exp.monthlySalary}</td>
            <td>${exp.appointmentStatus}</td>
            <td>${exp.noOfYearsInWork}</td>
        </tr>
    `
    )
    .join("");
};

const formatTrainingSeminars = (seminars) => {
  if (!seminars || !seminars.length) return "";
  return seminars
    .map(
      (seminar) => `
        <tr>
            <td>${seminar.title}</td>
            <td>${seminar.venue}</td>
            <td>${moment(seminar.inclusiveDates.from).format(
              "MM/DD/YYYY"
            )} - ${moment(seminar.inclusiveDates.to).format("MM/DD/YYYY")}</td>
            <td>${seminar.numberOfHours}</td>
            <td>${seminar.conductedBy}</td>
        </tr>
    `
    )
    .join("");
};

const formatLicensureExams = (exams) => {
  if (!exams || !exams.length) return "";
  return exams
    .map(
      (exam) => `
        <tr>
            <td>${exam.title}</td>
            <td>${moment(exam.dateOfExamination).format("YYYY")}</td>
            <td>${exam.examinationVenue}</td>
            <td>${exam.rating}</td>
            <td>${exam.remarks}</td>
            <td>${moment(exam.expiryDate).format("MM/DD/YYYY")}</td>
        </tr>
    `
    )
    .join("");
};

const formatCompetencyAssessments = (assessments) => {
  if (!assessments || !assessments.length) return "";
  return assessments
    .map(
      (assessment) => `
        <tr>
            <td>${assessment.title}</td>
            <td>${assessment.qualificationLevel}</td>
            <td>${assessment.industrySector}</td>
            <td>${assessment.certificateNumber}</td>
            <td>${moment(assessment.dateIssued).format("MM/DD/YYYY")}</td>
            <td>${moment(assessment.expirationDate).format("MM/DD/YYYY")}</td>
        </tr>
    `
    )
    .join("");
};

const setCheckboxValue = (html, field, value) => {
  console.log(`Setting checkbox for field: ${field}, value: ${value}`);
  // Handle specific mappings
  const mappings = {
    sex: {
      Male: "Male",
      Female: "Female",
    },
    civilStatus: {
      Single: "Single",
      Married: "Married",
      "Widow/er": "Widow/er",
      Separated: "Separated",
    },
    employmentStatus: {
      Casual: "Casual",
      "Job Order": "Job Order",
      Probationary: "Probationary",
      Permanent: "Permanent",
      "Self-Employed": "Self - Employed",
      OFW: "OFW",
    },
    education: {
      "Elementary Undergraduate": "Elementary Graduate",
      "Elementary Graduate": "Elementary Graduate",
      "High School Undergraduate": "High School Graduate",
      "High School Graduate": "High School Graduate",
      "College Level": "College Level",
      "College Graduate": "College Graduate",
      "TVET Graduate": "TVET Graduate",
    },
  };

  // Get the mapped value or use the original value
  const mappedValue = mappings[field] ? mappings[field][value] || value : value;

  // Create regex patterns to match various checkbox formats
  const checkboxRegexes = [
    new RegExp(`checkbox-${field}-${mappedValue}`, "g"),
    new RegExp(`checkbox-${mappedValue}`, "g"),
  ];

  // Apply checked to all matching patterns
  checkboxRegexes.forEach((regex) => {
    html = html.replace(regex, "checked");
  });

  return html;
};

export const getRegistrantByUli = asyncHandler(async (req, res) => {
  const { uli } = req.params;

  const user = await User.findOne({ uli: uli });
  const registrant = await Registrant.findOne({ uli: uli });

  if (!user || !registrant) {
    res.status(404);
    throw new Error("Registrant data not found");
  }

  const mergedData = {
    uli: user.uli,
    name: {
      firstName: user.name.firstName,
      middleName: user.name.middleName,
      lastName: user.name.lastName,
    },
    contact: {
      email: user.contact.email,
      mobileNumber: user.contact.mobileNumber,
    },
    mailingAddress: {
      street: user.completeMailingAddress.street,
      barangay: user.completeMailingAddress.barangay,
      district: user.completeMailingAddress.district,
      city: user.completeMailingAddress.city,
      province: user.completeMailingAddress.province,
      region: user.completeMailingAddress.region,
    },
    sex: user.sex,
    civilStatus: user.civilStatus,
    employmentStatus: user.employmentStatus,
    employmentType: user.employmentType,
    nationality: user.nationality,
    birthdate: user.birthdate,
    age: user.age,
    birthplace: {
      city: user.birthplace.city,
      province: user.birthplace.province,
      region: user.birthplace.region,
    },
    clientClassification: registrant.clientClassification,
    disabilityType: registrant.disabilityType,
    disabilityCause: registrant.disabilityCause,
    course: registrant.course,
  };

  res.status(200).json({
    success: true,
    data: mergedData,
  });
});

export const getApplicantByUli = asyncHandler(async (req, res) => {
  const { uli } = req.params;

  // Find user and applicant records
  const user = await User.findOne({ uli: uli });
  const applicant = await Applicant.findOne({ uli: uli });

  if (!user || !applicant) {
    res.status(404);
    throw new Error("Applicant data not found");
  }

  // Merge user and applicant data
  const mergedData = {
    // User basic information
    uli: user.uli,
    name: {
      firstName: user.name.firstName,
      middeName: user.name.middleName,
      lastName: user.name.lastName,
      extension: user.name.extension,
    },
    contact: {
      email: user.contact.email,
      telephoneNumber: user.contact.telephoneNumber,
      mobileNumber: user.contact.mobileNumber,
      fax: user.contact.fax,
    },
    mailingAddress: {
      street: user.completeMailingAddress.street,
      barangay: user.completeMailingAddress.barangay,
      district: user.completeMailingAddress.district,
      city: user.completeMailingAddress.city,
      province: user.completeMailingAddress.province,
      region: user.completeMailingAddress.region,
      zipCode: user.completeMailingAddress.zipCode,
    },

    // Demographic information
    sex: user.sex,
    birthdate: user.birthdate,
    age: user.age,
    birthplace: user.birthplace,
    nationality: user.nationality,
    civilStatus: user.civilStatus,

    // Family information
    motherName: user.motherName,
    fatherName: user.fatherName,

    // Employment and Education
    employmentStatus: user.employmentStatus,
    employmentType: user.employmentType,
    education: user.education,
    clientClassification: user.clientClassification,

    // Applicant-specific data
    trainingCenter: {
      name: applicant.trainingCenterName,
      address: applicant.addressLocation,
    },

    // Additional sections from Applicant model
    assessments: applicant.assessments,
    workExperience: applicant.workExperience,
    trainingSeminarsAttended: applicant.trainingSeminarAttended,
    licensureExaminations: applicant.licensureExaminationPassed,
    competencyAssessments: applicant.competencyAssessment,
  };

  res.status(200).json({
    success: true,
    data: mergedData,
  });
});
