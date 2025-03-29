// Default values for different filament types
const filamentDefaults = {
    pla: { cost: 20, wattage: 150 },
    abs: { cost: 25, wattage: 180 },
    petg: { cost: 28, wattage: 165 },
    tpu: { cost: 35, wattage: 160 },
    custom: { cost: 20, wattage: 150 }
};

// Initialize the calculator
function initCalculator() {
    // Set up event listeners for all input fields to auto-calculate on change
    const allInputs = document.querySelectorAll('input, select');
    allInputs.forEach(input => {
        // Auto-calculate on input change
        input.addEventListener('input', calculateCost);
        
        // For mobile: blur the input after entering a value
        input.addEventListener('change', function() {
            if (window.innerWidth < 768) {
                setTimeout(() => this.blur(), 100);
            }
        });
        
        // Add keyboard event handling for Enter key
        input.addEventListener('keydown', function(e) {
            if (e.key === 'Enter') {
                calculateCost();
                e.preventDefault();
                
                // Find the next input to focus
                const form = Array.from(allInputs);
                const currentIndex = form.indexOf(e.target);
                const nextElement = form[currentIndex + 1];
                
                if (nextElement) {
                    nextElement.focus();
                } else {
                    // If last element, focus on the calculate button
                    document.querySelector('.calculate-btn').focus();
                }
            }
        });
    });
    
    // Fix for iOS numeric keyboard
    const numericInputs = document.querySelectorAll('input[type="number"]');
    numericInputs.forEach(input => {
        input.addEventListener('focus', function() {
            // Add slight delay to ensure keyboard is shown
            setTimeout(() => {
                input.setAttribute('inputmode', 'decimal');
            }, 100);
        });
    });
    
    // Set up the filament type selector
    const filamentTypeSelect = document.getElementById('filamentType');
    if (filamentTypeSelect) {
        filamentTypeSelect.addEventListener('change', updateDefaultValues);
    }
    
    // Add click event for "Calculate" button
    const calculateBtn = document.querySelector('.calculate-btn');
    if (calculateBtn) {
        calculateBtn.addEventListener('click', function(event) {
            calculateCost();
            
            // Add haptic feedback for mobile devices if available
            if (navigator.vibrate && window.innerWidth < 768) {
                navigator.vibrate(15);
            }
            
            // Add a visual feedback animation to the button
            this.classList.add('clicked');
            setTimeout(() => this.classList.remove('clicked'), 200);
            
            // Show a ripple effect on the button
            createRipple(this, event);
        });
    }
    
    // Add click event for "Reset" button
    const resetBtn = document.querySelector('.reset-btn');
    if (resetBtn) {
        resetBtn.addEventListener('click', function(event) {
            resetForm();
            
            // Add haptic feedback for mobile devices if available
            if (navigator.vibrate && window.innerWidth < 768) {
                navigator.vibrate(15);
            }
            
            // Add a visual feedback animation to the button
            this.classList.add('clicked');
            setTimeout(() => this.classList.remove('clicked'), 200);
            
            // Show a ripple effect on the button
            createRipple(this, event);
        });
    }
    
    // Set up floating reset button for mobile
    const floatingResetBtn = document.getElementById('floatingReset');
    if (floatingResetBtn) {
        floatingResetBtn.addEventListener('click', function(event) {
            resetForm();
            
            // Add haptic feedback for mobile devices if available
            if (navigator.vibrate) {
                navigator.vibrate(15);
            }
            
            // Add a visual feedback animation to the button
            this.classList.add('clicked');
            setTimeout(() => this.classList.remove('clicked'), 200);
            
            // Show a ripple effect on the button
            createRipple(this, event);
        });
        
        // Show floating button when scrolling down on mobile
        window.addEventListener('scroll', toggleFloatingButton);
    }
    
    // Handle orientation changes
    window.addEventListener('orientationchange', () => {
        setTimeout(updateLayout, 300);
    });

    // Handle resize events for better responsiveness
    window.addEventListener('resize', debounce(function() {
        updateLayout();
        adjustForKeyboard();
    }, 250));
    
    // Initialize calculator with default values
    updateDefaultValues();
    calculateCost();
    updateLayout();
    
    // Initialize theme based on user preferences
    initTheme();
}

