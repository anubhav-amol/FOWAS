"use client";

import { useEffect, useState } from "react";
import { DonutChart, BarChart, LineAreaChart, ProgressList } from "@/components/charts/system-charts";
import { LogIncidentModal } from "@/components/incidents/log-incident-modal";
import { Panel } from "@/components/ui/panel";
import { useGlobalFilters } from "@/hooks/useGlobalFilters";
import {
  filterIncidents,
  formatDate,
  formatMetric,
  formatPercent,
  getRiskDistribution,
  getSeverityBreakdown,
  getSummaryMetrics,
  getTrendData,
  getWorkflowRisk,
  severityOptions,
  severityColors,
  statusColors,
} from "@/lib/fowas";
import { getIncidents, getOrganisations, getWorkflows } from "@/services/api";
import { exportIncidentsCSV, exportDashboardPDF } from "@/lib/export";
import type { DashboardFilters, Incident, Organisation, Workflow } from "@/types";

function StatCard({
  label,
  value,
  detail,
}: {
  label: string;
  value: string;
  detail: string;
}) {
  return (
    <div className="rounded-[var(--radius-lg)] border border-white/8 bg-white/[0.025] p-5">
      <p className="text-xs font-medium text-slate-500">{label}</p>
      <p className="mt-2.5 text-3xl font-semibold tabular-nums text-white">{value}</p>
      <p className="mt-1.5 text-[13px] text-slate-500">{detail}</p>
    </div>
  );
}

function LoadingPlaceholder({ label }: { label: string }) {
  return (
    <div className="flex flex-col items-center justify-center gap-3 py-12">
      <div className="skeleton h-1.5 w-24 rounded-full" />
      <p className="text-xs text-slate-600">{label}</p>
    </div>
  );
}

