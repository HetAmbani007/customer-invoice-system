# customer-invoice-system

# 📄 Customer Invoice System

A full-stack **Customer & Invoice Management System** built with **React, Node.js, Express, and PostgreSQL**.

This application allows users to manage customers, create invoices with line items, and track financial data with a clean UI and scalable backend.

---

## 🚀 Features

### 🔐 Authentication

- User registration & login
- JWT-based authentication
- Protected routes

### 👥 Customer Management

- Create, edit, delete customers
- Search, pagination, and sorting
- Dropdown API for invoice selection

### 🧾 Invoice Management

- Create invoices with multiple line items
- Auto-calculated totals
- Due date calculation (Invoice Date + Terms)
- Edit & delete invoices
- Soft delete support

### 📊 Dashboard

- Summary statistics
- Total invoices, customers, and revenue insights

---

## 🛠️ Tech Stack

### Frontend

- React.js
- Material UI (MUI)
- Axios

### Backend

- Node.js
- Express.js
- JWT Authentication

### Database

- PostgreSQL (Local setup)

---

## 🌍 Database Setup

### Local PostgreSQL Setup

1. Install PostgreSQL

2. Create a database:

   ```sql
   CREATE DATABASE cim_db;
   ```

3. Run schema file:

   ```bash
   psql -U postgres -d cim_db -f schema.sql
   ```

---

## ⚙️ Environment Variables

Create a `.env` file in backend (`cim-api`):

```env
DB_HOST=localhost
DB_PORT=5432
DB_USER=postgres
DB_PASSWORD=your_password
DB_NAME=cim_db
```

---

## 📦 Installation

### Backend

```bash
cd cim-api
npm install
node server.js
```

### Frontend

```bash
cd client
npm install
npm run dev
```

---

## 🔗 API Endpoints

### Auth

- `POST /api/auth/register`
- `POST /api/auth/login`

### Customers

- `GET /api/customers`
- `POST /api/customers`
- `PUT /api/customers/:id`
- `DELETE /api/customers/:id`
- `GET /api/customers/dropdown`

### Invoices

- `GET /api/invoices`
- `POST /api/invoices`
- `PUT /api/invoices/:id`
- `DELETE /api/invoices/:id`
- `GET /api/invoices/:id`

---

## 📌 Key Functionalities

- Server-side pagination & sorting
- Dynamic invoice line items
- Real-time total calculation
- Customer email display on selection
- Confirmation dialogs for delete
- Toast notifications for actions

---

## 🔐 Security

- Password hashing
- JWT authentication
- Protected API routes

---

## 📁 Project Structure

```
customer-invoice-system/
├── cim-api/        # Backend (Node.js)
├── client/         # Frontend (React)
├── schema.sql      # Database schema
└── README.md
```

---

## 🚀 Future Improvements

- Cloud database integration (Supabase / AWS RDS)
- PDF invoice generation
- Email notifications
- Deployment (Render + Vercel)
- Advanced analytics dashboard

---

## 👨‍💻 Author

**Het Ambani**

---

## ⭐ Notes

This project demonstrates:

- Full-stack development skills
- REST API design
- Database modeling with PostgreSQL
- Real-world invoice workflow implementation
