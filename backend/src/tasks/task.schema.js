import mongoose from "mongoose";

const TaskSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
    },

    priority: {
      type: String,
      enum: ["Urgent", "High", "Medium", "Low"],
      default: "Medium",
    },

    status: {
      type: String,
      enum: ["todo", "doing", "completed"],
      default: "todo",
    },

    dueDate: {
      type: String,
    },

    member: {
      type: String,
    },

    // Project this task belongs to
    projectId: {
      type: String,
      default: "",
    },

    userId: {
      type: String,
      required: true,
    },
    projectId: {
      type: String,
      default: null,
    },
  },
  {
    timestamps: true,
  }
);

const Task = mongoose.model("Task", TaskSchema);

export { Task, TaskSchema };
export default Task;