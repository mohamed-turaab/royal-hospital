# Royal Hospital Management System

Royal Hospital Management System is a full-stack MERN-style hospital operations platform. It brings clinical, administrative, financial, laboratory, pharmacy, and reporting workflows into one role-based web application.

The system is designed around real hospital handoffs:

- doctors request care services,
- reception collects payments,
- nurses prepare clinical handoffs,
- lab technicians upload results,
- pharmacists dispense paid prescriptions,
- accountants submit revenue reports,
- admins supervise the entire operation.

The app is served from one Express server. The backend exposes `/api/*` routes and also serves the compiled React frontend from `backend/public`.

---

## Table Of Contents

- [Core Idea](#core-idea)
- [Feature Overview](#feature-overview)
- [Role-Based Access](#role-based-access)
- [Technology Stack](#technology-stack)
- [Architecture](#architecture)
- [Project Structure](#project-structure)
- [Backend Modules](#backend-modules)
- [Frontend Modules](#frontend-modules)
- [Main Workflows](#main-workflows)
- [Data Models](#data-models)
- [API Overview](#api-overview)
- [Notifications](#notifications)
- [Images And Uploads](#images-and-uploads)
- [Environment Variables](#environment-variables)
- [Installation](#installation)
- [Running The App](#running-the-app)
- [Building The Frontend](#building-the-frontend)
- [Seeding Demo Data](#seeding-demo-data)
- [Demo Credentials](#demo-credentials)
- [Testing Checklist](#testing-checklist)
- [Troubleshooting](#troubleshooting)
- [Development Notes](#development-notes)
- [Deployment Notes](#deployment-notes)

---

## Core Idea

This project is not only a dashboard. It is a workflow system. Most actions in one role create a task for another role.

Examples:

- A doctor creates a lab test request. A billing item is automatically created for reception.
- A receptionist pays the bill. The lab test becomes available to the nurse.
- A nurse forwards one or more sample/procedure types. The lab technician receives the work.
- A lab technician uploads the result. The doctor can view it.
- An accountant submits a revenue report. Admin receives a notification and can approve/reject it.

The goal is to make hospital movement visible: who requested something, who paid for it, who handled it, and what happened next.

---

## Feature Overview

### Authentication

- Login with email and password.
- JWT-based session stored in local storage.
- Protected frontend routes.
- Protected backend routes.
- Role-based authorization middleware.

### Admin

- Admin dashboard with analytics.
- User management.
- Revenue report review through notification links.
- Approve or reject accountant revenue reports.
- Access to major operational sections.

### Doctor

- Doctor dashboard.
- Appointment views.
- Prescription creation.
- Lab test request creation.
- Lab result review.

### Receptionist

- Receptionist dashboard.
- Appointment and room flow.
- Billing and checkout.
- Collects payments for:
  - lab tests,
  - medicines,
  - consultations,
  - surgeries,
  - other services.

### Nurse

- Nurse dashboard.
- Patient and room workflow visibility.
- Receives lab tests only after payment.
- Forwards one or more sample/procedure types to lab:
  - Blood Sample,
  - Urine Sample,
  - Stool Sample,
  - X-Ray Imaging,
  - Ultrasound Imaging,
  - CT Scan Imaging,
  - MRI Imaging,
  - ECG Reading,
  - Culture Swab,
  - Other.

### Lab Technician

- Lab Technician dashboard.
- Receives only tests ready for lab analysis.
- Views nurse handoff notes.
- Uploads result notes and optional result file.
- Marks lab tests as completed.

### Pharmacist

- Pharmacy dashboard.
- Sees paid prescriptions ready for pharmacy.
- Dispenses medicine after checkout is completed.

### Accountant

- Accountant dashboard.
- Views live front-desk collections.
- Submits revenue reports to Admin.
- Report includes:
  - total revenue,
  - total expenses,
  - net profit,
  - pending invoices,
  - notes,
  - chart data.

### Patient

- Patient dashboard.
- Appointment, prescription, billing, and lab history visibility depending on available data.

---

## Role-Based Access

Roles are defined in both frontend and backend.

Frontend role/navigation config:

```text
frontend/src/config/roles.js
```

Backend role enum:

```text
backend/src/config/roles.js
backend/src/models/User.js
```

Important app roles:

- `Admin`
- `Doctor`
- `Nurse`
- `Receptionist`
- `Patient`
- `Pharmacist`
- `Accountant`
- `Lab Technician`

The frontend prevents users from opening another role's dashboard by using role-gated routes. The backend also protects APIs with authorization middleware, so access control does not rely only on the UI.

---

## Technology Stack

| Layer | Technology | Purpose |
| --- | --- | --- |
| Frontend | React 18 | UI and role dashboards |
| Routing | React Router DOM | Client-side route handling |
| API Client | Axios | HTTP API requests |
| Styling | Tailwind CSS | Utility-first styling |
| Motion | Framer Motion | Page transitions and UI animation |
| Charts | Recharts | Revenue and analytics charts |
| Icons | Lucide React | UI icons |
| Backend | Node.js | JavaScript runtime |
| Server | Express.js | API and static file server |
| Database | MongoDB | Persistent application data |
| ODM | Mongoose | MongoDB schema/model layer |
| Auth | JWT, bcryptjs | Login and password hashing |
| Uploads | Multer | Lab/report file upload handling |
| Build | Rollup, Sucrase, PostCSS | Custom frontend build |
| Dev | Nodemon | Auto-restart backend server |

---

## Architecture

```text
Browser
  |
  | React app served from backend/public
  v
Express Server :5000
  |
  | /api/auth
  | /api/patients
  | /api/doctors
  | /api/appointments
  | /api/prescriptions
  | /api/bills
  | /api/lab-tests
  | /api/notifications
  | /api/revenue-reports
  | /api/transactions
  | /api/analytics
  v
MongoDB
```

The frontend is compiled into:

```text
backend/public/assets/app.js
backend/public/assets/app.css
backend/public/index.html
```

The backend serves:

- API routes at `/api/*`
- frontend static files at `/`
- lab result uploads at `/uploads/*`

---

## Project Structure

```text
royal-hospital/
  backend/
    public/
      assets/                  Generated frontend JS/CSS
      images/                  Generated public images copied from frontend/public
      uploads/                 Runtime report uploads served by backend
      vendor/                  Vendor UMD bundles used by build output
      index.html               Generated frontend HTML

    src/
      config/
        roles.js               Backend role list
        upload.js              Lab result upload config
        db.js                  Optional DB helper

      controllers/
        analyticsController.js
        appointmentController.js
        authController.js
        billController.js
        doctorController.js
        labTestController.js
        notificationController.js
        patientController.js
        prescriptionController.js
        reportController.js
        revenueReportController.js
        roomController.js
        transactionController.js

      middleware/
        auth.js                JWT protection and authorize middleware
        error.js
        rateLimit.js
        roleGuard.js
        upload.js              Report upload middleware

      models/
        Appointment.js
        Bill.js
        Doctor.js
        LabTest.js
        Notification.js
        Patient.js
        Prescription.js
        Report.js
        RevenueReport.js
        Room.js
        Transaction.js
        User.js

      routes/
        analyticsRoutes.js
        appointmentRoutes.js
        authRoutes.js
        billRoutes.js
        doctorRoutes.js
        index.js
        labTests.js
        notifications.js
        patientRoutes.js
        prescriptionRoutes.js
        reportRoutes.js
        revenueReportRoutes.js
        roomRoutes.js
        transactionRoutes.js

      seed.js                  Main demo seed file
      server.js                Express entry point

  frontend/
    public/
      images/
        doctors/
        nurses/
        logo.svg

    scripts/
      build.mjs                Custom build pipeline

    src/
      components/
        Avatar.jsx
        BrandLogo.jsx
        Layout.jsx
        PrintablePrescription.jsx

      config/
        roles.js

      context/
        AuthContext.jsx
        SocketContext.jsx

      pages/
        Appointments.jsx
        BillingCheckout.jsx
        Doctors.jsx
        Home.jsx
        LabTests.jsx
        Login.jsx
        Patients.jsx
        Profile.jsx
        Rooms.jsx
        SectionPage.jsx
        Signup.jsx
        AdminAnalytics.jsx
        dashboards/
        doctor/
        pharmacist/

      router/
        AppRouter.jsx

      services/
        api.js
        roomService.js

      main.jsx
      styles.css

  uploads/
    lab-results/               Runtime lab result uploads

  .env                         Local environment variables
  .gitignore
  package.json
  README.md
```

---

## Backend Modules

### Authentication

Files:

```text
backend/src/controllers/authController.js
backend/src/routes/authRoutes.js
backend/src/middleware/auth.js
backend/src/models/User.js
```

Responsibilities:

- login,
- register,
- current user lookup,
- user management,
- password hashing,
- token generation,
- route protection,
- role authorization.

### Billing

Files:

```text
backend/src/controllers/billController.js
backend/src/routes/billRoutes.js
backend/src/models/Bill.js
backend/src/models/Transaction.js
```

Responsibilities:

- create bills,
- list unpaid/paid bills,
- checkout multiple bills,
- create transaction logs,
- move prescriptions to pharmacy after medicine payment,
- move lab tests to nurse after lab payment.

### Lab Tests

Files:

```text
backend/src/controllers/labTestController.js
backend/src/routes/labTests.js
backend/src/models/LabTest.js
backend/src/config/upload.js
```

Responsibilities:

- doctor creates lab request,
- create billing record for lab fee,
- receptionist payment unlocks nurse workflow,
- nurse forwards multiple sample/procedure types,
- lab uploads results,
- doctor views completed results.

### Notifications

Files:

```text
backend/src/controllers/notificationController.js
backend/src/routes/notifications.js
backend/src/models/Notification.js
frontend/src/context/SocketContext.jsx
frontend/src/components/Layout.jsx
```

Responsibilities:

- create notifications for users or roles,
- fetch current user's notifications,
- mark one read,
- mark all read,
- clear notifications,
- show View button for linked notifications,
- refresh every 5 seconds without page reload.

### Revenue Reports

Files:

```text
backend/src/controllers/revenueReportController.js
backend/src/routes/revenueReportRoutes.js
backend/src/models/RevenueReport.js
frontend/src/pages/dashboards/AccountantDashboard.jsx
frontend/src/pages/dashboards/AdminDashboard.jsx
```

Responsibilities:

- accountant submits revenue report,
- admin receives notification,
- admin opens report details from notification,
- admin approves or rejects report.

---

## Frontend Modules

### App Entry

```text
frontend/src/main.jsx
frontend/src/router/AppRouter.jsx
```

The app is wrapped with:

- `AuthProvider`
- notification/socket-like provider
- browser router

### Layout

```text
frontend/src/components/Layout.jsx
```

Provides:

- sidebar navigation,
- top bar,
- profile menu,
- notifications dropdown,
- Read All,
- Clear/Clear All,
- View notification action,
- emergency mock button.

### Auth Context

```text
frontend/src/context/AuthContext.jsx
```

Stores:

- logged-in user,
- token,
- login/logout functions,
- theme preference.

### Notification Context

```text
frontend/src/context/SocketContext.jsx
```

Despite the name, it currently uses API polling. It fetches notifications every 5 seconds and on window focus.

---

## Main Workflows

### 1. Lab Test Workflow

This is one of the most important connected workflows.

```text
Doctor
  creates lab test + fee
  |
  v
Bill
  created automatically as Unpaid
  |
  v
Receptionist
  collects payment in Billing & Checkout
  |
  v
Nurse
  forwards sample/procedure types
  |
  v
Lab Technician
  uploads result text/file
  |
  v
Doctor
  views completed result
```

Detailed behavior:

1. Doctor opens `Lab Tests`.
2. Doctor clicks `Request Lab Test`.
3. Doctor chooses patient, test name, notes, and fee.
4. Backend creates a `LabTest` with status `Pending Payment`.
5. Backend creates a matching `Bill` with `itemType: Lab Test`.
6. Receptionist opens `Billing`.
7. Patients with unpaid bills appear first, sorted by newest unpaid bill.
8. Receptionist selects patient and pays the bill.
9. Backend marks bill `Paid`.
10. If the bill is a lab bill, backend updates lab test to `Pending Sample`.
11. Nurse opens `Lab Tests`.
12. Nurse selects multiple sample/procedure types if needed.
13. Nurse adds handoff notes and sends to lab.
14. Backend updates lab test to `Pending Lab`.
15. Lab Technician opens `Lab Tests`.
16. Lab Technician sees nurse handoff and uploads result text/file.
17. Backend updates lab test to `Completed`.
18. Doctor opens `Lab Tests` and views result.

### 2. Prescription To Pharmacy Workflow

```text
Doctor creates prescription
  |
  v
Medicine bill is created
  |
  v
Receptionist receives payment
  |
  v
Prescription becomes Pending Pharmacy
  |
  v
Pharmacist dispenses medicine
```

### 3. Accountant To Admin Report Workflow

```text
Accountant submits report
  |
  v
RevenueReport saved as Pending Approval
  |
  v
Admin notification created
  |
  v
Admin clicks View
  |
  v
Report modal opens
  |
  v
Admin approves or rejects
```

### 4. Notification Workflow

Notifications can be created by backend controllers. They are shown in the layout dropdown.

Actions:

- `Read All`: marks all current notifications as read.
- `Clear`: shown when there is one notification.
- `Clear All`: shown when there are multiple notifications.
- `View`: shown when a notification has a link.

Refresh behavior:

- notifications are fetched every 5 seconds,
- notifications are fetched again when the browser tab gains focus,
- no full page reload is required.

---

## Data Models

### User

Stores login identity and role.

Important fields:

- `name`
- `email`
- `password`
- `role`
- `status`
- `profileImage`

### Patient

Stores patient profile.

Important fields:

- `user`
- `name`
- `age`
- `gender`
- `bloodGroup`
- `phone`
- `address`
- `condition`
- `status`
- `room`

### Doctor

Stores doctor profile connected to a user.

Important fields:

- `user`
- `name`
- `specialization`
- `phone`
- `profileImage`

### Bill

Stores payable items.

Important fields:

- `patient`
- `patientName`
- `itemType`
- `itemName`
- `amount`
- `status`
- `referenceId`
- `orderedBy`

Bill types:

- `Medicine`
- `Lab Test`
- `Surgery`
- `Consultation`
- `Other`

### LabTest

Stores lab workflow status and result.

Important fields:

- `patient`
- `doctor`
- `testName`
- `notes`
- `status`
- `resultText`
- `resultFileUrl`
- `specimenType`
- `specimenTypes`
- `sampleNotes`
- `labTechnician`
- `nurse`
- `paymentConfirmedBy`
- `paymentConfirmedAt`
- `sampleCollectedAt`
- `resultUploadedAt`

Statuses:

- `Pending Payment`
- `Pending Sample`
- `Pending Lab`
- `Completed`

### RevenueReport

Stores accountant reports.

Important fields:

- `reporter`
- `reporterName`
- `title`
- `totalRevenue`
- `totalExpenses`
- `netProfit`
- `pendingInvoices`
- `status`
- `notes`
- `chartsData`

Statuses:

- `Pending Approval`
- `Approved`
- `Rejected`

### Notification

Stores user notifications.

Important fields:

- `recipient`
- `title`
- `body`
- `type`
- `link`
- `read`

---

## API Overview

Base path:

```text
/api
```

### Auth

```text
POST   /api/auth/login
POST   /api/auth/register
GET    /api/auth/me
GET    /api/auth/users
POST   /api/auth/users
PUT    /api/auth/users/:id
DELETE /api/auth/users/:id
```

### Patients

```text
GET    /api/patients
POST   /api/patients
PUT    /api/patients/:id
DELETE /api/patients/:id
```

### Doctors

```text
GET    /api/doctors
POST   /api/doctors
PUT    /api/doctors/:id
DELETE /api/doctors/:id
```

### Appointments

```text
GET    /api/appointments
POST   /api/appointments
PUT    /api/appointments/:id
DELETE /api/appointments/:id
```

### Prescriptions

```text
GET    /api/prescriptions
POST   /api/prescriptions
PATCH  /api/prescriptions/:id/status
```

### Billing

```text
GET    /api/bills
POST   /api/bills
POST   /api/bills/checkout
```

Query examples:

```text
/api/bills?status=Unpaid
/api/bills?patientId=<patientId>&status=Unpaid
```

### Lab Tests

```text
GET    /api/lab-tests
POST   /api/lab-tests
PATCH  /api/lab-tests/:id/pay
PATCH  /api/lab-tests/:id/collect
PATCH  /api/lab-tests/:id/result
GET    /api/lab-tests/:id
```

Note: normal receptionist payment should happen through `/api/bills/checkout`, not manually through `/:id/pay`.

### Notifications

```text
GET    /api/notifications
PATCH  /api/notifications/read-all
PATCH  /api/notifications/:id/read
DELETE /api/notifications/clear
```

### Revenue Reports

```text
GET    /api/revenue-reports
POST   /api/revenue-reports
PATCH  /api/revenue-reports/:id/status
```

### Transactions

```text
GET    /api/transactions
GET    /api/transactions/stats
```

### Analytics

```text
GET    /api/analytics/admin
```

---

## Notifications

Notifications are stored in MongoDB and fetched by the frontend.

Backend helper:

```text
createNotification({
  recipientIds: [],
  roles: [],
  title,
  body,
  type,
  link
})
```

If `roles` is provided, the backend finds all users with those roles and creates notifications for them.

Notification types:

- `info`
- `success`
- `warning`
- `error`

Example:

When an accountant submits a revenue report, the backend creates an Admin notification with a link like:

```text
/admin/dashboard?report=<reportId>
```

The Admin can click `View` and open the report modal directly.

---

## Images And Uploads

### Source Images

Edit and organize source images here:

```text
frontend/public/images/
```

Current structure:

```text
frontend/public/images/
  logo.svg
  doctors/
    doctor1.png
    doctor2.png
    doctor3.png
    doctor4.png
  nurses/
    nurse1.png
    nurse2.png
```

During build, these are copied into:

```text
backend/public/images/
```

Do not edit `backend/public/images` directly unless you know it is temporary output.

### Runtime Uploads

Lab result uploads:

```text
uploads/lab-results/
```

Report uploads:

```text
backend/public/uploads/reports/
```

Uploaded files are ignored by git. `.gitkeep` files preserve the folder structure.

---

## Environment Variables

Example:

```env
PORT=5000
MONGODB_URI=mongodb://127.0.0.1:27017/hospital_management
JWT_SECRET=replace_with_a_long_secure_secret
JWT_EXPIRES_IN=7d
CLIENT_URL=http://localhost:5000
```

The server loads environment variables from:

```text
backend/.env
```

If `PORT` is missing, the server defaults to `5000`.

---

## Installation

Install root dependencies:

```bash
npm install
```

Install frontend dependencies:

```bash
npm --prefix frontend install
```

Install backend dependencies:

```bash
npm --prefix backend install
```

---

## Running The App

Start development server:

```bash
npm run dev
```

Open:

```text
http://localhost:5000
```

The root command runs:

```text
nodemon backend/src/server.js
```

---

## Building The Frontend

Build command:

```bash
npm run build
```

This runs:

```text
npm --prefix frontend run build
```

Frontend build script:

```text
frontend/scripts/build.mjs
```

Generated output:

```text
backend/public/assets/app.js
backend/public/assets/app.css
backend/public/index.html
backend/public/vendor/*
backend/public/images/*
```

---

## Seeding Demo Data

Run:

```bash
node backend/src/seed.js
```

The seed script creates demo users for all main roles plus patients, doctors, appointments, prescriptions, and rooms.

Important: the seed script clears existing users, patients, doctors, appointments, prescriptions, and rooms before recreating demo data.

---

## Demo Credentials

Seed password:

```text
admin123
```

| Role | Email | Password |
| --- | --- | --- |
| Admin | `admin@hospital.com` | `admin123` |
| Doctor | `amina@hospital.com` | `admin123` |
| Receptionist | `leyla@hospital.com` | `admin123` |
| Nurse | `hodan@hospital.com` | `admin123` |
| Lab Technician | `lab@hospital.com` | `admin123` |
| Patient | `jama@hospital.com` | `admin123` |
| Pharmacist | `kadiro@hospital.com` | `admin123` |
| Accountant | `nuur@hospital.com` | `admin123` |

Additional doctors:

```text
ibrahim@hospital.com
halima@hospital.com
ahmed@hospital.com
```

Additional nurses:

```text
ali_n@hospital.com
maryam@hospital.com
bashir@hospital.com
```

Additional patients:

```text
barni@hospital.com
caydiid@hospital.com
xaawo@hospital.com
```

---

## Testing Checklist

### Lab Flow

1. Login as Doctor.
2. Open `Lab Tests`.
3. Create a lab request with fee.
4. Logout.
5. Login as Receptionist.
6. Open `Billing`.
7. Select the patient.
8. Confirm the lab bill appears with reason `Lab Test`.
9. Pay the bill.
10. Logout.
11. Login as Nurse.
12. Open `Lab Tests`.
13. Confirm the test appears as `Pending Sample`.
14. Choose multiple sample/procedure types.
15. Send to Lab.
16. Logout.
17. Login as Lab Technician.
18. Open `Lab Tests`.
19. Confirm nurse handoff appears.
20. Upload result.
21. Logout.
22. Login as Doctor.
23. Open `Lab Tests`.
24. View completed result.

### Accountant Report Flow

1. Login as Accountant.
2. Submit a revenue report.
3. Logout.
4. Login as Admin.
5. Wait up to 5 seconds.
6. Open notifications.
7. Click `View`.
8. Confirm report modal opens.
9. Approve or reject the report.

### Billing Sorting

1. Create unpaid bills for multiple patients.
2. Open Receptionist Billing.
3. Confirm patients with unpaid balances appear first.
4. Confirm the newest unpaid patient appears at the top.

### Notification Actions

1. Create one notification.
2. Confirm button says `Clear`.
3. Create more than one notification.
4. Confirm button says `Clear All`.
5. Confirm `Read All` marks notifications read.
6. Confirm `View` opens linked pages.

---

## Troubleshooting

### `npm run dev` does not start

Check if another process is using port 5000.

PowerShell:

```powershell
Get-NetTCPConnection -LocalPort 5000 -State Listen
```

Stop the process if needed:

```powershell
Stop-Process -Id <PID> -Force
```

### Browser shows a blank page

Run:

```bash
npm run build
npm run dev
```

Then refresh:

```text
http://localhost:5000
```

### Login fails

Check:

- MongoDB is running.
- `backend/.env` has the correct `MONGODB_URI`.
- You seeded the database with `node backend/src/seed.js`.
- You are using the correct seed password: `admin123`.

### Images do not show

Check source images:

```text
frontend/public/images/
```

Run:

```bash
npm run build
```

The images should appear in:

```text
backend/public/images/
```

### Lab result file does not open

Check that the file exists in:

```text
uploads/lab-results/
```

The browser URL should look like:

```text
/uploads/lab-results/<filename>
```

### Notifications do not appear immediately

Wait up to 5 seconds, or click the browser tab/window again. Notifications fetch on a 5-second interval and on window focus.

---

## Development Notes

- Edit frontend code in `frontend/src`.
- Edit frontend source images in `frontend/public/images`.
- Do not edit generated files in `backend/public/assets` manually.
- Runtime upload files should not be committed.
- `backend/public` is server output, not the main frontend source.
- Billing is the main payment gate for paid clinical services.
- The lab test payment flow is intentionally connected to Billing & Checkout, not a separate Receptionist Lab Tests screen.

---

## Deployment Notes

Before production deployment:

- Use a strong `JWT_SECRET`.
- Use MongoDB Atlas or a managed MongoDB instance.
- Enable HTTPS.
- Restrict CORS to the deployed frontend domain.
- Review static cache headers.
- Store uploaded files in durable storage if deploying to ephemeral servers.
- Add backup policy for MongoDB.
- Add proper logging and monitoring.
- Review rate limiting and auth security.
- Avoid committing `.env` and runtime uploads.

---

## Current Runtime Summary

Default local URL:

```text
http://localhost:5000
```

Main API base:

```text
/api
```

Frontend build output:

```text
backend/public
```

Source image folder:

```text
frontend/public/images
```

Lab uploads folder:

```text
uploads/lab-results
```
