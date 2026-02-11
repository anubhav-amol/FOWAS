function FailureCard({ failure }) {
  return (
    <div
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
  );
}

export default FailureCard;
