"use client";
import { withProtectedRoute } from "@/components/auth/with-auth";

function UsersPage() {
  return (
    <div className="w-full h-full flex justify-center items-center">
      This is the user page
    </div>
  );
}

export default withProtectedRoute(UsersPage);
