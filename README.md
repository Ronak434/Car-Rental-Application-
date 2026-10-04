# 🚗 Car Rental Application

A full-stack car rental web application that lets people rent a car for a few hours or a few days, and lets car owners list their cars and manage bookings from a dedicated dashboard.

Built with **React / Next.js**, **Tailwind CSS**, **Node.js (Express)** and **MongoDB**, and secured with **JWT-based authentication**.

---

## 📌 Overview

Many people only need a car occasionally: a weekend trip, a family function, a short business visit. Buying a car for that is expensive. This project solves that problem by connecting **people who need a car** with **owners who want to rent theirs out**.

The project is split into two parts:

| Part | Folder | Description |
|------|--------|-------------|
| Frontend | `client/` | The user interface customers and owners interact with |
| Backend | `server/` | REST API, business logic, authentication and database access |

---

## ✨ Features

### 👤 For Users (Renters)
- Register and log in securely
- Browse the available cars
- View car details (model, price, availability)
- Book a car for the dates they need
- View their own bookings

### 🧑‍💼 For Car Owners
- Role-based access with a dedicated **Owner Dashboard**
- Add, update and delete car listings
- View booking requests for their cars
- Manage and track bookings

### 🔐 Security
- JWT (JSON Web Token) based authentication and verification
- Protected API routes: only logged-in users with a valid token get access
- Role-based authorization (User vs Owner)
- Passwords stored hashed, not as plain text
- Secrets kept in environment variables

---

<!-- ## 🛠️ Tech Stack

**Client (Frontend)**
- React.js and Next.js
- Tailwind CSS
- HTML5

**Server (Backend)**
- Node.js
- Express.js
- JavaScript (ES6+)
- MongoDB (database)
- JSON Web Tokens (JWT) for authentication -->


💻 Tech Stack
🚀 Frontend

<p align="left"> <a href="https://react.dev/" target="_blank"> <img src="https://skillicons.dev/icons?i=react" alt="React" width="50" height="50"/> </a> <a href="https://nextjs.org/" target="_blank"> <img src="https://skillicons.dev/icons?i=nextjs" alt="Next.js" width="50" height="50"/> </a> <a href="https://tailwindcss.com/" target="_blank"> <img src="https://skillicons.dev/icons?i=tailwind" alt="Tailwind CSS" width="50" height="50"/> </a> </p>

⚙️ Backend

<p align="left"> <a href="https://nodejs.org/" target="_blank"> <img src="https://skillicons.dev/icons?i=nodejs" alt="Node.js" width="50" height="50"/> </a> </p>

🗄️ Database

<p align="left"> <a href="https://www.mongodb.com/" target="_blank"> <img src="https://skillicons.dev/icons?i=mongodb" alt="MongoDB" width="50" height="50"/> </a> </p>
---

## 📁 Project Structure

```
Car-Rental-Application-/
├── client/          # Frontend (React / Next.js + Tailwind CSS)
├── server/          # Backend (Node.js + Express + MongoDB)
├── .gitignore
└── README.md
```

---

## ⚙️ Getting Started

### Prerequisites
- [Node.js]\([https://nodejs.org/](https://nodejs.org/)) v18 or higher
- [MongoDB](https://www.mongodb.com/) (local installation or a MongoDB Atlas cluster)
- npm or yarn
- Git

### 1. Clone the repository

```bash
git clone https://github.com/Ronak434/Car-Rental-Application-.git
cd Car-Rental-Application-
```

### 2. Set up the server

```bash
cd server
npm install
```

Create a `.env` file inside the `server/` folder:

```env
PORT=5000
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_secret_key
```

Start the server:

```bash
npm start
```

The API will run at `http://localhost:5000`.

### 3. Set up the client

Open a new terminal:

```bash
cd client
npm install
```

If your client needs the API address, create a `.env` file inside `client/`:

```env
NEXT_PUBLIC_API_URL=http://localhost:5000
```

Start the client:

```bash
npm run dev
```

The app will run at `http://localhost:3000`.

> **Note:** Environment variable names above are examples. Match them to the names used in your code.

---

## 🔑 How Authentication Works

1. A user registers or logs in with their credentials.
2. The server verifies the credentials and returns a signed **JWT**.
3. The client sends this token with every protected request in the `Authorization: Bearer <token>` header.
4. The server verifies the token (and the user's role) before allowing access to protected routes such as booking a car or managing listings.

---

## 🌍 Real-World Use Cases

- Renting a car for a weekend trip or vacation
- Short-term rental for weddings, events or family visits
- Temporary transport for business travel
- Helping car owners earn extra income from an idle vehicle

---

## 🚀 Future Improvements

- Online payment integration
- Car image uploads and a gallery
- Search and filters (price, car type, location)
- Ratings and reviews
- Email / SMS booking notifications
- Admin panel
- Deployment (Vercel for client, Render / Railway for server)

---

## 🤝 Contributing

Contributions, issues and feature requests are welcome. Feel free to fork the repository and open a pull request.

---

## 👨‍💻 Author

**Ronak**
GitHub: [@Ronak434](https://github.com/Ronak434)

---

⭐ If you found this project useful, consider giving it a star!