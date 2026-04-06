# 🗳️ TrustElect — The Online Voting System

<p align="center">
  <a href="https://trust-elect-the-online-voting-syste.vercel.app" target="_blank">
    <img src="https://img.shields.io/badge/Live%20Demo-Visit%20Now-brightgreen?style=for-the-badge&logo=vercel&logoColor=white"/>
  </a>
  &nbsp;&nbsp;
  <a href="https://trustelect-the-online-voting-system.onrender.com/api/health" target="_blank">
    <img src="https://img.shields.io/badge/Backend%20API-Online-blue?style=for-the-badge&logo=render&logoColor=white"/>
  </a>
</p>

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

- [Features](#-features)
- [Tech Stack](#-tech-stack)
- [Project Structure](#-project-structure)
- [Prerequisites](#-prerequisites)
- [Local Setup](#-local-setup)
- [How to Use](#-how-to-use)
  - [Voter Registration & Login](#-voter-registration--login)
  - [Admin Login](#-admin-login)
  - [Voting](#-voting)
  - [Admin Panel](#-admin-panel)
- [API Overview](#-api-overview)
- [Environment Variables](#-environment-variables)
- [Contributing](#-contributing)

---

## ✨ Features

| Feature | Description |
|---------|-------------|
| 🔐 **Secure Auth** | JWT-based authentication for both voters and admins |
| 🗳️ **Online Voting** | Cast votes securely; one vote per voter per election |
| 👤 **Voter Management** | Admin can add, edit, remove voters |
| 🧑‍💼 **Candidate Management** | Admin can add candidates with photos |
| 🏛️ **Election Control** | Create elections, set start/end dates, manage status |
| 📊 **Live Results** | Real-time vote count and winner display |
| 🔒 **Admin Portal** | Separate professional dark-themed admin login |
| 📱 **Responsive UI** | Works on desktop and mobile |

---

## 🛠️ Tech Stack

### Frontend
- **React 18** + **Vite** — fast dev server & build
- **React Router v6** — client-side routing
- **Axios** — API calls
- **Context API** — global auth state

### Backend
- **Spring Boot 3.5.13** — REST API framework
- **Java 25** — runtime
- **Spring Security** + **JWT** — authentication & authorization
- **Spring Data JPA** + **Hibernate** — ORM
- **MySQL 8** — relational database
- **Lombok** — boilerplate reduction
- **Maven** — build tool

---

## 📁 Project Structure

```
TrustElect-The-Online-Voting-System/
│
├── trustelect-frontend/          ← React + Vite frontend
│   ├── public/
│   │   └── logo.png
│   ├── src/
│   │   ├── api/api.js            ← Axios API configuration
│   │   ├── components/
│   │   │   ├── auth/
│   │   │   │   ├── Login.jsx         ← Voter login page
│   │   │   │   ├── AdminLogin.jsx    ← Admin login page (professional dark UI)
│   │   │   │   ├── Register.jsx      ← Voter registration
│   │   │   │   └── OTPVerify.jsx
│   │   │   ├── voter/
│   │   │   │   ├── Dashboard.jsx     ← Voter dashboard
│   │   │   │   ├── VotePage.jsx      ← Cast vote page
│   │   │   │   └── Results.jsx       ← Election results
│   │   │   ├── admin/
│   │   │   │   ├── AdminDashboard.jsx
│   │   │   │   ├── CreateElection.jsx
│   │   │   │   ├── ManageVoters.jsx
│   │   │   │   └── AddCandidates.jsx
│   │   │   └── common/
│   │   │       ├── Navbar.jsx
│   │   │       ├── Footer.jsx
│   │   │       └── Loader.jsx
│   │   ├── context/AuthContext.jsx   ← Global auth state
│   │   └── routes/AppRoutes.jsx      ← Route definitions
│   ├── package.json
│   └── vite.config.js
│
└── trustelect-backend/           ← Spring Boot backend
    ├── src/main/java/com/trustelect/
    │   ├── controller/           ← REST endpoints
    │   ├── service/              ← Business logic
    │   ├── model/                ← JPA entities
    │   ├── repository/           ← Spring Data JPA repos
    │   ├── security/             ← JWT filter & utilities
    │   ├── config/               ← Security, CORS config
    │   └── dto/                  ← Request/Response DTOs
    ├── src/main/resources/
    │   └── application.properties
    └── pom.xml
```

---

## ✅ Prerequisites

Make sure you have these installed before running the project:

| Tool | Version | Check Command |
|------|---------|---------------|
| Java JDK | 25 (or 21) | `java -version` |
| Maven | 3.9+ | `mvn -version` |
| Node.js | 18+ | `node -version` |
| MySQL | 8.0+ | `mysql --version` |
| Git | any | `git --version` |

---

## 🚀 Local Setup

### Step 1 — Clone the Repository

```bash
git clone https://github.com/iamxproo/TrustElect-The-Online-Voting-System.git
cd TrustElect-The-Online-Voting-System
```

### Step 2 — Setup MySQL Database

Open MySQL and run:

```sql
CREATE DATABASE trustelectdb;
```

> The tables will be auto-created by Hibernate on first run (`ddl-auto=update`).

### Step 3 — Configure Backend

Edit `trustelect-backend/src/main/resources/application.properties`:

```properties
# Database
spring.datasource.url=jdbc:mysql://localhost:3306/trustelectdb?useSSL=false&serverTimezone=UTC
spring.datasource.username=YOUR_MYSQL_USERNAME
spring.datasource.password=YOUR_MYSQL_PASSWORD

# JWT Secret (change this in production!)
app.jwt.secret=YourVeryLongSecretKeyHereAtLeast32Characters
```

### Step 4 — Start the Backend

```bash
cd trustelect-backend
JAVA_HOME=/path/to/jdk-25 mvn spring-boot:run
```

Backend starts at: **http://localhost:8080**

> ✅ You should see: `Started TrustElectApplication in X seconds`

### Step 5 — Start the Frontend

Open a new terminal:

```bash
cd trustelect-frontend   # (or root folder if already there)
npm install
npm run dev
```

Frontend starts at: **http://localhost:5173**

---

## 📖 How to Use

### 👤 Voter Registration & Login

#### Register as a Voter
1. Go to **http://localhost:5173**
2. Click **"Register"** in the navbar
3. Fill in your details: Name, Email, Phone, Address, Password
4. Click **"Register"**
5. ✅ A popup will show your **Voter ID** and **Password** — **save them!**
6. Click **"OK Login karo"** — you'll be redirected to login with fields pre-filled

#### Voter Login
1. Go to **http://localhost:5173/login**
2. Enter your **Voter ID** (e.g., `VTR-XXXXXX`) and **Password**
3. Click **"Login"**
4. You'll be redirected to your **Voter Dashboard**

---

### 🔐 Admin Login

The admin login is a **separate portal** with a professional dark UI.

#### Access the Admin Portal
1. Go to **http://localhost:5173/admin/login**
   > OR from the voter login page, scroll to the bottom and click **"Admin Access →"**

2. Enter admin credentials:
   - **Username:** `admin` (default, set in `DataInitializer.java`)
   - **Password:** `admin123` (default, change after first login)

3. Click **"Access Control Panel"**
4. You'll be redirected to the **Admin Dashboard**

> ⚠️ **Security Note:** Unauthorised access to the admin portal is logged and monitored. Change default credentials before deploying to production.

---

### 🗳️ Voting

1. Login as a **Voter**
2. On your dashboard, you'll see the active election
3. Click **"Vote Now"**
4. Select your preferred candidate
5. Click **"Cast Vote"** and confirm
6. ✅ Your vote is recorded — you cannot vote again in the same election

---

### 🛠️ Admin Panel

After logging in as admin, you can:

| Section | What you can do |
|---------|----------------|
| **Dashboard** | View total voters, votes cast, election stats |
| **Create Election** | Set election name, start date, end date |
| **Manage Voters** | Add new voters, edit details, remove voters |
| **Add Candidates** | Add candidates with name, party, photo |
| **Results** | View live vote counts per candidate |

#### How to Create an Election
1. Go to **Admin Dashboard → Create Election**
2. Enter: Election Name, Start Date, End Date
3. Click **"Create"**
4. Election becomes visible to voters on the start date

#### How to Add a Candidate
1. Go to **Admin Dashboard → Add Candidates**
2. Select the election
3. Enter: Candidate Name, Party Name
4. Upload candidate photo (optional)
5. Click **"Add Candidate"**

#### How to Add a Voter (manually)
1. Go to **Admin Dashboard → Manage Voters**
2. Click **"Add Voter"**
3. Fill in voter details
4. The voter will receive their Voter ID

---

## 🔌 API Overview

Base URL: `http://localhost:8080/api`

| Method | Endpoint | Description | Access |
|--------|----------|-------------|--------|
| `POST` | `/auth/voter/register` | Register new voter | Public |
| `POST` | `/auth/voter/login` | Voter login | Public |
| `POST` | `/auth/admin/login` | Admin login | Public |
| `GET` | `/voter/dashboard` | Get voter dashboard data | Voter |
| `GET` | `/election/active` | Get active election | Voter |
| `GET` | `/candidates/{electionId}` | Get candidates for election | Voter |
| `POST` | `/vote/cast` | Cast a vote | Voter |
| `GET` | `/vote/history` | Get voter's vote history | Voter |
| `GET` | `/admin/stats` | Get dashboard stats | Admin |
| `GET` | `/admin/voters` | List all voters | Admin |
| `POST` | `/admin/voters` | Add a voter | Admin |
| `PUT` | `/admin/voters/{id}` | Update voter | Admin |
| `DELETE` | `/admin/voters/{id}` | Remove voter | Admin |
| `POST` | `/election/create` | Create new election | Admin |
| `POST` | `/candidates/add` | Add candidate | Admin |

> All protected endpoints require: `Authorization: Bearer <token>` header

---

## ⚙️ Environment Variables

For production deployment, use environment variables instead of hardcoding values in `application.properties`:

```properties
# application-prod.properties
spring.datasource.url=${DATABASE_URL}
spring.datasource.username=${DATABASE_USERNAME}
spring.datasource.password=${DATABASE_PASSWORD}
app.jwt.secret=${JWT_SECRET}
app.cors.allowed-origins=${CORS_ORIGINS}
```

Frontend — create a `.env` file in the root:

```env
VITE_API_URL=http://localhost:8080/api
```

And in `src/api/api.js`:
```js
const BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8080/api';
```

---

## 🤝 Contributing

1. Fork the repository
2. Create your feature branch: `git checkout -b feature/your-feature`
3. Commit your changes: `git commit -m "feat: add your feature"`
4. Push to the branch: `git push origin feature/your-feature`
5. Open a **Pull Request**

---

## 👨‍💻 Author

**Samarth Dattatray Karale**
- GitHub: [@iamxproo](https://github.com/iamxproo)

---

<p align="center">Made with ❤️ for secure and transparent elections</p>
