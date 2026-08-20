"use client";

import {
  ArrowLeft,
  CheckCircle2,
  User,
  ListTodo,
  Info,
} from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export default function SettingsPage() {
  const router = useRouter();

  const [user, setUser] = useState(null);
  const [defaultPriority, setDefaultPriority] = useState("Medium");
  const [saved, setSaved] = useState(false);

  // Load current user
  useEffect(() => {
    const storedUser = localStorage.getItem("taskora-user");

    if (storedUser && storedUser !== "guest") {
      try {
        setUser(JSON.parse(storedUser));
      } catch {
        setUser(null);
      }
    }

    const storedPriority =
      localStorage.getItem("taskora-default-priority");

    if (storedPriority) {
      setDefaultPriority(storedPriority);
    }
  }, []);

  // Save task preference
  const handlePriorityChange = (event) => {
    const value = event.target.value;

    setDefaultPriority(value);
    localStorage.setItem(
      "taskora-default-priority",
      value
    );

    setSaved(true);

    setTimeout(() => {
      setSaved(false);
    }, 2000);
  };

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
            Manage your Taskora preferences.
          </p>

        </div>

        {/* Settings Card */}
        <div className="theme-surface theme-border rounded-2xl border shadow-sm">

          {/* Header */}
          <div className="border-b theme-border p-6">

            <h2 className="text-xl font-semibold">
              Settings
            </h2>

          </div>

          {/* Account */}
          <section className="border-b theme-border p-6">

            <div className="flex items-start gap-3">

              <div className="theme-surface-secondary flex h-9 w-9 shrink-0 items-center justify-center rounded-lg">
                <User size={18} />
              </div>

              <div className="flex-1">

                <h3 className="text-sm font-semibold">
                  Account
                </h3>

                <p className="theme-text-secondary mt-1 text-sm">
                  Manage your personal account information.
                </p>

              </div>

            </div>

            <div className="theme-surface-secondary mt-4 rounded-lg p-4">

              <div className="flex items-center justify-between">

                <div>
                  <p className="text-sm font-medium">
                    {user?.name || "Guest"}
                  </p>

                  <p className="theme-text-secondary mt-1 text-xs">
                    {user?.email || "Guest account"}
                  </p>
                </div>

                <button
                  type="button"
                  onClick={() => router.push("/profile")}
                  className="theme-accent-bg rounded-lg px-3 py-2 text-xs font-medium text-white hover:opacity-90"
                >
                  Edit Profile
                </button>

              </div>

            </div>

          </section>

          {/* Task Preferences */}
          <section className="border-b theme-border p-6">

            <div className="flex items-start gap-3">

              <div className="theme-surface-secondary flex h-9 w-9 shrink-0 items-center justify-center rounded-lg">
                <ListTodo size={18} />
              </div>

              <div className="flex-1">

                <h3 className="text-sm font-semibold">
                  Task Preferences
                </h3>

                <p className="theme-text-secondary mt-1 text-sm">
                  Choose your default task settings.
                </p>

              </div>

            </div>

            {/* Default Priority */}
            <div className="mt-5">

              <label className="mb-1 block text-sm font-medium">
                Default task priority
              </label>

              <select
                value={defaultPriority}
                onChange={handlePriorityChange}
                className="theme-bg theme-border theme-text w-full rounded-lg border px-3 py-2.5 text-sm outline-none focus:border-[var(--accent)]"
              >
                <option value="Urgent">Urgent</option>
                <option value="High">High</option>
                <option value="Medium">Medium</option>
                <option value="Low">Low</option>
              </select>

              <p className="theme-text-secondary mt-1 text-xs">
                This preference will be used when creating new tasks.
              </p>

              {saved && (
                <p className="mt-2 text-xs theme-accent">
                  Preference saved.
                </p>
              )}

            </div>

          </section>

          {/* Appearance Note */}
          <section className="border-b theme-border p-6">

            <div className="flex items-start gap-3">

              <div className="theme-surface-secondary flex h-9 w-9 shrink-0 items-center justify-center rounded-lg">
                <Info size={18} />
              </div>

              <div>

                <h3 className="text-sm font-semibold">
                  Appearance
                </h3>

                <p className="theme-text-secondary mt-1 text-sm">
                  Theme and color settings are available directly
                  from your profile menu for quick access.
                </p>

              </div>

            </div>

          </section>

          {/* App Information */}
          <section className="p-6">

            <h3 className="text-sm font-semibold">
              About Taskora
            </h3>

            <p className="theme-text-secondary mt-1 text-sm">
               Taskora helps you organize, manage, and track your work in one place.
            </p>

            <p className="theme-text-secondary mt-3 text-sm leading-6">
               Plan your tasks, set priorities, manage deadlines, and keep
               track of your progress without unnecessary complexity.
               Taskora is designed to keep your daily workflow simple,
               focused, and organized.
            </p>

            <p className="theme-text-secondary mt-4 text-xs">
              Taskora • Task Management System
            </p>

          </section>

        </div>

      </div>

    </main>
  );
}