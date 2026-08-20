"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function HomePage() {
  const router = useRouter();

  useEffect(() => {
    const storedUser = localStorage.getItem("taskora-user");

    if (storedUser) {
      router.replace("/dashboard");
    } else {
      router.replace("/login");
    }
  }, [router]);

  return null;
}