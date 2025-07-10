import { MobileSidebar, Sidebar } from "@/components/dashboard/sidebar";
import { Metadata } from "next";
import type React from "react";

export const metadata: Metadata = {
  title: "Dashboard - OneClickDrive",
  description: "OneClickDrive dashboard for managing your driving experience",
  keywords: ["dashboard", "driving", "oneclickdrive", "car management"],
  authors: [{ name: "OneClickDrive" }],
  creator: "OneClickDrive",
  publisher: "OneClickDrive",
  robots: {
    index: false,
    follow: false,
  },
};

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="h-full md:h-screen flex w-full">
      <div className="hidden md:block">
        <Sidebar />
      </div>

      {/* Main content */}
      <div className="flex-1 md:pl-56 lg:pl-64 flex flex-col w-full">
        <div className="flex h-16 items-center gap-x-4 border-b border-gray-200 bg-white px-4 shadow-sm sm:gap-x-6 sm:px-6 lg:px-8 dark:border-gray-800 dark:bg-gray-900 flex-shrink-0">
          <div className="flex flex-1 items-center gap-x-4 self-stretch lg:gap-x-6">
            <div className="flex items-center gap-x-4 lg:gap-x-6">
              <div className="md:hidden">
                <MobileSidebar />
              </div>
              <div className="hidden lg:block lg:h-6 lg:w-px lg:bg-gray-200 dark:lg:bg-gray-800" />
            </div>

            <div className="flex flex-1 justify-end">
              <div className="flex items-center gap-x-4 lg:gap-x-6">
                <div className="hidden lg:block lg:h-6 lg:w-px lg:bg-gray-200 dark:lg:bg-gray-800" />
              </div>
            </div>
          </div>
        </div>

        <main className="flex-1 min-h-0 w-full p-4">{children}</main>
      </div>
    </div>
  );
}
