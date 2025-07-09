"use client";

import type React from "react";

import { useEffect, useState } from "react";
import { useRouter, usePathname } from "next/navigation";
import { Loader2 } from "lucide-react";
import { getSession } from "@/lib/auth-actions";

interface WithAuthOptions {
  requireAuth?: boolean; // true for protected routes, false for public routes like login
  redirectTo?: string; // where to redirect if auth check fails
}

export function withAuth<P extends object>(
  WrappedComponent: React.ComponentType<P>,
  options: WithAuthOptions = {}
) {
  const {
    requireAuth = true,
    redirectTo = requireAuth ? "/login" : "/dashboard",
  } = options;

  return function AuthenticatedComponent(props: P) {
    const router = useRouter();
    const pathname = usePathname();
    const [isLoading, setIsLoading] = useState(true);
    const [isAuthenticated, setIsAuthenticated] = useState(false);

    useEffect(() => {
      const checkAuth = async () => {
        const session = await getSession();
        console.log(session);

        const hasSession = !!session;

        setIsAuthenticated(hasSession);

        if (requireAuth && !hasSession) {
          // Protected route but no session - redirect to login
          console.log("No session found, redirecting to login");
          router.push(redirectTo);
          return;
        }

        if (!requireAuth && hasSession) {
          // Public route (like login) but user is authenticated - redirect to dashboard
          console.log("User already authenticated, redirecting to dashboard");
          router.push(redirectTo);
          return;
        }

        setIsLoading(false);
      };

      checkAuth();
    }, [router, pathname, requireAuth, redirectTo]);

    // loading while checking authentication
    if (isLoading) {
      return (
        <div className="min-h-screen flex items-center justify-center">
          <div className="flex flex-col items-center gap-4">
            <Loader2 className="h-8 w-8 animate-spin" />
            <p className="text-muted-foreground">Checking authentication...</p>
          </div>
        </div>
      );
    }

    if (requireAuth && !isAuthenticated) {
      return null;
    }

    if (!requireAuth && isAuthenticated) {
      return null;
    }

    return <WrappedComponent {...props} />;
  };
}

export function withProtectedRoute<P extends object>(
  WrappedComponent: React.ComponentType<P>
) {
  return withAuth(WrappedComponent, {
    requireAuth: true,
    redirectTo: "/login",
  });
}

export function withPublicRoute<P extends object>(
  WrappedComponent: React.ComponentType<P>
) {
  return withAuth(WrappedComponent, {
    requireAuth: false,
    redirectTo: "/dashboard",
  });
}
