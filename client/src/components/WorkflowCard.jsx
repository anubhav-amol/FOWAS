import { Link } from "react-router-dom";

function WorkflowCard({ workflow }) {
  return (
    <div style={{ border: "1px solid #ccc", padding: "12px", marginBottom: "12px" }}>
      <h3>{workflow.name}</h3>
      <p>{workflow.description}</p>
      <small>Created: {workflow.createdAt}</small>
      <br />
      <Link to={`/workflows/${workflow.id}`}>View Details</Link>
    </div>
  );
}

export default WorkflowCard;
