
# 🛡️ INSURAI - AI-Powered Insurance Platform

<div align="center">

![Spring Boot](https://img.shields.io/badge/Spring%20Boot-3.2.0-brightgreen?logo=spring)
![React](https://img.shields.io/badge/React-19.0-61DAFB?logo=react)
![TypeScript](https://img.shields.io/badge/TypeScript-5.6-3178C6?logo=typescript)
![PostgreSQL](https://img.shields.io/badge/PostgreSQL-16-336791?logo=postgresql)
![License](https://img.shields.io/badge/License-MIT-yellow.svg)

**Full-stack insurance management platform with AI fraud detection, automated claims processing, and role-based dashboards**

[Features](#-features) • [Quick Start](#-quick-start) • [Tech Stack](#-tech-stack) • [API Docs](#-api-documentation)

</div>

---

## ✨ Features

- 🤖 **AI-Powered Fraud Detection** - Intelligent risk scoring for claims
- 📊 **Real-time Analytics** - Interactive dashboards with live charts
- 🔐 **JWT Authentication** - Secure login with 5 role levels
- 🎭 **Role-Based Access** - Admin, Manager, Underwriter, Claims Adjuster, Customer
- 📱 **Fully Responsive** - Mobile, tablet, and desktop optimized
- 🚀 **High Performance** - Redis caching & query optimization
- 🐳 **Docker Ready** - One-command deployment

---

## 🛠️ Tech Stack

**Frontend:** React 19, TypeScript, Tailwind CSS 4, Vite, Framer Motion, Chart.js  
**Backend:** Spring Boot 3, Java 17, Spring Security, JWT  
**Databases:** PostgreSQL 16, MongoDB 7, Redis 7  
**DevOps:** Docker, Docker Compose, Maven

---

## 🚀 Quick Start

### Prerequisites
- Java 17+
- Node.js 18+
- Docker Desktop

### 1️⃣ Clone Repository
```bash
git clone https://github.com/23r21a0570-msc/insurai-fullstack.git
cd insurai-fullstack
```

### 2️⃣ Start Databases
```bash
cd insurai-backend
docker compose up -d
```

### 3️⃣ Start Backend
```bash
mvn clean install
mvn spring-boot:run
```
Backend runs on: `http://localhost:8080`

### 4️⃣ Start Frontend
```bash
cd insurai-frontend
npm install
npm run dev
```
Frontend runs on: `http://localhost:5173`

---

## 🔑 Login Credentials

| Role | Email | Password |
|------|-------|----------|
| Admin | admin@insurai.com | password123 |
| Manager | sarah.chen@insurai.com | password123 |
| Underwriter | mike.ross@insurai.com | password123 |
| Claims Adjuster | emily.davis@insurai.com | password123 |
| Customer | jane.johnson@gmail.com | password123 |
> ⚠️ Demo credentials only. Do NOT use in production.

---

## 📁 Project Structure

```
insurai-fullstack/
├── insurai-backend/           # Spring Boot API
│   ├── controller/           # 12 REST controllers
│   ├── service/              # Business logic + AI fraud detection
│   ├── repository/           # PostgreSQL, MongoDB, Redis
│   ├── entity/               # 18 JPA entities
│   ├── security/             # JWT authentication
│   └── docker-compose.yml    # Database containers
│
└── insurai-frontend/         # React + TypeScript
    ├── components/           # Reusable UI components
    ├── pages/                # Application pages
    ├── api/                  # API services
    └── context/              # State management
```

---

## 📚 API Documentation

**Swagger UI:** `http://localhost:8080/swagger-ui.html`

### Sample Endpoints

```http
POST /api/v1/auth/login          # User login
GET  /api/v1/policies            # Get all policies
POST /api/v1/claims              # Submit claim
GET  /api/v1/analytics/dashboard # Dashboard stats
```

---

## 🗄️ Database

**Pre-seeded with:**
- 56 Users (6 staff + 50 customers)
- 97 Policies (Auto, Home, Health, Life, Business)
- 54 Claims (with AI risk scores)
- 190+ Payment records

**Multi-Database Architecture:**
- **PostgreSQL** - Users, policies, claims, payments
- **MongoDB** - Audit logs, analytics
- **Redis** - Session management, caching

---

## 🎯 Key Modules

| Module | Description |
|--------|-------------|
| **Policy Management** | Create, update, renew policies across 5 types |
| **Claims Processing** | Submit, review, approve claims with AI fraud detection |
| **Payment System** | Handle premiums, settlements, refunds |
| **Analytics Dashboard** | Real-time KPIs, charts, revenue tracking |
| **User Management** | 5-tier role system with permissions |
| **Document Management** | Upload, verify, store claim documents |

---

## 🧪 Testing

```bash
# Backend tests
cd insurai-backend
mvn test

# Frontend tests
cd insurai-frontend
npm run test
```

---

## 🐳 Docker Deployment

```bash
# Build images
docker build -t insurai-backend ./insurai-backend
docker build -t insurai-frontend ./insurai-frontend

# Run containers
docker-compose up -d
```

---

## 📊 Project Stats

- **12** REST Controllers
- **10** Business Services
- **18** Database Entities
- **60+** API Endpoints
- **15+** Pages
- **50+** React Components
- **190+** Seeded Records

---

## 🤝 Contributing

1. Fork the repository
2. Create feature branch (`git checkout -b feature/amazing-feature`)
3. Commit changes (`git commit -m 'Add amazing feature'`)
4. Push to branch (`git push origin feature/amazing-feature`)
5. Open Pull Request

---

## 📄 License

MIT License - see [LICENSE](LICENSE) file

---

## 📞 Support

- 📧 Email: support@insurai.com
- 🐛 Issues: [GitHub Issues](https://github.com/23r21a0570-msc/insurai-fullstack/issues)
- 📖 Docs: `http://localhost:8080/swagger-ui.html`

---

<div align="center">

**⭐ Star this repo if you find it useful!**

Made with ❤️ using Spring Boot & React

</div>
