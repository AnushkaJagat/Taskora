"use client";

import { CheckCircle2, ArrowLeft } from "lucide-react";
import { useState } from "react";
import { useRouter } from "next/navigation";

export default function AuthPage() {
  const router = useRouter();

  const [mode, setMode] = useState("login");

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (event) => {
    event.preventDefault();

    setError("");
    setLoading(true);

    try {
      const endpoint =
        mode === "login"
          ? "http://localhost:3004/auth/login"
          : "http://localhost:3004/auth/register";

      const body =
        mode === "login"
          ? {
              email,
              password,
            }
          : {
              name,
              email,
              password,
            };

      const response = await fetch(endpoint, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(body),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.message || "Something went wrong"
        );
      }

      // Save logged-in user
      localStorage.setItem(
        "taskora-user",
        JSON.stringify(data)
      );

      // Go to tasks
      router.push("/tasks");
    } catch (error) {
      console.error(error);
      setError(
        error.message ||
          "Unable to connect to the server."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="theme-bg theme-text flex min-h-screen items-center justify-center px-4 transition-colors duration-200">

      <div className="w-full max-w-md">

        {/* Back */}
        <button
          type="button"
          onClick={() => router.push("/login")}
          className="theme-text-secondary mb-6 flex items-center gap-2 text-sm hover:opacity-70"
        >
          <ArrowLeft size={16} />
          Back
        </button>

        {/* Logo */}
        <div className="mb-8 flex flex-col items-center">

          <div className="theme-accent-bg flex h-12 w-12 items-center justify-center rounded-xl text-white shadow-sm">
            <CheckCircle2
              size={26}
              strokeWidth={2.2}
            />
          </div>

          <h1 className="mt-3 text-xl font-semibold">
            Taskora
          </h1>

          <p className="theme-text-secondary mt-1 text-sm">
            Stay organized. Get things done.
          </p>

        </div>

        {/* Card */}
        <div className="theme-surface theme-border rounded-2xl border p-6 shadow-sm">

          {/* Heading */}
          <div className="mb-6 text-center">

            <h2 className="text-xl font-semibold">
              {mode === "login"
                ? "Welcome back"
                : "Create your account"}
            </h2>

            <p className="theme-text-secondary mt-2 text-sm">
              {mode === "login"
                ? "Sign in to continue to Taskora."
                : "Create an account to get started."}
            </p>

          </div>

          {/* Error */}
          {error && (
            <div className="mb-4 rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-600">
              {error}
            </div>
          )}

          <form
            onSubmit={handleSubmit}
            className="space-y-4"
          >

            {/* Name - Register only */}
            {mode === "register" && (
              <div>
                <label className="mb-1 block text-sm font-medium">
                  Name
                </label>

                <input
                  type="text"
                  value={name}
                  onChange={(event) =>
                    setName(event.target.value)
                  }
                  placeholder="Enter your name"
                  required
                  className="theme-bg theme-border theme-text w-full rounded-lg border px-3 py-2.5 text-sm outline-none focus:border-[var(--accent)]"
                />
              </div>
            )}

            {/* Email */}
            <div>
              <label className="mb-1 block text-sm font-medium">
                Email
              </label>

              <input
                type="email"
                value={email}
                onChange={(event) =>
                  setEmail(event.target.value)
                }
                placeholder="Enter your email"
                required
                className="theme-bg theme-border theme-text w-full rounded-lg border px-3 py-2.5 text-sm outline-none focus:border-[var(--accent)]"
              />
            </div>

            {/* Password */}
            <div>
              <label className="mb-1 block text-sm font-medium">
                Password
              </label>

              <input
                type="password"
                value={password}
                onChange={(event) =>
                  setPassword(event.target.value)
                }
                placeholder="Enter your password"
                required
                minLength={6}
                className="theme-bg theme-border theme-text w-full rounded-lg border px-3 py-2.5 text-sm outline-none focus:border-[var(--accent)]"
              />
            </div>

            {/* Submit */}
            <button
              type="submit"
              disabled={loading}
              className="theme-accent-bg flex w-full items-center justify-center rounded-lg px-4 py-3 text-sm font-medium text-white transition-opacity hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {loading
                ? "Please wait..."
                : mode === "login"
                ? "Sign In"
                : "Create Account"}
            </button>

          </form>

          {/* Switch */}
          <div className="theme-text-secondary mt-6 text-center text-sm">

            {mode === "login" ? (
              <>
                Don&apos;t have an account?{" "}
                <button
                  type="button"
                  onClick={() => {
                    setMode("register");
                    setError("");
                  }}
                  className="theme-accent font-medium hover:underline"
                >
                  Create an account
                </button>
              </>
            ) : (
              <>
                Already have an account?{" "}
                <button
                  type="button"
                  onClick={() => {
                    setMode("login");
                    setError("");
                  }}
                  className="theme-accent font-medium hover:underline"
                >
                  Sign in
                </button>
              </>
            )}

          </div>

        </div>

      </div>

    </main>
  );
}