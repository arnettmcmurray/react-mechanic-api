# Mechanic Workshop – React Frontend

## 🚗 Overview

This React app serves as the front-end for the **Mechanic Workshop Flask API**, a full-stack CRUD system for managing mechanics, customers, parts, and service tickets.

The frontend provides:

- Mechanic registration and login
- Profile view with assigned tickets
- CRUD controls for mechanics, customers, parts, and tickets
- Ticket display by mechanic and global ticket viewer
- Live connection to Render backend API

---

## 🔗 Backend (Flask API)

Live API:  
👉 [https://mechanics-api.onrender.com](https://mechanics-api.onrender.com)

Swagger Docs:  
👉 [https://mechanics-api.onrender.com/apidocs](https://mechanics-api.onrender.com/apidocs)

All CRUD routes are verified working (`/create`, `/update`, `/delete`, `/get_all`, `/my_tickets`, etc.).

---

## 🧩 Tech Stack

- **React + Vite**
- **React Router DOM**
- **Context API** for authentication
- **Fetch API** for HTTP requests
- **Flask + SQLAlchemy** backend
- **Render** (backend + Postgres DB)

---

## 🧰 Default Login (Seeded User)

| Role  | Email            | Password   |
| ----- | ---------------- | ---------- |
| Admin | `admin@shop.com` | `admin123` |

---

## 🧠 Local Development

To run the React frontend locally while connecting to the live backend:

```bash
npm install
npm run dev
```
