"use strict";

// Wait for all content to load before initializing
window.addEventListener("load", function() {
  // Initialize particles with default config
  initParticles();
  
  // Set up dark mode toggle
  initThemeToggle();
  
  // Set up disco mode toggle
  initDiscoMode();
  
  // Set up floating reset button for mobile
  initFloatingReset();
  
  // Initialize the calculator when DOM is ready
  if (typeof initCalculator === 'function') {
    initCalculator();
  }
});

// Initialize particles.js with optimized settings
function initParticles(customColor) {
  particlesJS('particles-js', {
    "particles": {
      "number": {
        "value": 60, // Reduced for better performance
        "density": {
          "enable": true,
          "value_area": 800
        }
      },
      "color": {
        "value": customColor || "#4dabf7"
      },
      "shape": {
        "type": "circle",
        "stroke": {
          "width": 0,
          "color": "#000000"
        },
        "polygon": {
          "nb_sides": 5
        }
      },
      "opacity": {
        "value": 0.6,
        "random": false,
        "anim": {
          "enable": false,
          "speed": 1,
          "opacity_min": 0.1,
          "sync": false
        }
      },
      "size": {
        "value": 3,
        "random": true,
        "anim": {
          "enable": false,
          "speed": 40,
          "size_min": 0.1,
          "sync": false
        }
      },
      "line_linked": {
        "enable": true,
        "distance": 150,
        "color": customColor || "#4dabf7",
        "opacity": 0.5,
        "width": 1
      },
      "move": {
        "enable": true,
        "speed": 2,
        "direction": "none",
        "random": false,
        "straight": false,
        "out_mode": "out",
        "bounce": false,
        "attract": {
          "enable": false,
          "rotateX": 600,
          "rotateY": 1200
        }
      }
    },
    "interactivity": {
      "detect_on": "canvas",
      "events": {
        "onhover": {
          "enable": true,
          "mode": "grab"
        },
        "onclick": {
          "enable": true,
          "mode": "push"
        },
        "resize": true
      },
      "modes": {
        "grab": {
          "distance": 140,
          "line_linked": {
            "opacity": 1
          }
        },
        "bubble": {
          "distance": 400,
          "size": 40,
          "duration": 2,
          "opacity": 8,
          "speed": 3
        },
        "repulse": {
          "distance": 200,
          "duration": 0.4
        },
        "push": {
          "particles_nb": 4
        },
        "remove": {
          "particles_nb": 2
        }
      }
    },
    "retina_detect": true
  });
}

// Initialize theme toggle functionality
function initThemeToggle() {
  const themeToggle = document.getElementById('themeToggle');
  if (!themeToggle) return;
  
  const themeIcon = themeToggle.querySelector('i');
  const body = document.body;
  
  // Check for saved user preference
  const savedTheme = localStorage.getItem('theme');
  if (savedTheme === 'dark') {
    body.classList.add('dark-mode');
    themeIcon.classList.remove('fa-sun');
    themeIcon.classList.add('fa-moon');
    updateParticlesColor('#74c0fc');
  }
  
  // Toggle theme when button is clicked
  themeToggle.addEventListener('click', () => {
    body.classList.toggle('dark-mode');
    
    // Update icon
    if (body.classList.contains('dark-mode')) {
      themeIcon.classList.remove('fa-sun');
      themeIcon.classList.add('fa-moon');
      localStorage.setItem('theme', 'dark');
      updateParticlesColor('#74c0fc');
    } else {
      themeIcon.classList.remove('fa-moon');
      themeIcon.classList.add('fa-sun');
      localStorage.setItem('theme', 'light');
      updateParticlesColor('#4dabf7');
    }
  });
}