// Create a ripple effect for buttons
function createRipple(button, e) {
    const rect = button.getBoundingClientRect();
    const circle = document.createElement('span');
    
    const diameter = Math.max(rect.width, rect.height);
    const radius = diameter / 2;
    
    // Position relative to button
    let x = e ? e.clientX - rect.left - radius : rect.width / 2;
    let y = e ? e.clientY - rect.top - radius : rect.height / 2;
    
    // Create the ripple effect
    circle.style.width = circle.style.height = `${diameter}px`;
    circle.style.left = `${x}px`;
    circle.style.top = `${y}px`;
    circle.classList.add('ripple');
    
    // Remove existing ripples
    const ripple = button.querySelector('.ripple');
    if (ripple) {
        ripple.remove();
    }
    
    button.appendChild(circle);
    
    // Remove the ripple after animation
    setTimeout(() => {
        if (circle) {
            circle.remove();
        }
    }, 600);
}

function updateLayout() {
    // Adjust UI based on viewport height
    const vh = window.innerHeight;
    const vw = window.innerWidth;
    const calculator = document.querySelector('.calculator-box');
    
    if (!calculator) return;
    
    if (vh < 600 || (vh < 500 && vw > vh)) {
        // For very small screens or landscape mode on phone
        calculator.classList.add('compact-view');
    } else {
        calculator.classList.remove('compact-view');
    }
    
    // Show/hide floating button for scrollable content
    toggleFloatingButton();
}

// Toggle floating reset button visibility based on scroll position
function toggleFloatingButton() {
    const floatingBtn = document.getElementById('floatingReset');
    if (!floatingBtn) return;
    
    // Only show on mobile
    if (window.innerWidth >= 768) {
        floatingBtn.classList.remove('visible');
        return;
    }
    
    // Show button when user has scrolled down a bit
    if (window.scrollY > 150) {
        floatingBtn.classList.add('visible');
    } else {
        floatingBtn.classList.remove('visible');
    }
}

// Adjust view when keyboard is shown on mobile
function adjustForKeyboard() {
    if (window.innerWidth >= 768) return;
    
    const calculator = document.querySelector('.calculator-box');
    if (!calculator) return;
    
    // If viewport height gets very small (keyboard is likely visible)
    if (window.innerHeight < 400) {
        calculator.classList.add('keyboard-visible');
        document.body.classList.add('keyboard-visible');
    } else {
        calculator.classList.remove('keyboard-visible');
        document.body.classList.remove('keyboard-visible');
    }
}

// Theme initialization based on user preference
function initTheme() {
    const darkModeMediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    
    // Check local storage first
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme) {
        if (savedTheme === 'dark') {
            document.body.classList.add('dark-mode');
        }
    } else if (darkModeMediaQuery.matches) {
        // If no saved preference, use system preference
        document.body.classList.add('dark-mode');
    }
    
    // Set up theme toggle
    const themeToggle = document.getElementById('themeToggle');
    if (themeToggle) {
        themeToggle.addEventListener('click', toggleTheme);
    }
    
    // Set up disco mode toggle
    const discoToggle = document.getElementById('discoToggle');
    if (discoToggle) {
        discoToggle.addEventListener('click', toggleDiscoMode);
    }
}

// Toggle dark/light theme
function toggleTheme() {
    document.body.classList.toggle('dark-mode');
    
    // Save preference
    if (document.body.classList.contains('dark-mode')) {
        localStorage.setItem('theme', 'dark');
    } else {
        localStorage.setItem('theme', 'light');
    }
}

// Toggle disco mode
function toggleDiscoMode() {
    document.body.classList.toggle('disco-mode');
}

