"use client";

import { Search, SlidersHorizontal, Columns3, Plus, X,} from "lucide-react";

import { useState } from "react";

export default function ProjectToolbar({ onAddProject, onSearch, onFilter, onFieldsChange,}) {
  
  const [showSearch, setShowSearch] =useState(false);
  const [showFilter, setShowFilter] =useState(false);
  const [showFields, setShowFields] =useState(false);
  const [searchValue, setSearchValue] =useState("");
  const [status, setStatus] = useState("All");
  const [fields, setFields] =useState({ project: true, status: true, tasks: true, dueDate: true, });

  // =========================
  // SEARCH
  // =========================

  const handleSearchChange = (value) => {
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

  const handleStatusChange = (value) => {
    setStatus(value);
    onFilter?.(value);
  };

  const clearFilters = () => {
    setStatus("All");
    onFilter?.("All");
  };

  // =========================
  // FIELDS
  // =========================

  const handleFieldChange = (field) => {
    const updatedFields = {
      ...fields,
      [field]: !fields[field],
    };

    setFields(updatedFields);
    onFieldsChange?.(updatedFields);
  };

  // =========================
  // TOGGLE HELPERS
  // =========================

  const openSearch = () => {
    setShowSearch(!showSearch);
    setShowFilter(false);
    setShowFields(false);
  };

  const openFilter = () => {
    setShowFilter(!showFilter);
    setShowSearch(false);
    setShowFields(false);
  };

  const openFields = () => {
    setShowFields(!showFields);
    setShowSearch(false);
    setShowFilter(false);
  };

  return (
    <div className="relative mb-6 flex items-center justify-between gap-4">

      {/* =========================
          LEFT SIDE
      ========================= */}

      <div className="flex items-center gap-2">

        {/* SEARCH BUTTON */}
        <button
          type="button"
          onClick={openSearch}
          className="
            flex
            h-10
            w-10
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
          aria-label="Search projects"
        >
          <Search size={18} />
        </button>

        {/* SEARCH INPUT */}
        {showSearch && (
          <div
            className="
              absolute
              left-0
              top-12
              z-40
              flex
              w-80
              items-center
              gap-2
              rounded-lg
              border
              theme-border
              theme-surface
              px-3
              py-2
              shadow-lg
            "
          >
            <Search
              size={16}
              className="theme-text-secondary"
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
              placeholder="Search projects..."
              className="
                w-full
                bg-transparent
                text-sm
                outline-none
                theme-text
              "
            />

            {searchValue && (
              <button
                type="button"
                onClick={clearSearch}
                className="theme-text-secondary"
                aria-label="Clear search"
              >
                <X size={16} />
              </button>
            )}
          </div>
        )}
      </div>

      {/* =========================
          RIGHT SIDE
      ========================= */}

      <div className="flex items-center gap-2">

        {/* =========================
            FIELDS
        ========================= */}

        <div className="relative">

          <button
            type="button"
            onClick={openFields}
            className="
              flex
              items-center
              gap-2
              rounded-lg
              border
              theme-border
              theme-surface
              px-3
              py-2
              text-sm
              theme-text
              transition
              hover:bg-black/5
              dark:hover:bg-white/10
            "
          >
            <Columns3 size={17} />
            Fields
          </button>

          {showFields && (
            <div
              className="
                absolute
                right-0
                top-11
                z-40
                w-52
                rounded-lg
                border
                theme-border
                theme-surface
                p-3
                shadow-lg
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
                ["project", "Project"],
                ["status", "Status"],
                ["tasks", "Tasks"],
                ["dueDate", "Due Date"],
              ].map(([key, label]) => (
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
                    checked={fields[key]}
                    onChange={() =>
                      handleFieldChange(key)
                    }
                  />

                  {label}
                </label>
              ))}
            </div>
          )}
        </div>

        {/* =========================
            FILTER
        ========================= */}

        <div className="relative">

          <button
            type="button"
            onClick={openFilter}
            className="
              flex
              items-center
              gap-2
              rounded-lg
              border
              theme-border
              theme-surface
              px-3
              py-2
              text-sm
              theme-text
              transition
              hover:bg-black/5
              dark:hover:bg-white/10
            "
          >
            <SlidersHorizontal size={17} />
            Filter
          </button>

          {showFilter && (
            <div
              className="
                absolute
                right-0
                top-11
                z-40
                w-64
                rounded-lg
                border
                theme-border
                theme-surface
                p-4
                shadow-lg
              "
            >
              <p
                className="
                  mb-3
                  text-sm
                  font-medium
                  theme-text
                "
              >
                Filter projects
              </p>

              <label
                className="
                  mb-2
                  block
                  text-xs
                  theme-text-secondary
                "
              >
                Status
              </label>

              <select
                value={status}
                onChange={(e) =>
                  handleStatusChange(
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
                  All statuses
                </option>

                <option value="planning">
                  Planning
                </option>

                <option value="in-progress">
                  In Progress
                </option>

                <option value="completed">
                  Completed
                </option>
              </select>

              <button
                type="button"
                onClick={clearFilters}
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
            ADD PROJECT
        ========================= */}

        <button
          type="button"
          onClick={() => {
            onAddProject?.();
          }}
          className="
            flex
            items-center
            gap-2
            rounded-lg
            bg-black
            px-4
            py-2
            text-sm
            font-medium
            text-white
            transition
            hover:bg-gray-800
          "
        >
          <Plus size={17} />
          Add Project
        </button>
      </div>
    </div>
  );
}