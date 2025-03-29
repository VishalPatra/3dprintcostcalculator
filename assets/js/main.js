"use strict";

// Wait for DOM content to load before executing JS
document.addEventListener('DOMContentLoaded', function() {
    // Initialize all components
    initMobileMenu();
    initRippleEffect();
    initThemeToggle();
    initSmoothScroll();
    initDiscoMode();
    
    // Initialize any calculators on the page
    if (document.querySelector('.calculator-form')) {
        initCalculator();
    }
});

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
        }
        
        // Add listener for theme toggle click
        themeToggle.addEventListener('click', function() {
            document.body.classList.toggle('dark-mode');
            toggleThumb.classList.toggle('active');
            
            // Save user preference
            if (document.body.classList.contains('dark-mode')) {
                localStorage.setItem('theme', 'dark');
            } else {
                localStorage.setItem('theme', 'light');
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
                } else {
                    document.body.classList.remove('dark-mode');
                    toggleThumb.classList.remove('active');
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
            updateParticleColors(false);
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
                
                document.body.style.backgroundColor = rgba;
                updateParticleColors(true);
            }, 200);
        }
    }
    
    function updateParticleColors(isDiscoMode) {
        // If using particles.js, update particle colors
        if (window.pJSDom && window.pJSDom.length > 0) {
            const particles = window.pJSDom[0].pJS.particles;
            
            if (isDiscoMode) {
                // Random colors for disco mode
                setInterval(() => {
                    const r = Math.floor(Math.random() * 255);
                    const g = Math.floor(Math.random() * 255);
                    const b = Math.floor(Math.random() * 255);
                    
                    particles.color.value = `rgb(${r}, ${g}, ${b})`;
                    particles.line_linked.color = `rgb(${r}, ${g}, ${b})`;
                    
                    particles.array.forEach(p => {
                        p.color.value = `rgb(${r}, ${g}, ${b})`;
                    });
                }, 200);
            } else {
                // Reset to default colors
                const isDarkMode = document.body.classList.contains('dark-mode');
                const defaultColor = isDarkMode ? '#ffffff' : '#232741';
                
                particles.color.value = defaultColor;
                particles.line_linked.color = defaultColor;
                
                particles.array.forEach(p => {
                    p.color.value = defaultColor;
                });
            }
        }
    }
}
