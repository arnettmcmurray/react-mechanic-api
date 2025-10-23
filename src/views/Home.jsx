import MechanicCard from "../components/MechanicCard";

const demoMechanics = [
  {
    name: "Arnett McMurray",
    specialty: "Engine Diagnostics",
    status: "Busy",
    ticketCount: 3,
    onDuty: true,
  },
  {
    name: "Sean Currie",
    specialty: "Brake Systems",
    status: "Available",
    ticketCount: 1,
    onDuty: true,
  },
  {
    name: "Dylan Katina",
    specialty: "Electrical Repair",
    status: "Off Duty",
    ticketCount: 4,
    onDuty: false,
  },
];

export default function Home() {
  return (
    <div className="view">
      <h1>Mechanic Dashboard</h1>
      <p>Active mechanics and their current status</p>

      <div className="card-grid">
        {demoMechanics.map((m, i) => (
          <MechanicCard key={i} mechanic={m} />
        ))}
      </div>
    </div>
  );
}
