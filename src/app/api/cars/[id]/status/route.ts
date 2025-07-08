import { type NextRequest, NextResponse } from "next/server";
import { getDatabase } from "../../../../../lib/database";

interface RouteParams {
  params: Promise<{
    id: string;
  }>;
}

interface StatusUpdateRequest {
  status: "approved" | "rejected" | "pending";
}

export async function PUT(request: NextRequest, { params }: RouteParams) {
  try {
    const db = getDatabase();
    const { id } = await params;
    const carId = Number.parseInt(id);

    if (isNaN(carId)) {
      return NextResponse.json({ error: "Invalid car ID" }, { status: 400 });
    }

    const body: StatusUpdateRequest = await request.json();

    // console.log(body);

    const { status } = body;

    // Validate status
    const validStatuses = ["approved", "rejected", "pending"];

    if (!status || !validStatuses.includes(status)) {
      return NextResponse.json(
        {
          error: "Invalid status. Must be one of: approved, rejected, pending",
        },
        { status: 400 }
      );
    }

    // Check if car exists
    const currentCar = db.prepare("SELECT * FROM cars WHERE id = ?").get(carId);
    if (!currentCar) {
      return NextResponse.json({ error: "Car not found" }, { status: 404 });
    }

    const updateQuery = db.prepare(`
      UPDATE cars 
      SET status = ?, updatedAt = CURRENT_TIMESTAMP 
      WHERE id = ?
    `);

    const result = updateQuery.run(status, carId);

    console.log(result);

    if (result.changes === 0) {
      return NextResponse.json(
        { error: "Failed to update car status" },
        { status: 500 }
      );
    }

    // Get updated car
    const updatedCar: any = db
      .prepare("SELECT * FROM cars WHERE id = ?")
      .get(carId);

    // Process boolean fields
    const processedCar = {
      ...updatedCar,
      isPremium: Boolean(updatedCar.isPremium),
      availableForRent: Boolean(updatedCar.availableForRent),
    };

    console.log(`Car ${carId} status ${status}`);

    return NextResponse.json({
      ...processedCar,
      message: `Car status updated to ${status}`,
    });
  } catch (error) {
    console.error("Error updating car status:", error);
    return NextResponse.json(
      { error: "Failed to update car status" },
      { status: 500 }
    );
  }
}
