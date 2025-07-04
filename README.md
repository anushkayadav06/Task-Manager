#  Task Manager App (MERN Stack)

A full-featured Task Management System built using the MERN Stack (MongoDB, Express, React, Node.js). This application supports role-based task creation, assignment, tracking, and completion for Admins and Users.

---

## Features

###  **Authentication**
- Register / Login with JWT
- Role-based access (Admin & User)

###  **Admin Features**
- Dashboard with task status summary
- Create new tasks
- Assign tasks to users by email
- Edit or delete existing tasks
- Filter tasks by status (All, Pending, In Progress, Completed)

### **User Features**
- View assigned tasks
- Mark tasks as `In Progress` or `Completed`
- Status counts for quick overview

---

## 🛠️ Tech Stack

### Frontend:
- React.js
- React Router DOM
- Bootstrap
- Axios
- Moment.js
- React Hot Toast

### Backend:
- Node.js
- Express.js
- MongoDB + Mongoose
- JWT (Authentication)
- dotenv
- bcryptjs

---

## Folder Structure
TASK-MANAGER/
├── backend/
│ ├── config/
│ ├── controllers/
│ ├── middlewares/
│ ├── models/
│ ├── routes/
│ ├── .env
│ ├── server.js
│
├── frontend/
│ ├── public/
│ ├── src/
│ ├── assets/
│ ├── components/
│ ├── context/
│ ├── hooks/
│ ├── pages/
│ ├── routes/
│ ├── utils/
│ ├── App.jsx
│
├── .gitignore
├── README.md

## Admin Dashboard
![image](https://github.com/user-attachments/assets/1e980a53-6a4d-4304-9634-8a875d0d7956)
![image](https://github.com/user-attachments/assets/50f683d6-791c-4388-9f84-f4c883621435)



