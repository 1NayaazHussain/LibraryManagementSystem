# 📚 Library Management System — NMAMIT

A full-stack **Library Management System** built with **Node.js**, **Express**, **EJS**, and **SQLite**. Designed for NMAMIT college librarians to manage books, students, borrowing records, and library visits from a clean, modern dashboard.

---

## ✨ Features

- 🔐 **Librarian Authentication** — Secure login with session management
- 📊 **Dashboard** — Live stats with animated counters and Chart.js charts (genre doughnut + monthly borrow bar chart)
- 📖 **Books Management** — Add, edit, delete, and search books with genre filtering
- 🎓 **Students Management** — Full CRUD for student records (USN, name, branch, email)
- 🔄 **Borrowed Books** — Issue books to students, track due dates, mark returns, flag overdue
- 🚪 **Library Visit Log** — Log student entry/exit times with automatic duration calculation
- 📱 **Responsive Design** — Dark-themed, mobile-friendly UI with glassmorphism effects

---

## 🛠️ Tech Stack

| Layer      | Technology            |
|------------|-----------------------|
| Backend    | Node.js + Express.js  |
| Templating | EJS                   |
| Database   | SQLite3               |
| Frontend   | Vanilla CSS + Chart.js|
| Auth       | express-session       |

---

## 🚀 Getting Started

### Prerequisites
- Node.js (v16+)
- npm

### Installation

```bash
# 1. Clone the repository
git clone https://github.com/1NayaazHussain/LibraryManagementSystem.git
cd LibraryManagementSystem

# 2. Install dependencies
npm install

# 3. Start the server
node app.js
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
├── app.js              # Express routes & server
├── db.js               # SQLite setup, schema, and seed data
├── library.db          # SQLite database file
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
    └── visits.ejs
```

---

## 📦 Dependencies

```json
{
  "express": "^4.x",
  "ejs": "^3.x",
  "sqlite3": "^5.x",
  "express-session": "^1.x"
}
```

---

## 🗄️ Database Schema

### Librarians
| Column   | Type    |
|----------|---------|
| id       | INTEGER |
| name     | TEXT    |
| email    | TEXT    |
| password | TEXT    |

### Books
| Column   | Type    |
|----------|---------|
| id       | INTEGER |
| title    | TEXT    |
| author   | TEXT    |
| genre    | TEXT    |
| isbn     | TEXT    |
| quantity | INTEGER |

### Students
| Column | Type |
|--------|------|
| usn    | TEXT |
| name   | TEXT |
| branch | TEXT |
| email  | TEXT |

### BorrowedBooks
| Column        | Type    |
|---------------|---------|
| id            | INTEGER |
| usn           | TEXT    |
| book_id       | INTEGER |
| borrowed_date | TEXT    |
| return_date   | TEXT    |
| status        | TEXT    |

### LibraryVisits
| Column     | Type    |
|------------|---------|
| id         | INTEGER |
| usn        | TEXT    |
| entry_time | TEXT    |
| exit_time  | TEXT    |
| duration   | TEXT    |

---

## 👨‍💻 Author

**Nayaaz Hussain**  
[github.com/1NayaazHussain](https://github.com/1NayaazHussain)

---

## 📄 License

This project is licensed under the MIT License — see the [LICENSE](LICENSE) file for details.
