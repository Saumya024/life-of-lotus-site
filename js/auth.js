// Authentication Module
import supabase from './supabase-client.js';

// Auth state management
let currentUser = null;
let authListeners = [];

// Initialize auth state
async function initAuth() {
  const { data: { session } } = await supabase.auth.getSession();
  currentUser = session?.user || null;
  notifyAuthListeners();
  return currentUser;
}

// Listen for auth state changes
supabase.auth.onAuthStateChange((event, session) => {
  currentUser = session?.user || null;
  notifyAuthListeners();
});

// Subscribe to auth state changes
function onAuthStateChange(callback) {
  authListeners.push(callback);
  if (currentUser !== null) {
    callback(currentUser);
  }
  return () => {
    authListeners = authListeners.filter(cb => cb !== callback);
  };
}

// Notify all listeners
function notifyAuthListeners() {
  authListeners.forEach(callback => callback(currentUser));
}

// Check if user is authenticated
function isAuthenticated() {
  return currentUser !== null;
}

// Get current user
function getCurrentUser() {
  return currentUser;
}

// Sign up with email and password
async function signUp(email, password, name) {
  try {
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          name: name
        }
      }
    });

    if (error) throw error;

    // Create user record in public.users table
    if (data.user) {
      const { error: userError } = await supabase
        .from('users')
        .insert({
          id: data.user.id,
          email: data.user.email,
          name: name,
          role: 'user'
        });

      if (userError) {
        console.error('Error creating user record:', userError);
      }
    }

    return { data, error: null };
  } catch (error) {
    return { data: null, error };
  }
}

// Sign in with email and password
async function signIn(email, password) {
  try {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password
    });

    if (error) throw error;
    return { data, error: null };
  } catch (error) {
    return { data: null, error };
  }
}

// Sign out
async function signOut() {
  try {
    const { error } = await supabase.auth.signOut();
    if (error) throw error;
    return { error: null };
  } catch (error) {
    return { error };
  }
}

// Reset password
async function resetPassword(email) {
  try {
    const { data, error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/reset-password`
    });

    if (error) throw error;
    return { data, error: null };
  } catch (error) {
    return { data: null, error };
  }
}

// Update password
async function updatePassword(newPassword) {
  try {
    const { data, error } = await supabase.auth.updateUser({
      password: newPassword
    });

    if (error) throw error;
    return { data, error: null };
  } catch (error) {
    return { data: null, error };
  }
}

// Require authentication - redirects to login if not authenticated
// Note: This is synchronous and checks current state. For async checks, use initAuth() first.
function requireAuth(redirectPath = null) {
  if (!isAuthenticated()) {
    const currentPath = window.location.pathname + window.location.search;
    const redirect = redirectPath || currentPath;
    window.location.href = `login.html?redirect=${encodeURIComponent(redirect)}`;
    return false;
  }
  return true;
}

// Check authentication and execute callback if authenticated
async function withAuth(callback, redirectPath = null) {
  if (!isAuthenticated()) {
    const currentPath = window.location.pathname + window.location.search;
    const redirect = redirectPath || currentPath;
    window.location.href = `/login.html?redirect=${encodeURIComponent(redirect)}`;
    return;
  }
  return callback();
}

// Get redirect URL from query params
function getRedirectUrl() {
  const params = new URLSearchParams(window.location.search);
  return params.get('redirect') || '/';
}

// Export functions
export {
  initAuth,
  onAuthStateChange,
  isAuthenticated,
  getCurrentUser,
  signUp,
  signIn,
  signOut,
  resetPassword,
  updatePassword,
  requireAuth,
  withAuth,
  getRedirectUrl
};

