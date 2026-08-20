"use client";

import { useEffect, useState } from "react";
import { ArrowLeft, CheckCircle2 } from "lucide-react";
import { useRouter } from "next/navigation";

export default function ProfilePage() {
  const router = useRouter();

  const [user, setUser] = useState(null);
  const [name, setName] = useState("");
  const [username, setUsername] = useState("");
  const [title, setTitle] = useState("");

  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  // Get current logged-in user
  const getCurrentUser = () => {
    const storedUser = localStorage.getItem("taskora-user");

    if (!storedUser || storedUser === "guest") {
      return null;
    }

    try {
      return JSON.parse(storedUser);
    } catch {
      return null;
    }
  };

  // Load profile
  useEffect(() => {
    const loadProfile = async () => {
      try {
        const currentUser = getCurrentUser();

        if (!currentUser?.id && !currentUser?._id) {
          setError("Please sign in to view your profile.");
          setIsLoading(false);
          return;
        }

        const userId = currentUser.id || currentUser._id;

        const response = await fetch(
          `http://localhost:3004/auth/profile/${userId}`
        );

        const data = await response.json();

        if (!response.ok) {
          throw new Error(
            data.message || "Unable to load profile"
          );
        }

        setUser(data);
        setName(data.name || "");
        setUsername(data.username || "");
        setTitle(data.title || "");
      } catch (error) {
        console.error("Profile loading error:", error);
        setError(
          error.message || "Unable to load your profile."
        );
      } finally {
        setIsLoading(false);
      }
    };

    loadProfile();
  }, []);

  // Save profile
  const handleSave = async (event) => {
    event.preventDefault();

    setError("");
    setSuccess("");
    setIsSaving(true);

    try {
      if (!user?._id && !user?.id) {
        throw new Error("Unable to identify your account.");
      }

      const userId = user._id || user.id;

      const response = await fetch(
        `http://localhost:3004/auth/profile/${userId}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            name,
            username,
            title,
          }),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.message || "Unable to update profile"
        );
      }

      setUser(data);

      // Keep localStorage user information updated
      const storedUser = JSON.parse(
        localStorage.getItem("taskora-user")
      );

      localStorage.setItem(
        "taskora-user",
        JSON.stringify({
          ...storedUser,
          id: data._id || data.id,
          name: data.name,
          email: data.email,
          username: data.username,
          title: data.title,
        })
      );

      setSuccess("Profile updated successfully.");
    } catch (error) {
      console.error("Profile update error:", error);
      setError(
        error.message || "Unable to update your profile."
      );
    } finally {
      setIsSaving(false);
    }
  };

  if (isLoading) {
    return (
      <main className="theme-bg theme-text flex min-h-screen items-center justify-center">
        <p className="theme-text-secondary text-sm">
          Loading profile...
        </p>
      </main>
    );
  }

  return (
    <main className="theme-bg theme-text min-h-screen px-4 py-8">

      <div className="mx-auto w-full max-w-2xl">

        {/* Back */}
        <button
          type="button"
          onClick={() => router.push("/tasks")}
          className="theme-text-secondary mb-8 flex items-center gap-2 text-sm hover:opacity-70"
        >
          <ArrowLeft size={16} />
          Back to Tasks
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
            Manage your profile
          </p>

        </div>

        {/* Profile Card */}
        <div className="theme-surface theme-border rounded-2xl border p-6 shadow-sm">

          <div className="mb-6">
            <h2 className="text-xl font-semibold">
              Profile
            </h2>

            <p className="theme-text-secondary mt-1 text-sm">
              Update your personal information.
            </p>
          </div>

          {/* Error */}
          {error && (
            <div className="mb-4 rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-600">
              {error}
            </div>
          )}

          {/* Success */}
          {success && (
            <div className="mb-4 rounded-lg border border-green-200 bg-green-50 px-3 py-2 text-sm text-green-600">
              {success}
            </div>
          )}

          <form
            onSubmit={handleSave}
            className="space-y-5"
          >

            {/* Name */}
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
                className="theme-bg theme-border theme-text w-full rounded-lg border px-3 py-2.5 text-sm outline-none focus:border-[var(--accent)]"
              />
            </div>

            {/* Email */}
            <div>
              <label className="mb-1 block text-sm font-medium">
                Email
              </label>

              <input
                type="email"
                value={user?.email || ""}
                disabled
                className="theme-bg theme-border theme-text-secondary w-full rounded-lg border px-3 py-2.5 text-sm opacity-70"
              />

              <p className="theme-text-secondary mt-1 text-xs">
                Email cannot be changed.
              </p>
            </div>

            {/* Username */}
            <div>
              <label className="mb-1 block text-sm font-medium">
                Username
              </label>

              <input
                type="text"
                value={username}
                onChange={(event) =>
                  setUsername(event.target.value)
                }
                placeholder="Enter username"
                className="theme-bg theme-border theme-text w-full rounded-lg border px-3 py-2.5 text-sm outline-none focus:border-[var(--accent)]"
              />
            </div>

            {/* Title */}
            <div>
              <label className="mb-1 block text-sm font-medium">
                Title
              </label>

              <input
                type="text"
                value={title}
                onChange={(event) =>
                  setTitle(event.target.value)
                }
                placeholder="Workspace member"
                className="theme-bg theme-border theme-text w-full rounded-lg border px-3 py-2.5 text-sm outline-none focus:border-[var(--accent)]"
              />
            </div>

            {/* Save */}
            <div className="flex justify-end pt-2">
              <button
                type="submit"
                disabled={isSaving}
                className="theme-accent-bg rounded-lg px-5 py-2.5 text-sm font-medium text-white transition-opacity hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-60"
              >
                {isSaving
                  ? "Saving..."
                  : "Save Changes"}
              </button>
            </div>

          </form>

        </div>

      </div>

    </main>
  );
}