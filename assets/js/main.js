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
  
  // Initialize mobile dropdown menu
  initMobileMenu();
  
  // Initialize ripple effects
  initRippleEffect();
  
  // Initialize smooth scrolling
  initSmoothScroll();
  
  // Initialize the calculator when DOM is ready
  if (typeof initCalculator === 'function') {
    initCalculator();
  }
});

// Initialize particles.js with optimized settings
function initParticles(customColor) {
  const particlesContainer = document.getElementById('particles-js');
  if (!particlesContainer) return;
  
  const isDarkMode = document.body.classList.contains('dark-mode');
  const defaultColor = isDarkMode ? '#74c0fc' : '#4dabf7';
  const color = customColor || defaultColor;
  
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
        "value": color
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
        "color": color,
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

// Mobile menu toggle
function initMobileMenu() {
    const mobileMenuBtn = document.querySelector('.mobile-menu-btn');
    const mobileNav = document.querySelector('.mobile-nav');
    
    if (mobileMenuBtn && mobileNav) {
        mobileMenuBtn.addEventListener('click', function() {
            this.classList.toggle('active');
            mobileNav.classList.toggle('active');
            document.body.classList.toggle('menu-open');
        });
    }
}

// Ripple effect for buttons
function initRippleEffect() {
    const buttons = document.querySelectorAll('button, .btn, .read-more');
    
    buttons.forEach(button => {
        button.addEventListener('click', function(e) {
            const x = e.clientX - e.target.getBoundingClientRect().left;
            const y = e.clientY - e.target.getBoundingClientRect().top;
            
            const ripple = document.createElement('span');
            ripple.classList.add('ripple');
            ripple.style.left = `${x}px`;
            ripple.style.top = `${y}px`;
            
            this.appendChild(ripple);
            
            setTimeout(() => {
                ripple.remove();
            }, 600);
        });
    });
}

// Theme toggle (Dark/Light mode)
function initThemeToggle() {
    const themeToggle = document.querySelector('.theme-toggle');
    const toggleThumb = document.querySelector('.toggle-thumb');
    const prefersDarkScheme = window.matchMedia('(prefers-color-scheme: dark)');
    
    if (themeToggle && toggleThumb) {
        // Check if user has previously set a preference
        const savedTheme = localStorage.getItem('theme');
        
        // Apply theme based on saved preference or system setting
        if (savedTheme === 'dark' || (!savedTheme && prefersDarkScheme.matches)) {
            document.body.classList.add('dark-mode');
            toggleThumb.classList.add('active');
            
            // Update particles colors if they exist
            if (window.pJSDom && window.pJSDom.length > 0) {
                updateParticlesColor('#74c0fc');
            }
        }
        
        // Add listener for theme toggle click
        themeToggle.addEventListener('click', function() {
            document.body.classList.toggle('dark-mode');
            toggleThumb.classList.toggle('active');
            
            // Save user preference
            if (document.body.classList.contains('dark-mode')) {
                localStorage.setItem('theme', 'dark');
                updateParticlesColor('#74c0fc');
            } else {
                localStorage.setItem('theme', 'light');
                updateParticlesColor('#4dabf7');
            }
            
            // Update calculator if it exists on the page
            if (typeof updateCalculatorTheme === 'function') {
                updateCalculatorTheme();
            }
        });
        
        // Listen for system preference changes
        prefersDarkScheme.addEventListener('change', (e) => {
            // Only apply system preference if user hasn't explicitly chosen a theme
            if (!localStorage.getItem('theme')) {
                if (e.matches) {
                    document.body.classList.add('dark-mode');
                    toggleThumb.classList.add('active');
                    updateParticlesColor('#74c0fc');
                } else {
                    document.body.classList.remove('dark-mode');
                    toggleThumb.classList.remove('active');
                    updateParticlesColor('#4dabf7');
                }
                
                // Update calculator if it exists on the page
                if (typeof updateCalculatorTheme === 'function') {
                    updateCalculatorTheme();
                }
            }
        });
    }
}

// Smooth scrolling for anchor links
function initSmoothScroll() {
    const links = document.querySelectorAll('a[href^="#"]:not([href="#"])');
    
    links.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            
            const targetId = this.getAttribute('href');
            const targetElement = document.querySelector(targetId);
            
            if (targetElement) {
                const offsetTop = targetElement.getBoundingClientRect().top + window.pageYOffset;
                
                window.scrollTo({
                    top: offsetTop,
                    behavior: 'smooth'
                });
                
                // If mobile menu is open, close it
                const mobileMenuBtn = document.querySelector('.mobile-menu-btn');
                const mobileNav = document.querySelector('.mobile-nav');
                
                if (mobileMenuBtn && mobileMenuBtn.classList.contains('active')) {
                    mobileMenuBtn.classList.remove('active');
                    mobileNav.classList.remove('active');
                    document.body.classList.remove('menu-open');
                }
            }
        });
    });
}

