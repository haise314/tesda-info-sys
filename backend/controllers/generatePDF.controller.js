import User from "../models/user.model.js";
import Registrant from "../models/registrant.model.js";
import asyncHandler from "express-async-handler";
import { PDFDocument } from "pdf-lib";
import fs from "fs/promises";
import path from "path";
import { fileURLToPath } from "url";
import Applicant from "../models/applicant.model.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Utility function for safe nested object access
const safeGet = (obj, path, defaultValue = "") => {
  return path
    .split(".")
    .reduce(
      (acc, part) =>
        acc && acc[part] !== undefined ? acc[part] : defaultValue,
      obj
    );
};

export const generateApplicantPDF = asyncHandler(async (req, res) => {
  try {
    const { uli } = req.body.data;

    // Find both user and applicant records
    const user = await User.findOne({ uli: uli });
    const applicant = await Applicant.findOne({ uli: uli });

    if (!user || !applicant) {
      res.status(404);
      throw new Error("User or Applicant data not found");
    }

    // Merge the data
    const mergedData = {
      // User basic information
      uli: user.uli,
      name: {
        firstName: user.name.firstName,
        middleName: user.name.middleName,
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
      assessments: applicant.assessments,
      workExperience: applicant.workExperience,
      trainingSeminarsAttended: applicant.trainingSeminarAttended,
      licensureExaminations: applicant.licensureExaminationPassed,
      competencyAssessments: applicant.competencyAssessment,
    };
    console.log("Merged Data:", mergedData);

    // Generate Reference Number
    const generateReferenceNumber = (uli) => {
      const qualAlphaCode = "Q";
      const year = new Date().getFullYear().toString().slice(-2);
      const regionCode = "03";
      const provinceCode = "54";
      const numberSeries = uli.split("-").pop().padStart(8, "0");
      return `${qualAlphaCode}${year}${regionCode}${provinceCode}${numberSeries}`;
    };

    // Read the PDF template
    const templatePath = path.join(
      __dirname,
      "../templates/applicant-template.pdf"
    );
    const templateBytes = await fs.readFile(templatePath);
    const pdfDoc = await PDFDocument.load(templateBytes);
    const form = pdfDoc.getForm();

    // Fill in all form fields with merged data
    const referenceNumber = generateReferenceNumber(mergedData.uli);
    form.getTextField("referenceNumber").setText(referenceNumber);
    form.getTextField("uli").setText(mergedData.uli);

    // Training Center
    form
      .getTextField("trainingCenterName")
      .setText(mergedData.trainingCenter.name);
    form
      .getTextField("addressLocation")
      .setText(mergedData.trainingCenter.address);

    // Personal Information
    form.getTextField("firstName").setText(mergedData.name.firstName);
    form.getTextField("middleName").setText(mergedData.name.middleName);
    form.getTextField("lastName").setText(mergedData.name.lastName);
    form.getTextField("extension").setText(mergedData.name.extension);

    // Address
    form.getTextField("street").setText(mergedData.mailingAddress.street);
    form.getTextField("barangay").setText(mergedData.mailingAddress.barangay);
    form.getTextField("district").setText(mergedData.mailingAddress.district);
    form.getTextField("city").setText(mergedData.mailingAddress.city);
    form.getTextField("province").setText(mergedData.mailingAddress.province);
    form.getTextField("region").setText(mergedData.mailingAddress.region);
    form.getTextField("zipCode").setText(mergedData.mailingAddress.zipCode);

    // Contact Information
    form
      .getTextField("telephoneNumber")
      .setText(mergedData.contact.telephoneNumber);
    form.getTextField("mobileNumber").setText(mergedData.contact.mobileNumber);
    form.getTextField("email").setText(mergedData.contact.email);
    form.getTextField("fax").setText(mergedData.contact.fax);

    // Radio Button Selections
    const sexRadio = form.getRadioGroup("sex");
    sexRadio.select(mergedData.sex === "Male" ? "male" : "female");

    const clientTypeRadio = form.getRadioGroup("clientType");
    switch (mergedData.clientClassification) {
      case "TVET Graduate":
        clientTypeRadio.select("TVETGraduating");
        break;
      case "College Graduate":
        clientTypeRadio.select("TVETgradudateclient");
        break;
      case "Industry":
        clientTypeRadio.select("industryWorker");
        break;
      case "K-12":
        clientTypeRadio.select("K-12");
        break;
      case "Returning/Repatriated OFWs":
        clientTypeRadio.select("OWF");
        break;
      default:
        clientTypeRadio.select("TVETgradudateclient");
        break;
    }

    const civilStatusRadio = form.getRadioGroup("civilStatus");
    switch (mergedData.civilStatus) {
      case "Married":
        civilStatusRadio.select("married");
        break;
      case "Widowed":
        civilStatusRadio.select("widower");
        break;
      case "Separated":
        civilStatusRadio.select("separated");
        break;
      default:
        civilStatusRadio.select("single");
    }

    const educationRadio = form.getRadioGroup("education");
    switch (mergedData.education) {
      case "High School Graduate":
        educationRadio.select("highSchoolGraduate");
        break;
      case "TVET Graduate":
        educationRadio.select("TVETGraduate");
        break;
      case "College Level":
        educationRadio.select("collegeLevel");
        break;
      case "College Graduate":
        educationRadio.select("collegeGraduate");
        break;
      default:
        educationRadio.select("elementaryGraduate");
    }

    const employmentStatusRadio = form.getRadioGroup("employmentStatus");
    switch (mergedData.employmentStatus) {
      case "Job Order":
        employmentStatusRadio.select("jobOrder");
        break;
      case "Probationary":
        employmentStatusRadio.select("probationary");
        break;
      case "Permanent":
        employmentStatusRadio.select("permanent");
        break;
      case "Self-Employed":
        employmentStatusRadio.select("selfEmployed");
        break;
      case "OFW":
        employmentStatusRadio.select("OFW");
        break;
      default:
        employmentStatusRadio.select("casual");
    }

    // Fill in additional sections if data exists
    if (mergedData.workExperience?.[0]) {
      const workExp = mergedData.workExperience[0];
      form.getTextField("companyName").setText(workExp.companyName);
      form.getTextField("position").setText(workExp.position);
      form
        .getTextField("WEfrom")
        .setText(
          workExp.inclusiveDates?.from
            ? new Date(workExp.inclusiveDates.from).toLocaleDateString()
            : ""
        );
      form
        .getTextField("WEto")
        .setText(
          workExp.inclusiveDates?.to
            ? new Date(workExp.inclusiveDates.to).toLocaleDateString()
            : ""
        );
      form
        .getTextField("monthlySalary")
        .setText(workExp.monthlySalary?.toString());
      form.getTextField("appointmentStatus").setText(workExp.appointmentStatus);
      form
        .getTextField("noOfYearsInWork")
        .setText(workExp.noOfYearsInWork?.toString());
    }

    if (mergedData.trainingSeminarsAttended?.[0]) {
      const training = mergedData.trainingSeminarsAttended[0];
      form.getTextField("title").setText(training.title);
      form.getTextField("venue").setText(training.venue);
      form
        .getTextField("OTfrom")
        .setText(
          training.inclusiveDates?.from
            ? new Date(training.inclusiveDates.from).toLocaleDateString()
            : ""
        );
      form
        .getTextField("OTto")
        .setText(
          training.inclusiveDates?.to
            ? new Date(training.inclusiveDates.to).toLocaleDateString()
            : ""
        );
      form
        .getTextField("numberOfHours")
        .setText(training.numberOfHours?.toString());
      form.getTextField("conductedBy").setText(training.conductedBy);
    }

    if (mergedData.licensureExaminations?.[0]) {
      const exam = mergedData.licensureExaminations[0];
      form.getTextField("LEtitle").setText(exam.title);
      form
        .getTextField("dateOfExamination")
        .setText(
          exam.dateOfExamination
            ? new Date(exam.dateOfExamination).toLocaleDateString()
            : ""
        );
      form.getTextField("examinationVenue").setText(exam.examinationVenue);
      form.getTextField("rating").setText(exam.rating?.toString());
      form.getTextField("remarks").setText(exam.remarks);
      form
        .getTextField("expiryDate")
        .setText(
          exam.expiryDate ? new Date(exam.expiryDate).toLocaleDateString() : ""
        );
    }

    if (mergedData.competencyAssessments?.[0]) {
      const competency = mergedData.competencyAssessments[0];
      form.getTextField("CAtitle").setText(competency.title);
      form
        .getTextField("qualificationLevel")
        .setText(competency.qualificationLevel);
      form.getTextField("industrySector").setText(competency.industrySector);
      form
        .getTextField("certificateNumber")
        .setText(competency.certificateNumber);
      form
        .getTextField("dateIssued")
        .setText(
          competency.dateIssued
            ? new Date(competency.dateIssued).toLocaleDateString()
            : ""
        );
      form
        .getTextField("expirationDate")
        .setText(
          competency.expirationDate
            ? new Date(competency.expirationDate).toLocaleDateString()
            : ""
        );
    }

    if (mergedData.assessments?.[0]) {
      const assessment = mergedData.assessments[0];
      const assessmentTypeRadio = form.getRadioGroup("assessmentType");
      switch (assessment.assessmentType) {
        case "COC":
          assessmentTypeRadio.select("coc");
          break;
        case "Renewal":
          assessmentTypeRadio.select("renewal");
          break;
        default:
          assessmentTypeRadio.select("fullQualification");
      }
      form.getTextField("assessmentTitle").setText(assessment.assessmentTitle);
    }

    // Save and send the PDF
    const pdfBytes = await pdfDoc.save();
    res.contentType("application/pdf");
    res.send(Buffer.from(pdfBytes));
  } catch (error) {
    console.error("PDF Generation Error:", error);
    res.status(500).json({
      message: "Error generating PDF",
      error: error.message,
    });
  }
});

export const generateRegistrantPDF = asyncHandler(async (req, res) => {
  // Configuration - move this before the try block
  const MAX_PDF_FILE_SIZE = process.env.MAX_PDF_FILE_SIZE
    ? parseInt(process.env.MAX_PDF_FILE_SIZE)
    : 10 * 1024 * 1024; // 10MB default

  // Define USE_DETAILED_ERRORS directly here
  const USE_DETAILED_ERRORS = process.env.NODE_ENV === "development";

  try {
    const { uli } = req.body.data;

    // Extensive logging for debugging
    console.log(`[PDF Generation] Starting for ULI: ${uli}`);
    console.log(`[Environment] Current environment: ${process.env.NODE_ENV}`);

    // Determine template path with multiple fallback options
    const possiblePaths = [
      process.env.PDF_TEMPLATE_PATH, // Custom environment variable
      path.join(process.cwd(), "templates", "registrant-template.pdf"),
      path.join(__dirname, "../templates/registrant-template.pdf"),
      path.join(__dirname, "templates", "registrant-template.pdf"),
      path.join(process.cwd(), "registrant-template.pdf"),
      path.join(__dirname, "registrant-template.pdf"),
    ].filter(Boolean); // Remove any undefined paths

    let templatePath;
    let templateBytes;

    // Try each path until we find a valid template
    for (const potentialPath of possiblePaths) {
      try {
        console.log(`Attempting to read template from: ${potentialPath}`);

        // Normalize the path to handle different path separators
        const normalizedPath = path.normalize(potentialPath);

        // Check if file exists before reading
        await fs.access(normalizedPath);

        templateBytes = await fs.readFile(normalizedPath);

        if (templateBytes && templateBytes.length > 0) {
          templatePath = normalizedPath;
          break;
        }
      } catch (fileError) {
        console.warn(
          `Failed to read template from ${potentialPath}: ${fileError.message}`
        );
      }
    }

    // If no template found
    if (!templatePath) {
      console.error(
        "Could not find PDF template in any of the attempted paths",
        {
          attemptedPaths: possiblePaths,
        }
      );
      return res.status(500).json({
        message: "PDF template not found",
        attemptedPaths: possiblePaths,
      });
    }

    console.log(`Successfully found template at: ${templatePath}`);

    // Rest of the existing code remains the same...
    const user = await User.findOne({ uli: uli });
    const registrant = await Registrant.findOne({ uli: uli });

    // Merge the data with safe access
    const mergedData = {
      uli: user.uli,
      name: {
        firstName: safeGet(user, "name.firstName", ""),
        middleName: safeGet(user, "name.middleName", ""),
        lastName: safeGet(user, "name.lastName", ""),
      },
      contact: {
        email: safeGet(user, "contact.email", ""),
        mobileNumber: safeGet(user, "contact.mobileNumber", ""),
      },
      completeMailingAddress: user.completeMailingAddress || {},
      sex: safeGet(user, "sex", ""),
      civilStatus: safeGet(user, "civilStatus", ""),
      employmentStatus: safeGet(user, "employmentStatus", ""),
      employmentType: safeGet(user, "employmentType", "none"),
      nationality: safeGet(user, "nationality", ""),
      birthdate: user.birthdate,
      age: safeGet(user, "age", ""),
      birthplace: user.birthplace || {},
      clientClassification: safeGet(user, "clientClassification", ""),
      fatherName: user.fatherName || {},
      disabilityType: safeGet(registrant, "disabilityType", ""),
      disabilityCause: safeGet(registrant, "disabilityCause", ""),
      course: registrant.course || [],
    };

    // Load PDF template
    const pdfDoc = await PDFDocument.load(templateBytes);
    const form = pdfDoc.getForm();

    // Helper function to safely set text field
    const safelySetTextField = (fieldName, value = "") => {
      try {
        const field = form.getTextField(fieldName);
        field.setText(value.toString().trim());
      } catch (error) {
        console.warn(
          `Warning: Failed to set text field ${fieldName}: ${error.message}`
        );
      }
    };

    // Helper function to safely select radio option
    const safelySelectRadioOption = (groupName, value, defaultOption) => {
      try {
        const radioGroup = form.getRadioGroup(groupName);
        const options = radioGroup.getOptions();
        const valueToSet = value?.toLowerCase();

        if (valueToSet && options.includes(valueToSet)) {
          radioGroup.select(valueToSet);
        } else {
          radioGroup.select(defaultOption);
        }
      } catch (error) {
        console.warn(
          `Warning: Failed to set radio group ${groupName}: ${error.message}`
        );
      }
    };

    // Fill in basic information
    safelySetTextField("uli", mergedData.uli);
    safelySetTextField("lastName", mergedData.name.lastName);
    safelySetTextField("firstName", mergedData.name.firstName);
    safelySetTextField("middleName", mergedData.name.middleName);

    // Fill in address
    safelySetTextField("street", mergedData.completeMailingAddress.street);
    safelySetTextField("barangay", mergedData.completeMailingAddress.barangay);
    safelySetTextField("district", mergedData.completeMailingAddress.district);
    safelySetTextField("city", mergedData.completeMailingAddress.city);
    safelySetTextField("province", mergedData.completeMailingAddress.province);
    safelySetTextField("region", mergedData.completeMailingAddress.region);

    // Fill in contact information
    safelySetTextField("email", mergedData.contact.email);
    safelySetTextField("mobileNumber", mergedData.contact.mobileNumber);
    safelySetTextField("nationality", mergedData.nationality);

    // Fill in parent information (father)
    const parentFullName = `${mergedData.fatherName.firstName} ${
      mergedData.fatherName.middleName
        ? mergedData.fatherName.middleName + " "
        : ""
    }${mergedData.fatherName.lastName}${
      mergedData.fatherName.extension
        ? " " + mergedData.fatherName.extension
        : ""
    }`.trim();
    safelySetTextField("parent", parentFullName);

    // Concatenate parent address (using user's address)
    const parentAddress = `${mergedData.completeMailingAddress.barangay}, ${mergedData.completeMailingAddress.city}, ${mergedData.completeMailingAddress.province}`;
    safelySetTextField("parentAddress", parentAddress);

    // Map employment status to form values
    const employmentStatusMap = {
      "Wage-Employed": "wageEmployed",
      Underemployed: "underemployed",
      "Self-Employed": "selfEmployed",
      Unemployed: "unemployed",
    };

    // Map employment type to form values
    const employmentTypeMap = {
      Casual: "casual",
      Probationary: "probationary",
      Contractual: "contractual",
      Regular: "regular",
      "Job Order": "jobOrder",
      Permanent: "permanent",
      Temporary: "temporary",
      None: "none",
    };

    // Handle radio groups
    safelySelectRadioOption("sex", mergedData.sex, "male");
    safelySelectRadioOption("civilStatus", mergedData.civilStatus, "single");
    safelySelectRadioOption(
      "employmentStatus",
      employmentStatusMap[mergedData.employmentStatus],
      "unemployed"
    );
    safelySelectRadioOption(
      "employmentType",
      employmentTypeMap[mergedData.employmentType],
      "none"
    );

    // Handle birthdate
    const birthdate = new Date(mergedData.birthdate);
    safelySetTextField(
      "birthdateMonth",
      (birthdate.getMonth() + 1).toString().padStart(2, "0")
    );
    safelySetTextField(
      "birthdateDay",
      birthdate.getDate().toString().padStart(2, "0")
    );
    safelySetTextField("birthdateYear", birthdate.getFullYear().toString());
    safelySetTextField("age", mergedData.age.toString());

    // Handle birthplace
    safelySetTextField("birthplaceCity", mergedData.birthplace.city);
    safelySetTextField("birthplaceProvince", mergedData.birthplace.province);
    safelySetTextField("birthplaceRegion", mergedData.birthplace.region);

    // Map client classification to form values
    const clientClassificationMap = {
      "4Ps Beneficiary": "4Psbeneficiary",
      "Displaced Worker": "displacedWorker",
      "Family Member of AFP": "familiyMemAFP",
      "Industry Worker": "industryWorker",
      "Out of School Youth": "outOfSchoolYouth",
      "Rebel Returnee": "rebel",
      "TESDA Alumni": "TESDAAlumni",
      "Victim of Natural Disasters": "victimOfNatDisasters",
      "Agrarian Reform Beneficiary": "agrarianReform",
      "Drug Dependents": "drugDependents",
      "Farmers and Fishermen": "farmersFishermen",
      Inmates: "inmates",
      OFW: "OFW",
      "Returning OFW": "returning",
      "TVET Trainers": "TVETTrainers",
      "Wounded-in-Action": "wounded",
      "Balik Probinsya": "balikProbinsya",
      "Family Members of AFP KIA": "famMembersofAFPKIA",
      "Indigenous People": "indigenous",
      MILF: "milf",
      "RCEF Beneficiary": "RCEF",
      Student: "student",
      "Uniformed Personnel": "uniformedPersonnel",
      Others: "others",
    };

    safelySelectRadioOption(
      "clientClassification",
      clientClassificationMap[mergedData.clientClassification],
      "student"
    );

    // Handle disability information if present
    if (mergedData.disabilityType) {
      safelySelectRadioOption(
        "disabilityType",
        mergedData.disabilityType,
        "visual"
      );
    }

    if (mergedData.disabilityCause) {
      safelySelectRadioOption(
        "disabilityCause",
        mergedData.disabilityCause,
        "congenital"
      );
    }

    // Handle course and scholarship information
    if (mergedData.course && mergedData.course.length > 0) {
      const firstCourse = mergedData.course[0];
      safelySetTextField("course", firstCourse.courseName);
      safelySetTextField(
        "scholarship",
        firstCourse.hasScholarType ? firstCourse.scholarType : "None"
      );
    } else {
      safelySetTextField("course", "");
      safelySetTextField("scholarship", "None");
    }

    // Save PDF with size check
    const pdfBytes = await pdfDoc.save();

    if (pdfBytes.length > MAX_PDF_FILE_SIZE) {
      throw new Error("Generated PDF exceeds maximum file size");
    }

    // Send PDF response
    res.contentType("application/pdf");
    res.send(Buffer.from(pdfBytes));
  } catch (error) {
    // Comprehensive error logging
    console.error("PDF Generation Error:", {
      message: error.message,
      name: error.name,
      stack: USE_DETAILED_ERRORS ? error.stack : undefined,
    });

    // Conditional error response based on environment
    res.status(500).json({
      message: "Error generating PDF",
      error: error.message,
      ...(USE_DETAILED_ERRORS && { stack: error.stack }),
    });
  }
});
