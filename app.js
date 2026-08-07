const express = require('express');
const path = require('path');
const db = require('./db');
const session = require('express-session');

const app = express();

app.set('view engine', 'ejs');
app.use(express.urlencoded({ extended: true }));
app.use(express.static('public'));

app.use(
    session({
        secret: 'LibrarySecret2024',
        resave: false,
        saveUninitialized: false
    })
);

// ─── Auth Middleware ─────────────────────────────────────────────────────────
function isLoggedIn(req, res, next) {
    if (req.session.librarian) {
        next();
    } else {
        res.redirect('/');
    }
}

// ─── Auth Routes ─────────────────────────────────────────────────────────────
app.get('/', (req, res) => {
    res.render('login', { error: null });
});

app.post('/login', (req, res) => {
    const { email, password } = req.body;
    db.get(`SELECT * FROM Librarians WHERE email=? AND password=?`, [email, password], (err, row) => {
        if (row) {
            req.session.librarian = row;
            res.redirect('/dashboard');
        } else {
            res.render('login', { error: 'Invalid email or password.' });
        }
    });
});

app.get('/logout', (req, res) => {
    req.session.destroy(() => res.redirect('/'));
});

// ─── Dashboard ───────────────────────────────────────────────────────────────
app.get('/dashboard', isLoggedIn, (req, res) => {
    db.get(`SELECT COUNT(*) AS totalBooks FROM Books`, (err, books) => {
        db.get(`SELECT COUNT(*) AS totalStudents FROM Students`, (err, students) => {
            db.get(`SELECT COUNT(*) AS totalBorrowed FROM BorrowedBooks WHERE status='borrowed'`, (err, borrowed) => {
                db.get(`SELECT COUNT(*) AS totalVisits FROM LibraryVisits`, (err, visits) => {
                    db.get(`SELECT COUNT(*) AS overdue FROM BorrowedBooks WHERE status='borrowed' AND return_date < date('now')`, (err, overdue) => {
                        db.all(`SELECT genre, COUNT(*) as count FROM Books GROUP BY genre`, (err, genreStats) => {
                            db.all(`SELECT strftime('%m', borrowed_date) as month, COUNT(*) as count FROM BorrowedBooks GROUP BY month ORDER BY month`, (err, borrowStats) => {
                                res.render('dashboard', {
                                    librarian: req.session.librarian,
                                    totalBooks: books.totalBooks,
                                    totalStudents: students.totalStudents,
                                    totalBorrowed: borrowed.totalBorrowed,
                                    totalVisits: visits.totalVisits,
                                    overdue: overdue ? overdue.overdue : 0,
                                    genreStats: JSON.stringify(genreStats || []),
                                    borrowStats: JSON.stringify(borrowStats || [])
                                });
                            });
                        });
                    });
                });
            });
        });
    });
});

// ─── Books Routes ─────────────────────────────────────────────────────────────
app.get('/books', isLoggedIn, (req, res) => {
    const search = req.query.search || '';
    const query = search
        ? `SELECT * FROM Books WHERE title LIKE ? OR author LIKE ? OR genre LIKE ?`
        : `SELECT * FROM Books`;
    const params = search ? [`%${search}%`, `%${search}%`, `%${search}%`] : [];
    db.all(query, params, (err, rows) => {
        res.render('books', { books: rows, search, librarian: req.session.librarian });
    });
});

app.get('/books/add', isLoggedIn, (req, res) => {
    res.render('addBook', { error: null, librarian: req.session.librarian });
});

app.post('/books/add', isLoggedIn, (req, res) => {
    const { title, author, genre, isbn, quantity } = req.body;
    db.run(
        `INSERT INTO Books(title, author, genre, isbn, quantity) VALUES(?,?,?,?,?)`,
        [title, author, genre, isbn, quantity],
        (err) => {
            if (!err) {
                res.redirect('/books?msg=Book+added+successfully');
            } else {
                res.render('addBook', { error: 'Failed to add book. Please try again.', librarian: req.session.librarian });
            }
        }
    );
});

