/**
 * Toast notification component
 * Auto-dismisses after 4 seconds. Supports success, error, and info types.
 * Usage: include this script on pages, then call showToast('message', 'success')
 */
(function () {
    // Check for flash message from URL params
    const params = new URLSearchParams(window.location.search);
    const msg = params.get('msg');
    const type = params.get('type') || 'success';

    if (msg) {
        showToast(decodeURIComponent(msg), type);
        // Clean URL without reloading
        const url = new URL(window.location);
        url.searchParams.delete('msg');
        url.searchParams.delete('type');
        window.history.replaceState({}, '', url);
    }

    window.showToast = function (message, type) {
        type = type || 'success';

        // Create toast container if it doesn't exist
        let container = document.getElementById('toast-container');
        if (!container) {
            container = document.createElement('div');
            container.id = 'toast-container';
            container.style.cssText = 'position:fixed;top:20px;right:20px;z-index:9999;display:flex;flex-direction:column;gap:10px;';
            document.body.appendChild(container);
        }

        const toast = document.createElement('div');
        const icons = { success: '✅', error: '❌', info: 'ℹ️' };
        const colors = {
            success: 'linear-gradient(135deg, rgba(16,185,129,0.95), rgba(5,150,105,0.95))',
            error: 'linear-gradient(135deg, rgba(244,63,94,0.95), rgba(225,29,72,0.95))',
            info: 'linear-gradient(135deg, rgba(59,130,246,0.95), rgba(37,99,235,0.95))'
        };

        toast.style.cssText =
            'background:' + (colors[type] || colors.info) + ';' +
            'color:#fff;padding:12px 20px;border-radius:12px;font-size:14px;' +
            'font-family:Inter,sans-serif;box-shadow:0 8px 32px rgba(0,0,0,0.3);' +
            'display:flex;align-items:center;gap:8px;min-width:250px;' +
            'animation:slideIn 0.3s ease-out;backdrop-filter:blur(8px);';
        toast.innerHTML = '<span>' + (icons[type] || '📢') + '</span><span>' + message + '</span>';

        container.appendChild(toast);

        // Add animation keyframes if not already added
        if (!document.getElementById('toast-keyframes')) {
            const style = document.createElement('style');
            style.id = 'toast-keyframes';
            style.textContent =
                '@keyframes slideIn{from{transform:translateX(100%);opacity:0}to{transform:translateX(0);opacity:1}}' +
                '@keyframes slideOut{from{transform:translateX(0);opacity:1}to{transform:translateX(100%);opacity:0}}';
            document.head.appendChild(style);
        }

        // Auto dismiss
        setTimeout(function () {
            toast.style.animation = 'slideOut 0.3s ease-in forwards';
            setTimeout(function () { toast.remove(); }, 300);
        }, 4000);
    };
})();
