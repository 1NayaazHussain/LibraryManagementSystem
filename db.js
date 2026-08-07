const sqlite3 = require('sqlite3');

const db = new sqlite3.Database('library.db', (err) => {
    if (err) {
        console.log(err.message);
    } else {
        console.log('Connected to database');
    }
});

db.serialize(() => {
    // Librarians table — IF NOT EXISTS prevents crash on restart
    db.run(`
        CREATE TABLE IF NOT EXISTS Librarians(
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            name TEXT,
            email TEXT UNIQUE,
            password TEXT
        )
    `, (err) => { if (!err) console.log('Librarians table ready'); });

    db.run(`
        CREATE TABLE IF NOT EXISTS Students(
            usn TEXT PRIMARY KEY,
            name TEXT,
            branch TEXT,
            email TEXT
        )
    `, (err) => { if (!err) console.log('Students table ready'); });

    db.run(`
        CREATE TABLE IF NOT EXISTS Books(
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            title TEXT,
            author TEXT,
            genre TEXT,
            isbn TEXT,
            quantity INTEGER
        )
    `, (err) => { if (!err) console.log('Books table ready'); });

    db.run(`
        CREATE TABLE IF NOT EXISTS BorrowedBooks(
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            usn TEXT,
            book_id INTEGER,
            borrowed_date TEXT,
            return_date TEXT,
            status TEXT DEFAULT 'borrowed'
        )
    `, (err) => { if (!err) console.log('BorrowedBooks table ready'); });

    db.run(`
        CREATE TABLE IF NOT EXISTS LibraryVisits(
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            usn TEXT,
            entry_time TEXT,
            exit_time TEXT,
            duration TEXT
        )
    `, (err) => { if (!err) console.log('LibraryVisits table ready'); });

    // Migrate: safely add new columns if they don't exist yet
    db.run(`ALTER TABLE Books ADD COLUMN genre TEXT`, () => {});
    db.run(`ALTER TABLE Books ADD COLUMN isbn TEXT`, () => {});
    db.run(`ALTER TABLE Students ADD COLUMN email TEXT`, () => {});

    // Seed Librarians
    db.run(`
        INSERT OR IGNORE INTO Librarians(id, name, email, password) VALUES
        (1, 'Raghunandan', 'raghunandan@nmamit.in', 'abc@123'),
        (2, 'Puneeth', 'puneeth@nmamit.in', 'password'),
        (3, 'Ananth Kumar', 'ananth@nmamit.in', 'ananth@123')
    `, (err) => { if (!err) console.log('Librarians seeded'); });

    // Seed Books
    db.run(`
        INSERT OR IGNORE INTO Books(id, title, author, genre, isbn, quantity) VALUES
        (1, 'The Pragmatic Programmer', 'Andrew Hunt', 'Technology', '978-0201616224', 5),
        (2, 'Clean Code', 'Robert C. Martin', 'Technology', '978-0132350884', 3),
        (3, 'Introduction to Algorithms', 'CLRS', 'Computer Science', '978-0262033848', 8),
        (4, 'Design Patterns', 'Gang of Four', 'Technology', '978-0201633610', 4),
        (5, 'The Great Gatsby', 'F. Scott Fitzgerald', 'Fiction', '978-0743273565', 6),
        (6, 'To Kill a Mockingbird', 'Harper Lee', 'Fiction', '978-0061935466', 7),
        (7, 'Atomic Habits', 'James Clear', 'Self-Help', '978-0735211292', 10),
        (8, 'Deep Work', 'Cal Newport', 'Self-Help', '978-1455586691', 5)
    `, (err) => { if (!err) console.log('Books seeded'); });

    // Seed Students
    db.run(`
        INSERT OR IGNORE INTO Students(usn, name, branch, email) VALUES
        ('1NM22CS001', 'Arjun Sharma', 'CSE', 'arjun@nmamit.in'),
        ('1NM22CS002', 'Priya Patel', 'CSE', 'priya@nmamit.in'),
        ('1NM22IS001', 'Rahul Verma', 'ISE', 'rahul@nmamit.in'),
        ('1NM22EC001', 'Sneha Kumar', 'ECE', 'sneha@nmamit.in'),
        ('1NM22ME001', 'Kiran Rao', 'ME', 'kiran@nmamit.in')
    `, (err) => { if (!err) console.log('Students seeded'); });
});

module.exports = db;