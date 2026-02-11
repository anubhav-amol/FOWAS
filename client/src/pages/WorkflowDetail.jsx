import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import { getFailuresByWorkflowId } from "../api/failure.api";
import FailureCard from "../components/FailureCard";
import { FAILURE_CATEGORIES, FAILURE_SEVERITIES } from "../utils/enums";

function WorkflowDetail() {
  const { id } = useParams();

  const [failures, setFailures] = useState([]);

  const [newFailure, setNewFailure] = useState({
    title: "",
    description: "",
    category: "setup",
    severity: "low",
  });

  useEffect(() => {
    async function fetchFailures() {
      const data = await getFailuresByWorkflowId(id);
      setFailures(data);
    }
    fetchFailures();
  }, [id]);

  function handleSubmit(e) {
    e.preventDefault();

    const failureToAdd = {
      id: Date.now().toString(),
      ...newFailure,
      status: "open",
      createdAt: new Date().toISOString().split("T")[0],
    };

    setFailures((prev) => [...prev, failureToAdd]);

    setNewFailure({
      title: "",
      description: "",
      category: "setup",
      severity: "low",
    });
  }

  return (
    <div>
      <h2>Workflow Detail</h2>
      <p>Workflow ID: {id}</p>

      <h3>Failures</h3>

      {failures.length === 0 ? (
        <p>No failures logged.</p>
      ) : (
        failures.map((failure) => (
          <FailureCard key={failure.id} failure={failure} />
        ))
      )}

      <h3>Add Failure</h3>

      <form onSubmit={handleSubmit}>
        <div>
          <label>Title</label>
          <input
            type="text"
            value={newFailure.title}
            onChange={(e) =>
              setNewFailure({ ...newFailure, title: e.target.value })
            }
            required
          />
        </div>

        <div>
          <label>Description</label>
          <textarea
            value={newFailure.description}
            onChange={(e) =>
              setNewFailure({ ...newFailure, description: e.target.value })
            }
            required
          />
        </div>

        <div>
          <label>Category</label>
          <select
            value={newFailure.category}
            onChange={(e) =>
              setNewFailure({ ...newFailure, category: e.target.value })
            }
          >
            {FAILURE_CATEGORIES.map((cat) => (
              <option key={cat} value={cat}>
                {cat}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label>Severity</label>
          <select
            value={newFailure.severity}
            onChange={(e) =>
              setNewFailure({ ...newFailure, severity: e.target.value })
            }
          >
            {FAILURE_SEVERITIES.map((sev) => (
              <option key={sev} value={sev}>
                {sev}
              </option>
            ))}
          </select>
        </div>

        <button type="submit">Add Failure</button>
      </form>
    </div>
  );
}

export default WorkflowDetail;

