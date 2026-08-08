/**
 * Fixed Header Enhancement
 * Adds scroll effects to the fixed navbar
 */

document.addEventListener('DOMContentLoaded', function() {
  const navbar = document.querySelector('.navbar-kids');
  
  if (!navbar) return;
  
  // Add scrolled class when user scrolls down
  let lastScroll = 0;
  
  window.addEventListener('scroll', function() {
    const currentScroll = window.pageYOffset;
    
    if (currentScroll > 50) {
      navbar.classList.add('scrolled');
    } else {
      navbar.classList.remove('scrolled');
    }
    
    lastScroll = currentScroll;
  });
  
  // Handle mobile menu closing when clicking outside
  document.addEventListener('click', function(event) {
    const navbar = document.querySelector('.navbar-kids');
    const navbarToggler = document.querySelector('.navbar-toggler');
    const navbarCollapse = document.querySelector('.navbar-collapse');
    
    if (!navbar || !navbarToggler || !navbarCollapse) return;
    
    const isClickInsideNavbar = navbar.contains(event.target);
    const isNavbarExpanded = navbarCollapse.classList.contains('show');
    
    if (!isClickInsideNavbar && isNavbarExpanded) {
      navbarToggler.click();
    }
  });
});

