"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { useAuth } from "@/hooks/useAuth";
import { useGlobalFilters } from "@/hooks/useGlobalFilters";
import { initials } from "@/lib/fowas";
import { severityOptions } from "@/lib/fowas";
import {
  AnalyticsIcon,
  BellIcon,
  DashboardIcon,
  HelpIcon,
  IncidentIcon,
  OrganisationIcon,
  PlusIcon,
  ProfileIcon,
  SearchIcon,
  SettingsIcon,
  TerminalIcon,
  WorkflowIcon,
} from "@/components/ui/icons";

const navItems = [
  { href: "/dashboard", label: "Dashboard", icon: DashboardIcon },
  { href: "/incidents", label: "Incidents", icon: IncidentIcon },
  { href: "/workflows", label: "Workflows", icon: WorkflowIcon },
  { href: "/analytics", label: "Analytics", icon: AnalyticsIcon },
  { href: "/organisations", label: "Organizations", icon: OrganisationIcon },
];

const footerItems = [
  { href: "/settings", label: "Settings", icon: SettingsIcon },
  { href: "/profile", label: "Profile", icon: ProfileIcon },
];

export function AppShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const { user, loading, logout } = useAuth();
  const { filters, setFilters, workflows } = useGlobalFilters();
  const [activeFilterPanel, setActiveFilterPanel] = useState<
    "global" | "date" | "severity" | "workflow" | null
  >(null);

  useEffect(() => {
    if (!loading && !user) {
      router.replace("/login");
    }
  }, [loading, router, user]);

  if (loading || !user) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="flex flex-col items-center gap-3">
          <div className="skeleton h-2 w-40 rounded-full" />
          <p className="mono text-xs uppercase tracking-widest text-slate-500">
            Loading session…
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="shell-background min-h-screen p-3 text-white md:p-4">
      <div className="mx-auto flex min-h-[calc(100vh-2rem)] max-w-[1800px] overflow-hidden rounded-[var(--radius-xl)] border border-white/8 bg-[#090d13]">

        {/* ── Sidebar ── */}
        <aside className="hidden w-[240px] flex-col border-r border-white/8 bg-[#0e1219] xl:flex">
          <div className="px-6 py-6">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-[var(--radius-md)] bg-[var(--blue)] text-white">
                <TerminalIcon />
              </div>
              <div>
                <p className="text-lg font-bold tracking-tight text-white">
                  FOWAS
                </p>
                <p className="mono text-[10px] uppercase tracking-widest text-slate-500">
                  Reliability Cockpit
                </p>
              </div>
            </div>
          </div>

          <div className="px-5">
            <Link
              href="/incidents"
              className="fowas-button glow-blue flex items-center justify-center gap-2.5 rounded-[var(--radius-md)] px-4 py-3 text-[13px]"
            >
              <PlusIcon />
              Log Incident
            </Link>
          </div>

          <nav className="mt-6 flex-1 space-y-1 px-3">
            {navItems.map((item) => {
              const active = pathname.startsWith(item.href);
              const Icon = item.icon;

              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`group flex items-center gap-3 rounded-[var(--radius-md)] px-4 py-3 text-[13px] font-medium transition-all ${
                    active
                      ? "bg-[var(--blue)]/10 text-[var(--blue)]"
                      : "text-slate-400 hover:bg-white/[0.04] hover:text-slate-200"
                  }`}
                >
                  <Icon />
                  <span>{item.label}</span>
                </Link>
              );
            })}
          </nav>

          <div className="border-t border-white/8 px-3 py-4 space-y-1">
            {footerItems.map((item) => {
              const active = pathname.startsWith(item.href);
              const Icon = item.icon;

              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`group flex items-center gap-3 rounded-[var(--radius-md)] px-4 py-3 text-[13px] font-medium transition-all ${
                    active
                      ? "bg-white/[0.06] text-white"
                      : "text-slate-400 hover:bg-white/[0.04] hover:text-slate-200"
                  }`}
                >
                  <Icon />
                  <span>{item.label}</span>
                </Link>
              );
            })}
          </div>
        </aside>

        {/* ── Main Area ── */}
        <div className="flex min-w-0 flex-1 flex-col">

          {/* ── Top Bar ── */}
          <header className="flex flex-col gap-3 border-b border-white/8 px-5 py-3.5 md:px-6 xl:flex-row xl:items-center xl:justify-between">
            <div className="flex items-center gap-1 overflow-x-auto">
              {[
                { id: "global", label: "Filters" },
                { id: "date", label: "Date Range" },
                { id: "severity", label: "Severity" },
                { id: "workflow", label: "Workflow" },
              ].map((item) => (
                <button
                  key={item.label}
                  type="button"
                  onClick={() =>
                    setActiveFilterPanel((current) =>
                      current === item.id ? null : (item.id as typeof activeFilterPanel),
                    )
                  }
                  className={`shrink-0 rounded-[var(--radius-sm)] px-3 py-2 text-xs font-medium transition-all ${
                    activeFilterPanel === item.id
                      ? "bg-[var(--blue)]/10 text-[var(--blue)]"
                      : "text-slate-500 hover:text-slate-300"
                  }`}
                >
                  {item.label}
                </button>
              ))}
            </div>

            <div className="flex flex-wrap items-center gap-2.5 xl:flex-nowrap">
              <label className="flex min-w-[260px] flex-1 items-center gap-2.5 rounded-[var(--radius-md)] border border-white/8 bg-black/20 px-3.5 py-2.5 text-slate-400">
                <SearchIcon />
                <input
                  value={filters.search}
                  onChange={(event) =>
                    setFilters((current) => ({
                      ...current,
                      search: event.target.value,
                    }))
                  }
                  placeholder="Search incidents..."
                  className="w-full bg-transparent text-sm text-slate-300 outline-none placeholder:text-slate-600"
                />
              </label>
              <button
                type="button"
                className="rounded-[var(--radius-md)] border border-white/8 p-2.5 text-slate-400 transition hover:border-white/15 hover:text-white"
              >
                <BellIcon />
              </button>
              <button
                type="button"
                className="rounded-[var(--radius-md)] border border-white/8 p-2.5 text-slate-400 transition hover:border-white/15 hover:text-white"
              >
                <HelpIcon />
              </button>
              <button
                type="button"
                onClick={() => {
                  logout();
                  router.replace("/login");
                }}
                className="flex items-center gap-2 rounded-full border border-white/8 bg-white/[0.03] px-1.5 py-1.5 text-left transition hover:border-white/15"
              >
                <span className="flex h-9 w-9 items-center justify-center rounded-full bg-gradient-to-br from-slate-100 to-slate-300 text-xs font-bold text-slate-900">
                  {initials(user.full_name)}
                </span>
              </button>
            </div>
          </header>

          {/* ── Filter Panel ── */}
          {activeFilterPanel ? (
            <div className="border-b border-white/8 bg-[#0c0f16] px-5 py-3.5 md:px-6 fade-in">
              {activeFilterPanel === "global" ? (
                <div className="flex flex-wrap items-center gap-2">
                  <button
                    type="button"
                    onClick={() =>
                      setFilters({
                        dateRange: 30,
                        severities: [],
                        workflowIds: [],
                        riskLevels: [],
                        tag: null,
                        search: "",
                      })
                    }
                    className="chip text-xs text-white"
                  >
                    Reset All
                  </button>
                  <span className="chip text-xs">
                    Range: {filters.dateRange}d
                  </span>
                  <span className="chip text-xs">
                    Severity: {filters.severities.length || "All"}
                  </span>
                  <span className="chip text-xs">
                    Workflows: {filters.workflowIds.length || "All"}
                  </span>
                </div>
              ) : null}

              {activeFilterPanel === "date" ? (
                <div className="flex flex-wrap gap-2">
                  {[7, 14, 30, 90].map((range) => (
                    <button
                      key={range}
                      type="button"
                      onClick={() =>
                        setFilters((current) => ({
                          ...current,
                          dateRange: range as typeof current.dateRange,
                        }))
                      }
                      className={`chip text-xs ${
                        filters.dateRange === range ? "border-[var(--blue)] text-white bg-[var(--blue)]/8" : ""
                      }`}
                    >
                      {range} days
                    </button>
                  ))}
                </div>
              ) : null}

              {activeFilterPanel === "severity" ? (
                <div className="flex flex-wrap gap-2">
                  {severityOptions.map((severity) => (
                    <button
                      key={severity}
                      type="button"
                      onClick={() =>
                        setFilters((current) => ({
                          ...current,
                          severities: current.severities.includes(severity)
                            ? current.severities.filter((item) => item !== severity)
                            : [...current.severities, severity],
                        }))
                      }
                      className={`chip text-xs ${
                        filters.severities.includes(severity) ? "border-[var(--blue)] text-white bg-[var(--blue)]/8" : ""
                      }`}
                    >
                      {severity}
                    </button>
                  ))}
                </div>
              ) : null}

              {activeFilterPanel === "workflow" ? (
                <div className="flex flex-wrap gap-2">
                  {workflows.length === 0 ? (
                    <p className="text-sm text-slate-500">
                      No workflows available. Create one to filter by scope.
                    </p>
                  ) : (
                    workflows.map((workflow) => (
                      <button
                        key={workflow.id}
                        type="button"
                        onClick={() =>
                          setFilters((current) => ({
                            ...current,
                            workflowIds: current.workflowIds.includes(workflow.id)
                              ? current.workflowIds.filter((item) => item !== workflow.id)
                              : [...current.workflowIds, workflow.id],
                          }))
                        }
                        className={`chip text-xs ${
                          filters.workflowIds.includes(workflow.id)
                            ? "border-[var(--blue)] text-white bg-[var(--blue)]/8"
                            : ""
                        }`}
                      >
                        {workflow.name}
                      </button>
                    ))
                  )}
                </div>
              ) : null}
            </div>
          ) : null}

          <main className="flex-1 overflow-y-auto p-4 md:p-6 xl:p-8">{children}</main>
        </div>
      </div>
    </div>
  );
}
