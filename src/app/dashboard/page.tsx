"use client";
import { withProtectedRoute } from "@/components/auth/with-auth";
import CarsPage from "./cars/page";

function DashboardPage() {
  return <CarsPage />;
}

export default withProtectedRoute(DashboardPage);
