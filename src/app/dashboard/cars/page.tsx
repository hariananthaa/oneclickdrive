"use client";
import { withProtectedRoute } from "@/components/auth/with-auth";
import { CarsDataTable } from "@/components/dashboard/cars-data-table";

function CarsPage() {
  return (
    <div className="container mx-auto">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-3xl font-bold">Cars Management</h1>
          <p className="text-muted-foreground">Manage your car rent info</p>
        </div>
      </div>

      <div className="h-[calc(100vh-180px)]">
        <CarsDataTable />
      </div>
    </div>
  );
}

export default withProtectedRoute(CarsPage);
