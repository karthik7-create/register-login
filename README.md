# 🔐 AuthSystem — Secure Register & Login

A full-stack authentication system with a stunning modern UI, built with **React** + **Spring Boot**.

![Tech Stack](https://img.shields.io/badge/Frontend-React%20+%20Vite-61DAFB?style=for-the-badge&logo=react)
![Tech Stack](https://img.shields.io/badge/Backend-Spring%20Boot-6DB33F?style=for-the-badge&logo=spring)
![Tech Stack](https://img.shields.io/badge/Database-MySQL-4479A1?style=for-the-badge&logo=mysql&logoColor=white)

## ✨ Features

### 🎨 Premium UI
- **Interactive Particle Background** — Mouse-reactive particles with connection lines
- **3D Floating Card** — Cards tilt toward your cursor with glare effect
- **Rotating Gradient Border** — Animated neon border flowing around cards
- **Typewriter Text** — Cycling animated subtitles
- **Confetti Burst** — Celebration animation on successful registration
- **Password Strength Meter** — Real-time strength indicator (Weak → Excellent)
- **Micro-animations** — Ripple buttons, shake errors, hover effects

### 🔒 Security
- **JWT Authentication** — Secure token-based auth
- **Password Encryption** — BCrypt hashing
- **Protected Routes** — Private dashboard access
- **Auto-logout** — On token expiration

### 📧 Email
- **Registration Emails** — Automated welcome email via Gmail SMTP

### 🏠 Dashboard
- **Dynamic Greeting** — Based on time of day
- **Live Clock** — Real-time display
- **Stats Cards** — Session, security, and activity info
- **Animated Avatar** — With rotating ring and online status

---

## 🚀 Getting Started

### Prerequisites
- **Java 17+** (JDK)
- **Node.js 18+** & npm
- **MySQL 8+**

### 1. Clone the Repository
```bash
git clone https://github.com/YOUR_USERNAME/registerlogin.git
cd registerlogin
```

### 2. Backend Setup
```bash
# Copy the example config and update with your credentials
cp backend/src/main/resources/application.properties.example backend/src/main/resources/application.properties
```

Edit `application.properties` with your:
- MySQL password
- Gmail App Password (see [Google App Passwords](https://myaccount.google.com/apppasswords))
- JWT secret key

Then run the backend:
```bash
cd backend
./mvnw spring-boot:run
```
The backend starts on **http://localhost:8081**

### 3. Frontend Setup
```bash
cd frontend
npm install
npm run dev
```
The frontend starts on **http://localhost:5173**

---

## 🛠️ Tech Stack

| Layer     | Technology          |
|-----------|---------------------|
| Frontend  | React, Vite, Framer Motion |
| Backend   | Spring Boot 3, Spring Security |
| Database  | MySQL               |
| Auth      | JWT (JSON Web Token) |
| Email     | JavaMailSender (Gmail SMTP) |
| Styling   | Vanilla CSS (Dark Theme) |

---

## 📁 Project Structure
```
registerlogin/
├── backend/                    # Spring Boot
│   └── src/main/java/com/authsystem/registerlogin/
│       ├── controller/         # REST endpoints
│       ├── dto/                # Request/Response DTOs
│       ├── entity/             # JPA Entities
│       ├── repository/         # Data access
│       ├── security/           # JWT + Spring Security
│       └── service/            # Business logic + Email
├── frontend/                   # React + Vite
│   └── src/
│       ├── components/         # UI Components
│       ├── services/           # API service layer
│       ├── App.jsx
│       └── index.css           # Global styles
└── README.md
```

---

## 📸 Screenshots

> Register page with particle background, floating card, and password strength meter.

> Dashboard with animated avatar, stats cards, and live clock.

---

## 📄 License

This project is open source and available under the [MIT License](LICENSE).
