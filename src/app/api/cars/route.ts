import { type NextRequest, NextResponse } from "next/server";
import { Car, getDatabase } from "../../../lib/database";

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
    const db = getDatabase();
    const { searchParams } = new URL(request.url);

    const page = searchParams.get("page") || "1";
    const limit = searchParams.get("limit") || "10";

    // console.log(page, limit);

    // Validate pagination parameters
    const pageNum = Math.max(1, Number.parseInt(page) || 1);
    const limitNum = Math.min(50, Math.max(1, Number.parseInt(limit) || 10));
    const offset = (pageNum - 1) * limitNum;

    // console.log(page, limit, status);

    let query = "SELECT * FROM cars";
    const countQuery = "SELECT COUNT(*) as total FROM cars";

    // Add ordering and pagination
    query += " ORDER BY createdAt DESC LIMIT ? OFFSET ?";
    const queryParams = [limitNum, offset];

    // Execute queries
    const cars = db.prepare(query).all(...queryParams);

    // console.log("Cars from db: ", cars);

    const totalResult = db.prepare(countQuery).get() as {
      total: number;
    };
    const total = totalResult.total;

    // Format the result
    const processedCars = cars.map((car: any) => ({
      ...car,
      isPremium: Boolean(car.isPremium),
      availableForRent: Boolean(car.availableForRent),
    }));

    // console.log("processed: ", processedCars);

    const response: CarsResponse = {
      cars: processedCars,
      pagination: {
        page: pageNum,
        limit: limitNum,
        total,
        totalPages: Math.ceil(total / limitNum),
      },
    };

    return NextResponse.json(response);
  } catch (error) {
    console.error("Error fetching cars:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
