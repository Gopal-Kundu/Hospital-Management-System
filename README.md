# 🏥 Hospital Management System (HMS)

### A Modern Full-Stack Hospital Management Platform
*Developed as part of the **TEN - The Entrepreneurship Network** Internship Program.*

---

## 📖 Overview

The **Hospital Management System (HMS)** is a full-stack web application designed to simplify hospital operations by providing a secure and user-friendly platform for both **Patients** and **Administrators**.

The system allows patients to register, verify their accounts via a 4-digit OTP, book appointments, and manage their medical visits, while administrators can efficiently manage doctors, patients, and appointments from a centralized dashboard.

Built using the **MERN Stack**, the application follows modern development practices with secure authentication, role-based authorization, responsive UI, and clean architecture.

---

# 🚀 Live Features

## 👤 Patient Module

- Secure Registration & Login
- JWT Authentication using HttpOnly Cookies
- **4-Digit OTP Account Verification (using EmailJS)**
- View Personal Dashboard
- Book Doctor Appointments
- Select Doctor & Department
- Choose Appointment Date
- Add Symptoms During Booking
- View Appointment History
- Cancel Pending Appointments
- Profile Management

---

## 👨‍⚕️ Admin Module

- Secure Admin Login
- Dashboard Analytics
- Manage Doctors
- Add New Doctors
- Delete Doctors
- View All Patients
- Search Patients
- Delete Patient Records
- View All Appointments
- Approve Appointments
- Mark Appointments as Completed
- Cancel Appointments
- Filter Appointments by Status

---

## 👨‍⚕️ Doctor Management

- Add Doctor Details
- Department Selection
- Doctor Availability
- View All Doctors
- Remove Doctors

---

## 📅 Appointment Management

- Book Appointment
- Date Validation
- Appointment Status Tracking
- Pending
- Approved
- Completed
- Cancelled

---

# 🔒 Authentication & Security

- JWT Authentication
- HttpOnly Cookie Sessions
- Password Hashing using bcrypt
- **4-Digit OTP Verification for New Accounts**
- **Email Validation using `validator` NPM package**
- Protected Routes
- Role-Based Authorization
- Secure Backend APIs
- Input Validation

---

# 🎨 User Interface

- Responsive Design
- Modern Medical Theme
- Mobile Friendly
- Clean Dashboard
- Fast Navigation
- Premium UI Components

---

# 🛠️ Tech Stack

## Frontend

- React
- Vite
- JavaScript
- Tailwind CSS
- Redux Toolkit
- React Router DOM
- Axios
- Lucide React

## Backend

- Node.js
- Express.js
- MongoDB
- Mongoose

## Authentication & Validation

- JWT
- Cookies
- bcrypt
- **validator** (NPM package)

## File Upload & Emailing

- Multer
- Cloudinary
- **EmailJS** (`@emailjs/nodejs`)

---

# 📂 Project Structure

```text
Hospital-Management-System/
│
├── backend/
│   ├── config/
│   ├── controllers/
│   ├── middleware/
│   ├── models/
│   ├── routes/
│   ├── utils/
│   ├── uploads/
│   ├── .env
│   ├── package.json
│   └── server.js
│
├── frontend/
│   ├── public/
│   ├── src/
│   │   ├── assets/
│   │   ├── components/
│   │   ├── pages/
│   │   ├── redux/
│   │   ├── services/
│   │   ├── utils/
│   │   ├── App.jsx
│   │   └── main.jsx
│   │
│   ├── package.json
│   └── vite.config.js
│
└── README.md
```

---

# ⚙️ Installation

## Prerequisites

- Node.js (v18 or later)
- MongoDB Atlas
- Cloudinary Account
- EmailJS Account
- Git

---

## Clone Repository

```bash
git clone <repository-url>
cd Hospital-Management-System
```

---

# Backend Setup

```bash
cd backend
npm install
```

Create a **.env** file.

```env
PORT=5000

MONGODB_URI=your_mongodb_connection

JWT_SECRET=your_jwt_secret

CLIENT_URL=http://localhost:5173

CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret

EMAILJS_SERVICE_ID=your_emailjs_service_id
EMAILJS_TEMPLATE_ID=your_emailjs_template_id
EMAILJS_PUBLIC_KEY=your_emailjs_public_key
VITE_EMAILJS_SERVICE_ID=your_emailjs_service_id
VITE_EMAILJS_TEMPLATE_ID=your_emailjs_template_id
VITE_EMAILJS_PUBLIC_KEY=your_emailjs_public_key
```

Start Backend

```bash
npm run dev
```

---

# Frontend Setup

```bash
cd frontend
npm install
```

Start Frontend

```bash
npm run dev
```

---

# 🌐 Application URLs

Frontend

```
http://localhost:5173
```

Backend

```
http://localhost:5000
```

---

# 📊 Database Collections

- Users
- Doctors
- Appointments

---

# 🔄 Application Flow

```text
Patient Register
          │
          ▼
Generate 4-Digit OTP & Send via EmailJS
          │
          ▼
Verify OTP Page (Input Code)
          │
          ▼
Account Activated & Logged In
          │
          ▼
Book Appointment
          │
          ▼
Appointment Stored
          │
          ▼
Admin Reviews Request
          │
    ┌─────┴─────┐
    ▼           ▼
Approve      Cancel
    │
    ▼
Complete Visit
```

---

# 📸 Screens

- Home Page
- Login
- Register
- Verify OTP
- Patient Dashboard
- Admin Dashboard
- Doctor Management
- Appointment Management
- Profile Page

---

# 📈 Future Improvements

- Doctor Login Panel
- Email Notifications
- SMS Notifications
- Online Payments
- Medical Reports
- Prescription Management
- Video Consultation
- Inventory Management
- Bed Management
- Billing System
- Lab Report Module
- Multi-Hospital Support

---

# 👨‍💻 Developed By

**Gopal Kundu**

Built during the **TEN (The Entrepreneurship Network)** Internship Program.

---

# ⭐ Support

If you found this project helpful, consider giving it a ⭐ on GitHub.
