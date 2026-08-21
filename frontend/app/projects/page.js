"use client";

import API_URL from "@/lib/api";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Sidebar from "../../components/layout/Sidebar";
import ProjectToolbar from "../../components/projects/ProjectToolbar";
import ProjectSection from "../../components/projects/ProjectSection";
import AddProjectModal from "../../components/projects/AddProjectModal";

export default function ProjectsPage() {

  const router = useRouter();
  const [projects, setProjects] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");
  const [isProjectModalOpen, setIsProjectModalOpen] =useState(false);
  const [editProject, setEditProject] = useState(null);

  // SEARCH

  const [searchQuery, setSearchQuery] = useState("");

  // FILTER

  const [statusFilter, setStatusFilter] = useState("All");

  // FIELDS

  const [visibleFields, setVisibleFields] = useState({ project: true, status: true, tasks: true, dueDate: true,});

  // CURRENT USER

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
      localStorage.getItem("taskora-guest-id");

    if (!guestId) {
      guestId = `guest-${crypto.randomUUID()}`;

      localStorage.setItem(
        "taskora-guest-id",
        guestId
      );
    }

    return guestId;
  };

  // FETCH PROJECTS

  const fetchProjects = async () => {
    try {
      setIsLoading(true);
      setError("");

      const userId = getCurrentUserId();

      if (!userId) {
        throw new Error(
          "Unable to identify current user"
        );
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

      const data = await response.json();

      const formattedProjects = data.map(
        (project) => ({
          id: project._id,
          name: project.name,
          description:
            project.description || "",
          status:
            project.status || "planning",
          dueDate:
            project.dueDate || "",
          taskCount:
            project.taskCount || 0,
        })
      );

      setProjects(formattedProjects);
    } catch (error) {
      console.error(
        "Error fetching projects:",
        error
      );

      setError(
        "Unable to load projects."
      );
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchProjects();
  }, []);

  // ADD PROJECT

  const handleAddProject = (newProject) => {
    const formattedProject = {
      id: newProject._id,
      name: newProject.name,
      description:
        newProject.description || "",
      status:
        newProject.status || "planning",
      dueDate:
        newProject.dueDate || "",
      taskCount: 0,
    };

    setProjects(
      (currentProjects) => [
        formattedProject,
        ...currentProjects,
      ]
    );
  };

  // UPDATE PROJECT

  const handleUpdateProject = (
    updatedProject
  ) => {
    const formattedProject = {
      id: updatedProject._id,
      name: updatedProject.name,
      description:
        updatedProject.description || "",
      status:
        updatedProject.status ||
        "planning",
      dueDate:
        updatedProject.dueDate || "",
      taskCount:
        projects.find(
          (project) =>
            project.id ===
            updatedProject._id
        )?.taskCount || 0,
    };

    setProjects(
      (currentProjects) =>
        currentProjects.map(
          (project) =>
            project.id ===
            formattedProject.id
              ? formattedProject
              : project
        )
    );
  };

  // =========================
  // DELETE PROJECT
  // =========================

  const handleDeleteProject = (
    projectId
  ) => {
    setProjects(
      (currentProjects) =>
        currentProjects.filter(
          (project) =>
            project.id !== projectId
        )
    );
  };

  // =========================
  // OPEN PROJECT DETAIL
  // =========================

  const handleProjectClick = (
    project
  ) => {
    router.push(
      `/projects/${project.id}`
    );
  };

  // =========================
  // FILTER PROJECTS
  // =========================

  const filteredProjects =
    projects.filter((project) => {
      const matchesSearch =
        project.name
          ?.toLowerCase()
          .includes(
            searchQuery
              .toLowerCase()
              .trim()
          );

      const matchesStatus =
        statusFilter === "All" ||
        project.status ===
          statusFilter;

      return (
        matchesSearch &&
        matchesStatus
      );
    });

  // =========================
  // SPLIT BY STATUS
  // =========================

  const activeProjects =
    filteredProjects.filter(
      (project) =>
        project.status !==
        "completed"
    );

  const completedProjects =
    filteredProjects.filter(
      (project) =>
        project.status ===
        "completed"
    );

  return (
    <div className="flex min-h-screen theme-bg theme-text">

      {/* Sidebar */}
      <Sidebar />

      {/* Main Content */}
      <main className="flex-1 p-8">

        {/* Header */}
        <div className="mb-6">
          <h1 className="text-2xl font-semibold theme-text">
            Projects
          </h1>

          <p className="mt-1 text-sm theme-text-secondary">
            Manage and organize your projects.
          </p>
        </div>

        {/* Toolbar */}
        <ProjectToolbar
          onAddProject={() => {
            setEditProject(null);
            setIsProjectModalOpen(true);
          }}
          onSearch={setSearchQuery}
          onFilter={setStatusFilter}
          onFieldsChange={
            setVisibleFields
          }
        />

        {/* Error */}
        {error && (
          <p className="mb-4 text-sm text-red-500">
            {error}
          </p>
        )}

        {/* Loading */}
        {isLoading ? (
          <p className="mt-8 text-sm theme-text-secondary">
            Loading projects...
          </p>
        ) : (
          <>
            {/* Active Projects */}
            <ProjectSection
              title="Active"
              projects={activeProjects}
              onDeleteProject={
                handleDeleteProject
              }
              onEditProject={(project) => {
                setEditProject(project);
                setIsProjectModalOpen(
                  true
                );
              }}
              onAddProject={() => {
                setEditProject(null);
                setIsProjectModalOpen(
                  true
                );
              }}
              onProjectClick={
                handleProjectClick
              }
              visibleFields={
                visibleFields
              }
            />

            {/* Completed Projects */}
            <ProjectSection
              title="Completed"
              projects={
                completedProjects
              }
              onDeleteProject={
                handleDeleteProject
              }
              onEditProject={(project) => {
                setEditProject(project);
                setIsProjectModalOpen(
                  true
                );
              }}
              onAddProject={() => {
                setEditProject(null);
                setIsProjectModalOpen(
                  true
                );
              }}
              onProjectClick={
                handleProjectClick
              }
              visibleFields={
                visibleFields
              }
            />

            {/* No Results */}
            {filteredProjects.length ===
              0 && (
              <p className="mt-8 text-center text-sm theme-text-secondary">
                No projects found.
              </p>
            )}
          </>
        )}

        {/* Add / Edit Project Modal */}
        {isProjectModalOpen && (
          <AddProjectModal
            onClose={() => {
              setIsProjectModalOpen(false);
              setEditProject(null);
            }}
            onAddProject={
              handleAddProject
            }
            editProject={
              editProject
            }
            onUpdateProject={
              handleUpdateProject
            }
          />
        )}
      </main>
    </div>
  );
}