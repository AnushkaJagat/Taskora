"use client";

import API_URL from "@/lib/api";
import { ChevronDown, ChevronRight, MoreHorizontal, Plus, Pencil, Trash2,} from "lucide-react";
import { useEffect, useState } from "react";

export default function TaskSection({ title, tasks, onDeleteTask, onEditTask, onUpdateTask, onAddTask, visibleFields,}) {

  const [isOpen, setIsOpen] = useState(true);
  const [openMenuId, setOpenMenuId] = useState(null);
  const [deletingId, setDeletingId] = useState(null);
  const [openMemberId, setOpenMemberId] = useState(null);
  const [members, setMembers] = useState([]);
  const [loadingMembers, setLoadingMembers] = useState(false);
  const [assigningId, setAssigningId] = useState(null);

  // =========================
  // CURRENT USER
  // =========================

  const getCurrentUserId = () => {
    if (typeof window === "undefined") {
      return null;
    }

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
      } catch (error) {
        console.error(
          "Unable to read user:",
          error
        );

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
  // FETCH MEMBERS
  // =========================

  const fetchMembers = async () => {
    try {
      setLoadingMembers(true);

      const response = await fetch(
        `${API_URL}/auth/users`,
        {
          cache: "no-store",
        }
      );

      if (!response.ok) {
        throw new Error(
          "Failed to fetch members"
        );
      }

      const data = await response.json();

      setMembers(
        Array.isArray(data) ? data : []
      );
    } catch (error) {
      console.error(
        "Error fetching members:",
        error
      );
    } finally {
      setLoadingMembers(false);
    }
  };

  useEffect(() => {
    fetchMembers();
  }, []);

  // =========================
  // MEMBER DROPDOWN
  // =========================

  const handleMemberClick = async (taskId) => {
    if (openMemberId === taskId) {
      setOpenMemberId(null);
      return;
    }

    // Close task actions
    setOpenMenuId(null);

    setOpenMemberId(taskId);

    if (members.length === 0) {
      await fetchMembers();
    }
  };

  // =========================
  // GET MEMBER NAME
  // =========================

  const getMemberName = (memberId) => {
    if (!memberId || memberId === "+") {
      return "+";
    }

    const member = members.find((user) => {
      const databaseId = user?._id
        ? String(user._id)
        : user?.id
        ? String(user.id)
        : "";

      return (
        databaseId === String(memberId)
      );
    });

    return member?.name || "+";
  };

  // =========================
  // ASSIGN MEMBER
  // =========================

  const handleAssignMember = async (
    task,
    selectedUser
  ) => {
    try {
      setAssigningId(task.id);

      const userId =
        getCurrentUserId();

      if (!userId) {
        throw new Error(
          "Unable to identify current user"
        );
      }

      const selectedMemberId =
        selectedUser?._id ||
        selectedUser?.id;

      if (!selectedMemberId) {
        throw new Error(
          "Unable to identify selected member"
        );
      }

     const response = await fetch(
      `${API_URL}/tasks/${task.id}?userId=${encodeURIComponent(
         userId
      )}`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            member: String(
              selectedMemberId
            ),
          }),
        }
      );

      if (!response.ok) {
        throw new Error(
          "Failed to assign member"
        );
      }

      const updatedTask =
        await response.json();

      // IMPORTANT:
      // Update local React state immediately
      // with the same structure used by tasks/page.js.
      const priority =
        updatedTask.priority ||
        "Medium";

      let priorityClass =
        "text-gray-400";

      if (priority === "Urgent") {
        priorityClass =
          "text-red-600";
      } else if (priority === "High") {
        priorityClass =
          "text-red-500";
      } else if (
        priority === "Medium"
      ) {
        priorityClass =
          "text-orange-500";
      }

      const formattedTask = {
        id:
          updatedTask._id ||
          updatedTask.id,

        title:
          updatedTask.title,

        priority,

        priorityClass,

        member:
          updatedTask.member || "+",

        dueDate:
          updatedTask.dueDate ||
          "No due date",

        status:
          updatedTask.status ||
          "todo",

        projectId:
          updatedTask.projectId ||
          null,

        projectName:
          updatedTask.projectName ||
          "",
      };

      onUpdateTask?.(formattedTask);

      // Close dropdown immediately
      setOpenMemberId(null);
    } catch (error) {
      console.error(
        "Error assigning member:",
        error
      );

      alert(
        "Unable to assign member. Please try again."
      );
    } finally {
      setAssigningId(null);
    }
  };

  // =========================
  // REMOVE MEMBER
  // =========================

  const handleRemoveMember = async (
    task
  ) => {
    try {
      setAssigningId(task.id);

      const userId =
        getCurrentUserId();

      if (!userId) {
        throw new Error(
          "Unable to identify current user"
        );
      }

      const response = await fetch(
        `${API_URL}/tasks/${task.id}?userId=${encodeURIComponent(
          userId
        )}`,
        {
          method: "PATCH",
          headers: {
            "Content-Type":
              "application/json",
          },
          body: JSON.stringify({
            member: "",
          }),
        }
      );

      if (!response.ok) {
        throw new Error(
          "Failed to remove member"
        );
      }

      const updatedTask =
        await response.json();

      const priority =
        updatedTask.priority ||
        "Medium";

      let priorityClass =
        "text-gray-400";

      if (priority === "Urgent") {
        priorityClass =
          "text-red-600";
      } else if (priority === "High") {
        priorityClass =
          "text-red-500";
      } else if (
        priority === "Medium"
      ) {
        priorityClass =
          "text-orange-500";
      }

      const formattedTask = {
        id:
          updatedTask._id ||
          updatedTask.id,

        title:
          updatedTask.title,

        priority,

        priorityClass,

        member: "+",

        dueDate:
          updatedTask.dueDate ||
          "No due date",

        status:
          updatedTask.status ||
          "todo",

        projectId:
          updatedTask.projectId ||
          null,

        projectName:
          updatedTask.projectName ||
          "",
      };

      onUpdateTask?.(formattedTask);

      setOpenMemberId(null);
    } catch (error) {
      console.error(
        "Error removing member:",
        error
      );

      alert(
        "Unable to remove member. Please try again."
      );
    } finally {
      setAssigningId(null);
    }
  };

  // =========================
  // DELETE TASK
  // =========================

  const handleDelete = async (
    taskId
  ) => {
    const confirmed =
      window.confirm(
        "Are you sure you want to delete this task?"
      );

    if (!confirmed) {
      setOpenMenuId(null);
      return;
    }

    try {
      setDeletingId(taskId);

      const userId =
        getCurrentUserId();

      if (!userId) {
        throw new Error(
          "Unable to identify current user"
        );
      }

      const response = await fetch(
        `${API_URL}/tasks/${taskId}?userId=${encodeURIComponent(
          userId
        )}`,
        {
          method: "DELETE",
        }
      );

      if (!response.ok) {
        throw new Error(
          "Failed to delete task"
        );
      }

      onDeleteTask(taskId);

      setOpenMenuId(null);
    } catch (error) {
      console.error(
        "Error deleting task:",
        error
      );

      alert(
        "Unable to delete task. Please try again."
      );
    } finally {
      setDeletingId(null);
    }
  };

  // =========================
  // EDIT TASK
  // =========================

  const handleEdit = (task) => {
    setOpenMenuId(null);

    onEditTask?.(task);
  };

  // =========================
  // GRID COLUMNS
  // =========================

  const getGridColumns = () => {
    const columns = [];

    if (visibleFields?.task !== false) {
      columns.push("2fr");
    }

    if (
      visibleFields?.priority !== false
    ) {
      columns.push("1fr");
    }

    if (
      visibleFields?.members !== false
    ) {
      columns.push("1fr");
    }

    if (
      visibleFields?.dueDate !== false
    ) {
      columns.push("1fr");
    }

    columns.push("40px");

    return columns.join(" ");
  };

  const gridColumns =
    getGridColumns();

  return (
    <section className="mb-6">

      {/* =========================
          SECTION HEADER
      ========================= */}

      <button
        type="button"
        onClick={() =>
          setIsOpen(!isOpen)
        }
        className=" mb-2 flex items-center gap-1 text-sm font-medium theme-text">
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

      {/* =========================
          TABLE
      ========================= */}

      {isOpen && (
        <div
          className=" overflow-visible rounded-lg border theme-border theme-surface"
        >

          {/* TABLE HEADER */}

          <div
            className=" grid border-b theme-border theme-surface-secondary px-3 py-2 text-xs font-medium theme-text-secondary"
            style={{
              gridTemplateColumns:
                gridColumns,
            }}
          >
            {visibleFields?.task !==
              false && (
              <span>
                Task
              </span>
            )}

            {visibleFields?.priority !==
              false && (
              <span>
                Priority
              </span>
            )}

            {visibleFields?.members !==
              false && (
              <span>
                Members
              </span>
            )}

            {visibleFields?.dueDate !==
              false && (
              <span>
                Due Date
              </span>
            )}

            <span></span>
          </div>

          {/* TASKS */}

          {tasks.map((task) => (
            <div
              key={task.id}
              className=" relative grid items-center border-b theme-border px-3 py-3 text-sm last:border-b-0"
              style={{
                gridTemplateColumns:
                  gridColumns,
              }}
            >

              {/* TASK */}

              {visibleFields?.task !==
                false && (
                <span className="theme-text">
                  {task.title}
                </span>
              )}

              {/* PRIORITY */}

              {visibleFields?.priority !==
                false && (
                <span
                  className={
                    task.priorityClass ||
                    (
                      task.priority ===
                      "Urgent"
                        ? "text-red-600"
                        : task.priority ===
                          "High"
                        ? "text-red-500"
                        : task.priority ===
                          "Medium"
                        ? "text-orange-500"
                        : "text-gray-400"
                    )
                  }
                >
                  {task.priority}
                </span>
              )}

              {/* MEMBER */}

              {visibleFields?.members !==
                false && (
                <div className="relative">

                  <button
                    type="button"
                    onClick={() =>
                      handleMemberClick(
                        task.id
                      )
                    }
                    disabled={
                      assigningId ===
                      task.id
                    }
                    className=" rounded-md px-2 py-1 text-left theme-text-secondary hover:bg-black/5 dark:hover:bg-white/10 disabled:opacity-50"
                  >
                    {getMemberName(
                      task.member
                    )}
                  </button>

                  {/* MEMBER DROPDOWN */}

                  {openMemberId ===
                    task.id && (
                    <div
                      className="absoluteleft-0top-9z-50w-56rounded-lgbordertheme-bordertheme-surfacep-2shadow-lg"
                    >

                      <p
                        className=" px-2 py-1 text-xs font-medium theme-text-secondary"
                      >
                        Assign Member
                      </p>

                      {loadingMembers ? (
                        <p
                          className=" px-2 py-2 text-sm theme-text-secondary"
                        >
                          Loading members...
                        </p>
                      ) : members.length ===
                        0 ? (
                        <p
                          className=" px-2 py-2 text-sm theme-text-secondary"
                        >
                          No members found.
                        </p>
                      ) : (
                        <div
                          className=" max-h-48 overflow-y-auto "
                        >

                          {members.map(
                            (user) => (
                              <button
                                key={
                                  user._id ||
                                  user.id
                                }
                                type="button"
                                onClick={(
                                  event
                                ) => {
                                  event.preventDefault();
                                  event.stopPropagation();

                                  handleAssignMember(
                                    task,
                                    user
                                  );
                                }}
                                disabled={
                                  assigningId ===
                                  task.id
                                }
                                className=" flex w-full flex-col rounded-md px-2 py-2 text-left hover:bg-black/5 dark:hover:bg-white/10 disabled:opacity-50"
                              >
                                <span
                                  className=" text-sm theme-text"
                                >
                                  {
                                    user.name
                                  }
                                </span>

                                <span
                                  className=" text-xs theme-text-secondary "
                                >
                                  {
                                    user.email
                                  }
                                </span>
                              </button>
                            )
                          )}

                        </div>
                      )}

                      {/* REMOVE MEMBER */}

                      {task.member &&
                        task.member !==
                          "+" && (
                          <button
                            type="button"
                            onClick={() =>
                              handleRemoveMember(
                                task
                              )
                            }
                            disabled={
                              assigningId ===
                              task.id
                            }
                            className=" mt-1 w-full border-t theme-border px-2 pt-2 text-left text-xs text-red-600 hover:underline"
                          >
                            Remove member
                          </button>
                        )}

                    </div>
                  )}

                </div>
              )}

              {/* DUE DATE */}

              {visibleFields?.dueDate !==
                false && (
                <span className="theme-text-secondary">
                  {task.dueDate}
                </span>
              )}

              {/* ACTIONS */}

              <div
                className=" relative flex items-center justify-center"
              >

                <button
                  type="button"
                  onClick={() => {
                    setOpenMemberId(null);

                    setOpenMenuId(
                      openMenuId ===
                        task.id
                        ? null
                        : task.id
                    );
                  }}
                  className=" flex items-center justify-center rounded-md p-1 theme-text-secondary hover:bg-black/5 dark:hover:bg-white/10"
                  aria-label="Task actions"
                >
                  <MoreHorizontal
                    size={17}
                  />
                </button>

                {/* ACTION DROPDOWN */}

                {openMenuId ===
                  task.id && (
                  <div
                    className=" absolute right-0 top-8 z-50 w-36 rounded-lg border theme-border theme-surface py-1 shadow-lg"
                  >

                    {/* EDIT */}

                    <button
                      type="button"
                      onClick={() =>
                        handleEdit(task)
                      }
                      className=" flex w-full items-center gap-2 px-3 py-2 text-left text-sm theme-text hover:bg-black/5 dark:hover:bg-white/10"
                    >
                      <Pencil
                        size={15}
                      />

                      Edit
                    </button>

                    {/* DELETE */}

                    <button
                      type="button"
                      onClick={() =>
                        handleDelete(
                          task.id
                        )
                      }
                      disabled={
                        deletingId ===
                        task.id
                      }
                      className=" flex w-full items-center gap-2 px-3 py-2 text-left text-sm text-red-600 hover:bg-red-50 disabled:opacity-50"
                    >
                      <Trash2
                        size={15}
                      />

                      {deletingId ===
                      task.id
                        ? "Deleting..."
                        : "Delete"}
                    </button>

                  </div>
                )}

              </div>

            </div>
          ))}

          {/* ADD TASK */}

          <button
            type="button"
            onClick={() => {
              onAddTask?.();
            }}
            className=" flex w-full items-center gap-2 px-3 py-2 text-left text-sm theme-text-secondary transition hover:bg-black/5 dark:hover:bg-white/10"
          >
            <Plus size={15} />

            Add Task
          </button>

        </div>
      )}
    </section>
  );
}