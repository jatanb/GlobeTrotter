import { createBrowserRouter } from "react-router-dom";

import DashboardPage from "../pages/DashboardPage";
import CreateTripPage from "../pages/CreateTripPage";
import MyTripsPage from "../pages/MytripsPage";
import LoginPage from "../pages/auth/LoginPage";
import SignupPage from "../pages/auth/SignupPage";
import ForgotPasswordPage from "../pages/auth/ForgotPasswordPage";
import ProtectedRoute from "./ProtectedRoute";
import AppLayout from "../components/common/AppLayout";
import ItineraryBuilderPage from "../pages/itinerary/ItineraryBuilderPage";
import ItineraryViewPage from "../pages/itinerary/ItineraryViewPage";
import CitySearchPage from "../pages/discovery/CitySearchPage";
import ActivitySearchPage from "../pages/discovery/ActivitySearchPage";
import BudgetPage from "../pages/budget/BudgetPage";
import CalendarPage from "../pages/calendar/CalendarPage";
import SharedItineraryPage from "../pages/shared/SharedItineraryPage";
import ProfilePage from "../pages/profile/ProfilePage";
import AdminRoute from "./AdminRoute";
import AdminDashboardPage from "../pages/admin/AdminDashboardPage";

export const router = createBrowserRouter([
  {
    element: (
      <ProtectedRoute>
        <AppLayout />
      </ProtectedRoute>
    ),
    children: [
      {
        path: "/",
        element: <DashboardPage />,
      },
      {
        path: "/create-trip",
        element: <CreateTripPage />,
      },
      {
        path: "/trips/new",
        element: <CreateTripPage />,
      },
      {
        path: "/trips",
        element: <MyTripsPage />,
      },
      {
        path: "/trips/:tripId/itinerary",
        element: <ItineraryBuilderPage />,
      },
      {
        path: "/trips/:tripId/itinerary/view",
        element: <ItineraryViewPage />,
      },
      {
        path: "/discover/cities",
        element: <CitySearchPage />,
      },
      {
        path: "/discover/activities",
        element: <ActivitySearchPage />,
      },
      {
        path: "/budget",
        element: <BudgetPage />,
      },
      {
        path: "/calendar",
        element: <CalendarPage />,
      },
      {
        path: "/profile",
        element: <ProfilePage />,
      },
      {
        path: "/admin",
        element: (
          <AdminRoute>
            <AdminDashboardPage />
          </AdminRoute>
        ),
      },
    ],
  },
  {
    path: "/login",
    element: <LoginPage />,
  },
  {
    path: "/signup",
    element: <SignupPage />,
  },
  {
    path: "/forgot-password",
    element: <ForgotPasswordPage />,
  },
  {
    path: "/share/:shareId",
    element: <SharedItineraryPage />,
  },
]);