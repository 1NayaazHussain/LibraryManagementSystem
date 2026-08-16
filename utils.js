/**
 * Utility Functions
 * ──────────────────
 * Shared helper utilities used across the application.
 */

/**
 * Formats a duration in milliseconds to a human-readable string.
 * @param {number} ms - Duration in milliseconds
 * @returns {string} - e.g. "2h 35m" or "45m"
 */
function formatDuration(ms) {
    if (isNaN(ms) || ms < 0) return 'N/A';
    const totalMins = Math.round(ms / 60000);
    const hours = Math.floor(totalMins / 60);
    const mins = totalMins % 60;
    if (hours > 0) return `${hours}h ${mins}m`;
    return `${mins}m`;
}

/**
 * Validates a book object from form input.
 * @param {Object} data - { title, author, genre, isbn, quantity }
 * @returns {string|null} - Error message or null if valid
 */
function validateBook({ title, author, genre, isbn, quantity }) {
    if (!title || title.trim().length < 2) return 'Title must be at least 2 characters.';
    if (!author || author.trim().length < 2) return 'Author name must be at least 2 characters.';
    if (!genre || genre.trim().length === 0) return 'Genre is required.';
    if (!isbn || isbn.trim().length < 5) return 'ISBN must be at least 5 characters.';
    const qty = parseInt(quantity, 10);
    if (isNaN(qty) || qty < 0) return 'Quantity must be a non-negative number.';
    return null;
}

/**
 * Validates a student object from form input.
 * @param {Object} data - { usn, name, branch, email }
 * @returns {string|null} - Error message or null if valid
 */
function validateStudent({ usn, name, branch, email }) {
    if (!usn || usn.trim().length < 5) return 'USN must be at least 5 characters.';
    if (!name || name.trim().length < 2) return 'Name must be at least 2 characters.';
    if (!branch || branch.trim().length === 0) return 'Branch is required.';
    if (email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) return 'Please enter a valid email address.';
    return null;
}

/**
 * Sanitizes a string for safe display (strips leading/trailing whitespace).
 * @param {string} str
 * @returns {string}
 */
function sanitize(str) {
    return str ? String(str).trim() : '';
}

/**
 * Returns today's date as YYYY-MM-DD in IST.
 * @returns {string}
 */
function todayIST() {
    return new Date().toLocaleDateString('en-CA', { timeZone: 'Asia/Kolkata' });
}

/**
 * Calculates a default return date N days from today (IST).
 * @param {number} days
 * @returns {string}
 */
function defaultReturnDate(days = 14) {
    const d = new Date();
    d.setDate(d.getDate() + days);
    return d.toLocaleDateString('en-CA', { timeZone: 'Asia/Kolkata' });
}

module.exports = {
    formatDuration,
    validateBook,
    validateStudent,
    sanitize,
    todayIST,
    defaultReturnDate,
};
