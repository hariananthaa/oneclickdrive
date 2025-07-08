import { type NextRequest, NextResponse } from "next/server";
import { getDatabase, CarSchema } from "../../../../lib/database";

interface RouteParams {
  params: Promise<{
    id: string;
  }>;
}

export async function GET(_: NextRequest, { params }: RouteParams) {
  try {
    const db = getDatabase();
    const { id } = await params;
    const carId = Number.parseInt(id);

    console.log(typeof carId);

    if (isNaN(carId)) {
      return NextResponse.json({ error: "Invalid car ID" }, { status: 400 });
    }

    const car: any = db.prepare("SELECT * FROM cars WHERE id = ?").get(carId);

    // console.log(car);

    if (!car) {
      return NextResponse.json({ error: "Car not found" }, { status: 404 });
    }

    // Process boolean fieldss
    const processedCar = {
      ...car,
      isPremium: Boolean(car.isPremium), // converting 1 or 0 to boolean
      availableForRent: Boolean(car.availableForRent),
    };

    return NextResponse.json(processedCar);
  } catch (error) {
    console.error("Error fetching car:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

export async function PUT(request: NextRequest, { params }: RouteParams) {
  try {
    const db = getDatabase();
    const { id } = await params;
    const carId = Number.parseInt(id);

    if (isNaN(carId)) {
      return NextResponse.json({ error: "Invalid car ID" }, { status: 400 });
    }

    // Check if car exists
    const existingCar = db
      .prepare("SELECT * FROM cars WHERE id = ?")
      .get(carId);
    if (!existingCar) {
      return NextResponse.json({ error: "Car not found" }, { status: 404 });
    }
    console.log(existingCar);

    const body = await request.json();

    console.log(body);

    // Validation
    const validationResult = CarSchema.safeParse(body);

    console.log(validationResult);

    if (!validationResult.success) {
      return NextResponse.json(
        {
          error: "Validation failed",
          details: validationResult.error.errors,
        },
        { status: 400 }
      );
    }

    const validatedData = validationResult.data;

    // Update car
    const updateQuery = db.prepare(`
      UPDATE cars 
      SET title = ?, brand = ?, model = ?, year = ?, category = ?,
          dailyRate = ?, monthlyRate = ?, location = ?, imageUrl = ?,
          isPremium = ?, availableForRent = ?, status = ?, updatedAt = CURRENT_TIMESTAMP
      WHERE id = ?
    `);

    const result = updateQuery.run(
      validatedData.title,
      validatedData.brand,
      validatedData.model,
      validatedData.year,
      validatedData.category,
      validatedData.dailyRate,
      validatedData.monthlyRate,
      validatedData.location,
      validatedData.imageUrl,
      validatedData.isPremium ? 1 : 0,
      validatedData.availableForRent ? 1 : 0,
      validatedData.status,
      carId
    );

    // console.log(result);

    if (result.changes === 0) {
      return NextResponse.json({ error: "No changes made" }, { status: 400 });
    }

    const updatedCar: any = db
      .prepare("SELECT * FROM cars WHERE id = ?")
      .get(carId);

    // Process boolean fields
    const processedCar = {
      ...updatedCar,
      isPremium: Boolean(updatedCar.isPremium),
      availableForRent: Boolean(updatedCar.availableForRent),
    };

    return NextResponse.json(processedCar);
  } catch (error) {
    console.error("Error updating car:", error);
    return NextResponse.json(
      { error: "Failed to update car" },
      { status: 500 }
    );
  }
}
