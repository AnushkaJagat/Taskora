"use client";

import API_URL from "@/lib/api";
import { X } from "lucide-react";
import { useEffect, useState } from "react";

export default function AddTaskModal({ onClose, onAddTask, editTask = null, onUpdateTask,}) {

  const isEditing = Boolean(editTask);
  const [title, setTitle] = useState("");

  const [priority, setPriority] = useState(() => {
    if (typeof window !== "undefined") {
      return (
        localStorage.getItem(
          "taskora-default-priority"
        ) || "Medium"
      );
    }

    return "Medium";
  });

  const [dueDate, setDueDate] = useState("");
  const [status, setStatus] = useState("todo");

  // Project
  const [projectId, setProjectId] = useState("");

  const [projects, setProjects] = useState([]);
  const [loadingProjects, setLoadingProjects] =
    useState(false);

  const [isLoading, setIsLoading] =
    useState(false);

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

    // Guest user
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
  // PRIORITY CLASS
  // =========================

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

  // =========================
  // FETCH PROJECTS
  // =========================

  useEffect(() => {
    const fetchProjects = async () => {
      try {
        setLoadingProjects(true);

        const userId =
          getCurrentUserId();

        if (!userId) {
          return;
        }

        const response = await fetch(
          `${API_URL}/projects?userId=${encodeURIComponent(
            userId
          )}`,
          {
            cache: "no-store",
          }
        );

        if (!response.ok) {
          throw new Error(
            "Failed to fetch projects"
          );
        }

        const data =
          await response.json();

        setProjects(data);
      } catch (error) {
        console.error(
          "Error fetching projects:",
          error
        );
      } finally {
        setLoadingProjects(false);
      }
    };

    fetchProjects();
  }, []);

  // =========================
  // LOAD EDIT TASK
  // =========================

  useEffect(() => {
    if (editTask) {
      setTitle(editTask.title || "");

      setPriority(
        editTask.priority || "Medium"
      );

      setStatus(
        editTask.status || "todo"
      );

      setDueDate(
        editTask.dueDate &&
          editTask.dueDate !==
            "No due date"
          ? editTask.dueDate
          : ""
      );

      setProjectId(
        editTask.projectId || ""
      );
    } else {
      setTitle("");

      setPriority(
        localStorage.getItem(
          "taskora-default-priority"
        ) || "Medium"
      );

      setStatus("todo");

      setDueDate("");

      setProjectId("");
    }

    setError("");
  }, [editTask]);

  // =========================
  // SUBMIT
  // =========================

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!title.trim()) {
      setError(
        "Please enter a task name."
      );
      return;
    }

    const userId =
      getCurrentUserId();

    if (!userId) {
      setError(
        "Unable to identify the current user."
      );
      return;
    }

    setError("");
    setIsLoading(true);

    const taskData = {
      title: title.trim(),
      priority,
      status,
      dueDate:
        dueDate || "No due date",
      member:
        editTask?.member || "+",

      // Project relationship
      projectId: projectId || null,
    };

    // Only add userId when creating
    if (!isEditing) {
      taskData.userId = userId;
    }

    try {
      const url = isEditing
        ? `${API_URL}/tasks/${editTask.id}?userId=${encodeURIComponent(
            userId
          )}`
        : `${API_URL}/tasks`;

      const response = await fetch(
        url,
        {
          method: isEditing
            ? "PATCH"
            : "POST",

          headers: {
            "Content-Type":
              "application/json",
          },

          body: JSON.stringify(
            taskData
          ),
        }
      );

      if (!response.ok) {
        throw new Error(
          isEditing
            ? "Failed to update task"
            : "Failed to create task"
        );
      }

      const savedTask =
        await response.json();

      const formattedTask = {
        id: savedTask._id,
        title: savedTask.title,
        priority:
          savedTask.priority,

        priorityClass:
          getPriorityClass(
            savedTask.priority
          ),

        member:
          savedTask.member || "+",

        dueDate:
          savedTask.dueDate ||
          "No due date",

        status:
          savedTask.status,

        // Keep project ID
        projectId:
          savedTask.projectId ||
          null,
      };

      if (isEditing) {
        onUpdateTask(
          formattedTask
        );
      } else {
        onAddTask(
          formattedTask
        );
      }

      onClose();
    } catch (error) {
      console.error(
        isEditing
          ? "Error updating task:"
          : "Error creating task:",
        error
      );

      setError(
        isEditing
          ? "Unable to update task. Please try again."
          : "Unable to create task. Please try again."
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30 px-4">

      <div className="w-full max-w-md rounded-xl border border-gray-200 bg-white p-6 shadow-xl">

        {/* Header */}
        <div className="mb-6 flex items-center justify-between">

          <h2 className="text-lg font-semibold text-gray-900">
            {isEditing
              ? "Edit Task"
              : "Add Task"}
          </h2>

          <button
            type="button"
            onClick={onClose}
            disabled={isLoading}
            className="rounded-lg p-1 text-gray-500 hover:bg-gray-100 hover:text-gray-900 disabled:opacity-50"
            aria-label="Close"
          >
            <X size={18} />
          </button>

        </div>

        <form
          onSubmit={handleSubmit}
          className="space-y-4"
        >

          {/* Task name */}
          <div>

            <label className="mb-1 block text-sm font-medium text-gray-700">
              Task name
            </label>

            <input
              type="text"
              value={title}
              onChange={(event) =>
                setTitle(
                  event.target.value
                )
              }
              placeholder="Enter task name"
              disabled={isLoading}
              className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm text-gray-900 placeholder:text-gray-400 outline-none focus:border-gray-400"
            />

          </div>

          {/* Priority */}
          <div>

            <label className="mb-1 block text-sm font-medium text-gray-700">
              Priority
            </label>

            <select
              value={priority}
              onChange={(event) =>
                setPriority(
                  event.target.value
                )
              }
              disabled={isLoading}
              className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm text-gray-900 outline-none focus:border-gray-400"
            >
              <option value="Urgent">
                Urgent
              </option>

              <option value="High">
                High
              </option>

              <option value="Medium">
                Medium
              </option>

              <option value="Low">
                Low
              </option>
            </select>

          </div>

          {/* Status */}
          <div>

            <label className="mb-1 block text-sm font-medium text-gray-700">
              Status
            </label>

            <select
              value={status}
              onChange={(event) =>
                setStatus(
                  event.target.value
                )
              }
              disabled={isLoading}
              className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm text-gray-900 outline-none focus:border-gray-400"
            >
              <option value="todo">
                To Do
              </option>

              <option value="doing">
                Doing
              </option>

              <option value="completed">
                Completed
              </option>
            </select>

          </div>

          {/* Project */}
          <div>

            <label className="mb-1 block text-sm font-medium text-gray-700">
              Project
            </label>

            <select
              value={projectId}
              onChange={(event) =>
                setProjectId(
                  event.target.value
                )
              }
              disabled={
                isLoading ||
                loadingProjects
              }
              className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm text-gray-900 outline-none focus:border-gray-400"
            >

              <option value="">
                No Project
              </option>

              {projects.map(
                (project) => (
                  <option
                    key={project._id}
                    value={project._id}
                  >
                    {project.name}
                  </option>
                )
              )}

            </select>

          </div>

          {/* Due date */}
          <div>

            <label className="mb-1 block text-sm font-medium text-gray-700">
              Due date
            </label>

            <input
              type="date"
              value={dueDate}
              onChange={(event) =>
                setDueDate(
                  event.target.value
                )
              }
              disabled={isLoading}
              className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm text-gray-900 outline-none focus:border-gray-400"
            />

          </div>

          {/* Error */}
          {error && (
            <p className="text-sm text-red-500">
              {error}
            </p>
          )}

          {/* Buttons */}
          <div className="flex justify-end gap-2 pt-3">

            <button
              type="button"
              onClick={onClose}
              disabled={isLoading}
              className="rounded-lg border border-gray-200 px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 disabled:opacity-50"
            >
              Cancel
            </button>

            <button
              type="submit"
              disabled={isLoading}
              className="rounded-lg bg-black px-4 py-2 text-sm font-medium text-white hover:bg-gray-800 disabled:cursor-not-allowed disabled:opacity-50"
            >
              {isLoading
                ? isEditing
                  ? "Saving..."
                  : "Creating..."
                : isEditing
                ? "Save Changes"
                : "Create Task"}
            </button>

          </div>

        </form>

      </div>

    </div>
  );
}