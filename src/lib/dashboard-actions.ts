"use server";

import { updateCar as updateCarInDb, CarSchema } from "@/lib/database";

interface ActionState {
  success?: boolean;
  message?: string;
  errors?: Record<string, string[]>;
}

export async function updateCar(
  prevState: ActionState | null,
  formData: FormData
): Promise<ActionState> {
  try {
    const id = formData.get("id");
    if (!id) {
      return { success: false, message: "Car ID is required" };
    }

    const carId = Number.parseInt(id.toString());
    if (isNaN(carId)) {
      return { success: false, message: "Invalid car ID" };
    }

    const rawData = {
      title: formData.get("title")?.toString() || "",
      brand: formData.get("brand")?.toString() || "",
      model: formData.get("model")?.toString() || "",
      year: Number.parseInt(formData.get("year")?.toString() || "0"),
      category: formData.get("category")?.toString() || "",
      dailyRate: Number.parseFloat(
        formData.get("dailyRate")?.toString() || "0"
      ),
      monthlyRate: Number.parseFloat(
        formData.get("monthlyRate")?.toString() || "0"
      ),
      location: formData.get("location")?.toString() || "",
      imageUrl: formData.get("imageUrl")?.toString() || "",
      isPremium: formData.get("isPremium") === "true",
      availableForRent: formData.get("availableForRent") === "true",
      status: formData.get("status")?.toString() || "pending",
    };

    console.log("Server action data:", rawData);

    const validationResult = CarSchema.safeParse(rawData);

    if (!validationResult.success) {
      const errors: Record<string, string[]> = {};
      validationResult.error.errors.forEach((error) => {
        const field = error.path[0]?.toString();
        if (field) {
          if (!errors[field]) errors[field] = [];
          errors[field].push(error.message);
        }
      });

      return {
        success: false,
        message: "Please fix the validation errors",
        errors,
      };
    }

    // Update the car in the database
    const updatedCar = await updateCarInDb(carId, validationResult.data);

    if (!updatedCar) {
      return {
        success: false,
        message: "Car not found or could not be updated",
      };
    }

    return {
      success: true,
      message: "Car updated successfully!",
    };
  } catch (error) {
    console.error("Error updating car:", error);
    return {
      success: false,
      message: "An unexpected error occurred. Please try again.",
    };
  }
}
