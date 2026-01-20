// Mobile Menu Script - Shared across all pages
(function() {
  'use strict';

  // Wait for DOM to be ready
  function initMobileMenu() {
    const hamburger = document.getElementById('hamburger');
    const nav = document.getElementById('nav');
    const body = document.body;

    // If elements don't exist, exit early
    if (!hamburger || !nav) {
      return;
    }

    function toggleMenu() {
      hamburger.classList.toggle('active');
      nav.classList.toggle('active');
      body.classList.toggle('menu-open');
    }

    function closeMenu() {
      hamburger.classList.remove('active');
      nav.classList.remove('active');
      body.classList.remove('menu-open');
    }

    // Toggle menu on hamburger click
    hamburger.addEventListener('click', function(e) {
      e.stopPropagation();
      toggleMenu();
    });

    // Close menu when clicking on a nav link
    nav.querySelectorAll('a').forEach(link => {
      link.addEventListener('click', () => {
        closeMenu();
      });
    });

    // Close menu when clicking outside
    document.addEventListener('click', (e) => {
      if (!nav.contains(e.target) && !hamburger.contains(e.target)) {
        if (nav.classList.contains('active')) {
          closeMenu();
        }
      }
    });
  }

  // Initialize when DOM is ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initMobileMenu);
  } else {
    initMobileMenu();
  }
})();

