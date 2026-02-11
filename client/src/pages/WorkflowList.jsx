import { useEffect, useState } from "react";
import { getWorkflows } from "../api/workflow.api";

function WorkflowList() {
  const [workflows, setWorkflows] = useState([]);

  useEffect(() => {
    async function fetchData() {
      const data = await getWorkflows();
      setWorkflows(data);
    }
    fetchData();
  }, []);

  return (
    <div>
      <h2>Workflows</h2>

      {workflows.length === 0 ? (
        <p>No workflows found.</p>
      ) : (
        <ul>
          {workflows.map((workflow) => (
            <li key={workflow.id}>
              <h3>{workflow.name}</h3>
              <p>{workflow.description}</p>
              <small>Created: {workflow.createdAt}</small>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

export default WorkflowList;

