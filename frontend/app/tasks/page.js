"use client";

import API_URL from "@/lib/api";
import { useEffect, useState } from "react";
import Sidebar from "../../components/layout/Sidebar";
import TaskToolbar from "../../components/tasks/TaskToolbar";
import TaskSection from "../../components/tasks/TaskSection";
import AddTaskModal from "../../components/tasks/AddTaskModal";

export default function TasksPage() {
  // =========================
  // TASKS
  // =========================

  const [tasks, setTasks] = useState([]);

  const [isLoading, setIsLoading] =
    useState(true);

  const [error, setError] = useState("");

  // =========================
  // MODAL
  // =========================

  const [isTaskModalOpen, setIsTaskModalOpen] =
    useState(false);

  const [editTask, setEditTask] =
    useState(null);

  // =========================
  // SEARCH
  // =========================

  const [searchQuery, setSearchQuery] =
    useState("");

  // =========================
  // FILTER
  // =========================

  const [filters, setFilters] = useState({
    priority: "All",
    member: "All",
  });

  // =========================
  // FIELDS
  // =========================

  const [visibleFields, setVisibleFields] =
    useState({
      task: true,
      priority: true,
      members: true,
      dueDate: true,
    });

  // =========================
  // CURRENT USER
  // =========================

  const getCurrentUserId = () => {
    if (
      typeof window === "undefined"
    ) {
      return null;
    }

    const storedUser =
      localStorage.getItem(
        "taskora-user"
      );

    // Registered user
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
  // FORMAT TASK
  // =========================

  const formatTask = (task) => {
    const priority =
      task.priority || "Medium";

    let priorityClass =
      "text-gray-600";

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

    return {
      id: task._id || task.id,

      title: task.title,

      priority,

      priorityClass,

      member: task.member || "+",

      dueDate:
        task.dueDate || "No due date",

      status:
        task.status || "todo",

      projectId:
        task.projectId || null,

      projectName:
        task.projectName || "",
    };
  };

  // =========================
  // FETCH TASKS
  // =========================

  const fetchTasks = async () => {
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

      const response =
        await fetch(
          `${API_URL}/tasks?userId=${encodeURIComponent(
            userId
          )}`,
          {
            cache: "no-store",
          }
        );

      if (!response.ok) {
        throw new Error(
          "Failed to fetch tasks"
        );
      }

      const data =
        await response.json();

      const formattedTasks =
        Array.isArray(data)
          ? data.map(formatTask)
          : [];

      setTasks(formattedTasks);
    } catch (error) {
      console.error(
        "Error fetching tasks:",
        error
      );

      setError(
        "Unable to load tasks."
      );
    } finally {
      setIsLoading(false);
    }
  };

  // =========================
  // LOAD TASKS
  // =========================

  useEffect(() => {
    fetchTasks();
  }, []);

  // =========================
  // ADD TASK
  // =========================

  const handleAddTask = (newTask) => {
    const formattedTask =
      formatTask(newTask);

    setTasks((currentTasks) => [
      formattedTask,
      ...currentTasks,
    ]);
  };

  // =========================
  // UPDATE TASK
  // =========================

  const handleUpdateTask = (
    updatedTask
  ) => {
    const formattedTask =
      formatTask(updatedTask);

    setTasks((currentTasks) =>
      currentTasks.map((task) =>
        task.id === formattedTask.id
          ? formattedTask
          : task
      )
    );
  };

  // =========================
  // DELETE TASK
  // =========================

  const handleDeleteTask = async (
    taskId
  ) => {
    try {
      const userId =
        getCurrentUserId();

      if (!userId) {
        return;
      }

      const response =
        await fetch(
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

      setTasks((currentTasks) =>
        currentTasks.filter(
          (task) =>
            task.id !== taskId
        )
      );
    } catch (error) {
      console.error(
        "Error deleting task:",
        error
      );

      setError(
        "Unable to delete task."
      );
    }
  };

  // =========================
  // SEARCH + FILTER
  // =========================

  const filteredTasks =
    tasks.filter((task) => {
      const search =
        searchQuery
          .toLowerCase()
          .trim();

      const matchesSearch =
        !search ||
        task.title
          ?.toLowerCase()
          .includes(search);

      const matchesPriority =
        filters.priority === "All" ||
        task.priority ===
          filters.priority;

      let matchesMember = true;

      if (
        filters.member ===
        "Assigned"
      ) {
        matchesMember =
          task.member &&
          task.member !== "+";
      }

      if (
        filters.member ===
        "Unassigned"
      ) {
        matchesMember =
          !task.member ||
          task.member === "+";
      }

      return (
        matchesSearch &&
        matchesPriority &&
        matchesMember
      );
    });

  // =========================
  // STATUS SECTIONS
  // =========================

  const todoTasks =
    filteredTasks.filter(
      (task) =>
        task.status === "todo"
    );

  const doingTasks =
    filteredTasks.filter(
      (task) =>
        task.status === "doing"
    );

  const completedTasks =
    filteredTasks.filter(
      (task) =>
        task.status === "completed"
    );

  // =========================
  // OPEN ADD MODAL
  // =========================

  const openAddTaskModal = () => {
    setEditTask(null);
    setIsTaskModalOpen(true);
  };

  // =========================
  // OPEN EDIT MODAL
  // =========================

  const openEditTaskModal = (
    task
  ) => {
    setEditTask(task);
    setIsTaskModalOpen(true);
  };

  // =========================
  // CLOSE MODAL
  // =========================

  const closeTaskModal = () => {
    setIsTaskModalOpen(false);
    setEditTask(null);
  };

  // =========================
  // UI
  // =========================

  return (
    <div
      className="
        flex
        min-h-screen
        min-w-0
        theme-bg
        theme-text
      "
    >
      {/* =========================
          SIDEBAR
      ========================= */}

      <Sidebar />

      {/* =========================
          MAIN CONTENT
      ========================= */}

      <main
        className="
          min-w-0
          flex-1
          overflow-x-hidden
          p-4
          pt-20
          sm:p-6
          sm:pt-20
          md:p-8
          md:pt-8
        "
      >
        {/* =========================
            PAGE HEADER
        ========================= */}

        <div className="mb-6">
          <h1
            className="
              text-2xl
              font-semibold
              theme-text
              sm:text-3xl
            "
          >
            Tasks
          </h1>

          <p
            className="
              mt-1
              text-sm
              theme-text-secondary
            "
          >
            Manage and track your
            tasks.
          </p>
        </div>

        {/* =========================
            TOOLBAR
        ========================= */}

        <TaskToolbar
          onAddTask={
            openAddTaskModal
          }
          onSearch={
            setSearchQuery
          }
          onFilter={
            setFilters
          }
          onFieldsChange={
            setVisibleFields
          }
        />

        {/* =========================
            ERROR
        ========================= */}

        {error && (
          <p
            className="
              mb-4
              text-sm
              text-red-500
            "
          >
            {error}
          </p>
        )}

        {/* =========================
            LOADING
        ========================= */}

        {isLoading ? (
          <p
            className="
              mt-8
              text-sm
              theme-text-secondary
            "
          >
            Loading tasks...
          </p>
        ) : (
          <div className="w-full min-w-0">

            {/* =========================
                TO DO
            ========================= */}

            <TaskSection
              title="To Do"
              tasks={todoTasks}
              onDeleteTask={
                handleDeleteTask
              }
              onEditTask={
                openEditTaskModal
              }
              onUpdateTask={
                handleUpdateTask
              }
              onAddTask={
                openAddTaskModal
              }
              visibleFields={
                visibleFields
              }
            />

            {/* =========================
                DOING
            ========================= */}

            <TaskSection
              title="Doing"
              tasks={doingTasks}
              onDeleteTask={
                handleDeleteTask
              }
              onEditTask={
                openEditTaskModal
              }
              onUpdateTask={
                handleUpdateTask
              }
              onAddTask={
                openAddTaskModal
              }
              visibleFields={
                visibleFields
              }
            />

            {/* =========================
                COMPLETED
            ========================= */}

            <TaskSection
              title="Completed"
              tasks={
                completedTasks
              }
              onDeleteTask={
                handleDeleteTask
              }
              onEditTask={
                openEditTaskModal
              }
              onUpdateTask={
                handleUpdateTask
              }
              onAddTask={
                openAddTaskModal
              }
              visibleFields={
                visibleFields
              }
            />

            {/* =========================
                NO RESULTS
            ========================= */}

            {filteredTasks.length ===
              0 && (
              <div
                className="
                  mt-8
                  text-center
                  text-sm
                  theme-text-secondary
                "
              >
                No tasks found.
              </div>
            )}

          </div>
        )}

        {/* =========================
            ADD / EDIT MODAL
        ========================= */}

        {isTaskModalOpen && (
          <AddTaskModal
            onClose={
              closeTaskModal
            }
            onAddTask={
              handleAddTask
            }
            editTask={editTask}
            onUpdateTask={
              handleUpdateTask
            }
          />
        )}

      </main>
    </div>
  );
}