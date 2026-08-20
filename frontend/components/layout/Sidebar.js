"use client";

import {
  CheckCircle2,
  ChevronDown,
  ChevronRight,
  CircleUserRound,
  Folder,
  LayoutDashboard,
  LogOut,
  Moon,
  Settings,
  Sun,
  User,
} from "lucide-react";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { useTheme } from "../theme/ThemeProvider";

const colors = [
  {
    name: "blue",
    label: "Blue",
    value: "#2563eb",
  },
  {
    name: "amber",
    label: "Amber",
    value: "#d97706",
  },
  {
    name: "pink",
    label: "Pink",
    value: "#db2777",
  },
  {
    name: "rose",
    label: "Rose",
    value: "#e11d48",
  },
  {
    name: "emerald",
    label: "Emerald",
    value: "#059669",
  },
  {
    name: "black",
    label: "Black",
    value: "#111111",
  },
];

export default function Sidebar() {
  const pathname = usePathname();

  const {
    theme,
    colorMode,
    toggleTheme,
    changeColorMode,
  } = useTheme();

  const [workspaceOpen, setWorkspaceOpen] =
    useState(true);

  const [profileOpen, setProfileOpen] =
    useState(false);

  const [themeOpen, setThemeOpen] =
    useState(false);

  const [colorOpen, setColorOpen] =
    useState(false);

  const [user, setUser] = useState(null);

  // =========================
  // LOAD USER
  // =========================

  useEffect(() => {
    const loadUser = () => {
      const storedUser =
        localStorage.getItem(
          "taskora-user"
        );

      if (
        storedUser &&
        storedUser !== "guest"
      ) {
        try {
          setUser(
            JSON.parse(storedUser)
          );
        } catch {
          setUser(null);
        }
      } else {
        setUser(null);
      }
    };

    loadUser();

    window.addEventListener(
      "storage",
      loadUser
    );

    return () => {
      window.removeEventListener(
        "storage",
        loadUser
      );
    };
  }, []);

  // =========================
  // ACTIVE ROUTE
  // =========================

  const isActive = (path) => {
    if (path === "/") {
      return pathname === "/";
    }

    return (
      pathname === path ||
      pathname.startsWith(`${path}/`)
    );
  };

  // =========================
  // CLOSE PROFILE MENU
  // =========================

  const closeProfileMenu = () => {
    setProfileOpen(false);
    setThemeOpen(false);
    setColorOpen(false);
  };

  return (
    <>
      {/* =================================================
          DESKTOP SIDEBAR
      ================================================= */}

      <aside className="sticky top-0 hidden h-screen w-60 shrink-0 flex-col border-r theme-border theme-surface md:flex">
       
        {/* ================= BRAND ================= */}

        <div
          className="
            flex
            h-16
            shrink-0
            items-center
            border-b
            theme-border
            px-5
          "
        >
          <Link
            href="/"
            className="flex items-center gap-2"
          >
            <div
              className="
                flex
                h-8
                w-8
                items-center
                justify-center
                rounded-lg
                bg-black
                text-white
              "
            >
              <CheckCircle2 size={18} />
            </div>

            <span className="text-sm font-semibold theme-text">
              Taskora
            </span>
          </Link>
        </div>

        {/* ================= WORKSPACE ================= */}

        <div className="min-h-0 flex-1 overflow-y-auto px-3 py-5">
          <button
            type="button"
            onClick={() =>
              setWorkspaceOpen(
                !workspaceOpen
              )
            }
            className="
              mb-2
              flex
              w-full
              items-center
              justify-between
              px-2
              text-xs
              font-medium
              theme-text-secondary
            "
          >
            <span>Workspace</span>

            {workspaceOpen ? (
              <ChevronDown size={14} />
            ) : (
              <ChevronRight size={14} />
            )}
          </button>

          {workspaceOpen && (
            <nav className="space-y-1">
              {/* ================= DASHBOARD ================= */}

<Link
  href="/dashboard"
  className={`
    flex
    items-center
    gap-3
    rounded-lg
    px-3
    py-2
    text-sm
    transition

    ${
      isActive("/dashboard")
        ? "bg-[var(--accent)]/10 font-medium theme-accent"
        : "theme-text-secondary hover:bg-black/5 dark:hover:bg-white/10"
    }
  `}
>
  <LayoutDashboard size={17} />

  Dashboard
</Link>

              {/* ================= TASKS ================= */}

              <Link
                href="/tasks"
                className={`
                  flex
                  items-center
                  gap-3
                  rounded-lg
                  px-3
                  py-2
                  text-sm
                  transition

                  ${
                    isActive("/tasks")
                      ? "bg-[var(--accent)]/10 font-medium theme-accent"
                      : "theme-text-secondary hover:bg-black/5 dark:hover:bg-white/10"
                  }
                `}
              >
                <CheckCircle2 size={17} />

                Tasks
              </Link>

              {/* ================= PROJECTS ================= */}

              <Link
                href="/projects"
                className={`
                  flex
                  items-center
                  gap-3
                  rounded-lg
                  px-3
                  py-2
                  text-sm
                  transition

                  ${
                    isActive("/projects")
                      ? "bg-[var(--accent)]/10 font-medium theme-accent"
                      : "theme-text-secondary hover:bg-black/5 dark:hover:bg-white/10"
                  }
                `}
              >
                <Folder size={17} />

                Projects
              </Link>
            </nav>
          )}
        </div>

        {/* =================================================
            PROFILE AREA
        ================================================= */}

        <div
          className="
            relative
            shrink-0
            border-t
            theme-border
            p-3
          "
        >
          <button
            type="button"
            onClick={() =>
              setProfileOpen(
                !profileOpen
              )
            }
            className="
              flex
              w-full
              items-center
              gap-3
              rounded-lg
              p-2
              text-left
              transition
              hover:bg-black/5
              dark:hover:bg-white/10
            "
          >
            {/* Avatar */}

            <div
              className="
                flex
                h-9
                w-9
                shrink-0
                items-center
                justify-center
                rounded-full
                theme-surface-secondary
                theme-text
              "
            >
              <CircleUserRound
                size={20}
              />
            </div>

            {/* User */}

            <div className="min-w-0 flex-1">
              <p className="truncate text-sm font-medium theme-text">
                {user
                  ? user.name
                  : "Guest"}
              </p>

              <p className="truncate text-xs theme-text-secondary">
                {user
                  ? user.title ||
                    "Workspace member"
                  : "Workspace member"}
              </p>
            </div>

            <ChevronDown
              size={15}
              className="theme-text-secondary"
            />
          </button>

          {/* =================================================
              PROFILE MENU
          ================================================= */}

          {profileOpen && (
            <div
              className="
                absolute
                bottom-[calc(100%-8px)]
                left-3
                right-3
                z-[100]
                max-h-[70vh]
                overflow-y-auto
                rounded-xl
                border
                theme-border
                theme-surface
                p-2
                shadow-xl
              "
            >
              {/* PROFILE */}

              <Link
                href="/profile"
                onClick={
                  closeProfileMenu
                }
                className="
                  flex
                  items-center
                  gap-3
                  rounded-lg
                  px-3
                  py-2
                  text-sm
                  theme-text
                  hover:bg-black/5
                  dark:hover:bg-white/10
                "
              >
                <User size={16} />

                Profile
              </Link>

              {/* THEME */}

              <button
                type="button"
                onClick={() => {
                  setThemeOpen(
                    !themeOpen
                  );
                  setColorOpen(false);
                }}
                className="
                  flex
                  w-full
                  items-center
                  justify-between
                  rounded-lg
                  px-3
                  py-2
                  text-sm
                  theme-text
                  hover:bg-black/5
                  dark:hover:bg-white/10
                "
              >
                <span className="flex items-center gap-3">
                  {theme === "light" ? (
                    <Sun size={16} />
                  ) : (
                    <Moon size={16} />
                  )}

                  Theme
                </span>

                <ChevronRight
                  size={14}
                />
              </button>

              {/* THEME OPTIONS */}

              {themeOpen && (
                <div
                  className="
                    ml-2
                    mt-1
                    rounded-lg
                    theme-surface-secondary
                    p-1
                  "
                >
                  {/* LIGHT */}

                  <button
                    type="button"
                    onClick={() => {
                      if (
                        theme !==
                        "light"
                      ) {
                        toggleTheme();
                      }
                    }}
                    className={`
                      flex
                      w-full
                      items-center
                      gap-2
                      rounded-md
                      px-3
                      py-2
                      text-sm

                      ${
                        theme ===
                        "light"
                          ? "theme-surface font-medium theme-text shadow-sm"
                          : "theme-text-secondary hover:bg-black/5 dark:hover:bg-white/10"
                      }
                    `}
                  >
                    <Sun size={15} />

                    Light

                    {theme ===
                      "light" && (
                      <span className="ml-auto">
                        ✓
                      </span>
                    )}
                  </button>

                  {/* DARK */}

                  <button
                    type="button"
                    onClick={() => {
                      if (
                        theme !==
                        "dark"
                      ) {
                        toggleTheme();
                      }
                    }}
                    className={`
                      flex
                      w-full
                      items-center
                      gap-2
                      rounded-md
                      px-3
                      py-2
                      text-sm

                      ${
                        theme ===
                        "dark"
                          ? "theme-surface-secondary font-medium theme-text"
                          : "theme-text-secondary hover:bg-black/5 dark:hover:bg-white/10"
                      }
                    `}
                  >
                    <Moon size={15} />

                    Dark

                    {theme ===
                      "dark" && (
                      <span className="ml-auto">
                        ✓
                      </span>
                    )}
                  </button>
                </div>
              )}

              {/* COLOR MODE */}

              <button
                type="button"
                onClick={() => {
                  setColorOpen(
                    !colorOpen
                  );
                  setThemeOpen(false);
                }}
                className="
                  flex
                  w-full
                  items-center
                  justify-between
                  rounded-lg
                  px-3
                  py-2
                  text-sm
                  theme-text
                  hover:bg-black/5
                  dark:hover:bg-white/10
                "
              >
                <span className="flex items-center gap-3">
                  <span
                    className="
                      h-4
                      w-4
                      rounded-full
                    "
                    style={{
                      backgroundColor:
                        colors.find(
                          (color) =>
                            color.name ===
                            colorMode
                        )?.value ||
                        "#2563eb",
                    }}
                  />

                  Color Mode
                </span>

                <ChevronRight
                  size={14}
                />
              </button>

              {/* COLOR OPTIONS */}

              {colorOpen && (
                <div
                  className="
                    ml-2
                    mt-1
                    rounded-lg
                    theme-surface-secondary
                    p-2
                  "
                >
                  {colors.map(
                    (color) => (
                      <button
                        key={
                          color.name
                        }
                        type="button"
                        onClick={() =>
                          changeColorMode(
                            color.name
                          )
                        }
                        className="
                          flex
                          w-full
                          items-center
                          gap-3
                          rounded-md
                          px-3
                          py-2
                          text-sm
                          theme-text
                          hover:bg-black/5
                          dark:hover:bg-white/10
                        "
                      >
                        <span
                          className="
                            h-3
                            w-3
                            rounded-full
                          "
                          style={{
                            backgroundColor:
                              color.value,
                          }}
                        />

                        {color.label}

                        {colorMode ===
                          color.name && (
                          <span className="ml-auto text-xs">
                            ✓
                          </span>
                        )}
                      </button>
                    )
                  )}
                </div>
              )}

              {/* SETTINGS */}

              <Link
                href="/settings"
                onClick={
                  closeProfileMenu
                }
                className="
                  flex
                  items-center
                  gap-3
                  rounded-lg
                  px-3
                  py-2
                  text-sm
                  theme-text
                  hover:bg-black/5
                  dark:hover:bg-white/10
                "
              >
                <Settings size={16} />

                Settings
              </Link>

              <div className="my-1 border-t theme-border" />

              {/* LOGOUT */}

              <Link
                href="/login"
                onClick={() => {
                  localStorage.removeItem(
                    "taskora-user"
                  );

                  setUser(null);

                  closeProfileMenu();
                }}
                className="
                  flex
                  items-center
                  gap-3
                  rounded-lg
                  px-3
                  py-2
                  text-sm
                  theme-text-secondary
                  hover:bg-black/5
                  dark:hover:bg-white/10
                "
              >
                <LogOut size={16} />

                Log out
              </Link>
            </div>
          )}
        </div>
      </aside>

      {/* =================================================
          MOBILE TOP BAR
      ================================================= */}

      <div
        className="
          flex
          h-14
          items-center
          justify-between
          border-b
          theme-border
          theme-surface
          px-4
          md:hidden
        "
      >
        <Link
          href="/"
          className="flex items-center gap-2"
        >
          <div
            className="
              flex
              h-8
              w-8
              items-center
              justify-center
              rounded-lg
              bg-black
              text-white
            "
          >
            <CheckCircle2 size={17} />
          </div>

          <span className="text-sm font-semibold theme-text">
            Taskora
          </span>
        </Link>

        <button
          type="button"
          onClick={toggleTheme}
          className="
            rounded-lg
            p-2
            theme-text-secondary
            hover:bg-black/5
            dark:hover:bg-white/10
          "
          aria-label="Toggle theme"
        >
          {theme === "light" ? (
            <Moon size={18} />
          ) : (
            <Sun size={18} />
          )}
        </button>
      </div>
    </>
  );
}