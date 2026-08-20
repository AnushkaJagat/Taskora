# Taskora – Task Management System

Taskora is a full-stack task and project management application developed as part of a Full Stack Developer Technical Assessment.

The application allows users to manage tasks and projects, track progress, assign members, set priorities and due dates, and monitor their workspace through a centralized dashboard.

## Overview

Taskora is designed to provide a simple and organized workspace for managing day-to-day tasks and projects.

# Features

- User authentication
- Guest access
- Dashboard
- Task management
- Project management
- Member assignment
- Task priorities
- Task statuses
- Due dates
- Search and filtering
- Theme support
- Responsive interface
- Persistent database storage

The frontend communicates with a NestJS backend, which handles authentication, tasks, projects, users, and database operations.

--------------------------------

## Authentication

Taskora provides multiple ways to access the application.

### User Registration

Users can create an account using:

- Name
- Email
- Password
- Username
- Workspace title

Passwords are securely hashed before being stored in the database.

### User Login

Registered users can log in using their email and password.

### Guest Login

Users can also continue as a guest without creating an account.
Guest users receive a unique local identifier so their workspace data can be separated from other users.

### Persistent Login

The application stores the current user information locally so that an already authenticated user can return directly to the dashboard.

--------------------------------

# Dashboard

The dashboard provides an overview of the user's workspace.

It displays:

- Total Tasks
- Tasks In Progress
- Completed Tasks
- Active Projects
- Recent Tasks
- Workspace Projects
- Upcoming Tasks

The dashboard provides a quick summary of the current workspace without requiring the user to navigate through individual pages.

--------------------------------

# Task Management

Users can manage their tasks from the Tasks page.

## Task Operations

Users can:

- Create tasks
- Edit tasks
- Delete tasks
- Change task status
- Set task priority
- Assign members
- Set due dates

All task modifications are sent to the backend and persisted in the database.

Therefore, task information remains available after refreshing the application.

## Task Statuses

Tasks can be organized into different workflow states:

- To Do
- Doing
- Completed

## Task Priorities

Tasks support different priority levels:

- Low
- Medium
- High
- Urgent

Priority levels are visually differentiated in the interface.

## Task Search

Users can search for tasks using the task search functionality.

## Task Filtering

Tasks can be filtered based on their available properties.

## Field Visibility

The task table allows users to control which fields are visible, helping keep the workspace organized.

--------------------------------

# Project Management

The Projects page allows users to manage their workspace projects.

Users can:

- Create projects
- Edit projects
- Delete projects
- Set project status
- Set project due dates
- Add project descriptions
- View task counts associated with projects

## Project Statuses

Projects support:

- Planning
- In Progress
- Completed

Projects are separated into active and completed sections for easier organization.

--------------------------------

# Member Assignment

Tasks can be assigned to workspace members.
The member assignment interface retrieves available users from the backend and allows the user to assign a member to a task.
Member information is persisted in the backend so the assignment remains available after refreshing the page.

--------------------------------

# Responsive Design

The application is designed to work across different screen sizes.

The interface supports:

- Desktop
- Tablet
- Mobile

The layout adapts the sidebar, navigation, dashboard cards, task tables, and other interface elements according to the available screen size.
A mobile navigation menu is provided for smaller screens.

--------------------------------

# Theme Support

Taskora supports theme switching.
Users can switch between the available themes using the theme control in the application.
The selected theme is maintained across page navigation and refreshes.

--------------------------------

# Navigation

The application uses separate routes for the main workspace sections.

/
├── login
├── dashboard
├── tasks
├── projects
└── settings

# Assessment
This project was developed as part of a Full Stack Developer Technical Assessment.

# Author 
Anushka Jagat
Full Stack Developer - Fresher

# GitHub ---