// Calculate based on input values
function initCalculator() {
    const calculatorForm = document.querySelector('.calculator-form');
    const resultSection = document.querySelector('.calculator-results');
    const costBreakdownSection = document.querySelector('.cost-breakdown');
    
    if (calculatorForm) {
        // Initialize tooltips
        const tooltipTriggers = document.querySelectorAll('.tooltip-trigger');
        
        tooltipTriggers.forEach(trigger => {
            trigger.addEventListener('click', function(e) {
                e.preventDefault();
                const tooltip = this.nextElementSibling;
                tooltip.classList.toggle('active');
                
                // Close other tooltips
                tooltipTriggers.forEach(otherTrigger => {
                    if (otherTrigger !== trigger) {
                        const otherTooltip = otherTrigger.nextElementSibling;
                        otherTooltip.classList.remove('active');
                    }
                });
                
                // Close tooltip when clicking outside
                document.addEventListener('click', function closeTooltip(e) {
                    if (!tooltip.contains(e.target) && e.target !== trigger) {
                        tooltip.classList.remove('active');
                        document.removeEventListener('click', closeTooltip);
                    }
                });
            });
        });
        
        // Handle form submission
        calculatorForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            // Get form values
            const filamentCost = parseFloat(document.getElementById('filament-cost').value);
            const filamentWeight = parseFloat(document.getElementById('filament-weight').value);
            const printWeight = parseFloat(document.getElementById('print-weight').value);
            const printTime = parseFloat(document.getElementById('print-time').value);
            const printerCost = parseFloat(document.getElementById('printer-cost').value);
            const printerLifespan = parseFloat(document.getElementById('printer-lifespan').value);
            const electricityCost = parseFloat(document.getElementById('electricity-cost').value);
            const printerWattage = parseFloat(document.getElementById('printer-wattage').value);
            const failureRate = parseFloat(document.getElementById('failure-rate').value) / 100;
            const margin = parseFloat(document.getElementById('margin').value) / 100;
            
            // Calculate costs
            const materialCost = calculateMaterialCost(filamentCost, filamentWeight, printWeight);
            const electricityCostTotal = calculateElectricityCost(printerWattage, printTime, electricityCost);
            const printerDepreciation = calculatePrinterDepreciation(printerCost, printerLifespan, printTime);
            const failureCost = calculateFailureCost(materialCost, electricityCostTotal, printerDepreciation, failureRate);
            const baseCost = materialCost + electricityCostTotal + printerDepreciation + failureCost;
            const profit = baseCost * margin;
            const totalCost = baseCost + profit;
            
            // Display results
            resultSection.querySelector('.total-cost-value').textContent = `$${totalCost.toFixed(2)}`;
            costBreakdownSection.querySelector('.material-cost').textContent = `$${materialCost.toFixed(2)} (${((materialCost / baseCost) * 100).toFixed(1)}%)`;
            costBreakdownSection.querySelector('.electricity-cost').textContent = `$${electricityCostTotal.toFixed(2)} (${((electricityCostTotal / baseCost) * 100).toFixed(1)}%)`;
            costBreakdownSection.querySelector('.depreciation-cost').textContent = `$${printerDepreciation.toFixed(2)} (${((printerDepreciation / baseCost) * 100).toFixed(1)}%)`;
            costBreakdownSection.querySelector('.failure-cost').textContent = `$${failureCost.toFixed(2)} (${((failureCost / baseCost) * 100).toFixed(1)}%)`;
            costBreakdownSection.querySelector('.profit-margin').textContent = `$${profit.toFixed(2)} (${(margin * 100).toFixed(0)}%)`;
            
            // Show results
            resultSection.classList.add('active');
            costBreakdownSection.classList.add('active');
            
            // Smooth scroll to results
            resultSection.scrollIntoView({ behavior: 'smooth' });
        });
        
        // Handle reset button
        const resetButton = document.querySelector('.reset-btn');
        
        if (resetButton) {
            resetButton.addEventListener('click', function() {
                calculatorForm.reset();
                resultSection.classList.remove('active');
                costBreakdownSection.classList.remove('active');
            });
        }
    }
}

