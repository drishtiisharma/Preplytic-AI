"use client";

import { useEffect, useState } from "react";
import { useRouter, usePathname } from "next/navigation";

export function AuthWrapper({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();
  const [isChecking, setIsChecking] = useState(true);

  useEffect(() => {
    const isLoggedIn = localStorage.getItem("isLoggedIn");
    
    // Only redirect if they are not logged in and not already on the login page
    if (!isLoggedIn && pathname !== "/login") {
      router.replace("/login");
    } else {
      setIsChecking(false);
    }
  }, [pathname, router]);

  if (isChecking) {
    return null; // or a loading spinner
  }

  return <>{children}</>;
}