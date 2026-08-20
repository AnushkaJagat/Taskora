"use client";

import { useState } from "react";
import { X } from "lucide-react";

export default function AddProjectModal({
  onClose,
  onAddProject,
  editProject = null,
  onUpdateProject,
}) {
  const [name, setName] = useState(
    editProject?.name || ""
  );

  const [description, setDescription] = useState(
    editProject?.description || ""
  );

  const [status, setStatus] = useState(
    editProject?.status || "planning"
  );

  const [dueDate, setDueDate] = useState(
    editProject?.dueDate || ""
  );

  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState("");

  // Get current user ID
  const getCurrentUserId = () => {
    const storedUser =
      localStorage.getItem("taskora-user");

    // Registered user
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

  const handleSubmit = async (e) => {
    e.preventDefault();

    setError("");

    if (!name.trim()) {
      setError("Project name is required.");
      return;
    }

    try {
      setIsSaving(true);

      const userId = getCurrentUserId();

      if (!userId) {
        throw new Error(
          "Unable to identify current user"
        );
      }

      const projectData = {
        name: name.trim(),
        description: description.trim(),
        status,
        dueDate,
        userId,
      };

      // EDIT PROJECT
      if (editProject) {
        const response = await fetch(
          `http://localhost:3004/projects/${editProject.id}?userId=${encodeURIComponent(
            userId
          )}`,
          {
            method: "PATCH",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              name: projectData.name,
              description:
                projectData.description,
              status: projectData.status,
              dueDate: projectData.dueDate,
            }),
          }
        );

        if (!response.ok) {
          throw new Error(
            "Failed to update project"
          );
        }

        const updatedProject =
          await response.json();

        onUpdateProject?.(updatedProject);
      }

      // CREATE PROJECT
      else {
        const response = await fetch(
          "http://localhost:3004/projects",
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify(projectData),
          }
        );

        if (!response.ok) {
          const data =
            await response.json().catch(
              () => null
            );

          throw new Error(
            data?.message ||
              "Failed to create project"
          );
        }

        const newProject =
          await response.json();

        onAddProject?.(newProject);
      }

      onClose();
    } catch (error) {
      console.error(
        "Error saving project:",
        error
      );

      setError(
        error.message ||
          "Unable to save project. Please try again."
      );
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div
      className="
        fixed
        inset-0
        z-50
        flex
        items-center
        justify-center
        bg-black/40
        px-4
      "
    >
      <div
        className="
          w-full
          max-w-lg
          rounded-xl
          border
          theme-border
          theme-surface
          shadow-xl
        "
      >
        {/* Header */}
        <div
          className="
            flex
            items-center
            justify-between
            border-b
            theme-border
            px-5
            py-4
          "
        >
          <h2 className="text-lg font-semibold theme-text">
            {editProject
              ? "Edit Project"
              : "Create Project"}
          </h2>

          <button
            type="button"
            onClick={onClose}
            className="
              rounded-md
              p-1
              theme-text-secondary
              transition
              hover:bg-black/5
              dark:hover:bg-white/10
            "
            aria-label="Close"
          >
            <X size={19} />
          </button>
        </div>

        {/* Form */}
        <form
          onSubmit={handleSubmit}
          className="space-y-4 p-5"
        >
          {/* Project Name */}
          <div>
            <label
              className="
                mb-1.5
                block
                text-sm
                font-medium
                theme-text
              "
            >
              Project name
            </label>

            <input
              type="text"
              value={name}
              onChange={(e) =>
                setName(e.target.value)
              }
              placeholder="Enter project name"
              className="
                w-full
                rounded-lg
                border
                theme-border
                theme-surface
                px-3
                py-2.5
                text-sm
                theme-text
                outline-none
                focus:ring-1
                focus:ring-gray-400
              "
            />
          </div>

          {/* Description */}
          <div>
            <label
              className="
                mb-1.5
                block
                text-sm
                font-medium
                theme-text
              "
            >
              Description
            </label>

            <textarea
              value={description}
              onChange={(e) =>
                setDescription(
                  e.target.value
                )
              }
              placeholder="Add a short description"
              rows={3}
              className="
                w-full
                resize-none
                rounded-lg
                border
                theme-border
                theme-surface
                px-3
                py-2.5
                text-sm
                theme-text
                outline-none
                focus:ring-1
                focus:ring-gray-400
              "
            />
          </div>

          {/* Status */}
          <div>
            <label
              className="
                mb-1.5
                block
                text-sm
                font-medium
                theme-text
              "
            >
              Status
            </label>

            <select
              value={status}
              onChange={(e) =>
                setStatus(e.target.value)
              }
              className="
                w-full
                rounded-lg
                border
                theme-border
                theme-surface
                px-3
                py-2.5
                text-sm
                theme-text
                outline-none
              "
            >
              <option value="planning">
                Planning
              </option>

              <option value="in-progress">
                In Progress
              </option>

              <option value="completed">
                Completed
              </option>
            </select>
          </div>

          {/* Due Date */}
          <div>
            <label
              className="
                mb-1.5
                block
                text-sm
                font-medium
                theme-text
              "
            >
              Due date
            </label>

            <input
              type="date"
              value={dueDate}
              onChange={(e) =>
                setDueDate(e.target.value)
              }
              className="
                w-full
                rounded-lg
                border
                theme-border
                theme-surface
                px-3
                py-2.5
                text-sm
                theme-text
                outline-none
              "
            />
          </div>

          {/* Error */}
          {error && (
            <p className="text-sm text-red-500">
              {error}
            </p>
          )}

          {/* Buttons */}
          <div
            className="
              flex
              justify-end
              gap-2
              pt-2
            "
          >
            <button
              type="button"
              onClick={onClose}
              disabled={isSaving}
              className="
                rounded-lg
                border
                theme-border
                px-4
                py-2
                text-sm
                theme-text
                transition
                hover:bg-black/5
                dark:hover:bg-white/10
                disabled:opacity-50
              "
            >
              Cancel
            </button>

            <button
              type="submit"
              disabled={isSaving}
              className="
                rounded-lg
                bg-black
                px-4
                py-2
                text-sm
                font-medium
                text-white
                transition
                hover:bg-gray-800
                disabled:cursor-not-allowed
                disabled:opacity-50
              "
            >
              {isSaving
                ? "Saving..."
                : editProject
                ? "Save Changes"
                : "Create Project"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}