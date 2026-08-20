import { Body, Bind, Controller, Delete, Get, Param, Patch, Post, Query,} from "@nestjs/common";

import { ProjectService } from "./project.service.js";

@Controller("projects")
export class ProjectController {
  constructor() {
    this.projectService =
      new ProjectService();
  }

  // Get projects for a specific user
  @Get()
  @Bind(Query("userId"))
  async getProjects(userId) {
    return await this.projectService.getProjects(
      userId
    );
  }

  // Get one project for a specific user
  @Get(":id")
  @Bind(Param("id"), Query("userId"))
  async getProjectById(id, userId) {
    return await this.projectService.getProjectById(
      id,
      userId
    );
  }

  // Create project
  @Post()
  @Bind(Body())
  async createProject(projectData) {
    return await this.projectService.createProject(
      projectData
    );
  }

  // Update only the user's own project
  @Patch(":id")
  @Bind(Param("id"), Body(), Query("userId"))
  async updateProject(
    id,
    projectData,
    userId
  ) {
    return await this.projectService.updateProject(
      id,
      projectData,
      userId
    );
  }

  // Delete only the user's own project
  @Delete(":id")
  @Bind(Param("id"), Query("userId"))
  async deleteProject(id, userId) {
    return await this.projectService.deleteProject(
      id,
      userId
    );
  }
}