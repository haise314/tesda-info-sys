export const flattenApplicantData = (applicant) => {
  return {
    // MongoDB _id, handling ObjectId cases
    _id: applicant._id?.$oid || applicant._id,

    uli: applicant.uli,

    // Flatten name fields
    firstName: applicant.name?.firstName,
    middleName: applicant.name?.middleName,
    lastName: applicant.name?.lastName,
    extension: applicant.name?.extension,

    // Flatten mailing address fields
    mailingStreet: applicant.completeMailingAddress?.street,
    mailingBarangay: applicant.completeMailingAddress?.barangay,
    mailingDistrict: applicant.completeMailingAddress?.district,
    mailingCity: applicant.completeMailingAddress?.city,
    mailingProvince: applicant.completeMailingAddress?.province,
    mailingRegion: applicant.completeMailingAddress?.region,
    mailingZipCode: applicant.completeMailingAddress?.zipCode,

    // Flatten contact fields
    telephoneNumber: applicant.contact?.telephoneNumber,
    mobileNumber: applicant.contact?.mobileNumber,
    email: applicant.contact?.email,
    fax: applicant.contact?.fax,
    otherContacts: applicant.contact?.others,

    // Personal details
    sex: applicant.sex,
    civilStatus: applicant.civilStatus,
    birthdate: applicant.birthdate?.$date || applicant.birthdate,
    birthplace: applicant.birthplace,
    age: applicant.age,

    // Parent details
    motherFirstName: applicant.motherName?.firstName,
    motherMiddleName: applicant.motherName?.middleName,
    motherLastName: applicant.motherName?.lastName,
    fatherFirstName: applicant.fatherName?.firstName,
    fatherMiddleName: applicant.fatherName?.middleName,
    fatherLastName: applicant.fatherName?.lastName,

    // Applicant's work experience
    workExperience: applicant.workExperience?.map((exp) => ({
      companyName: exp.companyName,
      position: exp.position,
      from: exp.inclusiveDates?.from,
      to: exp.inclusiveDates?.to,
      monthlySalary: exp.monthlySalary,
      appointmentStatus: exp.appointmentStatus,
      noOfYearsInWork: exp.noOfYearsInWork,
    })),

    // Applicant's training and seminars
    trainingSeminarAttended: applicant.trainingSeminarAttended?.map(
      (training) => ({
        title: training.title,
        venue: training.venue,
        from: training.inclusiveDates?.from,
        to: training.inclusiveDates?.to,
        numberOfHours: training.numberOfHours,
        conductedBy: training.conductedBy,
      })
    ),

    // Applicant's licensure exams
    licensureExaminationPassed: applicant.licensureExaminationPassed?.map(
      (exam) => ({
        title: exam.title,
        dateOfExamination: exam.dateOfExamination,
        examinationVenue: exam.examinationVenue,
        rating: exam.rating,
        remarks: exam.remarks,
        expiryDate: exam.expiryDate,
      })
    ),

    // Applicant's competency assessments
    competencyAssessment: applicant.competencyAssessment?.map((assessment) => ({
      title: assessment.title,
      qualificationLevel: assessment.qualificationLevel,
      industrySector: assessment.industrySector,
      certificateNumber: assessment.certificateNumber,
      dateIssued: assessment.dateIssued,
      expirationDate: assessment.expirationDate,
    })),

    // Miscellaneous details
    highestEducationalAttainment: applicant.highestEducationalAttainment,
    employmentStatus: applicant.employmentStatus,
    clientType: applicant.clientType,

    assessments: applicant.assessments.map((assessment) => ({
      assessmentTitle: assessment.assessmentTitle,
      assessmentType: assessment.assessmentType,
      applicationStatus: assessment.applicationStatus,
    })),

    trainingCenterName: applicant.trainingCenterName,
    // Created and updated timestamps
    createdAt: applicant.createdAt?.$date || applicant.createdAt,
    updatedAt: applicant.updatedAt?.$date || applicant.updatedAt,
    updatedBy: applicant.updatedBy,
  };
};

// Utility function to unflatten applicant data
export const unflattenApplicantData = (flatData) => {
  const { _id, assessments, ...rest } = flatData;

  return {
    _id,
    uli: rest.uli,
    name: {
      firstName: rest.firstName,
      middleName: rest.middleName,
      lastName: rest.lastName,
      extension: rest.extension,
    },
    completeMailingAddress: {
      street: rest.mailingStreet,
      barangay: rest.mailingBarangay,
      district: rest.mailingDistrict,
      city: rest.mailingCity,
      province: rest.mailingProvince,
      region: rest.mailingRegion,
      zipCode: rest.mailingZipCode,
    },
    contact: {
      telephoneNumber: rest.telephoneNumber,
      mobileNumber: rest.mobileNumber,
      email: rest.email,
      fax: rest.fax,
      others: rest.otherContacts,
    },
    sex: rest.sex,
    civilStatus: rest.civilStatus,
    birthdate: rest.birthdate,
    birthplace: rest.birthplace,
    age: rest.age,
    motherName: {
      firstName: rest.motherFirstName,
      middleName: rest.motherMiddleName,
      lastName: rest.motherLastName,
    },
    fatherName: {
      firstName: rest.fatherFirstName,
      middleName: rest.fatherMiddleName,
      lastName: rest.fatherLastName,
    },
    workExperience: rest.workExperience?.map((exp) => ({
      companyName: exp.companyName,
      position: exp.position,
      inclusiveDates: {
        from: exp.from,
        to: exp.to,
      },
      monthlySalary: exp.monthlySalary,
      appointmentStatus: exp.appointmentStatus,
      noOfYearsInWork: exp.noOfYearsInWork,
    })),
    trainingSeminarAttended: rest.trainingSeminarAttended?.map((training) => ({
      title: training.title,
      venue: training.venue,
      inclusiveDates: {
        from: training.from,
        to: training.to,
      },
      numberOfHours: training.numberOfHours,
      conductedBy: training.conductedBy,
    })),
    licensureExaminationPassed: rest.licensureExaminationPassed?.map(
      (exam) => ({
        title: exam.title,
        dateOfExamination: exam.dateOfExamination,
        examinationVenue: exam.examinationVenue,
        rating: exam.rating,
        remarks: exam.remarks,
        expiryDate: exam.expiryDate,
      })
    ),
    competencyAssessment: rest.competencyAssessment?.map((assessment) => ({
      title: assessment.title,
      qualificationLevel: assessment.qualificationLevel,
      industrySector: assessment.industrySector,
      certificateNumber: assessment.certificateNumber,
      dateIssued: assessment.dateIssued,
      expirationDate: assessment.expirationDate,
    })),
    highestEducationalAttainment: rest.highestEducationalAttainment,
    employmentStatus: rest.employmentStatus,
    clientType: rest.clientType,
    assessments: assessments, // Include the assessments array
    trainingCenterName: rest.trainingCenterName,
    createdAt: rest.createdAt,
    updatedAt: rest.updatedAt,
  };
};
