const mockFailures = [
  {
    id: "f1",
    workflowId: "w1",
    title: "Missing dependency",
    description: "Express not installed",
    category: "dependency",
    severity: "high",
    status: "open",
    createdAt: "2026-02-10",
  },
  {
    id: "f2",
    workflowId: "w1",
    title: "Incorrect port config",
    description: "App running on wrong port",
    category: "config",
    severity: "medium",
    status: "resolved",
    createdAt: "2026-02-08",
    resolvedAt: "2026-02-09",
    resolutionNotes: "Updated environment variables",
  },
  {
    id: "f3",
    workflowId: "w2",
    title: "Logic bug",
    description: "Incorrect loop condition",
    category: "logic",
    severity: "critical",
    status: "open",
    createdAt: "2026-02-11",
  },
];

export async function getFailuresByWorkflowId(workflowId) {
  return mockFailures.filter(
    (failure) => failure.workflowId === workflowId
  );
}

export async function getAllFailures() {
  return mockFailures;
}

