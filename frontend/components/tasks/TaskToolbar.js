"use client";

import {
  Search,
  SlidersHorizontal,
  Columns3,
  Plus,
  X,
} from "lucide-react";

import { useState } from "react";

export default function TaskToolbar({
  onAddTask,
  onSearch,
  onFilter,
  onFieldsChange,
}) {
  const [showSearch, setShowSearch] =
    useState(false);

  const [showFilter, setShowFilter] =
    useState(false);

  const [showFields, setShowFields] =
    useState(false);

  const [searchValue, setSearchValue] =
    useState("");

  const [priority, setPriority] =
    useState("All");

  const [member, setMember] =
    useState("All");

  const [fields, setFields] =
    useState({
      task: true,
      priority: true,
      members: true,
      dueDate: true,
    });

  // =========================
  // SEARCH
  // =========================

  const handleSearchChange = (
    value
  ) => {
    setSearchValue(value);

    onSearch?.(value);
  };

  const clearSearch = () => {
    setSearchValue("");

    onSearch?.("");
  };

  // =========================
  // FILTER
  // =========================

  const handlePriorityChange = (
    value
  ) => {
    setPriority(value);

    onFilter?.({
      priority: value,
      member,
    });
  };

  const handleMemberChange = (
    value
  ) => {
    setMember(value);

    onFilter?.({
      priority,
      member: value,
    });
  };

  const clearFilters = () => {
    setPriority("All");
    setMember("All");

    onFilter?.({
      priority: "All",
      member: "All",
    });
  };

  // =========================
  // FIELDS
  // =========================

  const handleFieldChange = (
    field
  ) => {
    const updatedFields = {
      ...fields,
      [field]: !fields[field],
    };

    setFields(updatedFields);

    onFieldsChange?.(
      updatedFields
    );
  };

  // =========================
  // CLOSE OTHER MENUS
  // =========================

  const openSearch = () => {
    setShowSearch(!showSearch);
    setShowFilter(false);
    setShowFields(false);
  };

  const openFields = () => {
    setShowFields(!showFields);
    setShowFilter(false);
    setShowSearch(false);
  };

  const openFilter = () => {
    setShowFilter(!showFilter);
    setShowFields(false);
    setShowSearch(false);
  };

  return (
    <div
      className="
        relative
        z-30
        mb-6
        w-full
        min-w-0
      "
    >
      <div
        className="
          flex
          w-full
          min-w-0
          flex-wrap
          items-center
          gap-2
        "
      >
        {/* =========================
            SEARCH
        ========================= */}

        <div className="relative shrink-0">
          <button
            type="button"
            onClick={openSearch}
            className="
              flex
              h-12
              w-12
              items-center
              justify-center
              rounded-lg
              border
              theme-border
              theme-surface
              theme-text-secondary
              transition
              hover:bg-black/5
              dark:hover:bg-white/10
            "
            aria-label="Search tasks"
          >
            <Search size={19} />
          </button>

          {showSearch && (
            <div
              className="
                absolute
                left-0
                top-14
                z-[100]
                flex
                w-[280px]
                max-w-[calc(100vw-32px)]
                items-center
                gap-2
                rounded-lg
                border
                theme-border
                theme-surface
                px-3
                py-2
                shadow-xl
              "
            >
              <Search
                size={16}
                className="shrink-0 theme-text-secondary"
              />

              <input
                autoFocus
                type="text"
                value={searchValue}
                onChange={(e) =>
                  handleSearchChange(
                    e.target.value
                  )
                }
                placeholder="Search tasks..."
                className="
                  min-w-0
                  flex-1
                  bg-transparent
                  text-sm
                  outline-none
                  theme-text
                "
              />

              {searchValue && (
                <button
                  type="button"
                  onClick={
                    clearSearch
                  }
                  className="shrink-0 theme-text-secondary"
                >
                  <X size={16} />
                </button>
              )}
            </div>
          )}
        </div>

        {/* =========================
            FIELDS
        ========================= */}

        <div className="relative shrink-0">
          <button
            type="button"
            onClick={openFields}
            className="
              flex
              h-12
              items-center
              gap-2
              rounded-lg
              border
              theme-border
              theme-surface
              px-3
              text-sm
              theme-text
              transition
              hover:bg-black/5
              dark:hover:bg-white/10
            "
          >
            <Columns3 size={18} />

            <span>Fields</span>
          </button>

          {showFields && (
            <div
              className="
                absolute
                left-0
                top-14
                z-[100]
                w-[210px]
                max-w-[calc(100vw-32px)]
                rounded-lg
                border
                theme-border
                theme-surface
                p-3
                shadow-xl
              "
            >
              <p
                className="
                  mb-2
                  text-xs
                  font-medium
                  theme-text-secondary
                "
              >
                Show fields
              </p>

              {[
                ["task", "Task"],
                [
                  "priority",
                  "Priority",
                ],
                [
                  "members",
                  "Members",
                ],
                [
                  "dueDate",
                  "Due Date",
                ],
              ].map(
                ([key, label]) => (
                  <label
                    key={key}
                    className="
                      flex
                      cursor-pointer
                      items-center
                      gap-2
                      rounded-md
                      px-2
                      py-2
                      text-sm
                      theme-text
                      hover:bg-black/5
                      dark:hover:bg-white/10
                    "
                  >
                    <input
                      type="checkbox"
                      checked={
                        fields[key]
                      }
                      onChange={() =>
                        handleFieldChange(
                          key
                        )
                      }
                    />

                    <span>
                      {label}
                    </span>
                  </label>
                )
              )}
            </div>
          )}
        </div>

        {/* =========================
            FILTER
        ========================= */}

        <div className="relative shrink-0">
          <button
            type="button"
            onClick={openFilter}
            className="
              flex
              h-12
              items-center
              gap-2
              rounded-lg
              border
              theme-border
              theme-surface
              px-3
              text-sm
              theme-text
              transition
              hover:bg-black/5
              dark:hover:bg-white/10
            "
          >
            <SlidersHorizontal
              size={18}
            />

            <span>Filter</span>
          </button>

          {showFilter && (
            <div
              className="
                absolute
                right-0
                top-14
                z-[100]
                w-[260px]
                max-w-[calc(100vw-32px)]
                rounded-lg
                border
                theme-border
                theme-surface
                p-4
                shadow-xl
              "
            >
              <p className="mb-3 text-sm font-medium theme-text">
                Filter tasks
              </p>

              {/* PRIORITY */}

              <label className="mb-2 block text-xs theme-text-secondary">
                Priority
              </label>

              <select
                value={priority}
                onChange={(e) =>
                  handlePriorityChange(
                    e.target.value
                  )
                }
                className="
                  mb-4
                  w-full
                  rounded-md
                  border
                  theme-border
                  theme-surface
                  px-3
                  py-2
                  text-sm
                  theme-text
                  outline-none
                "
              >
                <option value="All">
                  All priorities
                </option>

                <option value="Urgent">
                  Urgent
                </option>

                <option value="High">
                  High
                </option>

                <option value="Medium">
                  Medium
                </option>

                <option value="Low">
                  Low
                </option>
              </select>

              {/* MEMBER */}

              <label className="mb-2 block text-xs theme-text-secondary">
                Member
              </label>

              <select
                value={member}
                onChange={(e) =>
                  handleMemberChange(
                    e.target.value
                  )
                }
                className="
                  w-full
                  rounded-md
                  border
                  theme-border
                  theme-surface
                  px-3
                  py-2
                  text-sm
                  theme-text
                  outline-none
                "
              >
                <option value="All">
                  All tasks
                </option>

                <option value="Assigned">
                  Assigned
                </option>

                <option value="Unassigned">
                  Unassigned
                </option>
              </select>

              <button
                type="button"
                onClick={
                  clearFilters
                }
                className="
                  mt-3
                  w-full
                  rounded-md
                  border
                  theme-border
                  px-3
                  py-2
                  text-sm
                  theme-text
                  hover:bg-black/5
                  dark:hover:bg-white/10
                "
              >
                Clear filters
              </button>
            </div>
          )}
        </div>

        {/* =========================
            ADD TASK
        ========================= */}

        <button
          type="button"
          onClick={() =>
            onAddTask?.()
          }
          className="
            flex
            h-12
            shrink-0
            items-center
            gap-2
            rounded-lg
            bg-black
            px-4
            text-sm
            font-medium
            text-white
            transition
            hover:bg-gray-200
            dark:bg-white
            dark:text-black
          "
        >
          <Plus size={18} />

          <span>Add Task</span>
        </button>
      </div>
    </div>
  );
}