app.get('/books/edit/:id', isLoggedIn, (req, res) => {
    db.get(`SELECT * FROM Books WHERE id=?`, [req.params.id], (err, book) => {
        if (!book) return res.redirect('/books');
        res.render('editBook', { book, error: null, librarian: req.session.librarian });
    });
});

app.post('/books/edit/:id', isLoggedIn, (req, res) => {
    const { title, author, genre, isbn, quantity } = req.body;
    db.run(
        `UPDATE Books SET title=?, author=?, genre=?, isbn=?, quantity=? WHERE id=?`,
        [title, author, genre, isbn, quantity, req.params.id],
        (err) => {
            if (!err) {
                res.redirect('/books?msg=Book+updated+successfully');
            } else {
                db.get(`SELECT * FROM Books WHERE id=?`, [req.params.id], (err2, book) => {
                    res.render('editBook', { book, error: 'Update failed. Try again.', librarian: req.session.librarian });
                });
            }
        }
    );
});

app.get('/books/delete/:id', isLoggedIn, (req, res) => {
    db.run(`DELETE FROM Books WHERE id=?`, [req.params.id], (err) => {
        res.redirect('/books?msg=Book+deleted&type=info');
    });
});

// ─── Students Routes ──────────────────────────────────────────────────────────
app.get('/students', isLoggedIn, (req, res) => {
    const search = req.query.search || '';
    const query = search
        ? `SELECT * FROM Students WHERE name LIKE ? OR usn LIKE ? OR branch LIKE ?`
        : `SELECT * FROM Students`;
    const params = search ? [`%${search}%`, `%${search}%`, `%${search}%`] : [];
    db.all(query, params, (err, rows) => {
        res.render('students', { students: rows, search, librarian: req.session.librarian });
    });
});

app.get('/students/add', isLoggedIn, (req, res) => {
    res.render('addStudent', { error: null, librarian: req.session.librarian });
});

app.post('/students/add', isLoggedIn, (req, res) => {
    const { usn, name, branch, email } = req.body;
    db.run(
        `INSERT INTO Students(usn, name, branch, email) VALUES(?,?,?,?)`,
        [usn, name, branch, email],
        (err) => {
            if (!err) {
                res.redirect('/students?msg=Student+added+successfully');
            } else {
                res.render('addStudent', { error: 'USN already exists or invalid data.', librarian: req.session.librarian });
            }
        }
    );
});

app.get('/students/edit/:usn', isLoggedIn, (req, res) => {
    db.get(`SELECT * FROM Students WHERE usn=?`, [req.params.usn], (err, student) => {
        if (!student) return res.redirect('/students');
        res.render('editStudent', { student, error: null, librarian: req.session.librarian });
    });
});

app.post('/students/edit/:usn', isLoggedIn, (req, res) => {
    const { name, branch, email } = req.body;
    db.run(
        `UPDATE Students SET name=?, branch=?, email=? WHERE usn=?`,
        [name, branch, email, req.params.usn],
        (err) => {
            if (!err) {
                res.redirect('/students?msg=Student+updated+successfully');
            } else {
                db.get(`SELECT * FROM Students WHERE usn=?`, [req.params.usn], (err2, student) => {
                    res.render('editStudent', { student, error: 'Update failed.', librarian: req.session.librarian });
                });
            }
        }
    );
});

app.get('/students/delete/:usn', isLoggedIn, (req, res) => {
    db.run(`DELETE FROM Students WHERE usn=?`, [req.params.usn], () => res.redirect('/students?msg=Student+deleted&type=info'));
});

