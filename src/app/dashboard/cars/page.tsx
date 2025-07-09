"use client";

import { useState, useEffect } from "react";
import { CarIcon } from "lucide-react";
import type { Car } from "@/lib/database";
import { CarsTable } from "@/components/dashboard/data-table";

interface CarsResponse {
  cars: Car[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

export default function CarsPage() {
  const [data, setData] = useState<Car[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchCars();
  }, []);

  const fetchCars = async () => {
    console.log("Fetching cars...");
    setLoading(true);
    try {
      // Add timestamp to prevent caching
      const response = await fetch(`/api/cars?limit=100&t=${Date.now()}`, {
        cache: "no-store",
        headers: {
          "Cache-Control": "no-cache",
        },
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const result: CarsResponse = await response.json();
      console.log("Fetched cars:", result.cars.length);
      setData(result.cars);
    } catch (error) {
      console.error("Failed to fetch cars:", error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="h-full flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4" />
          <p className="text-muted-foreground">Loading cars...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="h-full flex flex-col space-y-6 p-6">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 flex-shrink-0">
        <div>
          <div className="flex items-center gap-3">
            <CarIcon className="h-8 w-8 text-primary" />
            <h1 className="text-3xl font-bold tracking-tight">Cars</h1>
          </div>
          <p className="text-muted-foreground mt-1">
            Manage your car rental inventory with advanced filtering and sorting
          </p>
        </div>
      </div>

      {/* TanStack Table */}
      <div className="flex-1 min-h-0">
        <CarsTable data={data} onRefresh={fetchCars} />
      </div>
    </div>
  );
}
