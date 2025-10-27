export default function GenericCard({ item }) {
  return (
    <div className="mechanic-card">
      {Object.entries(item).map(([key, value]) => (
        <p key={key}>
          <strong>{key}:</strong>{" "}
          {typeof value === "object" ? JSON.stringify(value) : String(value)}
        </p>
      ))}
    </div>
  );
}
