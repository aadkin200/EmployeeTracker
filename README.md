# Employee Tracker

_A full-stack, role-based employee management system_

---

## Overview

Employee Tracker is a full-stack web application designed to manage employee information within an organization. The system supports secure authentication, role-based access control, and centralized employee data management.

The application is built with a **Spring Boot REST API**, an **Angular frontend**, and a **MySQL database**, and is containerized using **Docker** for deployment on **Railway**. Authentication is handled using **JWT (JSON Web Tokens)**, ensuring stateless and secure access to protected resources.

This project was developed as a **software engineering capstone** and is structured to be scalable, maintainable, and extensible.

---

## Features

### Authentication & Security

- JWT-based authentication
- Secure password hashing with BCrypt
- Stateless backend session handling
- Role-based authorization enforced on both frontend and backend

### Role-Based Access

| Role        | Capabilities                                                        |
| ----------- | ------------------------------------------------------------------- |
| **USER**    | View and update personal profile information                        |
| **MANAGER** | View employees within their assigned department                     |
| **ADMIN**   | Create, update, and delete employee accounts across all departments |

### Employee Management

- View employees by department
- Admin-only user creation and deletion
- Admin-only editing of employee details
- Profile page for personal information updates

### UI & UX

- Responsive Angular frontend
- Role-aware navigation and dashboards
- Modal-based admin actions (create/edit users)
- Clean, dark-themed interface

---

## Technology Stack

### Frontend

- Angular (Standalone Components)
- TypeScript
- Reactive Forms
- Signals (zoneless change detection)
- SCSS
- Nginx (production container)

### Backend

- Java
- Spring Boot
- Spring Security
- Spring Data JPA
- JWT (jjwt)
- BCrypt password hashing

### Database

- MySQL

### DevOps / Deployment

- Docker & Docker Compose
- Railway (hosting)
- GitHub (version control)

---

## Application Architecture
