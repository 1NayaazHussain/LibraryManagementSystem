/**
 * Keyboard Shortcuts
 * ──────────────────
 * Ctrl+K / Cmd+K → Focus search bar
 * Escape → Clear search focus
 */
(function () {
    document.addEventListener('keydown', function (e) {
        // Ctrl+K or Cmd+K → focus search
        if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
            e.preventDefault();
            var search = document.getElementById('search-input') ||
                         document.getElementById('student-search');
            if (search) {
                search.focus();
                search.select();
            }
        }

        // Escape → blur active input
        if (e.key === 'Escape') {
            if (document.activeElement && document.activeElement.tagName === 'INPUT') {
                document.activeElement.blur();
            }
        }
    });
})();
