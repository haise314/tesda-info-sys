import fs from "fs";
import path from "path";
import handlebars from "handlebars";
import { fileURLToPath } from "url";
import htmlPdf from "html-pdf";
import { promisify } from "util";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const createPdf = promisify(htmlPdf.create);

// Registrant
export const generatePDF = async (data) => {
  console.log("Starting Registrant PDF generation...");
  try {
    // Load and compile template
    const templatePath = path.resolve(
      __dirname,
      "../template/registrant-template.html"
    );
    const templateHtml = fs.readFileSync(templatePath, "utf8");
    const template = handlebars.compile(templateHtml);

    // Format date if needed
    const formattedData = {
      ...data,
      // personalInformation: {
      //   ...data.personalInformation,
      //   birthdate: new Date(
      //     data.personalInformation.birthdate
      //   ).toLocaleDateString("en-US", {
      //     year: "numeric",
      //     month: "long",
      //     day: "numeric",
      //   }),
      // },
    };
    console.log("Data formatted:", formattedData);

    const compiledHtml = template(formattedData);

    // Save compiled HTML for debugging
    fs.writeFileSync("debug-output.html", compiledHtml);

    // Generate PDF
    const options = {
      format: "A4",
      border: {
        top: "20mm",
        right: "20mm",
        bottom: "20mm",
        left: "20mm",
      },
    };

    return new Promise((resolve, reject) => {
      htmlPdf.create(compiledHtml, options).toBuffer((err, buffer) => {
        if (err) {
          console.error("Error generating PDF:", err);
          reject(err);
        } else {
          console.log("PDF generated successfully!");
          resolve(buffer);
        }
      });
    });
  } catch (error) {
    console.error("Error in PDF generation:", error);
    throw error;
  }
};

// Applicant
export const generatePDFApplicant = async (data) => {
  console.log("Starting Applicant PDF generation...");
  try {
    // Load and compile template
    const templatePath = path.resolve(
      __dirname,
      "../template/applicant-template.html"
    );
    const templateHtml = fs.readFileSync(templatePath, "utf8");
    const template = handlebars.compile(templateHtml);

    // Format date if needed
    const formattedData = {
      ...data,
      // birthdate: new Date(data.birthdate).toLocaleDateString("en-US", {
      //   year: "numeric",
      //   month: "long",
      //   day: "numeric",
      // }),
    };
    console.log("Data formatted:", formattedData);

    const compiledHtml = template(formattedData);

    // Save compiled HTML for debugging
    fs.writeFileSync("debug-output.html", compiledHtml);

    // Generate PDF
    const options = {
      format: "A4",
      border: {
        top: "20mm",
        right: "20mm",
        bottom: "20mm",
        left: "20mm",
      },
    };

    return new Promise((resolve, reject) => {
      htmlPdf.create(compiledHtml, options).toBuffer((err, buffer) => {
        if (err) {
          console.error("Error generating PDF:", err);
          reject(err);
        } else {
          console.log("PDF generated successfully!");
          resolve(buffer);
        }
      });
    });
  } catch (error) {
    console.error("Error in PDF generation:", error);
    throw error;
  }
};
