// Toggle logout popup
function toggleLogoutPopup(event) {
    event.preventDefault();
    const popup = document.getElementById('logoutPopup');
    popup.classList.toggle('active');
}

// Close logout popup
function closeLogoutPopup() {
    const popup = document.getElementById('logoutPopup');
    popup.classList.remove('active');
}

// Handle logout
function handleLogout() {
    // Clear any stored session data
    localStorage.clear();
    sessionStorage.clear();
    
    // Redirect to login page (adjust path as needed)
    // If login.html is in parent directory:
    window.location.href = '../login.html';
    
    // Or if it's in the root directory, use:
    // window.location.href = '/login.html';
}

// Close popup when clicking outside
document.addEventListener('DOMContentLoaded', function() {
    const popup = document.getElementById('logoutPopup');
    
    popup.addEventListener('click', function(event) {
        if (event.target === popup) {
            closeLogoutPopup();
        }
    });
});