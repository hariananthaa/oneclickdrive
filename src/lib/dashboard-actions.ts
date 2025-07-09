"use server";

import { z } from "zod";
import { editCarSchema } from "./schemas";

type ActionState = {
  success: boolean;
  message: string;
  errors?: z.ZodIssue[];
} | null;

export async function updateCar(
  prevState: ActionState,
  formData: FormData
): Promise<ActionState> {
  try {
    const carId = formData.get("id") as string;
    console.log("Updating car with ID:", carId);

    const data = {
      id: carId,
      title: formData.get("title") as string,
      brand: formData.get("brand") as string,
      model: formData.get("model") as string,
      year: Number.parseInt(formData.get("year") as string),
      category: formData.get("category") as string,
      dailyRate: Number.parseFloat(formData.get("dailyRate") as string),
      monthlyRate: Number.parseFloat(formData.get("monthlyRate") as string),
      location: formData.get("location") as string,
      status: formData.get("status") as "approved" | "pending" | "rejected",
      isPremium: formData.get("isPremium") === "true",
      availableForRent: formData.get("availableForRent") === "true",
    };

    console.log("Form data:", data);

    // Validate data using the edit schema
    const validatedData = editCarSchema.parse(data);
    // console.log("Validated data:", validatedData);

    // Make API call to your existing endpoint
    const apiUrl = `${
      process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000"
    }/api/cars/${carId}`;
    // console.log("Making API call to:", apiUrl);

    // console.log(
    //   JSON.stringify({
    //     title: validatedData.title,
    //     brand: validatedData.brand,
    //     model: validatedData.model,
    //     year: validatedData.year,
    //     category: validatedData.category,
    //     dailyRate: validatedData.dailyRate,
    //     monthlyRate: validatedData.monthlyRate,
    //     location: validatedData.location,
    //     imageUrl: "", // You can add image URL handling later
    //     isPremium: validatedData.isPremium,
    //     availableForRent: validatedData.availableForRent,
    //     status: validatedData.status,
    //   })
    // );

    const response = await fetch(apiUrl, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        title: validatedData.title,
        brand: validatedData.brand,
        model: validatedData.model,
        year: validatedData.year,
        category: validatedData.category,
        dailyRate: validatedData.dailyRate,
        monthlyRate: validatedData.monthlyRate,
        location: validatedData.location,
        imageUrl: "", // You can add image URL handling later
        isPremium: validatedData.isPremium,
        availableForRent: validatedData.availableForRent,
        status: validatedData.status,
      }),
    });

    // console.log("API response status:", response.status);

    if (!response.ok) {
      const errorData = await response.json();
      console.error("API error:", errorData);
      return {
        success: false,
        message: errorData.error || "Failed to update car",
        errors: errorData.details,
      };
    }

    const result = await response.json();
    console.log("API success result:", result);

    return {
      success: true,
      message: "Car updated successfully!",
    };
  } catch (error) {
    console.error("Server action error:", error);

    if (error instanceof z.ZodError) {
      return {
        success: false,
        message: "Validation failed",
        errors: error.errors,
      };
    }

    if (error instanceof TypeError && error.message.includes("fetch")) {
      return {
        success: false,
        message: "Network error. Please check your connection and try again.",
      };
    }

    return {
      success: false,
      message: "Failed to update car. Please try again.",
    };
  }
}
