# Virtual Hackathon Platform

A full-stack hackathon management platform built with React + Node.js + PostgreSQL.

## Setup

### Prerequisites
- Node.js
- PostgreSQL

### Backend
```bash
cd server
cp .env.example .env   # fill in your DB credentials and email
npm install
npm run dev
```

### Frontend
```bash
cd react-app
npm install
npm run dev
```

### PostgreSQL
Create a database named `hackathon_db` and update `.env` with your credentials. Tables are auto-created on first run.

## Features
- JWT-free auth with bcrypt password hashing
- Team creation, join, rename, delete, add/remove members
- File upload for submissions (max 10MB)
- Admin: add/edit/delete hackathons and problems
- Admin: evaluate submissions with score 0-100
- Email notifications (signup, submission, evaluation)
- Leaderboard sorted by score
- PostgreSQL database

## Default Admin
- Email: `admin@hack.com`
- Password: `admin`
