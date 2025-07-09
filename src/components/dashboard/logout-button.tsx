"use client";
import React from "react";
import { Button } from "../ui/button";
import { LogOut } from "lucide-react";
import { logoutAction } from "@/lib/auth-actions";

export default function LogoutButton() {
  return (
    <Button
      onClick={async () => {
        console.log("logout clicked");
        await logoutAction();
      }}
      variant="ghost"
      size="sm"
      className="w-full justify-start"
    >
      <LogOut className="h-4 w-4 mr-2" />
      Logout
    </Button>
  );
}
