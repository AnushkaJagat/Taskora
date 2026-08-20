import { Project } from "./project.schema.js";
import Task from "../tasks/task.schema.js";

export class ProjectService {
  // Create project
  async createProject(projectData) {
    const project = new Project(projectData);

    return await project.save();
  }

  // Get projects for a specific user
  async getProjects(userId) {
    const projects = await Project.find({
      userId,
    }).sort({
      createdAt: -1,
    });

    // Get the number of tasks belonging to each project
    const projectsWithTaskCount =
      await Promise.all(
        projects.map(async (project) => {
          const taskCount =
            await Task.countDocuments({
              userId,
              projectId: String(project._id),
            });

          return {
            ...project.toObject(),
            taskCount,
          };
        })
      );

    return projectsWithTaskCount;
  }

    // Get one project for a specific user
    async getProjectById(id, userId) {
        const project = await Project.findOne({
            _id: id,
            userId,
        });
        if (!project) {
             throw new Error("Project not found");
            }
            
            const taskCount = await Task.countDocuments({
                userId,
                projectId: String(project._id),
            });
            
            return {
                ...project.toObject(),
                taskCount,
            };
        }

  // Update only the user's own project
  async updateProject(
    id,
    projectData,
    userId
  ) {
    return await Project.findOneAndUpdate(
      {
        _id: id,
        userId,
      },
      projectData,
      {
        new: true,
        runValidators: true,
      }
    );
  }

  // Delete only the user's own project
  async deleteProject(
    id,
    userId
  ) {
    return await Project.findOneAndDelete({
      _id: id,
      userId,
    });
  }
}