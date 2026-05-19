# 🏥 Royal Hospital Management System

> **Ku soo dhawoaw Royal Hospital Management System!** Kani waa nidaam dhammaystiran oo casri ah oo loogu talagalay maamulka isbitaalka, isku xirka dhakhaatiirta, bukaanada, kalkaaliyeyaasha, farmashiyaasha, iyo maamulka guud. Wuxuu ku dhisanyahay tignoolajiyada ugu dambeysay ee **MERN Stack** (React, Node.js, Express, MongoDB) isagoo leh nakhshad aad u qurux badan (Premium Glassmorphism Design).

---

## 🚀 Key System Features

The Royal Hospital Management System is a premium enterprise-grade web application optimized for absolute clinical speed, high-fidelity animations, and secure role-based operations.

### 👥 1. Comprehensive Role-Based Access Control (RBAC)
*   **Admin Dashboard**: Features real-time visual analytics charts for revenue, new check-ins, medical department distributions, and total users management.
*   **Doctor Dashboard**: Advanced patient appointments scheduling system, dynamic consultation queue manager, and an interactive **Prescription Builder**.
*   **Nurse Portal**: Real-time patient triage, room allocations, vital signs tracking (Pulse, BP, Temperature).
*   **Pharmacist Dashboard**: Automatic queue populated with prescriptions issued by doctors, status toggles (Pending/Dispensed), and medication tracking.
*   **Patient Portal**: Appointment bookings, medical history logging, download of invoices, and digital prescriptions.
*   **Accountant & Receptionist Portals**: Financial ledger charts, transaction histories, billing/invoice generation, and checkout panels.

### 🎨 2. Premium Design & Interactive UX
*   **Futuristic Landing Page**: Sleek dark-mode theme featuring a custom live ECG/EKG real-time vital animation mockup on the hero canvas.
*   **Unified Fluid Elements**: Glassmorphic headers, custom loaders, responsive sidebars, and smooth scrolling configurations powered by `framer-motion` and `lucide-react`.

---

## 🛠️ Technology Stack

| Layer | Technologies Used |
| :--- | :--- |
| **Frontend** | React (v18), TailwindCSS, Framer Motion, Recharts, Lucide Icons, Axios |
| **Backend** | Node.js, Express.js, JWT (JSON Web Tokens), bcryptjs, Multer |
| **Database** | MongoDB Atlas, Mongoose ODM |
| **Tooling** | Custom Rollup & PostCSS Bundling pipeline, Nodemon |

---

## 📂 Project Structure

```bash
hospital-management-system/
├── backend/
│   ├── src/
│   │   ├── config/          # Database connection & RBAC role configurations
│   │   ├── controllers/     # Business logic for all modules (auth, appointments, bills, etc.)
│   │   ├── middleware/      # Auth gates, error handlers, and file uploaders
│   │   ├── models/          # Mongoose database schemas (User, Patient, Bill, etc.)
│   │   ├── routes/          # Express API endpoints mapping
│   │   ├── seeds/           # Initial demo dataset seeder
│   │   └── server.js        # Main server configuration & endpoint router
│   └── public/              # Static served build assets and public images
├── frontend/
│   ├── src/
│   │   ├── components/      # Shared layout UI (Avatar, Sidebar, Header)
│   │   ├── context/         # React Auth and WebSockets application states
│   │   ├── pages/           # High-fidelity dashboard modules and interactive pages
│   │   ├── router/          # Client-side routing logic
│   │   └── styles.css       # Tailwind base directives and global layers
│   ├── scripts/             # Custom Rollup & PostCSS build script (build.mjs)
│   └── index.html           # Core HTML skeleton
├── package.json             # Root monorepo startup configurations
└── tailwind.config.js       # Global responsive styles tokenization
```

---

## 💻 Installation & Quickstart

Follow these simple steps to run the complete environment locally:

### 1. Prerequisite Configuration
Ensure you have **Node.js (v18+)** and **MongoDB** installed and running on your system.

### 2. Set Up Environment Variables
Create a `.env` file in the **backend** directory:
```env
PORT=5000
MONGODB_URI=mongodb://localhost:27017/royal-hospital
JWT_SECRET=your_super_secret_jwt_key
```

### 3. Install & Start Development Environment
From the project root directory, run:
```bash
# Install root node modules
npm install

# Run the single-port development command (launches nodemon server)
npm run dev
```
Open **[http://localhost:5000](http://localhost:5000)** in your web browser. The backend server automatically serves the compiled React app!

---

## 📊 Database Seeding & Demo Access

Initialize the database with complete sample statistics, registered doctors, nurses, pharmacists, accountants, receptionist profiles, and test patients.

Run this command inside the `backend` folder:
```bash
node src/seeds/seed.js
```

### 🔑 Demo Login Credentials

You can use the following logins to test different roles and explore their custom dashboard layouts:

| Role | Username / Email | Password |
| :--- | :--- | :--- |
| **Administrator** | `admin@hospital.com` | `Password123!` |
| **Doctor** | `doctor@hospital.com` | `Password123!` |
| **Patient** | `patient@hospital.com` | `Password123!` |
| **Nurse** | `nurse@hospital.com` | `Password123!` |
| **Pharmacist** | `pharmacist@hospital.com` | `Password123!` |
| **Accountant** | `accountant@hospital.com` | `Password123!` |

---

## 📦 Production Builds

To package the frontend assets using the custom build tool:
```bash
npm run build
```
This runs the rollup compiler (`frontend/scripts/build.mjs`) which transpiles all React/JSX code, processes Tailwind stylesheets, and outputs single-file artifacts under `backend/public/assets` ready for static serving.

---
*Built with ❤️ for Mohamed Turaab - Royal Hospital Team.*