function updateDefaultValues() {
    const filamentType = document.getElementById('filamentType');
    if (!filamentType) return;
    
    const defaults = filamentDefaults[filamentType.value];
    
    if (filamentType.value !== 'custom') {
        const filamentCostInput = document.getElementById('filamentCost');
        const printerWattageInput = document.getElementById('printerWattage');
        
        if (filamentCostInput) filamentCostInput.value = defaults.cost;
        if (printerWattageInput) printerWattageInput.value = defaults.wattage;
    }
}

function resetForm() {
    // Reset to default filament type
    const filamentType = document.getElementById('filamentType');
    if (filamentType) filamentType.value = 'pla';
    
    // Reset all input fields to default values
    const inputs = {
        'filamentCost': filamentDefaults.pla.cost,
        'printWeight': 100,
        'printHours': 3,
        'printMinutes': 0,
        'electricityCost': 0.12,
        'printerWattage': filamentDefaults.pla.wattage,
        'failureRate': 10,
        'laborCost': 0
    };
    
    // Set each input value if element exists
    Object.entries(inputs).forEach(([id, value]) => {
        const input = document.getElementById(id);
        if (input) input.value = value;
    });
    
    // Reset result displays with fade effect
    const resultElements = ['materialCost', 'powerCost', 'riskCost', 'laborCostResult', 'totalCost'];
    resultElements.forEach(id => {
        const element = document.getElementById(id);
        if (element) {
            element.classList.add('update-animation');
            element.textContent = '$0.00';
            setTimeout(() => {
                if (element) element.classList.remove('update-animation');
            }, 400);
        }
    });
    
    // Focus on the first input field
    if (filamentType) filamentType.focus();
    
    // On mobile, scroll to top
    if (window.innerWidth < 768) {
        window.scrollTo({top: 0, behavior: 'smooth'});
    }
}

function calculateCost() {
    try {
        // Get input values and handle potential empty values
        const getValue = (id) => {
            const element = document.getElementById(id);
            return element ? (parseFloat(element.value) || 0) : 0;
        };
        
        const filamentCost = getValue('filamentCost');
        const printWeight = getValue('printWeight');
        const printHours = getValue('printHours');
        const printMinutes = getValue('printMinutes');
        const electricityCost = getValue('electricityCost');
        const printerWattage = getValue('printerWattage');
        const failureRate = getValue('failureRate');
        const laborCost = getValue('laborCost');

        // Calculate total print time in hours
        const printTime = printHours + (printMinutes / 60);

        // Calculate costs
        const materialCost = (filamentCost * printWeight) / 1000;
        const powerCost = (printerWattage * printTime * electricityCost) / 1000;
        const laborCostTotal = laborCost * printTime;
        const subtotal = materialCost + powerCost + laborCostTotal;
        const riskCost = subtotal * (failureRate / 100);
        const totalCost = subtotal + riskCost;

        // Update results with animations
        updateCostDisplay('materialCost', materialCost);
        updateCostDisplay('powerCost', powerCost);
        updateCostDisplay('riskCost', riskCost);
        updateCostDisplay('laborCostResult', laborCostTotal);
        updateCostDisplay('totalCost', totalCost);
        
    } catch (error) {
        console.error("Error calculating cost:", error);
    }
}

function updateCostDisplay(elementId, value) {
    const element = document.getElementById(elementId);
    if (!element) return;
    
    const oldValue = parseFloat(element.textContent.replace('$', '')) || 0;
    const formattedValue = formatNumber(value);
    
    // Only animate if the value has changed significantly
    if (Math.abs(oldValue - value) > 0.001) {
        element.classList.add('update-animation');
        element.textContent = formattedValue;
        
        // Remove animation class after animation completes
        setTimeout(() => {
            element.classList.remove('update-animation');
        }, 400);
    } else {
        element.textContent = formattedValue;
    }
}

function formatNumber(value) {
    // Format as currency with 2 decimal places
    return '$' + value.toFixed(2);
}

// Utility function for debouncing
function debounce(func, wait) {
    let timeout;
    return function() {
        const context = this;
        const args = arguments;
        clearTimeout(timeout);
        timeout = setTimeout(() => func.apply(context, args), wait);
    };
}

// Initialize the calculator when the DOM is ready
document.addEventListener('DOMContentLoaded', initCalculator); 