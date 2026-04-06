# 🗳️ TrustElect — The Online Voting System

<div align="center">

### 🌐 [**Live Demo → Click Here**](https://trust-elect-the-online-voting-syste.vercel.app)

</div>

<p align="center">
  <a href="https://trust-elect-the-online-voting-syste.vercel.app" target="_blank">
    <img src="https://img.shields.io/badge/Live%20Demo-Visit%20Now-brightgreen?style=for-the-badge&logo=vercel&logoColor=white"/>
  </a>
  &nbsp;
  <a href="https://trustelect-the-online-voting-system.onrender.com/api/health" target="_blank">
    <img src="https://img.shields.io/badge/Backend%20API-Online-blue?style=for-the-badge&logo=render&logoColor=white"/>
  </a>
  &nbsp;
  <a href="https://github.com/iamxproo/TrustElect-The-Online-Voting-System" target="_blank">
    <img src="https://img.shields.io/badge/GitHub-Repository-black?style=for-the-badge&logo=github&logoColor=white"/>
  </a>
</p>

<br/>

<p align="center">
  <img src="public/logo.png" alt="TrustElect Logo" width="120"/>
</p>

<p align="center">
  A secure, full-stack online voting platform built with <strong>React + Vite</strong> (frontend) and <strong>Spring Boot 3.5</strong> (backend), backed by <strong>MySQL</strong>.
</p>

<p align="center">
  <img src="https://img.shields.io/badge/Java-21-orange?style=flat-square&logo=openjdk"/>
  <img src="https://img.shields.io/badge/Spring_Boot-3.5.13-brightgreen?style=flat-square&logo=springboot"/>
  <img src="https://img.shields.io/badge/React-18-blue?style=flat-square&logo=react"/>
  <img src="https://img.shields.io/badge/Vite-5-purple?style=flat-square&logo=vite"/>
  <img src="https://img.shields.io/badge/MySQL-8-blue?style=flat-square&logo=mysql"/>
  <img src="https://img.shields.io/badge/JWT-Auth-yellow?style=flat-square"/>
  <img src="https://img.shields.io/badge/Deployed-Render%20%2B%20Vercel-success?style=flat-square"/>
</p>

---

## 📋 Table of Contents

