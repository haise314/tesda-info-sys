const serviceTypes = [
  "Customer Inquiry and Feedback Through Assistance and Complaint Desk",
  "Customer Inquiry and Feedback Through Calls",
  "Application for Assessment and Certification",
  "Payment of Training and Support Fund",
  "Application for Scholarship and Enrollment",
  "Application of Competency Assessment",
  "Issuance of Certificate of Training",
  "Replacement of Lost Training Certificate",
  "Community-Based Training",
  "Customer Inquiry and Feedback Electronic Mails",
  "Conduct of Training Induction Program",
  "Availment of Scholarship Program",
  "Payment of Scholarship Voucher",
  "Catering Services",
];

const qualityDimensions = [
  {
    name: "satisfaction",
    label:
      "I was satisfied with the service I received at the office I visited.",
  },
  {
    name: "processingTime",
    label: "The time I spent for processing my transaction was reasonable.",
  },
  {
    name: "documentCompliance",
    label:
      "The office follows the necessary documents and steps based on the information provided.",
  },
  {
    name: "processSimplicity",
    label: "The processing steps, including payment are easy and simple.",
  },
  {
    name: "informationAccessibility",
    label:
      "I can quickly and easily find information about my transaction from the office or its website.",
  },
  {
    name: "reasonableCost",
    label: "I paid a reasonable amount for my transaction.",
  },
  {
    name: "fairness",
    label:
      'I feel the office is fair to everyone, "or no sports", in my transaction.',
  },
  {
    name: "staffRespect",
    label:
      "I was treated with respect by the staff, and (if I ever asked for help) I knew they would be willing to help me.",
  },
  {
    name: "serviceDelivery",
    label:
      "I got what I needed from the government office, if rejected, it was adequately explained to me.",
  },
];

export { serviceTypes, qualityDimensions };
