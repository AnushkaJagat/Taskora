"use client";

import { CheckCircle2 } from "lucide-react";
import { useRouter } from "next/navigation";

export default function LoginPage() {
  const router = useRouter();

  const handleGuestLogin = () => {
    // Store simple guest login state
    localStorage.setItem("taskora-user", "guest");

    // Go to Tasks page
    router.push("/tasks");
  };

  return (
    <main className="theme-bg theme-text flex min-h-screen items-center justify-center px-4 transition-colors duration-200">

      {/* Login Container */}
      <div className="w-full max-w-md">

        {/* Logo */}
        <div className="mb-8 flex flex-col items-center">

          <div
            className="theme-accent-bg flex h-12 w-12 items-center justify-center rounded-xl text-white shadow-sm"
          >
            <CheckCircle2 size={26} strokeWidth={2.2} />
          </div>

          <h1 className="mt-3 text-xl font-semibold">
            Taskora
          </h1>

          <p className="theme-text-secondary mt-1 text-sm">
            Stay organized. Get things done.
          </p>

        </div>

        {/* Login Card */}
        <div className="theme-surface theme-border rounded-2xl border p-6 shadow-sm">

          {/* Heading */}
          <div className="mb-6 text-center">

            <h2 className="text-xl font-semibold">
              Let&apos;s get back on track
            </h2>

            <p className="theme-text-secondary mt-2 text-sm">
              Choose how you want to continue.
            </p>

          </div>

          {/* Guest Login */}
          <button
            type="button"
            onClick={handleGuestLogin}
            className="theme-accent-bg flex w-full items-center justify-center rounded-lg px-4 py-3 text-sm font-medium text-white transition-opacity hover:opacity-90"
          >
            Continue as Guest
          </button>

          {/* Divider */}
          <div className="my-5 flex items-center gap-3">

            <div className="theme-border h-px flex-1 border-t" />

            <span className="theme-text-secondary text-xs">
              OR
            </span>

            <div className="theme-border h-px flex-1 border-t" />

          </div>

          {/* Sign In */}
          <button
           type="button"
           onClick={() => router.push("/auth")}
           className="theme-border theme-text flex w-full items-center justify-center rounded-lg border px-4 py-3 text-sm font-medium transition-colors hover:bg-gray-50 dark:hover:bg-[#8f8d8d]">
            
            Sign in / Create an account
            </button>

          {/* Terms */}
          <p className="theme-text-secondary mt-6 text-center text-xs leading-5">
            By continuing, you agree to our{" "}
            <span className="underline">
              Terms of Service
            </span>{" "}
            and{" "}
            <span className="underline">
              Privacy Policy
            </span>
            .
          </p>

        </div>

      </div>

    </main>
  );
}