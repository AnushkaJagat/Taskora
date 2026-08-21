"use client";

import API_URL from "@/lib/api";
import { useEffect, useState } from "react";
import Link from "next/link";
import { CheckCircle2, Circle, Clock3, FolderKanban, ListTodo, ArrowRight,} from "lucide-react";
import Sidebar from "../../components/layout/Sidebar";

const getPriorityClass = (priority) => {
  if (priority === "Urgent") return "text-red-600";
  if (priority === "High") return "text-red-500";
  if (priority === "Medium") return "text-orange-500";
  return "text-gray-400";
};

const getCurrentUserId = () => {
  const storedUser = localStorage.getItem("taskora-user");

  if (storedUser && storedUser !== "guest") {
    try {
      const user = JSON.parse(storedUser);

      if (user?.id) {
        return String(user.id);
      }

      if (user?._id) {
        return String(user._id);
      }
    } catch {
      return null;
    }
  }

  let guestId = localStorage.getItem("taskora-guest-id");

  if (!guestId) {
    guestId = `guest-${crypto.randomUUID()}`;
    localStorage.setItem("taskora-guest-id", guestId);
  }

  return guestId;
};

export default function DashboardPage() {
  const [tasks, setTasks] = useState([]);
  const [projects, setProjects] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        setIsLoading(true);
        setError("");

        const userId = getCurrentUserId();

        if (!userId) {
          throw new Error("Unable to identify current user");
        }

        const encodedUserId = encodeURIComponent(userId);

        const [tasksResponse, projectsResponse] =
          await Promise.all([
            fetch(
              `${API_URL}/tasks?userId=${encodedUserId}`,
              {
                cache: "no-store",
              }
            ),

            fetch(
              `${API_URL}/projects?userId=${encodedUserId}`,
              {
                cache: "no-store",
              }
            ),
          ]);

        if (!tasksResponse.ok) {
          throw new Error("Failed to fetch tasks");
        }

        if (!projectsResponse.ok) {
          throw new Error("Failed to fetch projects");
        }

        const tasksData = await tasksResponse.json();
        const projectsData = await projectsResponse.json();

        setTasks(tasksData);
        setProjects(projectsData);
      } catch (error) {
        console.error(
          "Error loading dashboard:",
          error
        );

        setError(
          "Unable to load dashboard data."
        );
      } finally {
        setIsLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  // =========================
  // TASK COUNTS
  // =========================

  const totalTasks = tasks.length;

  const todoTasks = tasks.filter(
    (task) => task.status === "todo"
  ).length;

  const doingTasks = tasks.filter(
    (task) => task.status === "doing"
  ).length;

  const completedTasks = tasks.filter(
    (task) => task.status === "completed"
  ).length;

  // =========================
  // PROJECT COUNTS
  // =========================

  const totalProjects = projects.length;

  const activeProjects = projects.filter(
    (project) =>
      project.status !== "completed"
  ).length;

  const completedProjects = projects.filter(
    (project) =>
      project.status === "completed"
  ).length;

  // =========================
  // RECENT TASKS
  // =========================

  const recentTasks = [...tasks]
    .sort(
      (a, b) =>
        new Date(b.createdAt) -
        new Date(a.createdAt)
    )
    .slice(0, 5);

  // =========================
  // UPCOMING TASKS
  // =========================

  const upcomingTasks = [...tasks]
    .filter(
      (task) =>
        task.dueDate &&
        task.dueDate !== "No due date"
    )
    .sort(
      (a, b) =>
        new Date(a.dueDate) -
        new Date(b.dueDate)
    )
    .slice(0, 5);

  return (
    <div className="flex min-h-screen theme-bg theme-text">
      {/* Sidebar */}
      <Sidebar />

      {/* Main Content */}
      <main className=" min-w-0 flex-1 overflow-x-hidden p-4 pt-24 sm:p-6 sm:pt-24 md:p-8 md:pt-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-2xl font-semibold theme-text">
            Dashboard
          </h1>

          <p className="mt-1 text-sm theme-text-secondary">
            Here's what's happening in your workspace.
          </p>
        </div>

        {/* Error */}
        {error && (
          <div className="mb-6 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-600">
            {error}
          </div>
        )}

        {/* Loading */}
        {isLoading ? (
          <div className="mt-10 text-sm theme-text-secondary">
            Loading dashboard...
          </div>
        ) : (
          <>
            {/* =========================
                STAT CARDS
            ========================= */}

            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
              {/* Total Tasks */}
              <div className="rounded-xl border theme-border theme-surface p-5">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm theme-text-secondary">
                      Total Tasks
                    </p>

                    <p className="mt-2 text-3xl font-semibold theme-text">
                      {totalTasks}
                    </p>
                  </div>

                  <div className="rounded-lg bg-gray-100 p-3">
                    <ListTodo
                      size={20}
                      className="text-gray-700"
                    />
                  </div>
                </div>
              </div>

              {/* In Progress */}
              <div className="rounded-xl border theme-border theme-surface p-5">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm theme-text-secondary">
                      In Progress
                    </p>

                    <p className="mt-2 text-3xl font-semibold theme-text">
                      {doingTasks}
                    </p>
                  </div>

                  <div className="rounded-lg bg-gray-100 p-3">
                    <Clock3
                      size={20}
                      className="text-gray-700"
                    />
                  </div>
                </div>
              </div>

              {/* Completed */}
              <div className="rounded-xl border theme-border theme-surface p-5">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm theme-text-secondary">
                      Completed
                    </p>

                    <p className="mt-2 text-3xl font-semibold theme-text">
                      {completedTasks}
                    </p>
                  </div>

                  <div className="rounded-lg bg-gray-100 p-3">
                    <CheckCircle2
                      size={20}
                      className="text-gray-700"
                    />
                  </div>
                </div>
              </div>

              {/* Active Projects */}
              <div className="rounded-xl border theme-border theme-surface p-5">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm theme-text-secondary">
                      Active Projects
                    </p>

                    <p className="mt-2 text-3xl font-semibold theme-text">
                      {activeProjects}
                    </p>
                  </div>

                  <div className="rounded-lg bg-gray-100 p-3">
                    <FolderKanban
                      size={20}
                      className="text-gray-700"
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* =========================
                MAIN GRID
            ========================= */}

            <div className="mt-8 grid grid-cols-1 gap-6 lg:grid-cols-2">
              {/* Recent Tasks */}
              <section className="rounded-xl border theme-border theme-surface">
                <div className="flex items-center justify-between border-b theme-border px-5 py-4">
                  <div>
                    <h2 className="font-semibold theme-text">
                      Recent Tasks
                    </h2>

                    <p className="mt-1 text-xs theme-text-secondary">
                      Your latest tasks
                    </p>
                  </div>

                  <Link
                    href="/tasks"
                    className="flex items-center gap-1 text-sm theme-text-secondary hover:theme-text"
                  >
                    View all
                    <ArrowRight size={15} />
                  </Link>
                </div>

                {recentTasks.length === 0 ? (
                  <div className="px-5 py-8 text-center text-sm theme-text-secondary">
                    No tasks yet.
                  </div>
                ) : (
                  <div>
                    {recentTasks.map((task) => (
                      <div
                        key={task._id}
                        className="flex items-center justify-between border-b theme-border px-5 py-4 last:border-b-0"
                      >
                        <div className="flex min-w-0 items-center gap-3">
                          {task.status === "completed" ? (
                            <CheckCircle2
                              size={18}
                              className="shrink-0 text-green-500"
                            />
                          ) : task.status === "doing" ? (
                            <Clock3
                              size={18}
                              className="shrink-0 text-orange-500"
                            />
                          ) : (
                            <Circle
                              size={18}
                              className="shrink-0 theme-text-secondary"
                            />
                          )}

                          <div className="min-w-0">
                            <p className="truncate text-sm theme-text">
                              {task.title}
                            </p>

                            <p className="mt-1 text-xs theme-text-secondary">
                              {task.status === "todo"
                                ? "To Do"
                                : task.status ===
                                  "doing"
                                ? "Doing"
                                : "Completed"}
                            </p>
                          </div>
                        </div>

                        <span
                          className={`ml-4 shrink-0 text-sm ${getPriorityClass(
                            task.priority
                          )}`}
                        >
                          {task.priority}
                        </span>
                      </div>
                    ))}
                  </div>
                )}
              </section>

              {/* Projects */}
              <section className="rounded-xl border theme-border theme-surface">
                <div className="flex items-center justify-between border-b theme-border px-5 py-4">
                  <div>
                    <h2 className="font-semibold theme-text">
                      Projects
                    </h2>

                    <p className="mt-1 text-xs theme-text-secondary">
                      Your workspace projects
                    </p>
                  </div>

                  <Link
                    href="/projects"
                    className="flex items-center gap-1 text-sm theme-text-secondary hover:theme-text"
                  >
                    View all
                    <ArrowRight size={15} />
                  </Link>
                </div>

                {projects.length === 0 ? (
                  <div className="px-5 py-8 text-center text-sm theme-text-secondary">
                    No projects yet.
                  </div>
                ) : (
                  <div>
                    {projects
                      .slice(0, 5)
                      .map((project) => (
                        <Link
                          key={project._id}
                          href={`/projects/${project._id}`}
                          className="flex items-center justify-between border-b theme-border px-5 py-4 transition hover:bg-black/5 dark:hover:bg-white/5 last:border-b-0"
                        >
                          <div className="min-w-0">
                            <p className="truncate text-sm theme-text">
                              {project.name}
                            </p>

                            <p className="mt-1 text-xs theme-text-secondary">
                              {project.status ===
                              "completed"
                                ? "Completed"
                                : project.status ===
                                  "in-progress"
                                ? "In Progress"
                                : "Planning"}
                            </p>
                          </div>

                          <ArrowRight
                            size={16}
                            className="shrink-0 theme-text-secondary"
                          />
                        </Link>
                      ))}
                  </div>
                )}
              </section>
            </div>

            {/* =========================
                UPCOMING TASKS
            ========================= */}

            <section className="mt-6 rounded-xl border theme-border theme-surface">
              <div className="flex items-center justify-between border-b theme-border px-5 py-4">
                <div>
                  <h2 className="font-semibold theme-text">
                    Upcoming Tasks
                  </h2>

                  <p className="mt-1 text-xs theme-text-secondary">
                    Tasks with upcoming deadlines
                  </p>
                </div>

                <Link
                  href="/tasks"
                  className="flex items-center gap-1 text-sm theme-text-secondary hover:theme-text"
                >
                  View all
                  <ArrowRight size={15} />
                </Link>
              </div>

              {upcomingTasks.length === 0 ? (
                <div className="px-5 py-8 text-center text-sm theme-text-secondary">
                  No upcoming deadlines.
                </div>
              ) : (
                <div>
                  {upcomingTasks.map((task) => (
                    <div
                      key={task._id}
                      className="grid grid-cols-[1fr_120px_120px] items-center gap-4 border-b theme-border px-5 py-4 text-sm last:border-b-0"
                    >
                      <div className="min-w-0">
                        <p className="truncate theme-text">
                          {task.title}
                        </p>
                      </div>

                      <span
                        className={getPriorityClass(
                          task.priority
                        )}
                      >
                        {task.priority}
                      </span>

                      <span className="theme-text-secondary">
                        {task.dueDate}
                      </span>
                    </div>
                  ))}
                </div>
              )}
            </section>

            {/* =========================
                SUMMARY
            ========================= */}

            <div className="mt-6 flex flex-wrap gap-4 text-sm theme-text-secondary">
              <span>
                {todoTasks} tasks waiting to be started
              </span>

              <span>•</span>

              <span>
                {doingTasks} tasks in progress
              </span>

              <span>•</span>

              <span>
                {completedProjects} completed projects
              </span>
            </div>
          </>
        )}
      </main>
    </div>
  );
}