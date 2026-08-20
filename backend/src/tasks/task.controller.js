import { Body, Bind, Controller, Delete, Get, Param, Patch, Post, Query,} from "@nestjs/common";

import { TaskService } from "./task.service.js";

@Controller("tasks")
export class TaskController {
  constructor() {
    this.taskService = new TaskService();
  }

  // Get tasks for a specific user
  @Get()
  @Bind(Query("userId"))
  async getTasks(userId) {
    return await this.taskService.getTasks(userId);
  }

  // Get tasks belonging to a specific project
  @Get("project/:projectId")
  @Bind(Param("projectId"), Query("userId"))
  async getTasksByProject(projectId, userId) {
    return await this.taskService.getTasksByProject(
      projectId,
      userId
    );
  }

  // Create a task for a specific user
  @Post()
  @Bind(Body())
  async createTask(taskData) {
    return await this.taskService.createTask(taskData);
  }

  // Update only the user's own task
  @Patch(":id")
  @Bind(Param("id"), Body(), Query("userId"))
  async updateTask(id, taskData, userId) {
    return await this.taskService.updateTask(
      id,
      taskData,
      userId
    );
  }

  // Delete only the user's own task
  @Delete(":id")
  @Bind(Param("id"), Query("userId"))
  async deleteTask(id, userId) {
    return await this.taskService.deleteTask(
      id,
      userId
    );
  }
}