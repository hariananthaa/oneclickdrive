import { config } from "dotenv";
import { neon } from "@neondatabase/serverless";
import sampleCars from "./data.js";

// Load environment variables
config({ path: ".env.development.local" });
config({ path: ".env.local" });

async function seedDatabase() {
  console.log("🔍 Checking DATABASE_URL...");

  if (!process.env.DATABASE_URL) {
    console.log("❌ DATABASE_URL not found");
    console.log("💡 Run: vercel env pull .env.development.local");
    return;
  }

  const sql = neon(process.env.DATABASE_URL);

  try {
    await sql`
      CREATE TABLE IF NOT EXISTS cars (
        id SERIAL PRIMARY KEY,
        title VARCHAR(255) NOT NULL,
        brand VARCHAR(100) NOT NULL,
        model VARCHAR(100) NOT NULL,
        year INTEGER NOT NULL,
        category VARCHAR(50) NOT NULL,
        dailyRate DECIMAL(10,2) NOT NULL,
        monthlyRate DECIMAL(10,2) NOT NULL,
        location VARCHAR(255) NOT NULL,
        imageUrl TEXT NOT NULL,
        isPremium BOOLEAN DEFAULT FALSE,
        availableForRent BOOLEAN DEFAULT TRUE,
        status VARCHAR(20) DEFAULT 'pending',
        createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `;

    const result = await sql`SELECT COUNT(*) as count FROM cars`;
    console.log(`Total cars in database: ${result[0].count}`);

    console.log(typeof result[0].count);

    if (result[0].count == 0) {
      for (const car of sampleCars) {
        await sql`
        INSERT INTO cars (
          title, brand, model, year, category,
          dailyRate, monthlyRate, location, imageUrl,
          isPremium, availableForRent, status
        ) VALUES (
          ${car.title}, ${car.brand}, ${car.model}, ${car.year}, ${car.category},
          ${car.dailyRate}, ${car.monthlyRate}, ${car.location}, ${car.imageUrl},
          ${car.isPremium}, ${car.availableForRent}, ${car.status}
        )
      `;
      }
    }
  } catch (error) {
    console.log("⚠️  Database setup failed:", error.message);
  }
}

seedDatabase();
