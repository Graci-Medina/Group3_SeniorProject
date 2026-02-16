import { auth } from './firebase-config.js';
import { 
    createUserWithEmailAndPassword
} from "https://www.gstatic.com/firebasejs/10.8.0/firebase-auth.js";

// Get form elements
const signupForm = document.getElementById('signupForm');
const emailInput = document.getElementById('email');
const passwordInput = document.getElementById('password');
const confirmPasswordInput = document.getElementById('confirmPassword');
const submitBtn = document.getElementById('submitBtn');
const messageDiv = document.getElementById('message');
const passwordWarning = document.getElementById('passwordWarning');

// Real-time password match validation
function checkPasswordMatch() {
    const password = passwordInput.value;
    const confirmPassword = confirmPasswordInput.value;
    
    // Only check if both fields have values
    if (password && confirmPassword) {
        if (password === confirmPassword) {
            // Passwords match
            confirmPasswordInput.classList.remove('password-mismatch');
            confirmPasswordInput.classList.add('password-match');
            passwordWarning.classList.remove('show');
            return true;
        } else {
            // Passwords don't match
            confirmPasswordInput.classList.remove('password-match');
            confirmPasswordInput.classList.add('password-mismatch');
            passwordWarning.classList.add('show');
            return false;
        }
    } else {
        // Clear styling if fields are empty
        confirmPasswordInput.classList.remove('password-match', 'password-mismatch');
        passwordWarning.classList.remove('show');
        return false;
    }
}

// Add event listeners for real-time checking
passwordInput.addEventListener('input', checkPasswordMatch);
confirmPasswordInput.addEventListener('input', checkPasswordMatch);

// Handle form submission
signupForm.addEventListener('submit', async function(e) {
    e.preventDefault();
    
    const email = emailInput.value.trim();
    const password = passwordInput.value;
    const confirmPassword = confirmPasswordInput.value;
    
    // Basic validation
    if (!email || !password || !confirmPassword) {
        showMessage('Please fill in all fields', 'error');
        return;
    }
    
    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
        showMessage('Please enter a valid email address', 'error');
        return;
    }
    
    // Password length validation
    if (password.length < 6) {
        showMessage('Password must be at least 6 characters', 'error');
        return;
    }
    
    // Password match validation
    if (password !== confirmPassword) {
        showMessage('Passwords do not match', 'error');
        confirmPasswordInput.focus();
        return;
    }
    
    // Disable button while processing
    submitBtn.disabled = true;
    submitBtn.textContent = 'Creating account...';
    
    try {
        // Create new user
        const userCredential = await createUserWithEmailAndPassword(auth, email, password);
        
        showMessage('Account created successfully! Redirecting to login...', 'success');
        console.log('User created:', userCredential.user);
        
        // Clear form
        signupForm.reset();
        confirmPasswordInput.classList.remove('password-match', 'password-mismatch');
        passwordWarning.classList.remove('show');
        
        // Redirect to login page after 2 seconds
        setTimeout(() => {
            window.location.href = 'login.html';
        }, 2000);
        
    } catch (error) {
        console.error('Signup error:', error);
        
        // Handle specific Firebase errors
        let errorMessage = 'An error occurred. Please try again.';
        
        switch (error.code) {
            case 'auth/email-already-in-use':
                errorMessage = 'This email is already registered. Please login instead.';
                break;
            case 'auth/invalid-email':
                errorMessage = 'Invalid email address.';
                break;
            case 'auth/weak-password':
                errorMessage = 'Password should be at least 6 characters.';
                break;
            case 'auth/network-request-failed':
                errorMessage = 'Network error. Please check your connection.';
                break;
            case 'auth/too-many-requests':
                errorMessage = 'Too many attempts. Please try again later.';
                break;
        }
        
        showMessage(errorMessage, 'error');
    } finally {
        // Re-enable button
        submitBtn.disabled = false;
        submitBtn.textContent = 'Sign Up';
    }
});

// Function to show messages
function showMessage(message, type) {
    messageDiv.textContent = message;
    messageDiv.className = `message ${type}`;
    messageDiv.style.display = 'block';
}

// Function to clear messages
function clearMessage() {
    messageDiv.textContent = '';
    messageDiv.style.display = 'none';
}

// Clear message when user starts typing
const inputs = document.querySelectorAll('#signupForm input');

inputs.forEach(input => {
    input.addEventListener('input', clearMessage);
    
    input.addEventListener('focus', function() {
        this.style.transform = 'scale(1.02)';
        this.style.transition = 'transform 0.2s';
    });
    
    input.addEventListener('blur', function() {
        this.style.transform = 'scale(1)';
    });
});