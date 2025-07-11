import LoginForm from "@/components/auth/login-form";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Login",
  description: "Sign in to your OneClickDrive account to car renting services",
  keywords: [
    "login",
    "sign in",
    "oneclickdrive",
    "authentication",
    "account access",
  ],
  authors: [{ name: "OneClickDrive" }],
  creator: "OneClickDrive",
  publisher: "OneClickDrive",
  icons: "/images/ocd_app_icon.webp",
  robots: {
    index: true,
    follow: true,
  },
};

async function Page() {
  return (
    <div className="flex min-h-svh w-full items-center justify-center p-6 md:p-10">
      <div className="w-full max-w-sm">
        <LoginForm />
      </div>
    </div>
  );
}

export default Page;
