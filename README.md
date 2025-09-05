Admin
username:asek
password:abcd12345%

Teacher
username:osama
password:abcd12345%

Teacher
username:roni
password:abcd12345%

# Course Management System

A full-stack course management application built with **Django REST Framework** (backend) and **React.js** (frontend).  
This project allows **admins** to manage users and categories, **teachers** to manage their own courses, and **students** to browse courses.

---

## Features

### Role-based Access

| Role    | Permissions                                                                 |
|---------|-----------------------------------------------------------------------------|
| Admin   | - Create, update, delete categories and users<br>- View all courses        |
| Teacher | - Create, update, delete their own courses<br>- View only their own courses |
| Student | - View all courses                                                          |

### Course Management

- Courses have title, description, banner, price, duration, category, instructor, and active status.
- Teachers can upload course banners (images) during creation or update.
- Students can browse courses and see course details.

### Authentication

- JWT token-based authentication.
- Role-based access control ensures proper permissions.

---

## Technologies Used

- **Backend:** Django, Django REST Framework, DRF-YASG (Swagger Docs)
- **Frontend:** React.js, Axios, Tailwind CSS
- **Database:** SQLite / PostgreSQL
- **Tools:** Postman (API testing), Swagger (API docs)

---
