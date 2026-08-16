# 📚 Library Management System — NMAMIT

> A full-stack **Library Management System** built with **Node.js**, **Express**, **EJS**, and **SQLite**. Designed for NMAMIT college librarians to manage books, students, borrowing records, and library visits — all from a clean, modern dark-themed dashboard.

![Node.js](https://img.shields.io/badge/Node.js-v16+-339933?style=for-the-badge&logo=node.js&logoColor=white)
![Express](https://img.shields.io/badge/Express-5.x-000000?style=for-the-badge&logo=express&logoColor=white)
![SQLite](https://img.shields.io/badge/SQLite-3-003B57?style=for-the-badge&logo=sqlite&logoColor=white)
![License](https://img.shields.io/badge/License-MIT-blue?style=for-the-badge)

---

## ✨ Features

| Feature | Description |
|---|---|
| 🔐 **Librarian Auth** | Secure login with session management |
| 📊 **Dashboard** | Live stats with animated counters and Chart.js charts |
| 📖 **Books Management** | Add, edit, delete, and search books with genre filtering |
| 🎓 **Students Management** | Full CRUD for student records (USN, name, branch, email) |
| 🔄 **Borrowed Books** | Issue books, track due dates, mark returns, flag overdue |
| 🚪 **Library Visit Log** | Log student entry/exit times with auto duration calculation |
| ✅ **Input Validation** | Server-side validation for all form inputs |
| 📱 **Responsive Design** | Dark-themed, mobile-friendly UI with glassmorphism effects |

---

## 🛠️ Tech Stack

| Layer      | Technology            |
|------------|-----------------------|
| Backend    | Node.js + Express.js 5 |
| Templating | EJS                   |
| Database   | SQLite3               |
| Frontend   | Vanilla CSS + Chart.js |
| Auth       | express-session       |

---

## 🚀 Getting Started

### Prerequisites
- Node.js (v16 or higher)
- npm

### Installation

```bash
# 1. Clone the repository
git clone https://github.com/1NayaazHussain/LibraryManagementSystem.git
cd LibraryManagementSystem

# 2. Install dependencies
npm install

# 3. (Optional) Configure environment variables
cp .env.example .env
# Edit .env with your preferred settings

# 4. Start the server
node app.js
```

### Development Mode (auto-restart on changes)

```bash
npm run dev
```

### Access the App

Open your browser and go to: **http://localhost:5000**

### Default Login Credentials

| Name          | Email                    | Password    |
|---------------|--------------------------|-------------|
| Raghunandan   | raghunandan@nmamit.in    | abc@123     |
| Puneeth       | puneeth@nmamit.in        | password    |
| Ananth Kumar  | ananth@nmamit.in         | ananth@123  |

---

## 📁 Project Structure

```
LibraryManagementSystem/
├── app.js              # Express routes & server entry point
├── db.js               # SQLite setup, schema, migrations & seed data
├── utils.js            # Shared helper functions (validation, formatting)
├── library.db          # SQLite database file (auto-created)
├── .env.example        # Environment variable template
├── package.json
├── public/
│   └── style.css       # Global dark-theme stylesheet
└── views/
    ├── partials/
    │   ├── head.ejs    # HTML <head> with CSS link
    │   └── sidebar.ejs # Navigation sidebar
    ├── login.ejs
    ├── dashboard.ejs
    ├── books.ejs
    ├── addBook.ejs
    ├── editBook.ejs
    ├── students.ejs
    ├── addStudent.ejs
    ├── editStudent.ejs
    ├── borrowed.ejs
    ├── visits.ejs
    └── 404.ejs
```

---

## 📦 Dependencies

```json
{
  "express": "^5.x",
  "ejs": "^6.x",
  "sqlite3": "^6.x",
  "express-session": "^1.x"
}
```

---

## 🗄️ Database Schema

### Librarians
| Column   | Type    | Notes        |
|----------|---------|--------------|
| id       | INTEGER | Primary Key  |
| name     | TEXT    |              |
| email    | TEXT    | Unique       |
| password | TEXT    |              |

### Books
| Column   | Type    | Notes        |
|----------|---------|--------------|
| id       | INTEGER | Primary Key  |
| title    | TEXT    |              |
| author   | TEXT    |              |
| genre    | TEXT    |              |
| isbn     | TEXT    |              |
| quantity | INTEGER |              |

### Students
| Column | Type | Notes       |
|--------|------|-------------|
| usn    | TEXT | Primary Key |
| name   | TEXT |             |
| branch | TEXT |             |
| email  | TEXT |             |

### BorrowedBooks
| Column        | Type    | Notes                       |
|---------------|---------|-----------------------------|
| id            | INTEGER | Primary Key                 |
| usn           | TEXT    | FK → Students               |
| book_id       | INTEGER | FK → Books                  |
| borrowed_date | TEXT    | YYYY-MM-DD (IST)            |
| return_date   | TEXT    | YYYY-MM-DD                  |
| status        | TEXT    | 'borrowed' or 'returned'    |

### LibraryVisits
| Column     | Type    | Notes                    |
|------------|---------|--------------------------|
| id         | INTEGER | Primary Key              |
| usn        | TEXT    | FK → Students            |
| entry_time | TEXT    | IST locale string        |
| exit_time  | TEXT    | IST locale string        |
| duration   | TEXT    | e.g. "2h 35m" or "45m"  |

---

## 🤝 Contributing

Contributions, issues, and feature requests are welcome!

1. Fork the project
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

---

## 👨‍💻 Author

**Nayaaz Hussain**  
[github.com/1NayaazHussain](https://github.com/1NayaazHussain)

---

## 📄 License

This project is licensed under the MIT License — see the [LICENSE](LICENSE) file for details.