// Update calculator theme (light/dark)
function updateCalculatorTheme() {
    const isDarkMode = document.body.classList.contains('dark-mode');
    const resultSection = document.querySelector('.calculator-results');
    
    if (resultSection) {
        // If there's a Chart.js chart, update its theme
        if (window.costChart) {
            const textColor = isDarkMode ? '#f8f9fa' : '#333';
            const gridColor = isDarkMode ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.1)';
            
            window.costChart.options.scales.x.ticks.color = textColor;
            window.costChart.options.scales.y.ticks.color = textColor;
            window.costChart.options.scales.x.grid.color = gridColor;
            window.costChart.options.scales.y.grid.color = gridColor;
            window.costChart.update();
        }
    }
}

// Material cost calculation
function calculateMaterialCost(filamentCost, filamentWeight, printWeight) {
    const costPerGram = filamentCost / filamentWeight;
    return costPerGram * printWeight;
}

// Electricity cost calculation
function calculateElectricityCost(printerWattage, printTime, electricityCost) {
    const kwhUsed = (printerWattage * printTime) / 1000;
    return kwhUsed * electricityCost;
}

// Printer depreciation calculation
function calculatePrinterDepreciation(printerCost, printerLifespan, printTime) {
    const costPerHour = printerCost / (printerLifespan * 24 * 365);
    return costPerHour * printTime;
}

// Failure cost calculation
function calculateFailureCost(materialCost, electricityCost, printerDepreciation, failureRate) {
    const baseCost = materialCost + electricityCost + printerDepreciation;
    return baseCost * failureRate;
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

// Disco mode - fun easter egg
function initDiscoMode() {
  let discoModeActive = false;
  let discoInterval;
  let clickCount = 0;
  let lastClick = 0;
  
  const logo = document.querySelector('.logo img');
  
  if (logo) {
    logo.addEventListener('click', function() {
      const now = new Date().getTime();
      
      // Reset click count if more than 500ms between clicks
      if (now - lastClick > 500) {
        clickCount = 0;
      }
      
      clickCount++;
      lastClick = now;
      
      // Activate disco mode with 5 rapid clicks
      if (clickCount >= 5) {
        toggleDiscoMode();
        clickCount = 0;
      }
    });
  }
  
  function toggleDiscoMode() {
    if (discoModeActive) {
      // Turn off disco mode
      clearInterval(discoInterval);
      document.body.style.transition = 'background-color 0.5s ease';
      document.body.style.backgroundColor = '';
      updateParticlesColor(document.body.classList.contains('dark-mode') ? '#74c0fc' : '#4dabf7');
      discoModeActive = false;
    } else {
      // Turn on disco mode
      discoModeActive = true;
      document.body.style.transition = 'background-color 0.2s ease';
      
      discoInterval = setInterval(() => {
        const r = Math.floor(Math.random() * 255);
        const g = Math.floor(Math.random() * 255);
        const b = Math.floor(Math.random() * 255);
        const rgba = `rgba(${r}, ${g}, ${b}, 0.1)`;
        const particleColor = `#${r.toString(16).padStart(2, '0')}${g.toString(16).padStart(2, '0')}${b.toString(16).padStart(2, '0')}`;
        
        document.body.style.backgroundColor = rgba;
        updateParticlesColor(particleColor);
      }, 2000);
    }
  }
}