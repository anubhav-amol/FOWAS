import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import { getFailuresByWorkflowId } from "../api/failure.api";

function WorkflowDetail() {
  const { id } = useParams();
  const [failures, setFailures] = useState([]);

  useEffect(() => {
    async function fetchFailures() {
      const data = await getFailuresByWorkflowId(id);
      setFailures(data);
    }
    fetchFailures();
  }, [id]);

  return (
    <div>
      <h2>Workflow Detail</h2>
      <p>Workflow ID: {id}</p>

      <h3>Failures</h3>

      {failures.length === 0 ? (
        <p>No failures logged.</p>
      ) : (
        failures.map((failure) => (
          <div
            key={failure.id}
            style={{
              border: "1px solid #999",
              padding: "10px",
              marginBottom: "10px",
            }}
          >
            <h4>{failure.title}</h4>
            <p>{failure.description}</p>
            <p>Category: {failure.category}</p>
            <p>Severity: {failure.severity}</p>
            <p>Status: {failure.status}</p>
            <small>Created: {failure.createdAt}</small>
            {failure.resolvedAt && (
              <small> | Resolved: {failure.resolvedAt}</small>
            )}
          </div>
        ))
      )}
    </div>
  );
}

export default WorkflowDetail;