// ─── Borrowed Books Routes ────────────────────────────────────────────────────
app.get('/borrowed', isLoggedIn, (req, res) => {
    db.all(`
        SELECT bb.id, bb.usn, s.name AS student_name, b.title AS book_title,
               bb.borrowed_date, bb.return_date, bb.status,
               CASE WHEN bb.status='borrowed' AND bb.return_date < date('now') THEN 1 ELSE 0 END AS is_overdue
        FROM BorrowedBooks bb
        LEFT JOIN Students s ON bb.usn = s.usn
        LEFT JOIN Books b ON bb.book_id = b.id
        ORDER BY bb.id DESC
    `, (err, rows) => {
        db.all(`SELECT * FROM Students`, (err2, students) => {
            db.all(`SELECT * FROM Books WHERE quantity > 0`, (err3, books) => {
                res.render('borrowed', {
                    records: rows || [],
                    students: students || [],
                    books: books || [],
                    librarian: req.session.librarian
                });
            });
        });
    });
});

app.post('/borrowed/issue', isLoggedIn, (req, res) => {
    const { usn, book_id, return_date } = req.body;
    const borrowed_date = new Date().toISOString().split('T')[0];
    db.run(
        `INSERT INTO BorrowedBooks(usn, book_id, borrowed_date, return_date, status) VALUES(?,?,?,?,'borrowed')`,
        [usn, book_id, borrowed_date, return_date],
        (err) => {
            if (!err) {
                db.run(`UPDATE Books SET quantity = quantity - 1 WHERE id=? AND quantity > 0`, [book_id]);
            }
            res.redirect('/borrowed');
        }
    );
});

app.get('/borrowed/return/:id', isLoggedIn, (req, res) => {
    db.get(`SELECT * FROM BorrowedBooks WHERE id=?`, [req.params.id], (err, record) => {
        if (record && record.status === 'borrowed') {
            db.run(`UPDATE BorrowedBooks SET status='returned' WHERE id=?`, [req.params.id], () => {
                db.run(`UPDATE Books SET quantity = quantity + 1 WHERE id=?`, [record.book_id]);
            });
        }
        res.redirect('/borrowed');
    });
});

// ─── Library Visits Routes ────────────────────────────────────────────────────
app.get('/visits', isLoggedIn, (req, res) => {
    db.all(`
        SELECT lv.id, lv.usn, s.name AS student_name, lv.entry_time, lv.exit_time, lv.duration
        FROM LibraryVisits lv
        LEFT JOIN Students s ON lv.usn = s.usn
        ORDER BY lv.id DESC
    `, (err, rows) => {
        db.all(`SELECT * FROM Students`, (err2, students) => {
            res.render('visits', { visits: rows || [], students: students || [], librarian: req.session.librarian });
        });
    });
});

app.post('/visits/entry', isLoggedIn, (req, res) => {
    const { usn } = req.body;
    const entry_time = new Date().toLocaleString('en-IN', { timeZone: 'Asia/Kolkata' });
    db.run(`INSERT INTO LibraryVisits(usn, entry_time) VALUES(?,?)`, [usn, entry_time], () => {
        res.redirect('/visits');
    });
});

app.post('/visits/exit/:id', isLoggedIn, (req, res) => {
    db.get(`SELECT * FROM LibraryVisits WHERE id=?`, [req.params.id], (err, visit) => {
        if (visit && !visit.exit_time) {
            const exit_time = new Date().toLocaleString('en-IN', { timeZone: 'Asia/Kolkata' });
            // Calculate duration
            const entry = new Date(visit.entry_time);
            const exit = new Date();
            const diffMs = exit - entry;
            const diffMins = Math.round(diffMs / 60000);
            const hours = Math.floor(diffMins / 60);
            const mins = diffMins % 60;
            const duration = hours > 0 ? `${hours}h ${mins}m` : `${mins}m`;
            db.run(
                `UPDATE LibraryVisits SET exit_time=?, duration=? WHERE id=?`,
                [exit_time, duration, req.params.id]
            );
        }
        res.redirect('/visits');
    });
});

// ─── 404 Handler ──────────────────────────────────────────────────────────────
app.use((req, res) => {
    res.status(404).render('404');
});

// ─── Start Server ─────────────────────────────────────────────────────────────
app.listen(5000, () => {
    console.log('🚀 Library Management System running at http://localhost:5000');
});