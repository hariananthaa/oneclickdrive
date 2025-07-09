"use client";
import { withProtectedRoute } from "@/components/auth/with-auth";

function SettingsPage() {
  return (
    <div className="w-full h-full flex justify-center items-center">
      This is the settings page
    </div>
  );
}

export default withProtectedRoute(SettingsPage);
