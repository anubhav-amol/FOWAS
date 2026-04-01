"use client";

import { useEffect, useState } from "react";
import { Panel } from "@/components/ui/panel";
import { createWorkflow, getOrganisations, getWorkflows } from "@/services/api";
import type { Organisation, Workflow, WorkflowVisibility } from "@/types";

const visibilityOptions: WorkflowVisibility[] = ["PRIVATE", "ORGANISATION", "PUBLIC"];

export default function WorkflowsPage() {
  const [workflows, setWorkflows] = useState<Workflow[]>([]);
  const [organisations, setOrganisations] = useState<Organisation[]>([]);
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [organisationId, setOrganisationId] = useState("");
  const [visibility, setVisibility] = useState<WorkflowVisibility>("PRIVATE");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    async function loadData() {
      setLoading(true);
      setError(null);

      try {
        const [workflowData, organisationData] = await Promise.all([
          getWorkflows(),
          getOrganisations(),
        ]);
        setWorkflows(workflowData);
        setOrganisations(organisationData);
        if (organisationData.length > 0) {
          setOrganisationId((current) => current || organisationData[0].id);
        }
      } catch (loadError) {
        setError(loadError instanceof Error ? loadError.message : "Unable to load workflows");
      } finally {
        setLoading(false);
      }
    }

    void loadData();
  }, []);

  async function handleCreate(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setSubmitting(true);
    setError(null);

    try {
      const workflow = await createWorkflow({
        name,
        description: description || undefined,
        organisation_id: organisationId || undefined,
        visibility,
      });
      setWorkflows((current) => [workflow, ...current]);
      setName("");
      setDescription("");
    } catch (submissionError) {
      setError(
        submissionError instanceof Error ? submissionError.message : "Unable to create workflow",
      );
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="grid gap-6 xl:grid-cols-[0.9fr_1.1fr]">
      <Panel title="Create Workflow" eyebrow="Reliability Scope">
        <form className="space-y-4" onSubmit={handleCreate}>
          <input
            value={name}
            onChange={(event) => setName(event.target.value)}
            className="fowas-input w-full"
            placeholder="Workflow name"
            required
          />
          <textarea
            value={description}
            onChange={(event) => setDescription(event.target.value)}
            className="fowas-input min-h-[140px] w-full resize-y"
            placeholder="Describe the service, pipeline, or operational boundary."
          />
          <select
            value={organisationId}
            onChange={(event) => setOrganisationId(event.target.value)}
            className="fowas-input w-full"
          >
            <option value="">Personal workflow</option>
            {organisations.map((organisation) => (
              <option key={organisation.id} value={organisation.id}>
                {organisation.name}
              </option>
            ))}
          </select>
          <select
            value={visibility}
            onChange={(event) => setVisibility(event.target.value as WorkflowVisibility)}
            className="fowas-input w-full"
          >
            {visibilityOptions.map((option) => (
              <option key={option} value={option}>
                {option}
              </option>
            ))}
          </select>
          {error ? (
            <div className="rounded-[var(--radius-md)] border border-red-500/20 bg-red-500/8 px-4 py-3 text-sm text-red-300">
              {error}
            </div>
          ) : null}
          <button type="submit" disabled={submitting} className="fowas-button px-5 py-2.5 text-[13px]">
            {submitting ? "Creating…" : "Create Workflow"}
          </button>
        </form>
      </Panel>

      <Panel title="Workflow Registry" eyebrow="Visible Workstreams">
        <div className="space-y-3">
          {loading ? (
            <div className="space-y-3">
              {[1, 2].map((i) => (
                <div key={i} className="skeleton h-20 w-full" />
              ))}
            </div>
          ) : workflows.length === 0 ? (
            <div className="py-10 text-center">
              <p className="text-sm text-slate-500">
                No workflows yet.
              </p>
              <p className="mt-1 text-xs text-slate-600">
                Create one to start grouping incidents by operational domain.
              </p>
            </div>
          ) : (
            workflows.map((workflow) => (
              <div key={workflow.id} className="rounded-[var(--radius-lg)] border border-white/8 bg-white/[0.025] p-4">
                <div className="flex flex-wrap items-center justify-between gap-3">
                  <div>
                    <h3 className="text-sm font-semibold text-white">
                      {workflow.name}
                    </h3>
                    <p className="mt-1 text-[13px] text-slate-500">
                      {workflow.description || "No description recorded."}
                    </p>
                  </div>
                  <span className="chip text-xs">
                    {workflow.visibility}
                  </span>
                </div>
              </div>
            ))
          )}
        </div>
      </Panel>
    </div>
  );
}
