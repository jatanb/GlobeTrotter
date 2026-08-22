import { createBrowserRouter } from "react-router-dom";

import DashboardPage from "../pages/DashboardPage";
import CreateTripPage from "../pages/trips/CreateTripPage";
import MyTripsPage from "../pages/trips/MyTripsPage";

export const router = createBrowserRouter([
  {
    path: "/",
    element: <DashboardPage />,
  },
  {
    path: "/create-trip",
    element: <CreateTripPage />,
  },
  {
    path: "/trips",
    element: <MyTripsPage />,
  },
]);