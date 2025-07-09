import { neon } from "@neondatabase/serverless";
import { z } from "zod";

// Database schemas
export const CarSchema = z.object({
  id: z.number().optional(),
  title: z.string().min(1, "Title is required"),
  brand: z.string().min(1, "Brand is required"),
  model: z.string().min(1, "Model is required"),
  year: z
    .number()
    .min(1900)
    .max(new Date().getFullYear() + 1),
  category: z.enum([
    "SUV",
    "Sedan",
    "Hatchback",
    "Coupe",
    "Convertible",
    "Truck",
    "Van",
  ]),
  dailyRate: z.number().min(0, "Daily rate must be positive"),
  monthlyRate: z.number().min(0, "Monthly rate must be positive"),
  location: z.string().min(1, "Location is required"),
  imageUrl: z.string().url("Must be a valid URL"),
  isPremium: z.boolean().default(false),
  availableForRent: z.boolean().default(true),
  status: z.enum(["pending", "approved", "rejected"]).default("pending"),
  createdAt: z.string().optional(),
  updatedAt: z.string().optional(),
});

export type Car = z.infer<typeof CarSchema>;

interface PaginationOptions {
  page?: number;
  limit?: number;
  search?: string;
  category?: string;
  status?: string;
  isPremium?: boolean;
  availableForRent?: boolean;
}

export interface PaginatedResult {
  cars: Car[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

const sql = neon(process.env.DATABASE_URL!);

// Helper function to map database row to Car object
function mapDbRowToCar(row: any): Car {
  return {
    id: row.id,
    title: row.title,
    brand: row.brand,
    model: row.model,
    year: row.year,
    category: row.category,
    dailyRate: parseFloat(row.dailyrate || row.dailyRate || 0),
    monthlyRate: parseFloat(row.monthlyrate || row.monthlyRate || 0),
    location: row.location,
    imageUrl: row.imageurl || row.imageUrl || "",
    isPremium: Boolean(row.ispremium || row.isPremium),
    availableForRent: Boolean(row.availableforrent || row.availableForRent),
    status: row.status,
    createdAt: row.createdat || row.createdAt,
    updatedAt: row.updatedat || row.updatedAt,
  };
}

export async function getAllCars(
  options: PaginationOptions = {}
): Promise<PaginatedResult> {
  try {
    const { page = 1, limit = 10, search = "", status = "" } = options;

    const offset = (page - 1) * limit;

    let whereClause = "";
    const conditions = [];

    if (search) {
      conditions.push(
        `(title ILIKE '%${search}%' OR brand ILIKE '%${search}%' OR model ILIKE '%${search}%')`
      );
    }

    if (status) {
      conditions.push(`status = '${status}'`);
    }

    if (conditions.length > 0) {
      whereClause = `WHERE ${conditions.join(" AND ")}`;
    }

    // Get total count for pagination
    const totalResult = await sql`
      SELECT COUNT(*) as count 
      FROM cars 
      ${sql.unsafe(whereClause)}
    `;
    const total = Number.parseInt(totalResult[0].count);

    const cars = await sql`
      SELECT * FROM cars 
      ${sql.unsafe(whereClause)}
      ORDER BY createdAt DESC 
      LIMIT ${limit} OFFSET ${offset}
    `;

    // Map database rows to Car objects. Becuase we get string as a type for numbers
    const processedCars = cars.map(mapDbRowToCar);

    const totalPages = Math.ceil(total / limit);

    return {
      cars: processedCars,
      pagination: {
        page,
        limit,
        total,
        totalPages,
      },
    };
  } catch (error) {
    console.error("Error fetching cars:", error);
    throw new Error("Failed to fetch cars");
  }
}

export async function getCarById(id: number): Promise<Car | null> {
  try {
    const cars = await sql`
      SELECT * FROM cars 
      WHERE id = ${id}
      LIMIT 1
    `;

    if (cars.length === 0) return null;

    return mapDbRowToCar(cars[0]);
  } catch (error) {
    console.error("Error fetching car:", error);
    throw new Error("Failed to fetch car");
  }
}

export async function updateCar(
  id: number,
  data: Partial<Car>
): Promise<Car | null> {
  try {
    const updatedCars = await sql`
      UPDATE cars 
      SET 
        title = ${data.title},
        brand = ${data.brand},
        model = ${data.model},
        year = ${data.year},
        category = ${data.category},
        dailyRate = ${data.dailyRate},
        monthlyRate = ${data.monthlyRate},
        location = ${data.location},
        imageUrl = ${data.imageUrl},
        isPremium = ${data.isPremium ? 1 : 0},
        availableForRent = ${data.availableForRent ? 1 : 0},
        status = ${data.status},
        updatedAt = NOW()
      WHERE id = ${id}
      RETURNING *
    `;

    if (updatedCars.length === 0) return null;

    return mapDbRowToCar(updatedCars[0]);
  } catch (error) {
    console.error("Error updating car:", error);
    throw new Error("Failed to update car");
  }
}

export async function createCar(
  data: Omit<Car, "id" | "createdAt" | "updatedAt">
): Promise<Car> {
  try {
    const newCars = await sql`
      INSERT INTO cars (
        title, brand, model, year, category,
        dailyRate, monthlyRate, location, imageUrl,
        isPremium, availableForRent, status
      ) VALUES (
        ${data.title}, ${data.brand}, ${data.model}, ${data.year}, ${
      data.category
    },
        ${data.dailyRate}, ${data.monthlyRate}, ${data.location}, ${
      data.imageUrl
    },
        ${data.isPremium ? 1 : 0}, ${data.availableForRent ? 1 : 0}, ${
      data.status
    }
      )
      RETURNING *
    `;

    return mapDbRowToCar(newCars[0]);
  } catch (error) {
    console.error("Error creating car:", error);
    throw new Error("Failed to create car");
  }
}

export async function deleteCar(id: number): Promise<boolean> {
  try {
    const result = await sql`
      DELETE FROM cars 
      WHERE id = ${id}
    `;

    return result.length > 0;
  } catch (error) {
    console.error("Error deleting car:", error);
    throw new Error("Failed to delete car");
  }
}
