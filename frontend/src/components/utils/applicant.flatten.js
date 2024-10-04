const flattenApplicantData = (applicant) => {
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
    assessmentTitle: applicant.assessmentTitle,
    assessmentType: applicant.assessmentType,
    trainingCenterName: applicant.trainingCenterName,

    // Created and updated timestamps
    createdAt: applicant.createdAt?.$date || applicant.createdAt,
    updatedAt: applicant.updatedAt?.$date || applicant.updatedAt,
  };
};

export default flattenApplicantData;
