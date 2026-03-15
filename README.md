# Wonder Blog

> A premium, silk-smooth Node.js blog platform — built with Express.js, MongoDB, EJS, and Vanilla CSS.

---

## ✦ Quick Start

### 1. Install Dependencies
```bash
npm install
```

### 2. Configure Environment
```bash
cp .env.example .env
```
Then edit `.env` with your MongoDB connection string and secrets.

### 3. Seed Posts (optional)
```bash
node seedPosts.js
```

### 4. Start the Server
```bash
# Development (auto-restart)
npm run dev

# Production
npm start
```

The blog runs at **http://localhost:5000**

---

## ✦ Routes

| Route | Description |
|-------|-------------|
| `/login-choice` | Landing — choose Admin or User login |
| `/login` | User login |
| `/register` | User registration |
| `/admin` | Admin login |
| `/admin/dashboard` | Admin dashboard (protected) |
| `/dashboard` | User dashboard (protected) |
| `/` | Home — hero + post grid |
| `/posts` | All posts |
| `/post/:id` | Single post |
| `/about` | About page |
| `/contact` | Contact form |

---

## ✦ Demo Credentials

**Admin Login** (`/admin`)
- Username: `Wonder`
- Password: `Blogger`

**User Login** (`/login`)
- Register a new account or use any seeded user

---

## ✦ Features

- **Role-Based Auth** — JWT-secured admin and user sessions
- **Full CRUD** — Create, read, update, delete posts
- **Category Filtering** — Filter posts by category
- **Full-Text Search** — Search posts by title/content
- **Dark Mode** — System-aware, persisted preference
- **Responsive** — Mobile-first, works on all devices
- **Featured Posts** — Admin can mark posts as featured
- **Related Posts** — Shows related posts by category
- **Contact Form** — Email integration via Nodemailer
- **Reading Progress** — Progress bar on article pages
- **Premium Design** — DM Serif Display + DM Sans, gold accent system

---

## ✦ Tech Stack

- **Runtime:** Node.js
- **Framework:** Express.js
- **Database:** MongoDB + Mongoose
- **Auth:** JWT + cookie-based sessions
- **Templates:** EJS + express-ejs-layouts
- **Email:** Nodemailer
- **Security:** bcryptjs

---

*WonderBlog — Ideas worth reading.*
