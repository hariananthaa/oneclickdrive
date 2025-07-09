import { getSession } from "@/lib/auth-actions";
import React from "react";

export default async function UserSection() {
  const session = await getSession();
  console.log(session);

  return (
    <div className="flex items-center gap-3 mb-3">
      <div className="h-8 w-8 rounded-full bg-primary flex items-center justify-center">
        <span className="text-sm font-medium text-primary-foreground">A</span>
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-sm font-medium">{session?.name}</p>
        <p className="text-xs text-muted-foreground truncate">
          {session?.email}
        </p>
      </div>
    </div>
  );
}
