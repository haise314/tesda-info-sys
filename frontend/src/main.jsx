import React, { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import App from "./App.jsx";
import Login from "./pages/public/Login.jsx";
import ErrorPage from "./pages/public/ErrorPage.jsx";
import LandingPage from "./pages/public/LandingPage.jsx";
import DashboardLayout from "./layouts/DashboardLayout.jsx";
import Dashboard from "./pages/dashboard/Dashboard.jsx";
import Profile from "./pages/dashboard/Profile.jsx";
import Applicants from "./pages/dashboard/Applicants.jsx";
import MATB from "./pages/dashboard/MATB.jsx";
import Feedback from "./pages/dashboard/Feedback.jsx";
import TrainingPrograms from "./pages/dashboard/TrainingPrograms.jsx";
import Client from "./pages/dashboard/Client.jsx";
import Settings from "./pages/dashboard/Settings.jsx";
import Notifications from "./pages/dashboard/Notifications.jsx";
import Scheduling from "./pages/dashboard/Scheduling.jsx";
import Reports from "./pages/dashboard/Reports.jsx";
import "./main.css";
import TrainingProgram from "./pages/public/TrainingProgram.jsx";
import MATBform from "./pages/public/MATBform.jsx";
import RegistrationForm from "./pages/public/RegistrationForm.jsx";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { AuthProvider } from "./context/AuthContext.jsx";
import ProtectedRoute from "./routes/ProtectedRoute.jsx";
import ApplicationForm from "./pages/public/ApplicationForm.jsx";
import RegisterUser from "./pages/public/RegisterUser.jsx";
import FeedbackForm from "./pages/public/FeedbackForm.jsx";
import UpdateRegistrant from "./components/dashboard/UpdateRegistrant.jsx";
import Unauthorized from "./pages/public/UnauthorizedPage.jsx";
import TrainingProgramList from "./pages/dashboard/TrainingProgramList.jsx";
import UsersTable from "./components/dashboard/UsersTable.jsx";
import { ThemeProvider, createTheme } from "@mui/material/styles";
import ProgramsTable from "./components/dashboard/ProgramsTable.jsx";
const queryClient = new QueryClient();

const router = createBrowserRouter([
  {
    path: "/",
    element: <App />,
    errorElement: <ErrorPage />,
    children: [
      {
        path: "",
        element: <LandingPage />,
      },
      {
        path: "apply",
        element: <ApplicationForm />,
      },
      {
        path: "register",
        element: <RegistrationForm />,
      },
      {
        path: "login",
        element: <Login />,
      },
      {
        path: "programs",
        element: <TrainingProgram />,
      },
      {
        path: "MATB",
        element: <MATBform />,
      },
      {
        path: "registeruser",
        element: <RegisterUser />,
      },
      {
        path: "feedback",
        element: <FeedbackForm />,
      },
      {
        path: "unauthorized",
        element: <Unauthorized />,
      },
    ],
  },
  {
    path: "/dashboard",
    element: (
      <ProtectedRoute allowedRoles={["client", "admin", "superadmin"]}>
        <DashboardLayout />
      </ProtectedRoute>
    ),
    children: [
      {
        path: "", // Default route for dashboard
        element: (
          <ProtectedRoute allowedRoles={["client", "admin", "superadmin"]}>
            <Dashboard />
          </ProtectedRoute>
        ),
      },
      {
        path: "users",
        element: <UsersTable />,
      },
      {
        path: "profile",
        element: (
          <ProtectedRoute allowedRoles={["client", "admin", "superadmin"]}>
            <Profile />
          </ProtectedRoute>
        ),
      },
      {
        path: "clients",
        element: (
          <ProtectedRoute allowedRoles={["admin", "superadmin"]}>
            <Client />
          </ProtectedRoute>
        ),
      },
      {
        path: "applicants",
        element: (
          <ProtectedRoute allowedRoles={["admin", "superadmin"]}>
            <Applicants />
          </ProtectedRoute>
        ),
      },
      {
        path: "MATB",
        element: (
          <ProtectedRoute allowedRoles={["admin", "superadmin"]}>
            <MATB />
          </ProtectedRoute>
        ),
      },
      {
        path: "feedback",
        element: (
          <ProtectedRoute allowedRoles={["admin", "superadmin"]}>
            <Feedback />
          </ProtectedRoute>
        ),
      },
      {
        path: "programs",
        element: (
          <ProtectedRoute allowedRoles={["admin", "superadmin"]}>
            <TrainingPrograms />
          </ProtectedRoute>
        ),
      },
      {
        path: "settings",
        element: (
          <ProtectedRoute allowedRoles={["admin", "superadmin"]}>
            <UpdateRegistrant />
          </ProtectedRoute>
        ),
      },
      {
        path: "notifications",
        element: (
          <ProtectedRoute allowedRoles={["client", "admin", "superadmin"]}>
            <Notifications />
          </ProtectedRoute>
        ),
      },
      {
        path: "scheduling",
        element: (
          <ProtectedRoute allowedRoles={["admin", "superadmin"]}>
            <Scheduling />
          </ProtectedRoute>
        ),
      },
      {
        path: "reports",
        element: (
          <ProtectedRoute allowedRoles={["admin", "superadmin"]}>
            <Reports />
          </ProtectedRoute>
        ),
      },
      {
        path: "training-programs",
        element: (
          <ProtectedRoute allowedRoles={["client", "admin", "superadmin"]}>
            <TrainingProgramList />
          </ProtectedRoute>
        ),
      },
      {
        path: "training-program-table",
        element: (
          <ProtectedRoute allowedRoles={["admin", "superadmin"]}>
            <ProgramsTable />
          </ProtectedRoute>
        ),
      },
    ],
  },
]);

const theme = createTheme();

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <ThemeProvider theme={theme}>
      <AuthProvider>
        <QueryClientProvider client={queryClient}>
          <LocalizationProvider dateAdapter={AdapterDayjs}>
            <RouterProvider router={router} />
          </LocalizationProvider>
        </QueryClientProvider>
      </AuthProvider>
    </ThemeProvider>
  </StrictMode>
);
