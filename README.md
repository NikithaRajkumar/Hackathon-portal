# Virtual Hackathon Platform

Full-stack hackathon management platform — React + Spring Boot + PostgreSQL.

## Setup

### Prerequisites
- Java 17+
- Maven
- Node.js
- PostgreSQL

### Backend (Spring Boot)
```bash
cd server
# Edit src/main/resources/application.properties with your DB credentials
mvn spring-boot:run
```
Runs on http://localhost:8080

### Frontend (React)
```bash
cd react-app
npm install
npm run dev
```
Runs on http://localhost:3000

### PostgreSQL
Create a database named `hackathon_db`. Tables are auto-created on first run.

## Features
- bcrypt password hashing
- Team creation, join, rename, delete, add/remove members
- File upload for submissions (max 10MB)
- Admin: add/edit/delete hackathons and problems
- Admin: evaluate submissions with score + feedback
- Email notifications (signup, submission, evaluation)
- Leaderboard sorted by score
- JSONB fields: rules, constraints, links, evaluation, preferences, metadata
- PostgreSQL with Spring Data JPA

## Default Admin
- Email: `admin@hack.com`
- Password: `admin`
