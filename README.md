# Hospital Management System

## Features
- JWT authentication with bcrypt password hashing
- Role-based access control for Admin, Doctor, Nurse, Patient, Pharmacist
- Profile image support stored as URL in MongoDB
- Patients, doctors, appointments, prescriptions APIs
- React + Tailwind dashboard UI with sidebar and top avatar header

## Project Structure
- `backend/`
- `frontend/`

## Run Backend
1. `cd backend`
2. Copy `.env.example` to `.env` and fill values
3. `npm install`
4. `npm run dev`

## Seed Demo Data
- `node src/seeds/seed.js`

Demo login:
- `admin@hospital.com` / `Password123!`
- `doctor@hospital.com` / `Password123!`
- `patient@hospital.com` / `Password123!`

## One Port Dev
1. From the project root, run `npm run dev`
2. Open `http://localhost:5000`
3. The backend API and React frontend will both come from that same port

## Notes
- Frontend points to `/api`
- Replace placeholder avatars with real uploaded URLs as needed
