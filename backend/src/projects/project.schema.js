import mongoose from "mongoose";

const ProjectSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },

    description: {
      type: String,
      default: "",
      trim: true,
    },

    status: {
      type: String,
      enum: ["planning", "in-progress", "completed"],
      default: "planning",
    },

    dueDate: {
      type: String,
      default: "",
    },

    userId: {
      type: String,
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

const Project = mongoose.model(
  "Project",
  ProjectSchema
);

export { Project, ProjectSchema };

export default Project;