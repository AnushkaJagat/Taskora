"use client";

import { useEffect, useState } from "react";
import { ArrowLeft, CalendarDays } from "lucide-react";
import { useParams, useRouter } from "next/navigation";

import Sidebar from "../../../components/layout/Sidebar";

const getPriorityClass = (priority) => {
  if (priority === "Urgent") {
    return "text-red-600";
  }

  if (priority === "High") {
    return "text-red-500";
  }

  if (priority === "Medium") {
    return "text-orange-500";
  }

  return "text-gray-400";
};

const getStatusLabel = (status) => {
  if (status === "doing") {
    return "Doing";
  }

  if (status === "completed") {
    return "Completed";
  }

  return "To Do";
};

export default function ProjectDetailPage() {

  const params = useParams();
  const router = useRouter();
  const projectId = params.id;
  const [project, setProject] = useState(null);
  const [tasks, setTasks] = useState([]);
  const [isLoading, setIsLoading] =useState(true);
  const [error, setError] = useState("");

  // =========================
  // CURRENT USER
  // =========================

  const getCurrentUserId = () => {
    const storedUser =
      localStorage.getItem("taskora-user");

    if (
      storedUser &&
      storedUser !== "guest"
    ) {
      try {
        const user =
          JSON.parse(storedUser);

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

    let guestId =
      localStorage.getItem(
        "taskora-guest-id"
      );

    if (!guestId) {
      guestId = `guest-${crypto.randomUUID()}`;

      localStorage.setItem(
        "taskora-guest-id",
        guestId
      );
    }

    return guestId;
  };

  // =========================
  // FETCH PROJECT + TASKS
  // =========================

  useEffect(() => {
    const fetchProjectDetails =
      async () => {
        try {
          setIsLoading(true);
          setError("");

          const userId =
            getCurrentUserId();

          if (!userId) {
            throw new Error(
              "Unable to identify current user"
            );
          }

          // Fetch project
          const projectResponse =
            await fetch(
              `http://localhost:3004/projects/${projectId}?userId=${encodeURIComponent(
                userId
              )}`,
              {
                cache: "no-store",
              }
            );

          if (!projectResponse.ok) {
            throw new Error(
              "Failed to fetch project"
            );
          }

          const projectData =
            await projectResponse.json();

          // Fetch tasks belonging
          // to this project
          const tasksResponse =
            await fetch(
              `http://localhost:3004/tasks/project/${projectId}?userId=${encodeURIComponent(
                userId
              )}`,
              {
                cache: "no-store",
              }
            );

          if (!tasksResponse.ok) {
            throw new Error(
              "Failed to fetch project tasks"
            );
          }

          const tasksData =
            await tasksResponse.json();

          setProject(projectData);

          setTasks(
            Array.isArray(tasksData)
              ? tasksData
              : []
          );
        } catch (error) {
          console.error(
            "Error loading project details:",
            error
          );

          setError(
            "Unable to load project details."
          );
        } finally {
          setIsLoading(false);
        }
      };

    if (projectId) {
      fetchProjectDetails();
    }
  }, [projectId]);

  // =========================
  // LOADING
  // =========================

  if (isLoading) {
    return (
      <div className="flex min-h-screen theme-bg theme-text">
        <Sidebar />

        <main className="flex-1 p-8">
          <p className="text-sm theme-text-secondary">
            Loading project...
          </p>
        </main>
      </div>
    );
  }

  // =========================
  // ERROR
  // =========================

  if (error || !project) {
    return (
      <div className="flex min-h-screen theme-bg theme-text">
        <Sidebar />

        <main className="flex-1 p-8">
          <button
            type="button"
            onClick={() =>
              router.push("/projects")
            }
            className="mb-6 flex items-center gap-2 text-sm theme-text-secondary hover:theme-text"
          >
            <ArrowLeft size={17} />
            Back to Projects
          </button>

          <p className="text-sm text-red-500">
            {error ||
              "Project not found."}
          </p>
        </main>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen theme-bg theme-text">

      {/* Sidebar */}
      <Sidebar />

      {/* Main Content */}
      <main className="flex-1 p-8">

        {/* Back */}
        <button
          type="button"
          onClick={() =>
            router.push("/projects")
          }
          className="
            mb-6
            flex
            items-center
            gap-2
            text-sm
            theme-text-secondary
            transition
            hover:theme-text
          "
        >
          <ArrowLeft size={17} />
          Back to Projects
        </button>

        {/* Project Header */}
        <div className="mb-8">

          <div className="flex items-start justify-between gap-6">

            <div>
              <h1 className="text-2xl font-semibold theme-text">
                {project.name}
              </h1>

              {project.description && (
                <p className="mt-2 max-w-2xl text-sm leading-6 theme-text-secondary">
                  {project.description}
                </p>
              )}
            </div>

            {/* Status */}
            <span
              className={`
                rounded-full
                px-3
                py-1
                text-xs
                font-medium
                ${
                  project.status ===
                  "completed"
                    ? "bg-green-50 text-green-600"
                    : project.status ===
                      "in-progress"
                    ? "bg-blue-50 text-blue-600"
                    : "bg-orange-50 text-orange-600"
                }
              `}
            >
              {project.status ===
              "in-progress"
                ? "In Progress"
                : project.status ===
                  "completed"
                ? "Completed"
                : "Planning"}
            </span>
          </div>

          {/* Project Info */}
          <div className="mt-5 flex flex-wrap items-center gap-6">

            <div className="flex items-center gap-2 text-sm theme-text-secondary">
              <CalendarDays
                size={16}
              />

              <span>
                {project.dueDate ||
                  "No due date"}
              </span>
            </div>

            <div className="text-sm theme-text-secondary">
              {tasks.length}{" "}
              {tasks.length === 1
                ? "Task"
                : "Tasks"}
            </div>
          </div>
        </div>

        {/* Tasks */}
        <section>

          <div className="mb-3 flex items-center justify-between">
            <h2 className="text-lg font-semibold theme-text">
              Tasks
            </h2>

            <button
              type="button"
              onClick={() =>
                router.push("/tasks")
              }
              className="
                text-sm
                theme-text-secondary
                hover:theme-text
              "
            >
              View all tasks
            </button>
          </div>

          {tasks.length === 0 ? (
            <div
              className="
                rounded-lg
                border
                theme-border
                theme-surface
                p-8
                text-center
              "
            >
              <p className="text-sm theme-text-secondary">
                No tasks are attached to
                this project yet.
              </p>
            </div>
          ) : (
            <div
              className="
                overflow-hidden
                rounded-lg
                border
                theme-border
                theme-surface
              "
            >

              {/* Header */}
              <div
                className="
                  grid
                  grid-cols-[2fr_1fr_1fr_1fr]
                  border-b
                  theme-border
                  theme-surface-secondary
                  px-4
                  py-2.5
                  text-xs
                  font-medium
                  theme-text-secondary
                "
              >
                <span>Task</span>
                <span>Priority</span>
                <span>Status</span>
                <span>Due Date</span>
              </div>

              {/* Task rows */}
              {tasks.map((task) => (
                <div
                  key={task._id}
                  className="
                    grid
                    grid-cols-[2fr_1fr_1fr_1fr]
                    items-center
                    border-b
                    theme-border
                    px-4
                    py-3
                    text-sm
                    last:border-b-0
                  "
                >
                  <span className="theme-text">
                    {task.title}
                  </span>

                  <span
                    className={getPriorityClass(
                      task.priority
                    )}
                  >
                    {task.priority}
                  </span>

                  <span className="theme-text-secondary">
                    {getStatusLabel(
                      task.status
                    )}
                  </span>

                  <span className="theme-text-secondary">
                    {task.dueDate &&
                    task.dueDate !==
                      "No due date"
                      ? task.dueDate
                      : "No due date"}
                  </span>
                </div>
              ))}
            </div>
          )}
        </section>
      </main>
    </div>
  );
}