- [Live Demo](#-live-demo)
- [Features](#-features)
- [Tech Stack](#-tech-stack)
- [Project Structure](#-project-structure)
- [Prerequisites](#-prerequisites)
- [Local Setup](#-local-setup)
- [How to Use](#-how-to-use)
- [API Overview](#-api-overview)
- [Environment Variables](#-environment-variables)
- [Production Deployment](#-production-deployment)
- [Contributing](#-contributing)

---

## 🌐 Live Demo

| Service | URL |
|---------|-----|
| 🖥️ **Frontend (Vercel)** | https://trust-elect-the-online-voting-syste.vercel.app |
| ⚙️ **Backend API (Render)** | https://trustelect-the-online-voting-system.onrender.com |
| 🔧 **Health Check** | https://trustelect-the-online-voting-system.onrender.com/api/health |

> ⚠️ Backend is on Render free tier — first request may take ~30 seconds to wake up.

---

## ✨ Features

| Feature | Description |
|---------|-------------|
| 🔐 **Secure JWT Auth** | Separate JWT authentication for voters and admins |
| 🗳️ **Online Voting** | Cast votes securely; one vote per voter per election |
| 👤 **Voter Registration** | Self-registration with auto-generated Voter ID |
| 🧑‍💼 **Candidate Management** | Admin adds candidates with name, party & photo |
| 🏛️ **Election Control** | Create elections, set start/end dates |
| 📊 **Live Results** | Real-time vote count and winner display |
| 🔒 **Admin Portal** | Separate dark-themed admin login at `/admin/login` |
| 📱 **Responsive UI** | Works on all screen sizes |
| ⏰ **Vote Later** | Come back to vote when election goes live |
| 💓 **Uptime Monitoring** | UptimeRobot keeps backend always awake |

---

## 🛠️ Tech Stack

### Frontend
| Technology | Purpose |
|------------|---------|
| **React 18** | UI framework |
| **Vite 5** | Fast dev server & build tool |
| **React Router v6** | Client-side routing |
| **Context API** | Global auth state management |
| **Fetch API** | REST API calls |

### Backend
| Technology | Purpose |
|------------|---------|
| **Spring Boot 3.5.13** | REST API framework |
| **Java 21** | Runtime |
| **Spring Security + JWT** | Authentication & authorization |
| **Spring Data JPA + Hibernate** | ORM |
| **MySQL 8** | Relational database |
| **Lombok** | Boilerplate reduction |
| **Maven** | Build tool |

### Deployment
| Service | Purpose |
|---------|---------|
| **Vercel** | Frontend hosting |
| **Render** | Backend hosting (Docker) |
| **Aiven** | Managed MySQL database |
| **UptimeRobot** | Backend uptime monitoring |

---

## 📁 Project Structure

```
TrustElect-The-Online-Voting-System/
│
├── src/                              ← React Frontend (Vite)
│   ├── api/api.js                    ← All API calls
│   ├── components/
│   │   ├── auth/
│   │   │   ├── Login.jsx             ← Voter login
│   │   │   ├── AdminLogin.jsx        ← Admin login (dark UI)
│   │   │   └── Register.jsx          ← Voter registration
│   │   ├── voter/
│   │   │   ├── Dashboard.jsx         ← Voter dashboard
│   │   │   ├── VotePage.jsx          ← Cast vote page
│   │   │   └── Results.jsx           ← Election results
│   │   ├── admin/
│   │   │   ├── AdminDashboard.jsx
│   │   │   ├── CreateElection.jsx
│   │   │   ├── ManageVoters.jsx
│   │   │   └── AddCandidates.jsx
│   │   └── common/
│   │       ├── Navbar.jsx
│   │       ├── Footer.jsx
│   │       └── Loader.jsx
│   ├── context/AuthContext.jsx        ← Global auth state
│   ├── pages/                         ← Home, About, Contact
│   └── routes/AppRoutes.jsx           ← Route definitions
│
├── trustelect-backend/                ← Spring Boot Backend
│   ├── src/main/java/com/trustelect/
│   │   ├── controller/                ← REST endpoints
│   │   ├── service/                   ← Business logic
│   │   ├── model/                     ← JPA entities
│   │   ├── repository/                ← Spring Data repos
│   │   ├── security/                  ← JWT filter & utils
│   │   ├── config/                    ← SecurityConfig, CORS, DataInitializer
│   │   ├── dto/                       ← Request/Response DTOs
│   │   └── exception/                 ← Global exception handler
│   ├── src/main/resources/application.properties
│   ├── Dockerfile
│   └── pom.xml
│
├── public/logo.png
├── vercel.json                        ← Vercel SPA config
├── package.json
└── vite.config.js
```

---

## ✅ Prerequisites

| Tool | Version | Check |
|------|---------|-------|
| Java JDK | 21+ | `java -version` |
| Maven | 3.9+ | `mvn -version` |
| Node.js | 18+ | `node -version` |
| MySQL | 8.0+ | `mysql --version` |
| Git | any | `git --version` |

---

## 🚀 Local Setup

### 1. Clone the Repository

```bash
git clone https://github.com/iamxproo/TrustElect-The-Online-Voting-System.git
cd TrustElect-The-Online-Voting-System
```

### 2. Setup MySQL Database

```sql
CREATE DATABASE trustelectdb;
```

> Tables are auto-created by Hibernate on first run.

### 3. Configure Backend

Edit `trustelect-backend/src/main/resources/application.properties`:

```properties
spring.datasource.url=jdbc:mysql://localhost:3306/trustelectdb?useSSL=false&serverTimezone=UTC
spring.datasource.username=YOUR_MYSQL_USERNAME
spring.datasource.password=YOUR_MYSQL_PASSWORD

app.jwt.secret=YourVeryLongSecretKeyHereAtLeast32Characters
app.cors.allowed-origins=http://localhost:5173
```

### 4. Start the Backend

```bash
cd trustelect-backend
mvn spring-boot:run
```

> ✅ Backend runs at: **http://localhost:8080**

### 5. Configure Frontend

Create `.env` file in project root:

```env
VITE_API_URL=http://localhost:8080/api
```

### 6. Start the Frontend

```bash
npm install
npm run dev
```

> ✅ Frontend runs at: **http://localhost:5173**

---

## 📖 How to Use

### 👤 Voter Registration

1. Go to **http://localhost:5173** → Click **"Register"**
2. Fill in: Name, Email, Phone, Class, Roll Number
3. Click **"Register"**
4. ✅ Popup shows your **Voter ID** and **Password** — **save these!**
5. Auto-redirected to login page with fields pre-filled

> 💡 Voter ID and Password are auto-generated. Keep them safe!

### 🔑 Voter Login

1. Go to **http://localhost:5173/login**
2. Enter **Voter ID** and **Password**
3. Click **"Login"** → Voter Dashboard ✅

### 🔐 Admin Login

URL: **http://localhost:5173/admin/login**

| Field | Default |
|-------|---------|
| Username | `admin` |
| Password | `admin123` |

> ⚠️ Change default password before using in production!

### 🗳️ Voting

1. Login as Voter → Click **"Vote Now"**
2. Select your candidate → Confirm
3. ✅ Vote recorded — one vote per voter per election

> If no election is active, **"Vote Later"** screen appears with option to return later.

### 🛠️ Admin Panel

| Section | What you can do |
|---------|----------------|
| 📊 Dashboard | View stats — voters, votes, elections |
| 🏛️ Create Election | Set name, start & end date |
| 👥 Manage Voters | Add, edit, remove voters |
| 🧑‍💼 Add Candidates | Add with name, party, photo |

---

## 🔌 API Overview

**Base URL:** `http://localhost:8080/api`

### Public Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| `POST` | `/auth/voter/register` | Register new voter |
| `POST` | `/auth/voter/login` | Voter login → JWT |
| `POST` | `/auth/admin/login` | Admin login → JWT |
| `GET` | `/candidates` | Get all candidates |
| `GET` | `/election/current` | Get current election |
| `GET` | `/votes/results` | Get results |
| `GET` | `/health` | Health check |

### Voter Endpoints *(JWT required)*

| Method | Endpoint | Description |
|--------|----------|-------------|
| `GET` | `/voter/me` | Get voter profile |
| `POST` | `/votes` | Cast vote `{ "candidateId": 1 }` |

### Admin Endpoints *(Admin JWT required)*

| Method | Endpoint | Description |
|--------|----------|-------------|
| `GET` | `/admin/voters` | List all voters |
| `POST` | `/admin/voters` | Add voter |
| `PUT` | `/admin/voters/{id}` | Update voter |
| `DELETE` | `/admin/voters/{id}` | Remove voter |
| `POST` | `/election` | Create election |
| `POST` | `/candidates` | Add candidate |
| `DELETE` | `/candidates/{id}` | Remove candidate |
| `POST` | `/candidates/{id}/image` | Upload photo |
| `GET` | `/votes/stats` | Vote statistics |

> 🔑 Use header: `Authorization: Bearer <token>`

---

## ⚙️ Environment Variables

### Backend (Render env vars)

| Variable | Description |
|----------|-------------|
| `DATABASE_URL` | Full JDBC connection string |
| `DATABASE_USERNAME` | MySQL username |
| `DATABASE_PASSWORD` | MySQL password |
| `JWT_SECRET` | JWT signing key (min 32 chars) |
| `CORS_ORIGINS` | Allowed frontend origin URL |

### Frontend (Vercel env vars)

| Variable | Description |
|----------|-------------|
| `VITE_API_URL` | Backend base URL + `/api` |

---

## ☁️ Production Deployment

### Backend → Render

1. Push to GitHub
2. [render.com](https://render.com) → New Web Service → Connect repo
3. Root Directory: `trustelect-backend` | Runtime: **Docker**
4. Add all env variables → Deploy ✅

### Frontend → Vercel

1. [vercel.com](https://vercel.com) → New Project → Import repo
2. Root Directory: `.` | Framework: **Vite**
3. Add `VITE_API_URL` env variable → Deploy ✅

### Database → Aiven MySQL

1. [aiven.io](https://aiven.io) → Create free MySQL service
2. Build `DATABASE_URL`:
```
jdbc:mysql://HOST:PORT/DBNAME?useSSL=true&requireSSL=true&serverTimezone=UTC&allowPublicKeyRetrieval=true
```
3. Add to Render env variables ✅

### Uptime → UptimeRobot

1. [uptimerobot.com](https://uptimerobot.com) → Add Monitor
2. Type: **HTTP(s)** | URL: `https://your-backend.onrender.com/api/health`
3. Interval: **5 minutes** → Save ✅

---

## 🤝 Contributing

1. Fork the repository
2. Create feature branch: `git checkout -b feature/your-feature`
3. Commit: `git commit -m "feat: add your feature"`
4. Push & open a Pull Request ✅

---

## 📄 License

This project is open source under the [MIT License](LICENSE).

---

## 👨‍💻 Author

**Samarth Karale**
[![GitHub](https://img.shields.io/badge/GitHub-iamxproo-black?style=flat-square&logo=github)](https://github.com/iamxproo)

---

<p align="center">Made with ❤️ for secure and transparent elections</p>
