import { type NextRequest, NextResponse } from "next/server";
import { getAllCars } from "@/lib/database";
import type { Car } from "@/lib/database";

interface CarsResponse {
  cars: Car[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);

    // Get pagination parameters from query
    const page = Math.max(1, Number.parseInt(searchParams.get("page") || "1"));
    const limit = Math.min(
      100,
      Math.max(1, Number.parseInt(searchParams.get("limit") || "10"))
    );

    const search = searchParams.get("search") || "";
    const status = searchParams.get("status") || "";

    console.log("API Request params:", {
      page,
      limit,
      search,
      status,
    });

    const result = await getAllCars({
      page,
      limit,
      search,
      status,
    });

    const response: CarsResponse = {
      cars: result.cars,
      pagination: {
        page: result.pagination.page,
        limit: result.pagination.limit,
        total: result.pagination.total,
        totalPages: result.pagination.totalPages,
      },
    };

    console.log("API Response:", {
      carsCount: response.cars.length,
      pagination: response.pagination,
    });

    return NextResponse.json(response);
  } catch (error) {
    console.error("Error fetching cars:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
