"use client";

import API_URL from "@/lib/api";
import { ChevronDown, ChevronRight, MoreHorizontal, Plus, Pencil, Trash2,} from "lucide-react";
import { useState } from "react";

const getStatusLabel = (status) => {
  if (status === "in-progress") {
    return "In Progress";
  }

  if (status === "completed") {
    return "Completed";
  }

  return "Planning";
};

const getStatusClass = (status) => {
  if (status === "completed") {
    return "text-green-600";
  }

  if (status === "in-progress") {
    return "text-blue-600";
  }

  return "text-orange-500";
};

export default function ProjectSection({ title, projects, onDeleteProject, onEditProject, onAddProject, onProjectClick, visibleFields,}) {
  
  const [isOpen, setIsOpen] = useState(true);
  const [openMenuId, setOpenMenuId] = useState(null);
  const [deletingId, setDeletingId] = useState(null);

  const getGridColumns = () => {
    const columns = [];

    if (visibleFields?.project !== false) {
      columns.push("2fr");
    }

    if (visibleFields?.status !== false) {
      columns.push("1fr");
    }

    if (visibleFields?.tasks !== false) {
      columns.push("1fr");
    }

    if (visibleFields?.dueDate !== false) {
      columns.push("1fr");
    }

    columns.push("40px");

    return columns.join(" ");
  };

  const gridColumns = getGridColumns();

  const handleDelete = async (projectId) => {
    const confirmed = window.confirm(
      "Are you sure you want to delete this project?"
    );

    if (!confirmed) {
      setOpenMenuId(null);
      return;
    }

    try {
      setDeletingId(projectId);

      const storedUser =
        localStorage.getItem("taskora-user");

      let userId = null;

      if (
        storedUser &&
        storedUser !== "guest"
      ) {
        try {
          const user = JSON.parse(storedUser);

          if (user?.id) {
            userId = String(user.id);
          } else if (user?._id) {
            userId = String(user._id);
          }
        } catch {
          userId = null;
        }
      }

      if (!userId) {
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

        userId = guestId;
      }

      const response = await fetch(
        `${API_URL}/projects/${projectId}?userId=${encodeURIComponent(
          userId
        )}`,
        {
          method: "DELETE",
        }
      );

      if (!response.ok) {
        throw new Error(
          "Failed to delete project"
        );
      }

      onDeleteProject?.(projectId);
      setOpenMenuId(null);
    } catch (error) {
      console.error(
        "Error deleting project:",
        error
      );

      alert(
        "Unable to delete project. Please try again."
      );
    } finally {
      setDeletingId(null);
    }
  };

  const handleEdit = (project) => {
    setOpenMenuId(null);
    onEditProject?.(project);
  };

  const handleProjectClick = (project) => {
    onProjectClick?.(project);
  };

  return (
    <section className="mb-6">

      {/* Section Header */}
      <button
        type="button"
        onClick={() =>
          setIsOpen(!isOpen)
        }
        className=" mb-2 flex items-center gap-1 text-sm font-medium theme-text
        "
      >
        {isOpen ? (
          <ChevronDown
            size={15}
            strokeWidth={2}
          />
        ) : (
          <ChevronRight
            size={15}
            strokeWidth={2}
          />
        )}

        {title}
      </button>

      {isOpen && (
        <div
          className=" overflow-visible rounded-lg border theme-border theme-surface
          "
        >

          {/* Table Header */}
          <div
            className=" grid border-b theme-border theme-surface-secondary px-3 py-2 text-xs font-medium theme-text-secondary
            "
            style={{
              gridTemplateColumns:
                gridColumns,
            }}
          >
            {visibleFields?.project !==
              false && (
              <span>Project</span>
            )}

            {visibleFields?.status !==
              false && (
              <span>Status</span>
            )}

            {visibleFields?.tasks !==
              false && (
              <span>Tasks</span>
            )}

            {visibleFields?.dueDate !==
              false && (
              <span>Due Date</span>
            )}

            <span></span>
          </div>

          {/* Projects */}
          {projects.map((project) => (
            <div
              key={project.id}
              className=" grid items-center border-b theme-border px-3 py-3 text-sm last:border-b-0
              "
              style={{
                gridTemplateColumns:
                  gridColumns,
              }}
            >

              {/* Project */}
              {visibleFields?.project !==
                false && (
                <div>

                  <button
                    type="button"
                    onClick={() =>
                      handleProjectClick(
                        project
                      )
                    }
                    className=" text-left font-medium theme-text hover:underline
                    "
                  >
                    {project.name}
                  </button>

                  {project.description && (
                    <p className="mt-0.5 truncate pr-4 text-xs theme-text-secondary">
                      {project.description}
                    </p>
                  )}

                </div>
              )}

              {/* Status */}
              {visibleFields?.status !==
                false && (
                <span
                  className={getStatusClass(
                    project.status
                  )}
                >
                  {getStatusLabel(
                    project.status
                  )}
                </span>
              )}

              {/* Tasks */}
              {visibleFields?.tasks !==
                false && (
                <span className="theme-text-secondary">
                  {project.taskCount || 0}{" "}
                  {project.taskCount === 1
                    ? "Task"
                    : "Tasks"}
                </span>
              )}

              {/* Due Date */}
              {visibleFields?.dueDate !==
                false && (
                <span className="theme-text-secondary">
                  {project.dueDate ||
                    "No due date"}
                </span>
              )}

              {/* Actions */}
              <div className="relative flex items-center justify-center">

                <button
                  type="button"
                  onClick={() =>
                    setOpenMenuId(
                      openMenuId ===
                        project.id
                        ? null
                        : project.id
                    )
                  }
                  className=" flex items-center justify-center rounded-md p-1 theme-text-secondary hover:bg-black/5 dark:hover:bg-white/10
                  "
                  aria-label="Project actions"
                >
                  <MoreHorizontal
                    size={17}
                  />
                </button>

                {openMenuId ===
                  project.id && (
                  <div
                    className=" absolute right-0 top-8 z-20 w-36 rounded-lg border theme-border theme-surface py-1 shadow-lg
                    "
                  >

                    {/* Edit */}
                    <button
                      type="button"
                      onClick={() =>
                        handleEdit(project)
                      }
                      className=" flex w-full items-center gap-2 px-3 py-2 text-left text-sm theme-text hover:bg-black/5 dark:hover:bg-white/10
                      "
                    >
                      <Pencil size={15} />
                      Edit
                    </button>

                    {/* Delete */}
                    <button
                      type="button"
                      onClick={() =>handleDelete( project.id)
                      }
                      disabled={ deletingId === project.id}
                      className=" flex w-full items-center gap-2 px-3 py-2 text-left text-sm text-red-600 hover:bg-red-50 disabled:opacity-50
                      "
                    >
                      <Trash2 size={15} />

                      {deletingId ===
                      project.id
                        ? "Deleting..."
                        : "Delete"}
                    </button>

                  </div>
                )}

              </div>
            </div>
          ))}

          {/* Add Project */}
          <button
            type="button"
            onClick={() =>
              onAddProject?.()
            }
            className=" flex w-full items-center gap-2 px-3 py-2 text-left text-sm theme-text-secondary transition hover:bg-black/5 dark:hover:bg-white/10
            "
          >
            <Plus size={15} />
            Add Project
          </button>

        </div>
      )}
    </section>
  );
}