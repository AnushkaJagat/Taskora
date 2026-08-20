import Task from "./task.schema.js";

export class TaskService {
  // Create task
  async createTask(taskData) {
    const task = new Task(taskData);

    return await task.save();
  }

  // Get all tasks for a user
  async getTasks(userId) {
    return await Task.find({
      userId,
    }).sort({
      createdAt: -1,
    });
  }

  // Get tasks belonging to a specific project
  async getTasksByProject(projectId, userId) {
    return await Task.find({
      projectId,
      userId,
    }).sort({
      createdAt: -1,
    });
  }

  // Update user's own task
  async updateTask(
    id,
    taskData,
    userId
  ) {
    return await Task.findOneAndUpdate(
      {
        _id: id,
        userId,
      },
      taskData,
      {
        new: true,
        runValidators: true,
      }
    );
  }

  // Delete user's own task
  async deleteTask(id, userId) {
    return await Task.findOneAndDelete({
      _id: id,
      userId,
    });
  }
}