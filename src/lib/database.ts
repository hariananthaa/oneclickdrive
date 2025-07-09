import Database from "better-sqlite3";
import { z } from "zod";
import { sampleCars } from "./data";

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

// Initialize database
let db: Database.Database;

export function getDatabase() {
  if (!db) {
    // Temp Db
    db = new Database(":memory:");
    initializeDatabase();
  }
  return db;
}

function initializeDatabase() {
  // Create cars table
  db.exec(`
    CREATE TABLE IF NOT EXISTS cars (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      title TEXT NOT NULL,
      brand TEXT NOT NULL,
      model TEXT NOT NULL,
      year INTEGER NOT NULL,
      category TEXT NOT NULL,
      dailyRate REAL NOT NULL,
      monthlyRate REAL NOT NULL,
      location TEXT NOT NULL,
      imageUrl TEXT NOT NULL,
      isPremium BOOLEAN DEFAULT 0,
      availableForRent BOOLEAN DEFAULT 1,
      status TEXT DEFAULT 'pending',
      createdAt DATETIME DEFAULT CURRENT_TIMESTAMP,
      updatedAt DATETIME DEFAULT CURRENT_TIMESTAMP
    )
  `);

  const insertCar = db.prepare(`
    INSERT INTO cars (
      title, brand, model, year, category,
      dailyRate, monthlyRate, location, imageUrl,
      isPremium, availableForRent, status
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `);

  sampleCars.forEach((car) => {
    insertCar.run(
      car.title,
      car.brand,
      car.model,
      car.year,
      car.category,
      car.dailyRate,
      car.monthlyRate,
      car.location,
      car.imageUrl,
      car.isPremium ? 1 : 0,
      car.availableForRent ? 1 : 0,
      car.status
    );
  });
}
