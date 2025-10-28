export default function MechanicCard({ mechanic }) {
  // Reusable card for mechanic info or ticket summaries
  const { name, specialty, status, ticketCount, onDuty } = mechanic;

  return (
    <div className="card">
      <h3>{name}</h3>
      <h5>{specialty}</h5>
      <p>Status: {status}</p>
      <p>Tickets: {ticketCount}</p>
      <p>{onDuty ? "🟢 On Duty" : "🔴 Off Duty"}</p>
    </div>
  );
}
