# File Uploader

A full-stack file upload and folder management web application built with **Node.js**, **Express**, **Prisma**, **PostgreSQL**, and **Passport.js**.  
Users can register, log in, create folders, upload files, download them, and securely manage their content.

The app features a **dark theme UI**, **responsive design**, **AA-level accessibility**, and secure authentication.

---

## Features

### Authentication
- User registration with **username, email, and password**
- Secure password hashing with **bcrypt**
- Login/logout using **Passport.js (Local Strategy)**
- Persistent sessions stored in PostgreSQL
- Password visibility toggle (eye icon)
- Password validation (minimum 6 characters)

### Folder Management
- Create folders
- View all user folders
- Delete folders
- Each folder shows how many files it contains

### File Management
- Upload files to folders
- View file details (name, size, upload date)
- Download files
- Delete files

### UI & Accessibility
- Modern **dark theme**
- Fully responsive (desktop, tablet, mobile)
- Keyboard-navigable
- Visible focus states
- WCAG 2.1 **AA contrast compliant**
- Inline form validation styling

---

## Tech Stack

**Backend**
- Node.js
- Express
- Passport.js
- Prisma ORM
- PostgreSQL
- Multer (file uploads)
- bcryptjs

**Frontend**
- EJS templates
- Vanilla CSS (custom, responsive)
- Google Material Symbols (icons)

---
