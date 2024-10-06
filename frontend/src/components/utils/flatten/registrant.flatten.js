const flattenRegistrantData = (registrant) => {
  return {
    // Include the MongoDB _id
    _id: registrant._id.$oid || registrant._id, // Handle both string and ObjectId cases
    uli: registrant.uli,

    // Rest of your flattened data
    firstName: registrant.name.firstName,
    middleName: registrant.name.middleName,
    lastName: registrant.name.lastName,
    extension: registrant.name.extension,

    mailingStreet: registrant.completeMailingAddress.street,
    mailingBarangay: registrant.completeMailingAddress.barangay,
    mailingDistrict: registrant.completeMailingAddress.district,
    mailingCity: registrant.completeMailingAddress.city,
    mailingProvince: registrant.completeMailingAddress.province,
    mailingRegion: registrant.completeMailingAddress.region,

    email: registrant.contact.email,
    mobileNumber: registrant.contact.mobileNumber,

    sex: registrant.personalInformation.sex,
    civilStatus: registrant.personalInformation.civilStatus,
    nationality: registrant.personalInformation.nationality,
    birthdate:
      registrant.personalInformation.birthdate.$date ||
      registrant.personalInformation.birthdate,
    age:
      registrant.personalInformation.age.$numberInt ||
      registrant.personalInformation.age,

    birthplaceCity: registrant.personalInformation.birthplace.city,
    birthplaceProvince: registrant.personalInformation.birthplace.province,
    birthplaceRegion: registrant.personalInformation.birthplace.region,

    employmentStatus: registrant.employmentStatus,
    employmentType: registrant.employmentType,

    education: registrant.education,

    parentFirstName: registrant.parent.name.firstName,
    parentMiddleName: registrant.parent.name.middleName,
    parentLastName: registrant.parent.name.lastName,
    parentMailingStreet: registrant.parent.completeMailingAddress.street,
    parentMailingBarangay: registrant.parent.completeMailingAddress.barangay,
    parentMailingDistrict: registrant.parent.completeMailingAddress.district,
    parentMailingCity: registrant.parent.completeMailingAddress.city,
    parentMailingProvince: registrant.parent.completeMailingAddress.province,
    parentMailingRegion: registrant.parent.completeMailingAddress.region,

    clientClassification: registrant.clientClassification,
    disabilityType: registrant.disabilityType,
    disabilityCause: registrant.disabilityCause,
    course: registrant.course,
    hasScholarType: registrant.hasScholarType,
    scholarType: registrant.scholarType,
    registrationStatus: registrant.registrationStatus,

    // You might also want to include these
    createdAt: registrant.createdAt.$date || registrant.createdAt,
    updatedAt: registrant.updatedAt.$date || registrant.updatedAt,
  };
};

export default flattenRegistrantData;
