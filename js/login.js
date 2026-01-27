// Login Page Handler
import { signIn, signUp, getRedirectUrl, initAuth } from './auth.js';

// Initialize login page
async function initLogin() {
  await initAuth();
  
  // Get redirect URL
  const redirectUrl = getRedirectUrl();
  
  // Set up form handlers
  const loginForm = document.getElementById('login-form');
  const signupForm = document.getElementById('signup-form');
  const toggleLink = document.getElementById('toggle-signup');
  
  if (loginForm) {
    loginForm.addEventListener('submit', async (e) => {
      e.preventDefault();
      await handleLogin(redirectUrl);
    });
  }
  
  if (signupForm) {
    signupForm.addEventListener('submit', async (e) => {
      e.preventDefault();
      await handleSignup(redirectUrl);
    });
  }
  
  if (toggleLink) {
    toggleLink.addEventListener('click', (e) => {
      e.preventDefault();
      toggleLoginSignup();
    });
  }
}

// Handle login
async function handleLogin(redirectUrl) {
  const emailInput = document.getElementById('email');
  const passwordInput = document.getElementById('password');
  const errorElement = document.getElementById('login-error');
  
  if (!emailInput || !passwordInput) return;
  
  const email = emailInput.value;
  const password = passwordInput.value;
  
  // Clear previous errors
  if (errorElement) errorElement.textContent = '';
  
  // Validate
  if (!email || !password) {
    if (errorElement) errorElement.textContent = 'Please enter email and password';
    return;
  }
  
  // Sign in
  const { data, error } = await signIn(email, password);
  
  if (error) {
    if (errorElement) errorElement.textContent = error.message;
    return;
  }
  
  // Redirect
  window.location.href = redirectUrl || '/';
}

// Handle signup
async function handleSignup(redirectUrl) {
  const nameInput = document.getElementById('signup-name');
  const emailInput = document.getElementById('signup-email');
  const passwordInput = document.getElementById('signup-password');
  const errorElement = document.getElementById('signup-error');
  
  if (!nameInput || !emailInput || !passwordInput) return;
  
  const name = nameInput.value;
  const email = emailInput.value;
  const password = passwordInput.value;
  
  // Clear previous errors
  if (errorElement) errorElement.textContent = '';
  
  // Validate
  if (!name || !email || !password) {
    if (errorElement) errorElement.textContent = 'Please fill in all fields';
    return;
  }
  
  if (password.length < 6) {
    if (errorElement) errorElement.textContent = 'Password must be at least 6 characters';
    return;
  }
  
  // Sign up
  const { data, error } = await signUp(email, password, name);
  
  if (error) {
    if (errorElement) errorElement.textContent = error.message;
    return;
  }
  
  // Check if email confirmation is required
  if (data.user && !data.session) {
    if (errorElement) {
      errorElement.textContent = 'Please check your email to confirm your account';
      errorElement.style.color = 'green';
    }
    return;
  }
  
  // Redirect
  window.location.href = redirectUrl || '/';
}

// Toggle between login and signup forms
function toggleLoginSignup() {
  const loginForm = document.getElementById('login-form');
  const signupForm = document.getElementById('signup-form');
  
  if (!loginForm || !signupForm) return;
  
  const isLoginVisible = loginForm.style.display !== 'none';
  
  loginForm.style.display = isLoginVisible ? 'none' : 'block';
  signupForm.style.display = isLoginVisible ? 'block' : 'none';
}

// Initialize on page load
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initLogin);
} else {
  initLogin();
}

export { initLogin };