// Initialize disco mode functionality
function initDiscoMode() {
  const discoToggle = document.getElementById('discoToggle');
  if (!discoToggle) return;
  
  const discoIcon = discoToggle.querySelector('i');
  const body = document.body;
  const particlesContainer = document.getElementById('particles-js');
  
  // Check for saved user preference
  const savedDiscoMode = localStorage.getItem('discoMode');
  if (savedDiscoMode === 'active') {
    activateDiscoMode();
  }
  
  // Toggle disco mode when button is clicked
  discoToggle.addEventListener('click', () => {
    if (body.classList.contains('disco-mode')) {
      // Turn off disco mode
      body.classList.remove('disco-mode');
      discoToggle.classList.remove('active');
      discoIcon.classList.remove('fa-compact-disc');
      discoIcon.classList.add('fa-music');
      localStorage.setItem('discoMode', 'inactive');
      
      // Reset particles to default
      const currentColor = body.classList.contains('dark-mode') ? '#74c0fc' : '#4dabf7';
      updateParticlesColor(currentColor);
      
      // Stop any active color interval
      if (window.discoInterval) {
        clearInterval(window.discoInterval);
        window.discoInterval = null;
      }
    } else {
      activateDiscoMode();
    }
  });
  
  // Also let users click on particles canvas to change colors in both modes
  if (particlesContainer) {
    particlesContainer.addEventListener('click', (e) => {
      // Only if it's not coming from a form control
      if (!e.target.closest('input, button, select, .calculator-box')) {
        const colors = ['#4dabf7', '#74c0fc', '#a5d8ff', '#1971c2', '#1864ab', '#fd7e14', '#f76707', '#e8590c', '#ff922b', '#40c057', '#2b8a3e', '#82c91e', '#66a80f', '#be4bdb', '#ae3ec9', '#9c36b5'];
        const randomColor = colors[Math.floor(Math.random() * colors.length)];
        updateParticlesColor(randomColor);
      }
    });
  }
  
  function activateDiscoMode() {
    // Turn on disco mode
    body.classList.add('disco-mode');
    discoToggle.classList.add('active');
    discoIcon.classList.remove('fa-music');
    discoIcon.classList.add('fa-compact-disc');
    localStorage.setItem('discoMode', 'active');
    
    // Start color changing interval if not already running
    if (!window.discoInterval) {
      window.discoInterval = setInterval(() => {
        const colors = ['#4dabf7', '#74c0fc', '#a5d8ff', '#1971c2', '#1864ab', '#fd7e14', '#f76707', '#e8590c', '#ff922b', '#40c057', '#2b8a3e', '#82c91e', '#66a80f', '#be4bdb', '#ae3ec9', '#9c36b5'];
        const randomColor = colors[Math.floor(Math.random() * colors.length)];
        updateParticlesColor(randomColor);
      }, 3000);
    }
  }
}

// Initialize floating reset button for mobile devices
function initFloatingReset() {
  const floatingReset = document.getElementById('floatingReset');
  if (!floatingReset) return;
  
  // Only show on mobile devices
  if (window.innerWidth < 768) {
    // Show when user has scrolled a bit
    window.addEventListener('scroll', () => {
      if (window.scrollY > 200) {
        floatingReset.classList.add('visible');
      } else {
        floatingReset.classList.remove('visible');
      }
    });
    
    // Handle click event
    floatingReset.addEventListener('click', () => {
      if (typeof resetForm === 'function') {
        resetForm();
        
        // Add haptic feedback for mobile devices if available
        if (navigator.vibrate) {
          navigator.vibrate(15);
        }
        
        // Add a visual feedback animation to the button
        floatingReset.classList.add('clicked');
        setTimeout(() => floatingReset.classList.remove('clicked'), 200);
        
        // Scroll to top
        window.scrollTo({
          top: 0,
          behavior: 'smooth'
        });
      }
    });
  }
}

// Update particle colors
function updateParticlesColor(color) {
  if (window.pJSDom && window.pJSDom[0]) {
    const particles = window.pJSDom[0].pJS.particles;
    
    // Update particles color
    particles.array.forEach(p => {
      p.color.value = color;
      p.color.rgb = hexToRgb(color);
    });
    
    // Update line linked color
    particles.line_linked.color = color;
    particles.line_linked.color_rgb_line = hexToRgb(color);
  }
}

// Convert hex color to RGB
function hexToRgb(hex) {
  // Remove the '#' if present
  hex = hex.replace('#', '');
  
  // Parse the hex values
  const r = parseInt(hex.substring(0, 2), 16);
  const g = parseInt(hex.substring(2, 4), 16);
  const b = parseInt(hex.substring(4, 6), 16);
  
  return { r, g, b };
}
