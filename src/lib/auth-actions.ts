"use server";

import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { z } from "zod";

const LoginSchema = z.object({
  email: z.string().email("Invalid email address"),
  password: z.string().min(1, "Password is required"),
});

export interface User {
  email: string;
  name: string;
}

const MOCK_USERS = [
  { email: "admin@example.com", password: "admin123", name: "Admin User" },
  {
    email: "manager@example.com",
    password: "manager123",
    name: "Manager User",
  },
];

export async function loginAction(prevState: any, formData: FormData) {
  const validatedFields = LoginSchema.safeParse({
    email: formData.get("email"),
    password: formData.get("password"),
  });

  console.log(validatedFields);

  if (!validatedFields.success) {
    return {
      errors: validatedFields.error.flatten().fieldErrors,
      message: "Invalid fields. Please check your input.",
    };
  }

  const { email, password } = validatedFields.data;

  // Simulate delay
  await new Promise((resolve) => setTimeout(resolve, 3000));

  const user = MOCK_USERS.find(
    (u) => u.email === email && u.password === password
  );

  if (!user) {
    return {
      message: "Invalid email or password. Please try again.",
    };
  }

  // Creating session
  const cookieStore = await cookies();
  const sessionData = {
    email: user.email,
    name: user.name,
    isLoggedIn: true,
  };

  // 1 week
  cookieStore.set("session", JSON.stringify(sessionData), {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    maxAge: 60 * 60 * 24 * 7,
  });

  redirect("/dashboard");
}

export async function logoutAction() {
  const cookieStore = await cookies();
  cookieStore.delete("session");
  redirect("/login");
}

export async function getSession(): Promise<User | null> {
  const cookieStore = await cookies();
  const session = cookieStore.get("session");

  if (!session) {
    return null;
  }

  try {
    const sessionData = JSON.parse(session.value);
    if (sessionData.isLoggedIn) {
      return {
        email: sessionData.email,
        name: sessionData.name,
      };
    }
  } catch (error) {
    console.log(error);
    return null;
  }

  return null;
}
