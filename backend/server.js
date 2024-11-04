import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import { connectDB } from "./config/db.js";
import registrantRoutes from "./routes/registrant.route.js";
import applicantRoutes from "./routes/applicant.route.js";
import authRoutes from "./routes/auth.route.js";
import feedbackRoutes from "./routes/feedback.route.js";
import testRoutes from "./routes/test.route.js";
import answerSheetRoutes from "./routes/answersheet.route.js";
import testSessionRoutes from "./routes/testSession.route.js";
import trainingProgramRoutes from "./routes/programs.route.js";
import path from "path";
import imageRouter from "./routes/image.route.js";
import pdfRouter from "./routes/generatePDF.route.js";
import eventRoutes from "./routes/event.route.js";
import resultsRoutes from "./routes/results.route.js";
import newsRoutes from "./routes/news.route.js";
import deletedApplicantRoutes from "./routes/deletedApplicant.route.js";
import deletedRegistrantRoutes from "./routes/deletedRegistrant.route.js";
import citizenscharterRoutes from "./routes/citizenscharter.route.js";
import pdfRoutes from "./routes/pdfRoutes.js";

dotenv.config();
const app = express();
const PORT = process.env.PORT || 5000;

const __dirname = path.resolve();

// Middleware
app.use(express.json());

app.use(
  cors({
    origin: "https://tesda-info-sys.onrender.com",
    credentials: true,
  })
);

app.use("/uploads", express.static(path.join(__dirname, "backend/uploads")));

app.use("/api", pdfRoutes);
app.use("/api/auth", authRoutes);
app.use("/api/register", registrantRoutes);
app.use("/api/applicants", applicantRoutes);
app.use("/api/feedback", feedbackRoutes);
app.use("/api/tests", testRoutes);
app.use("/api/answer-sheets", answerSheetRoutes);
app.use("/api/test-sessions", testSessionRoutes);
app.use("/api/programs", trainingProgramRoutes);
app.use("/api/images", imageRouter);
app.use("/api", pdfRouter);
app.use("/api/events", eventRoutes);
app.use("/api/results", resultsRoutes);
app.use("/api/news", newsRoutes);
app.use("/api/deleted-applicants", deletedApplicantRoutes);
app.use("/api/deleted-registrants", deletedRegistrantRoutes);
app.use("/api/citizens-charter", citizenscharterRoutes);

if (process.env.NODE_ENV === "production") {
  app.use(express.static(path.join(__dirname, "/frontend/dist")));

  app.get("*", (req, res) =>
    res.sendFile(path.resolve(__dirname, "frontend", "dist", "index.html"))
  );
}

app.listen(5000, () => {
  connectDB();
  console.log(`Server started at http://localhost:${PORT}`);
});
