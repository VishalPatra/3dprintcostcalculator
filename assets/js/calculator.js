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
    
    // Handle orientation changes
    window.addEventListener('orientationchange', () => {
        setTimeout(updateLayout, 300);
    });
    
    // Initialize calculator with default values
    updateDefaultValues();
    calculateCost();
    updateLayout();
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
    const calculator = document.querySelector('.calculator-box');
    
    if (vh < 600) {
        // For very small screens (like landscape on phone)
        calculator.classList.add('compact-view');
    } else {
        calculator.classList.remove('compact-view');
    }
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
        
        // Scroll to results if they're not visible
        // Only on small screens and only if calculation was triggered by button
        if (window.innerWidth < 768 && document.activeElement === document.querySelector('.calculate-btn')) {
            const resultsElement = document.getElementById('results');
            if (resultsElement) {
                const rect = resultsElement.getBoundingClientRect();
                
                if (rect.bottom > window.innerHeight) {
                    resultsElement.scrollIntoView({ 
                        behavior: 'smooth', 
                        block: 'nearest',
                        inline: 'nearest'
                    });
                }
            }
        }
    } catch (error) {
        console.error("Error calculating cost:", error);
    }
}

function updateCostDisplay(elementId, value) {
    const element = document.getElementById(elementId);
    if (!element) return;
    
    // Format with 2 decimal places and include dollar sign
    const formattedValue = `$${formatNumber(value)}`;
    
    // Only animate if the value has changed
    if (element.textContent !== formattedValue) {
        // Add animation class
        element.classList.add('update-animation');
        element.textContent = formattedValue;
        
        // Remove animation class after animation completes
        setTimeout(() => {
            if (element) element.classList.remove('update-animation');
        }, 400);
    }
}

// Helper to format number with proper decimal places
function formatNumber(value) {
    // For values less than 0.1, show 3 decimal places
    if (value < 0.1 && value > 0) {
        return value.toFixed(3);
    } 
    // For values less than 100, show 2 decimal places
    else if (value < 100) {
        return value.toFixed(2);
    } 
    // For larger values, only show 1 decimal place
    else {
        return value.toFixed(1);
    }
} 