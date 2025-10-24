# Mechanic Workshop Frontend (React)

## 🚗 Overview

=======

<
This React app serves as the front-end for the **Mechanic Workshop API**, a full-stack CRUD system built with Flask and React.  
It allows mechanics to:

- Register and log in
- View and edit profiles
- Manage tickets
- # Toggle between light and dark mode

This React app serves as the front-end for the **Mechanic Workshop API**, a full-stack CRUD system built with Flask and React.  
It allows mechanics to:

- Register and log in
- View and edit profiles
- Manage tickets

=======

This project connects directly to the live Flask API hosted on **Render**.  
No local backend setup required — just start the React app.

---

## 🧩 Tech Stack

=======

- **React + Vite**
- **React Router DOM**
- **Axios** for API requests
- **Context API** for auth
- **Render (Backend)** for live data
- **Postgres (Render DB)**

---

## 🔗 API Connection

The app automatically connects to the live backend:
https://mechanics-api.onrender.com
=======

yaml
Copy code

For local development, the proxy is already configured in `vite.config.js`.

---

## 🧰 Default Login (for testing)

Use these credentials to log in and test CRUD functionality:

| Role     | Email          | Password    |
| -------- | -------------- | ----------- |
| Admin    | admin@shop.com | admin123    |
| Mechanic | alex@shop.com  | password123 |

=======

Use these credentials to log in and test CRUD functionality:

| Role     | Email          | Password    |
| -------- | -------------- | ----------- |
| Admin    | admin@shop.com | admin123    |
| Mechanic | alex@shop.com  | password123 |

=======

---

## 🧠 Run Locally

=======

=======

npm install
npm run dev
Visit:
👉 http://localhost:5173

The app will use your local Flask server if running, or fallback to Render.

🧑‍💻 Features
Full CRUD for Mechanics

JWT authentication with auto token handling

Global light/dark theme toggle

Responsive layout

Card view for mechanic overview

README + visible demo login for grading clarity

🚀 Deployment
Frontend: GitHub → Vercel (or Render)

Backend: GitHub → Render Web Service

Database: Render PostgreSQL

Each service updates automatically on commit.

yaml
Copy code

---

### ✅ Quick Home page edit (`src/views/Home.jsx`)

Add this little note to make grading obvious:

import MechanicCard from "../components/MechanicCard";

const demoMechanics = [
{
name: "Admin Mechanic",
specialty: "Full Diagnostics",
status: "Available",
ticketCount: 2,
onDuty: true,
},
{
name: "Alex Rivera",
specialty: "Brake Systems",
status: "Active",
ticketCount: 3,
onDuty: true,
},
];

export default function Home() {
return (

<div className="view">
<h1>Mechanic Workshop Portal</h1>
<p>

=======

        <strong>Demo Login for Grading:</strong>

=======

        <strong>Demo Login for Grading:</strong>
        Email: <code>admin@shop.com</code> | Password: <code>admin123</code>
      </p>

      <div className="card-grid">
        {demoMechanics.map((m, i) => (
          <MechanicCard key={i} mechanic={m} />
        ))}
      </div>
    </div>

);
}