export default function DashboardPage() {
  const { filters, setFilters, setWorkflows: setGlobalWorkflows } = useGlobalFilters();
  const [incidents, setIncidents] = useState<Incident[]>([]);
  const [workflows, setWorkflows] = useState<Workflow[]>([]);
  const [organisations, setOrganisations] = useState<Organisation[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [modalOpen, setModalOpen] = useState(false);

  useEffect(() => {
    async function loadData() {
      setLoading(true);
      setError(null);

      try {
        const [incidentData, workflowData, organisationData] = await Promise.all([
          getIncidents(),
          getWorkflows(),
          getOrganisations(),
        ]);

        setIncidents(incidentData);
        setWorkflows(workflowData);
        setGlobalWorkflows(workflowData);
        setOrganisations(organisationData);
      } catch (loadError) {
        setError(loadError instanceof Error ? loadError.message : "Unable to load dashboard");
      } finally {
        setLoading(false);
      }
    }

    void loadData();
  }, [setGlobalWorkflows]);

  const filteredIncidents = filterIncidents(incidents, filters);
  const summary = getSummaryMetrics(filteredIncidents);
  const severityBreakdown = getSeverityBreakdown(filteredIncidents);
  const riskDistribution = getRiskDistribution(filteredIncidents);
  const workflowRisk = getWorkflowRisk(filteredIncidents, workflows).slice(0, 3);
  const trend = getTrendData(filteredIncidents, filters.dateRange);
  const recentIncidents = [...filteredIncidents]
    .sort((left, right) => new Date(right.created_at).getTime() - new Date(left.created_at).getTime())
    .slice(0, 5);

  return (
    <div className="space-y-6">
      {/* KPI Cards */}
      <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        <StatCard
          label="Total Incidents"
          value={String(summary.total)}
          detail="Current filter scope"
        />
        <StatCard
          label="High Risk"
          value={String(summary.highRisk)}
          detail="Risk score above 15"
        />
        <StatCard
          label="Resolved"
          value={String(summary.resolved)}
          detail={`Availability ${formatPercent(summary.availabilityRatio)}`}
        />
        <StatCard
          label="MTTR (hrs)"
          value={formatMetric(summary.mttrHours)}
          detail={`MTBF ${formatMetric(summary.mtbfHours)} hrs`}
        />
      </section>

      {/* Filter bar */}
      <section className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex flex-wrap gap-2">
          {[7, 14, 30, 90].map((range) => (
            <button
              key={range}
              type="button"
              onClick={() =>
                setFilters((current) => ({
                  ...current,
                  dateRange: range as DashboardFilters["dateRange"],
                }))
              }
              className={`chip text-xs ${
                filters.dateRange === range ? "border-[var(--blue)] text-white bg-[var(--blue)]/8" : ""
              }`}
            >
              {range}d
            </button>
          ))}
        </div>
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
          <span className="mx-0.5 self-center text-white/10">|</span>
          <button
            type="button"
            onClick={() => exportIncidentsCSV(filteredIncidents, workflows)}
            disabled={loading || filteredIncidents.length === 0}
            className="chip text-xs transition hover:border-[var(--green)] hover:text-[var(--green)] disabled:opacity-30 disabled:cursor-not-allowed"
          >
            Export CSV
          </button>
          <button
            type="button"
            onClick={() => exportDashboardPDF(filteredIncidents, workflows)}
            disabled={loading || filteredIncidents.length === 0}
            className="chip text-xs transition hover:border-[var(--blue)] hover:text-[var(--blue)] disabled:opacity-30 disabled:cursor-not-allowed"
          >
            Export PDF
          </button>
        </div>
      </section>

      {error ? (
        <Panel>
          <p className="text-sm text-red-300">{error}</p>
        </Panel>
      ) : null}

      {/* Charts row */}
      <section className="grid gap-6 xl:grid-cols-[1.6fr_0.75fr_0.75fr]">
        <Panel title="Risk Distribution" eyebrow="Global Filters" className="min-h-[340px]">
          {loading ? (
            <LoadingPlaceholder label="Loading histogram…" />
          ) : (
            <BarChart data={riskDistribution} />
          )}
        </Panel>

        <Panel title="Severity Mix" className="min-h-[340px]">
          {loading ? (
            <LoadingPlaceholder label="Loading severity…" />
          ) : (
            <DonutChart
              data={severityBreakdown}
              valueLabel={`${summary.total || 0}`}
            />
          )}
        </Panel>

        <Panel title="Workflow Exposure" className="min-h-[340px]">
          {loading ? (
            <LoadingPlaceholder label="Loading workflows…" />
          ) : (
            <ProgressList data={workflowRisk} maxValue={30} />
          )}
        </Panel>
      </section>

      {/* Trend chart */}
      <Panel
        title={`Incident Trend (${filters.dateRange}d)`}
        right={
          <div className="flex items-center gap-5">
            <span className="flex items-center gap-2 text-xs text-slate-400">
              <span className="inline-block h-2 w-2 rounded-full bg-[var(--blue)]" />
              Active
            </span>
            <span className="flex items-center gap-2 text-xs text-slate-500">
              <span className="inline-block h-2 w-2 rounded-full bg-slate-500" />
              Resolved
            </span>
          </div>
        }
      >
        {loading ? (
          <LoadingPlaceholder label="Loading trend…" />
        ) : (
          <LineAreaChart
            data={trend}
            lines={[
              { key: "active", color: "#4484ff" },
              { key: "resolved", color: "#8aa6d9", dashed: true },
            ]}
          />
        )}
      </Panel>

      {/* Recent Incidents table */}
      <Panel
        title="Recent Incidents"
        right={
          <button type="button" onClick={() => setModalOpen(true)} className="fowas-button px-4 py-2.5 text-[13px]">
            Log Incident
          </button>
        }
      >
        <div className="overflow-x-auto">
          <table className="min-w-full">
            <thead>
              <tr className="border-b border-white/8 text-left text-xs font-medium uppercase tracking-wider text-slate-500">
                <th className="px-4 pb-3">Title</th>
                <th className="px-4 pb-3">Workflow</th>
                <th className="px-4 pb-3">Severity</th>
                <th className="px-4 pb-3">Status</th>
                <th className="px-4 pb-3">Created</th>
              </tr>
            </thead>
            <tbody>
              {recentIncidents.map((incident) => (
                <tr key={incident.id} className="border-b border-white/[0.04] transition hover:bg-white/[0.02]">
                  <td className="px-4 py-3.5 text-sm text-white">{incident.title}</td>
                  <td className="px-4 py-3.5 text-sm text-slate-400">
                    {workflows.find((workflow) => workflow.id === incident.workflow_id)?.name ?? "—"}
                  </td>
                  <td className="px-4 py-3.5">
                    <span className="badge" style={{ color: severityColors[incident.severity] }}>
                      {incident.severity}
                    </span>
                  </td>
                  <td className="px-4 py-3.5">
                    <span className="badge" style={{ color: statusColors[incident.status] }}>
                      {incident.status}
                    </span>
                  </td>
                  <td className="px-4 py-3.5 text-sm text-slate-500">
                    {formatDate(incident.created_at)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {!loading && recentIncidents.length === 0 ? (
          <div className="py-10 text-center">
            <p className="text-sm text-slate-500">
              No incidents match the active filters.
            </p>
            <p className="mt-1 text-xs text-slate-600">
              Create your first incident to populate the dashboard.
            </p>
          </div>
        ) : null}
      </Panel>

      {/* Workspace summary */}
      <section className="grid gap-6 xl:grid-cols-[1.1fr_0.9fr]">
        <Panel title="Workspace Status">
          <div className="grid gap-4 md:grid-cols-3">
            <div className="rounded-[var(--radius-lg)] border border-white/8 bg-white/[0.03] p-4">
              <p className="text-xs font-medium text-slate-500">Organizations</p>
              <p className="mt-2 text-2xl font-semibold text-white">{organisations.length}</p>
            </div>
            <div className="rounded-[var(--radius-lg)] border border-white/8 bg-white/[0.03] p-4">
              <p className="text-xs font-medium text-slate-500">Workflows</p>
              <p className="mt-2 text-2xl font-semibold text-white">{workflows.length}</p>
            </div>
            <div className="rounded-[var(--radius-lg)] border border-white/8 bg-white/[0.03] p-4">
              <p className="text-xs font-medium text-slate-500">Filter Range</p>
              <p className="mt-2 text-2xl font-semibold text-white">{filters.dateRange}d</p>
            </div>
          </div>
        </Panel>

        <Panel title="Signal Mix">
          <div className="space-y-4">
            {severityBreakdown.map((item) => (
              <div key={item.label} className="space-y-2">
                <div className="flex items-center justify-between gap-3">
                  <span className="text-xs font-medium" style={{ color: item.color }}>
                    {item.label}
                  </span>
                  <span className="mono text-xs text-slate-500">
                    {item.value}
                  </span>
                </div>
                <div className="h-1.5 rounded-full bg-white/[0.05]">
                  <div
                    className="h-full rounded-full transition-all duration-500"
                    style={{
                      width: `${summary.total === 0 ? 0 : (item.value / summary.total) * 100}%`,
                      background: item.color,
                    }}
                  />
                </div>
              </div>
            ))}
          </div>
        </Panel>
      </section>

      <LogIncidentModal
        open={modalOpen}
        workflows={workflows}
        incidents={incidents}
        onClose={() => setModalOpen(false)}
        onCreated={(incident) => setIncidents((current) => [incident, ...current])}
      />
    </div>
  );
}
