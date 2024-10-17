import mongoose from "mongoose";

const citizensCharterSchema = new mongoose.Schema(
  {
    emailAddress: {
      type: String,
      required: false,
      trim: true,
      lowercase: true,
    },
    name: {
      type: String,
      required: false,
      trim: true,
    },
    gender: {
      type: String,
      required: true,
      enum: ["Male", "Female", "Other"],
    },
    age: {
      type: Number,
      required: false,
    },
    serviceType: {
      type: String,
      required: true,
      enum: [
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
      ],
    },
    clientType: {
      type: String,
      required: true,
      enum: ["Citizen", "Business", "Government Employee/Agency"],
    },
    transactionType: {
      type: String,
      required: true,
      enum: [
        "Assessment and Certification",
        "Program Registration",
        "Training",
        "Scholarship",
        "Administrative",
        "Others",
      ],
    },
    otherTransactionType: {
      type: String,
      required: function () {
        return this.transactionType === "Others";
      },
    },
    citizensCharterKnowledge: {
      type: String,
      required: true,
    },
    serviceQualityDimensions: {
      satisfaction: {
        type: String,
        required: true,
        enum: [
          "Strongly Agree",
          "Agree",
          "Neutral",
          "Disagree",
          "Strongly Disagree",
        ],
      },
      processingTime: {
        type: String,
        required: true,
        enum: [
          "Strongly Agree",
          "Agree",
          "Neutral",
          "Disagree",
          "Strongly Disagree",
        ],
      },
      documentCompliance: {
        type: String,
        required: true,
        enum: [
          "Strongly Agree",
          "Agree",
          "Neutral",
          "Disagree",
          "Strongly Disagree",
        ],
      },
      processSimplicity: {
        type: String,
        required: true,
        enum: [
          "Strongly Agree",
          "Agree",
          "Neutral",
          "Disagree",
          "Strongly Disagree",
        ],
      },
      informationAccessibility: {
        type: String,
        required: true,
        enum: [
          "Strongly Agree",
          "Agree",
          "Neutral",
          "Disagree",
          "Strongly Disagree",
        ],
      },
      reasonableCost: {
        type: String,
        required: true,
        enum: [
          "Strongly Agree",
          "Agree",
          "Neutral",
          "Disagree",
          "Strongly Disagree",
          "N/A",
        ],
      },
      fairness: {
        type: String,
        required: true,
        enum: [
          "Strongly Agree",
          "Agree",
          "Neutral",
          "Disagree",
          "Strongly Disagree",
        ],
      },
      staffRespect: {
        type: String,
        required: true,
        enum: [
          "Strongly Agree",
          "Agree",
          "Neutral",
          "Disagree",
          "Strongly Disagree",
        ],
      },
      serviceDelivery: {
        type: String,
        required: true,
        enum: [
          "Strongly Agree",
          "Agree",
          "Neutral",
          "Disagree",
          "Strongly Disagree",
        ],
      },
    },
    suggestions: {
      type: String,
      trim: true,
    },
    employeeName: {
      type: String,
      trim: true,
    },
  },
  {
    timestamps: true,
  }
);

const CitizensCharter = mongoose.model(
  "CitizensCharter",
  citizensCharterSchema
);

export default CitizensCharter;
