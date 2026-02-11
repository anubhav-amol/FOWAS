import { useEffect, useState } from "react";
import { getAllFailures } from "../api/failure.api";

function Dashboard() {
  const [failures, setFailures] = useState([]);

  useEffect(() => {
    async function fetchData() {
      const data = await getAllFailures();
      setFailures(data);
    }
    fetchData();
  }, []);

  const totalFailures = failures.length;

  const openCount = failures.filter(
    (f) => f.status === "open"
  ).length;

  const resolvedCount = failures.filter(
    (f) => f.status === "resolved"
  ).length;

  const severityCounts = failures.reduce((acc, failure) => {
    acc[failure.severity] =
      (acc[failure.severity] || 0) + 1;
    return acc;
  }, {});

  const recentFailures = [...failures]
    .sort(
      (a, b) =>
        new Date(b.createdAt) - new Date(a.createdAt)
    )
    .slice(0, 5);

  return (
    <div>
      <h2>Dashboard</h2>

      <h3>Overview</h3>
      <p>Total Failures: {totalFailures}</p>
      <p>Open: {openCount}</p>
      <p>Resolved: {resolvedCount}</p>

      <h3>Severity Distribution</h3>
      {Object.keys(severityCounts).map((severity) => (
        <p key={severity}>
          {severity}: {severityCounts[severity]}
        </p>
      ))}

      <h3>Recent Failures</h3>
      {recentFailures.map((failure) => (
        <div key={failure.id}>
          <strong>{failure.title}</strong> —{" "}
          {failure.severity} ({failure.status})
        </div>
      ))}
    </div>
  );
}

export default Dashboard;

