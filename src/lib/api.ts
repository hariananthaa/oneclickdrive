import type { Car } from "./database";

// const API_BASE_URL = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";

export class ApiError extends Error {
  constructor(message: string, public status: number, public errors?: any[]) {
    super(message);
    this.name = "ApiError";
  }
}

export async function updateCarApi(carId: string, data: Partial<Car>) {
  const response = await fetch(`/api/cars/${carId}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  });

  const result = await response.json();

  if (!response.ok) {
    throw new ApiError(
      result.message || "Failed to update car",
      response.status,
      result.errors
    );
  }

  return result;
}

export async function getCarApi(carId: string) {
  const response = await fetch(`/api/cars/${carId}`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
  });

  const result = await response.json();

  if (!response.ok) {
    throw new ApiError(
      result.message || "Failed to fetch car",
      response.status
    );
  }

  return result;
}

export async function getCarsApi() {
  const response = await fetch(`/api/cars`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
  });

  const result = await response.json();

  if (!response.ok) {
    throw new ApiError(
      result.message || "Failed to fetch cars",
      response.status
    );
  }

  return result;
}
