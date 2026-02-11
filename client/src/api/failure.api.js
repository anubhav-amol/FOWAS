export async function getFailuresByWorkflowId(workflowId) {
  return [
    {
      id: "f1",
      title: "Missing dependency",
      description: "Express not installed",
      category: "dependency",
      severity: "high",
      status: "open",
      createdAt: "2026-02-10",
    },
    {
      id: "f2",
      title: "Incorrect port config",
      description: "App running on wrong port",
      category: "config",
      severity: "medium",
      status: "resolved",
      createdAt: "2026-02-08",
      resolvedAt: "2026-02-09",
    },
  ];
}
