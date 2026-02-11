import { useState } from "react";

function FailureCard({ failure, onResolve }) {
  const isResolved = failure.status === "resolved";

  const [showResolveInput, setShowResolveInput] = useState(false);
  const [notes, setNotes] = useState("");

  function handleResolveClick() {
    setShowResolveInput(true);
  }

  function handleConfirmResolve() {
    if (!notes.trim()) return;

    onResolve(failure.id, notes);
    setShowResolveInput(false);
    setNotes("");
  }

  function getSeverityColor(severity) {
    switch (severity) {
      case "low":
        return "#e6f4ea";
      case "medium":
        return "#fff4e5";
      case "high":
        return "#fdecea";
      case "critical":
        return "#f8d7da";
      default:
        return "#ffffff";
    }
  }

  return (
    <div
      style={{
        border: "1px solid #999",
        padding: "10px",
        marginBottom: "10px",
        backgroundColor: isResolved
          ? "#f0f0f0"
          : getSeverityColor(failure.severity),
      }}
    >
      <h4>{failure.title}</h4>
      <p>{failure.description}</p>
      <p><strong>Category:</strong> {failure.category}</p>
      <p><strong>Severity:</strong> {failure.severity}</p>
      <p><strong>Status:</strong> {failure.status}</p>

      <small>Created: {failure.createdAt}</small>
      {failure.resolvedAt && (
        <small> | Resolved: {failure.resolvedAt}</small>
      )}

      {failure.resolutionNotes && (
        <p>
          <strong>Resolution Notes:</strong> {failure.resolutionNotes}
        </p>
      )}

      {!isResolved && !showResolveInput && (
        <div style={{ marginTop: "8px" }}>
          <button onClick={handleResolveClick}>
            Mark as Resolved
          </button>
        </div>
      )}

      {!isResolved && showResolveInput && (
        <div style={{ marginTop: "8px" }}>
          <textarea
            placeholder="Enter resolution notes..."
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
          />
          <br />
          <button onClick={handleConfirmResolve}>
            Confirm Resolution
          </button>
        </div>
      )}
    </div>
  );
}

export default FailureCard;

