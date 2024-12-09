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

const safeGet = (obj, path, defaultValue = "") => {
  return path
    .split(".")
    .reduce(
      (acc, part) =>
        acc && acc[part] !== undefined ? acc[part] : defaultValue,
      obj
    );
};

export const generateRegistrantPDF = asyncHandler(async (req, res) => {
  const MAX_PDF_FILE_SIZE = process.env.MAX_PDF_FILE_SIZE
    ? parseInt(process.env.MAX_PDF_FILE_SIZE)
    : 10 * 1024 * 1024;

  const USE_DETAILED_ERRORS = process.env.NODE_ENV === "development";

  try {
    const { uli } = req.body.data;

    console.log(`[PDF Generation] Starting for ULI: ${uli}`);
    console.log(`[Environment] Current environment: ${process.env.NODE_ENV}`);

    const possiblePaths = [
      process.env.PDF_TEMPLATE_PATH,
      path.join(process.cwd(), "templates", "registrant-template-revised.pdf"),
      path.join(__dirname, "../templates/registrant-template-revised.pdf"),
      path.join(__dirname, "templates", "registrant-template-revised.pdf"),
      path.join(process.cwd(), "registrant-template-revised.pdf"),
      path.join(__dirname, "registrant-template-revised.pdf"),
    ].filter(Boolean);

    let templatePath;
    let templateBytes;

    for (const potentialPath of possiblePaths) {
      try {
        console.log(`Attempting to read template from: ${potentialPath}`);
        const normalizedPath = path.normalize(potentialPath);
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

    const user = await User.findOne({ uli: uli });
    const registrant = await Registrant.findOne({ uli: uli });

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
      education: safeGet(user, "education", ""),
    };
    console.log(`[PDF Generation] Merged data:`, mergedData);

    const pdfDoc = await PDFDocument.load(templateBytes);
    const form = pdfDoc.getForm();

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

    // Handle ULI splitting
    const uliWithoutHyphens = mergedData.uli.replace(/-/g, "");
    for (let i = 0; i < 13; i++) {
      safelySetTextField(`uli${i + 1}`, uliWithoutHyphens[i] || "");
    }

    // Handle current date
    const currentDate = new Date();
    safelySetTextField("date", currentDate.toLocaleDateString());

    // Basic information fields
    safelySetTextField("lastName", mergedData.name.lastName);
    safelySetTextField("firstName", mergedData.name.firstName);
    safelySetTextField("middleName", mergedData.name.middleName);

    // Address fields
    safelySetTextField("street", mergedData.completeMailingAddress.street);
    safelySetTextField("barangay", mergedData.completeMailingAddress.barangay);
    safelySetTextField("district", mergedData.completeMailingAddress.district);
    safelySetTextField("city", mergedData.completeMailingAddress.city);
    safelySetTextField("province", mergedData.completeMailingAddress.province);
    safelySetTextField("region", mergedData.completeMailingAddress.region);

    // Contact information
    safelySetTextField("email", mergedData.contact.email);
    safelySetTextField("mobileNumber", mergedData.contact.mobileNumber);
    safelySetTextField("nationality", mergedData.nationality);

    // Parent information
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

    const parentAddress = `${mergedData.completeMailingAddress.barangay}, ${mergedData.completeMailingAddress.city}, ${mergedData.completeMailingAddress.province}`;
    safelySetTextField("parentAddress", parentAddress);

    // Handle education radio group
    const educationOptions = [
      "noGradeCompleted",
      "elementaryUndergraduate",
      "elementaryGraduate",
      "highSchoolUndergraduate",
      "highSchoolGraduate",
      "juniorHigh",
      "seniorHigh",
      "techVocUndergraduate",
      "techVocGraduate",
      "collegeUndergraduate",
      "collegeGraduate",
      "masteral",
      "doctorate",
    ];
    const educationValue = mergedData.education
      .toLowerCase()
      .replace(/\s+/g, "");
    safelySelectRadioOption("education", educationValue, "noGradeCompleted");

    // Handle sex radio group
    safelySelectRadioOption("sex", mergedData.sex, "male");

    // Handle civil status radio group
    safelySelectRadioOption("civilStatus", mergedData.civilStatus, "single");

    // Handle employment status
    const employmentStatusOptions = [
      "wageEmployed",
      "underemployed",
      "selfEmployed",
    ];
    const employmentStatusValue = mergedData.employmentStatus
      .toLowerCase()
      .replace(/\s+/g, "");

    if (employmentStatusOptions.includes(employmentStatusValue)) {
      safelySelectRadioOption(
        "employmentStatus",
        employmentStatusValue,
        "wageEmployed"
      );
    } else {
      safelySelectRadioOption("employmentStatus", "custom", "custom");
      safelySetTextField("employmentStatusCustom", mergedData.employmentStatus);
    }

    // Handle client classification with accurate mappings
    const clientClassificationMap = {
      "4Psbeneficiary": "4Ps Beneficiary",
      displacedWorker: "Displaced Worker",
      familiyMemAFP: "Family Members of AFP and PNP Wounded in Action",
      industryWorker: "Industry Workers",
      outOfSchoolYouth: "Out-Of-School Youth",
      rebel: "Rebel Returnees/Decommissioned Combatants",
      TESDAAlumni: "TESDA Alumni",
      victimOfNatDisasters: "Victim of Natural Disasters and Calamities",
      agrarianReform: "Agrarian Reform Beneficiaries",
      drugDependents: "Drug Dependents Surrenderers",
      farmersFishermen: "Farmers and Fishermen",
      inmates: "Inmates and Detainees",
      OFW: "Overseas Filipino Workers (OFW) Dependent",
      returning: "Returning/Repatriated OFWs",
      TVETTrainers: "TVET Trainers",
      wounded: "Wounded-In-Action AFP and PNP Personnel",
      balikProbinsya: "Balik Probinsya",
      famMembersofAFPKIA: "Family Members of AFP and PNP Killed-in-Action",
      indigenous: "Indigenous Peoples",
      milf: "MILF Beneficiary",
      RCEF: "RCEF-RESP",
      student: "Student",
      uniformedPersonnel: "Uniformed Personnel",
      "others(clientClassificationOthers)": "Others",
    };

    const clientClassificationValue = Object.keys(clientClassificationMap).find(
      (key) =>
        clientClassificationMap[key].toLowerCase() ===
        mergedData.clientClassification.toLowerCase()
    );

    if (clientClassificationValue) {
      safelySelectRadioOption(
        "clientClassification",
        clientClassificationValue,
        "student"
      );
    } else {
      safelySelectRadioOption("clientClassification", "others", "others");
      safelySetTextField(
        "clientClassificationOthers",
        mergedData.clientClassification
      );
    }

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

    // Handle disability information
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

    // Save and check PDF size
    const pdfBytes = await pdfDoc.save();

    if (pdfBytes.length > MAX_PDF_FILE_SIZE) {
      throw new Error("Generated PDF exceeds maximum file size");
    }

    // Send PDF response
    res.contentType("application/pdf");
    res.send(Buffer.from(pdfBytes));
  } catch (error) {
    console.error("PDF Generation Error:", {
      message: error.message,
      name: error.name,
      stack: USE_DETAILED_ERRORS ? error.stack : undefined,
    });

    res.status(500).json({
      message: "Error generating PDF",
      error: error.message,
      ...(USE_DETAILED_ERRORS && { stack: error.stack }),
    });
  }
});

const validateFormValue = (value) => {
  if (value === null || value === undefined || Number.isNaN(value)) {
    return "";
  }
  return String(value);
};

const generateReferenceNumber = (data) => {
  const qualAlphaCode = "Q";
  const year = new Date().getFullYear().toString().slice(-2);

  // Extract regional components (first 2 chars each)
  const region = data.mailingAddress.region
    .replace(/[^a-zA-Z0-9]/g, "")
    .slice(0, 2);
  const province = data.mailingAddress.province
    .replace(/[^a-zA-Z0-9]/g, "")
    .slice(0, 2);

  // Generate random series (remaining digits)
  const generateRandomDigits = (length) => {
    return Array.from({ length }, () => Math.floor(Math.random() * 10)).join(
      ""
    );
  };

  // Construct reference number (16 digits)
  const referenceNumber = `${qualAlphaCode}${year}${region}${province}${generateRandomDigits(
    11
  )}`;
  return referenceNumber.slice(0, 16);
};

const formatBirthplace = (birthplace) => {
  if (!birthplace) return "";
  const parts = [
    birthplace.barangay,
    birthplace.city,
    birthplace.province,
    birthplace.region,
  ].filter(Boolean);
  return parts.join(", ");
};

const formatName = (nameObj) => {
  if (!nameObj) return "";
  const parts = [
    nameObj.firstName,
    nameObj.middleName,
    nameObj.lastName,
    nameObj.extension,
  ].filter(Boolean);
  return parts.join(" ");
};

export const generateApplicantPDF = asyncHandler(async (req, res) => {
  try {
    const { uli } = req.body.data;

    const user = await User.findOne({ uli: uli });
    const applicant = await Applicant.findOne({ uli: uli });

    if (!user || !applicant) {
      res.status(404);
      throw new Error("User or Applicant data not found");
    }

    const mergedData = {
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
        others: user.contact.others,
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
      sex: user.sex,
      birthdate: user.birthdate,
      age: user.age,
      birthplace: user.birthplace,
      nationality: user.nationality,
      civilStatus: user.civilStatus,
      motherName: user.motherName,
      fatherName: user.fatherName,
      employmentStatus: user.employmentStatus,
      employmentType: user.employmentType,
      education: user.education,
      clientClassification: user.clientClassification,
      otherClientClassification: user.otherClientClassification,
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

    const templatePath = path.join(
      __dirname,
      "../templates/applicant-template-revised.pdf"
    );
    const templateBytes = await fs.readFile(templatePath);
    const pdfDoc = await PDFDocument.load(templateBytes);
    const form = pdfDoc.getForm();

    // Generate and set reference number
    const referenceNumber = generateReferenceNumber(mergedData);
    referenceNumber.split("").forEach((digit, index) => {
      form.getTextField(`referenceNumber${index + 1}`).setText(digit);
    });

    // Basic Information
    form.getTextField("uli").setText(mergedData.uli);
    form
      .getTextField("trainingCenterName")
      .setText(mergedData.trainingCenter.name);
    form
      .getTextField("addressLocation")
      .setText(mergedData.trainingCenter.address);

    // Name Fields
    ["firstName", "middleName", "lastName", "extension"].forEach((nameType) => {
      const nameValue = mergedData.name[nameType] || "";
      const limitedNameValue =
        nameType === "middleName"
          ? nameValue.slice(0, 18)
          : nameType === "extension"
          ? nameValue.replace(/\s/g, "").slice(0, 3)
          : nameValue;

      limitedNameValue.split("").forEach((letter, index) => {
        const fieldName = `${nameType}${index + 1}`;
        form.getTextField(fieldName)?.setText(letter.toUpperCase() || "");
      });
    });

    // Middle Initials (first two letters of middleName)
    // Middle Initial (first letter of middleName)
    const middleName = mergedData.name.middleName || "";
    const middleInitial = middleName.charAt(0).toUpperCase();
    form.getTextField("middleInitial1").setText(middleInitial);

    // Contact Information
    form
      .getTextField("telephoneNumber")
      .setText(validateFormValue(mergedData.contact.telephoneNumber));
    form
      .getTextField("mobileNumber")
      .setText(validateFormValue(mergedData.contact.mobileNumber));
    form
      .getTextField("email")
      .setText(validateFormValue(mergedData.contact.email));
    form.getTextField("fax").setText(validateFormValue(mergedData.contact.fax));
    form
      .getTextField("others")
      .setText(validateFormValue(mergedData.contact.others));

    // Address Information
    form
      .getTextField("street")
      .setText(validateFormValue(mergedData.mailingAddress.street));
    form
      .getTextField("barangay")
      .setText(validateFormValue(mergedData.mailingAddress.barangay));
    form
      .getTextField("district")
      .setText(validateFormValue(mergedData.mailingAddress.district));
    form
      .getTextField("city")
      .setText(validateFormValue(mergedData.mailingAddress.city));
    form
      .getTextField("province")
      .setText(validateFormValue(mergedData.mailingAddress.province));
    form
      .getTextField("region")
      .setText(validateFormValue(mergedData.mailingAddress.region));
    form
      .getTextField("zipCode")
      .setText(validateFormValue(mergedData.mailingAddress.zipCode));

    // Parent Names
    form.getTextField("motherName").setText(formatName(mergedData.motherName));
    form.getTextField("fatherName").setText(formatName(mergedData.fatherName));

    // Birthplace and Age
    form
      .getTextField("birthplace")
      .setText(formatBirthplace(mergedData.birthplace));
    form.getTextField("age").setText(validateFormValue(mergedData.age));

    // Birthdate
    const birthdate = new Date(mergedData.birthdate);
    const birthMonth = (birthdate.getMonth() + 1).toString().padStart(2, "0");
    const birthDay = birthdate.getDate().toString().padStart(2, "0");
    const birthYear = birthdate.getFullYear().toString();

    birthMonth.split("").forEach((digit, index) => {
      form.getTextField(`birthdateM${index + 1}`).setText(digit);
    });
    birthDay.split("").forEach((digit, index) => {
      form.getTextField(`birthdateD${index + 1}`).setText(digit);
    });
    birthYear
      .slice(2)
      .split("")
      .forEach((digit, index) => {
        form.getTextField(`birthdateY${index + 1}`).setText(digit);
      });

    // Assessment Type and Title
    const firstAssessment = mergedData.assessments?.[0];
    if (firstAssessment) {
      const assessmentTypeMap = {
        "Full Qualification": "fullQualification",
        COC: "coc",
        Renewal: "renewal",
      };
      const mappedType =
        assessmentTypeMap[firstAssessment.assessmentType] ||
        "fullQualification";
      form.getRadioGroup("assessmentType").select(mappedType);
      form
        .getTextField("assessmentTitle")
        .setText(firstAssessment.assessmentTitle || "");
    }

    // Handle Radio Groups
    const handleRadioSelection = (radioGroup, value, options, customField) => {
      const radio = form.getRadioGroup(radioGroup);
      const matchedOption = options.find((opt) => opt === value);

      if (matchedOption) {
        radio.select(matchedOption.toLowerCase());
      } else {
        radio.select("custom");
        form.getTextField(customField)?.setText(value);
      }
    };

    // Insert the sex radio group handling here
    const sexOptions = ["male", "female"];
    const sexValue = mergedData.sex.toLowerCase();
    handleRadioSelection("sex", sexValue, sexOptions, "sexCustom");

    handleRadioSelection(
      "clientType",
      mergedData.clientClassification,
      ["TVETGraduating", "TVETGraduate", "industryWorker", "K-12"],
      "clientTypeCustom"
    );

    handleRadioSelection(
      "civilStatus",
      mergedData.civilStatus,
      ["Single", "Married", "Widower"],
      "civilStatusCustom"
    );

    handleRadioSelection(
      "education",
      mergedData.education,
      [
        "Elementary Graduate",
        "High School Graduate",
        "TVET Graduate",
        "College Level",
        "College Graduate",
      ],
      "educationCustom"
    );

    handleRadioSelection(
      "employmentStatus",
      mergedData.employmentStatus,
      ["Casual", "Job Order", "Probationary", "Permanent", "Self-Employed"],
      "employmentStatusCustom"
    );

    // Table Sections
    const fillTableSection = (sectionName, data, fieldMappings) => {
      if (!Array.isArray(data)) {
        data = [];
      }

      data.slice(0, 4).forEach((entry, entryIndex) => {
        fieldMappings.forEach(({ modelField, pdfFields }) => {
          let value = safeGet(entry, modelField, "");
          if (value instanceof Date) {
            value = value.toLocaleDateString();
          }
          const safeValue = validateFormValue(value);
          const field = form.getTextField(`${pdfFields}${entryIndex + 1}`);
          if (field) {
            field.setText(safeValue);
          }
        });
      });
    };

    // Fill Work Experience
    fillTableSection("workExperience", mergedData.workExperience, [
      { modelField: "companyName", pdfFields: "companyName" },
      { modelField: "position", pdfFields: "position" },
      { modelField: "inclusiveDates.from", pdfFields: "WEfrom" },
      { modelField: "inclusiveDates.to", pdfFields: "WEto" },
      { modelField: "monthlySalary", pdfFields: "monthlySalary" },
      { modelField: "appointmentStatus", pdfFields: "appointmentStatus" },
      { modelField: "noOfYearsInWork", pdfFields: "noOfYearsInWork" },
    ]);

    // Fill Training Seminars
    fillTableSection(
      "trainingSeminarsAttended",
      mergedData.trainingSeminarsAttended,
      [
        { modelField: "title", pdfFields: "title" },
        { modelField: "venue", pdfFields: "venue" },
        { modelField: "inclusiveDates.from", pdfFields: "OTfrom" },
        { modelField: "inclusiveDates.to", pdfFields: "OTto" },
        { modelField: "numberOfHours", pdfFields: "numberOfHours" },
        { modelField: "conductedBy", pdfFields: "conductedBy" },
      ]
    );

    // Fill Licensure Examinations
    fillTableSection(
      "licensureExaminations",
      mergedData.licensureExaminations,
      [
        { modelField: "title", pdfFields: "LEtitle" },
        { modelField: "dateOfExamination", pdfFields: "dateOfExamination" },
        { modelField: "examinationVenue", pdfFields: "examinationVenue" },
        { modelField: "rating", pdfFields: "rating" },
        { modelField: "remarks", pdfFields: "remarks" },
        { modelField: "expiryDate", pdfFields: "expiryDate" },
      ]
    );

    // Fill Competency Assessments
    fillTableSection(
      "competencyAssessments",
      mergedData.competencyAssessments,
      [
        { modelField: "title", pdfFields: "CAtitle" },
        { modelField: "qualificationLevel", pdfFields: "qualificationLevel" },
        { modelField: "industrySector", pdfFields: "industrySector" },
        { modelField: "certificateNumber", pdfFields: "certificateNumber" },
        { modelField: "dateIssued", pdfFields: "dateIssued" },
        { modelField: "expirationDate", pdfFields: "expirationDate" },
      ]
    );

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
