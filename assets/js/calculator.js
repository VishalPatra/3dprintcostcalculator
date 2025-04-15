// Initialize global state variables
let calculatorState = {
    materialCost: 0,
    printTime: 0,
    totalCost: 0,
    additionalCosts: {}
};

// DOM elements cache
const DOM = {
    materialType: document.getElementById('material-type'),
    filamentWeight: document.getElementById('filament-weight'),
    materialCost: document.getElementById('material-cost'),
    printHours: document.getElementById('print-hours'),
    printMinutes: document.getElementById('print-minutes'),
    electricityCost: document.getElementById('electricity-cost'),
    printerCost: document.getElementById('printer-cost'),
    maintenanceCost: document.getElementById('maintenance-cost'),
    failureRate: document.getElementById('failure-rate'),
    profitMargin: document.getElementById('profit-margin'),
    calculateBtn: document.getElementById('calculate-btn'),
    resetBtn: document.getElementById('reset-btn'),
    resultsSection: document.getElementById('results'),
    materialCostResult: document.getElementById('material-cost-result'),
    electricityCostResult: document.getElementById('electricity-cost-result'),
    wearTearResult: document.getElementById('wear-tear-result'),
    failureCostResult: document.getElementById('failure-cost-result'),
    baseCostResult: document.getElementById('base-cost-result'),
    profitResult: document.getElementById('profit-result'),
    totalCostResult: document.getElementById('total-cost-result'),
    floatingResetBtn: document.getElementById('floating-reset-btn'),
    themeToggle: document.getElementById('theme-toggle'),
    discoToggle: document.getElementById('disco-toggle')
};

// Material density data (g/cm³)
const MATERIAL_DENSITY = {
    "pla": 1.24,
    "abs": 1.04,
    "petg": 1.27,
    "tpu": 1.21,
    "nylon": 1.13,
    "pva": 1.23,
    "asa": 1.05,
    "pc": 1.3,
    "hips": 1.04,
    "carbon-fiber": 1.3,
    "wood-fill": 1.28,
    "metal-fill": 1.8,
    "resin-standard": 1.1,
    "resin-tough": 1.12,
    "resin-dental": 1.15,
    "resin-casting": 1.1
};

// Default values
const DEFAULT_VALUES = {
    materialType: "pla",
    filamentWeight: 100,
    materialCost: 25,
    printHours: 5,
    printMinutes: 30,
    electricityCost: 0.15,
    printerCost: 400,
    maintenanceCost: 50,
    failureRate: 5,
    profitMargin: 30
};

// Initialize the calculator
document.addEventListener('DOMContentLoaded', () => {
    // Initialize the app
    initializeCalculator();
    initializeParticles();
    addEventListeners();
    
    // Set initial theme based on user preference
    if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
        document.body.classList.add('dark-mode');
        updateThemeIcon();
    }
    
    // Check URL for calculator or blog mode
    const pathName = window.location.pathname;
    const isCalculatorPage = !pathName.includes('/blog/');
    
    // Apply compact view for landscape mode on mobile
    applyCompactViewIfNeeded();
    window.addEventListener('resize', debounce(applyCompactViewIfNeeded, 250));
    
    // Check if page has scrolled and show/hide floating reset button
    window.addEventListener('scroll', debounce(() => {
        const scrollPosition = window.scrollY;
        if (scrollPosition > 200) {
            DOM.floatingResetBtn.classList.add('visible');
        } else {
            DOM.floatingResetBtn.classList.remove('visible');
        }
    }, 100));
    
    // Lazy load images
    lazyLoadImages();
    
    // Ensure all links use HTTPS
    ensureHttpsLinks();
});

// Initialize calculator with default values
function initializeCalculator() {
    // Populate form with default values
    populateFormWithDefaults();
    
    // Initialize results section (hidden by default)
    hideResults();
}

// Initialize particle background
function initializeParticles() {
    if (!document.getElementById('particles-js')) return;
    
    particlesJS('particles-js', {
        particles: {
            number: { value: 80, density: { enable: true, value_area: 800 } },
            color: { value: "#1971c2" },
            shape: { type: "circle" },
            opacity: { value: 0.5, random: true },
            size: { value: 3, random: true },
            line_linked: {
                enable: true,
                distance: 150,
                color: "#1971c2",
                opacity: 0.4,
                width: 1
            },
            move: {
                enable: true,
                speed: 2,
                direction: "none",
                random: true,
                straight: false,
                out_mode: "out",
                bounce: false
            }
        },
        interactivity: {
            detect_on: "canvas",
            events: {
                onhover: { enable: true, mode: "grab" },
                onclick: { enable: true, mode: "push" },
                resize: true
            },
            modes: {
                grab: { distance: 140, line_linked: { opacity: 1 } },
                push: { particles_nb: 4 }
            }
        },
        retina_detect: true
    });
}

// Add event listeners 
function addEventListeners() {
    // Calculate button
    DOM.calculateBtn.addEventListener('click', (e) => {
        addRippleEffect(e);
        calculateCosts();
    });
    
    // Reset button
    DOM.resetBtn.addEventListener('click', (e) => {
        addRippleEffect(e);
        resetCalculator();
    });
    
    // Floating reset button
    DOM.floatingResetBtn?.addEventListener('click', (e) => {
        resetCalculator();
        // Scroll to top
        window.scrollTo({ top: 0, behavior: 'smooth' });
    });
    
    // Theme toggle
    DOM.themeToggle?.addEventListener('click', toggleTheme);
    
    // Disco mode toggle
    DOM.discoToggle?.addEventListener('click', toggleDiscoMode);
    
    // Input event listeners for real-time calculations
    const inputElements = [
        DOM.materialType, DOM.filamentWeight, DOM.materialCost,
        DOM.printHours, DOM.printMinutes, DOM.electricityCost,
        DOM.printerCost, DOM.maintenanceCost, DOM.failureRate,
        DOM.profitMargin
    ];
    
    inputElements.forEach(element => {
        if (element) {
            element.addEventListener('input', debounce(calculateCosts, 500));
        }
    });
}

// Calculate all costs
function calculateCosts() {
    // Get values from form
    const formValues = getFormValues();
    
    // Calculate material cost
    const materialCost = calculateMaterialCost(
        formValues.materialType,
        formValues.filamentWeight,
        formValues.materialCost
    );
    
    // Calculate print time in hours
    const printTimeInHours = formValues.printHours + (formValues.printMinutes / 60);
    
    // Calculate electricity cost
    const electricityCost = calculateElectricityCost(
        printTimeInHours,
        formValues.electricityCost
    );
    
    // Calculate wear and tear
    const wearAndTear = calculateWearAndTear(
        printTimeInHours,
        formValues.printerCost,
        formValues.maintenanceCost
    );
    
    // Calculate failure cost
    const failureCost = calculateFailureCost(
        materialCost + electricityCost + wearAndTear,
        formValues.failureRate
    );
    
    // Calculate base cost
    const baseCost = materialCost + electricityCost + wearAndTear + failureCost;
    
    // Calculate profit
    const profit = calculateProfit(baseCost, formValues.profitMargin);
    
    // Calculate total cost
    const totalCost = baseCost + profit;
    
    // Update state
    calculatorState = {
        materialCost,
        printTime: printTimeInHours,
        totalCost,
        additionalCosts: {
            electricityCost,
            wearAndTear,
            failureCost,
            baseCost,
            profit
        }
    };
    
    // Display results
    displayResults();
}

// Get current form values
function getFormValues() {
    return {
        materialType: DOM.materialType.value,
        filamentWeight: parseFloat(DOM.filamentWeight.value) || 0,
        materialCost: parseFloat(DOM.materialCost.value) || 0,
        printHours: parseInt(DOM.printHours.value) || 0,
        printMinutes: parseInt(DOM.printMinutes.value) || 0,
        electricityCost: parseFloat(DOM.electricityCost.value) || 0,
        printerCost: parseFloat(DOM.printerCost.value) || 0,
        maintenanceCost: parseFloat(DOM.maintenanceCost.value) || 0,
        failureRate: parseFloat(DOM.failureRate.value) || 0,
        profitMargin: parseFloat(DOM.profitMargin.value) || 0
    };
}

// Calculate material cost
function calculateMaterialCost(materialType, weight, cost) {
    return (weight / 1000) * cost;
}

// Calculate electricity cost
function calculateElectricityCost(printTime, electricityCostPerKWh) {
    // Assume average 3D printer consumes 70W (0.07kW)
    const powerConsumption = 0.07; // kW
    return printTime * powerConsumption * electricityCostPerKWh;
}

// Calculate wear and tear cost
function calculateWearAndTear(printTime, printerCost, yearlyMaintenance) {
    // Assume 3 year printer lifespan with 2000 print hours per year
    const printerLifespanHours = 3 * 2000;
    const depreciationPerHour = printerCost / printerLifespanHours;
    const maintenancePerHour = yearlyMaintenance / 2000;
    
    return printTime * (depreciationPerHour + maintenancePerHour);
}

// Calculate failure cost based on failure rate
function calculateFailureCost(baseCost, failureRate) {
    return baseCost * (failureRate / 100);
}

// Calculate profit based on margin
function calculateProfit(baseCost, profitMargin) {
    return baseCost * (profitMargin / 100);
}

// Display results in the UI
function displayResults() {
    // Show results section if hidden
    DOM.resultsSection.style.display = 'block';
    
    // Apply update animation
    DOM.resultsSection.classList.add('update-animation');
    setTimeout(() => DOM.resultsSection.classList.remove('update-animation'), 500);
    
    // Update result values
    DOM.materialCostResult.textContent = formatCurrency(calculatorState.materialCost);
    DOM.electricityCostResult.textContent = formatCurrency(calculatorState.additionalCosts.electricityCost);
    DOM.wearTearResult.textContent = formatCurrency(calculatorState.additionalCosts.wearAndTear);
    DOM.failureCostResult.textContent = formatCurrency(calculatorState.additionalCosts.failureCost);
    DOM.baseCostResult.textContent = formatCurrency(calculatorState.additionalCosts.baseCost);
    DOM.profitResult.textContent = formatCurrency(calculatorState.additionalCosts.profit);
    DOM.totalCostResult.textContent = formatCurrency(calculatorState.totalCost);
}

// Hide results section
function hideResults() {
    if (DOM.resultsSection) {
        DOM.resultsSection.style.display = 'none';
    }
}

// Reset calculator to default values
function resetCalculator() {
    // Reset form values
    populateFormWithDefaults();
    
    // Hide results
    hideResults();
    
    // Add clicked animation to button
    DOM.resetBtn.classList.add('clicked');
    setTimeout(() => DOM.resetBtn.classList.remove('clicked'), 300);
    
    // Hide floating reset button
    DOM.floatingResetBtn.classList.remove('visible');
}

// Populate form with default values
function populateFormWithDefaults() {
    DOM.materialType.value = DEFAULT_VALUES.materialType;
    DOM.filamentWeight.value = DEFAULT_VALUES.filamentWeight;
    DOM.materialCost.value = DEFAULT_VALUES.materialCost;
    DOM.printHours.value = DEFAULT_VALUES.printHours;
    DOM.printMinutes.value = DEFAULT_VALUES.printMinutes;
    DOM.electricityCost.value = DEFAULT_VALUES.electricityCost;
    DOM.printerCost.value = DEFAULT_VALUES.printerCost;
    DOM.maintenanceCost.value = DEFAULT_VALUES.maintenanceCost;
    DOM.failureRate.value = DEFAULT_VALUES.failureRate;
    DOM.profitMargin.value = DEFAULT_VALUES.profitMargin;
}

// Format currency with 2 decimal places
function formatCurrency(value) {
    return '$' + value.toFixed(2);
}

// Add ripple effect to buttons
function addRippleEffect(event) {
    const button = event.currentTarget;
    const ripple = document.createElement('span');
    
    const rect = button.getBoundingClientRect();
    const size = Math.max(rect.width, rect.height);
    
    ripple.style.width = ripple.style.height = `${size}px`;
    ripple.style.left = `${event.clientX - rect.left - size / 2}px`;
    ripple.style.top = `${event.clientY - rect.top - size / 2}px`;
    
    ripple.classList.add('ripple');
    button.appendChild(ripple);
    
    button.classList.add('clicked');
    
    setTimeout(() => {
        ripple.remove();
        button.classList.remove('clicked');
    }, 600);
}

// Toggle theme between light and dark mode
function toggleTheme() {
    document.body.classList.toggle('dark-mode');
    updateThemeIcon();
    
    // If disco mode is on, turn it off
    if (document.body.classList.contains('disco-mode')) {
        document.body.classList.remove('disco-mode');
        DOM.discoToggle.classList.remove('active');
    }
}

// Update theme icon based on current theme
function updateThemeIcon() {
    if (DOM.themeToggle) {
        const isDarkMode = document.body.classList.contains('dark-mode');
        DOM.themeToggle.innerHTML = isDarkMode 
            ? '<i class="fas fa-sun"></i>' 
            : '<i class="fas fa-moon"></i>';
    }
}

// Toggle disco mode
function toggleDiscoMode() {
    document.body.classList.toggle('disco-mode');
    DOM.discoToggle.classList.toggle('active');
    
    // If dark mode is on, switch to light mode
    if (document.body.classList.contains('dark-mode') && document.body.classList.contains('disco-mode')) {
        document.body.classList.remove('dark-mode');
        updateThemeIcon();
    }
}

// Apply compact view for landscape mode on mobile
function applyCompactViewIfNeeded() {
    const isLandscape = window.innerWidth > window.innerHeight;
    const isMobile = window.innerWidth < 768;
    
    if (isLandscape && isMobile) {
        document.body.classList.add('compact-view');
    } else {
        document.body.classList.remove('compact-view');
    }
}

// Debounce function to limit how often a function is called
function debounce(func, delay = 300) {
    let timer;
    return function(...args) {
        clearTimeout(timer);
        timer = setTimeout(() => func.apply(this, args), delay);
    };
}

// Helper function to convert filament length to weight
function lengthToWeight(length, diameter, density) {
    // Calculate volume in cm³
    const radius = diameter / 2;
    const volume = Math.PI * radius * radius * length / 10; // cm³
    
    // Calculate weight in grams
    return volume * density;
}

// Helper function to convert filament weight to length
function weightToLength(weight, diameter, density) {
    // Calculate volume in cm³
    const volume = weight / density;
    
    // Calculate length in meters
    const radius = diameter / 2;
    const length = (volume * 10) / (Math.PI * radius * radius);
    
    return length;
}

// Lazy load images
function lazyLoadImages() {
    if ('loading' in HTMLImageElement.prototype) {
        // Browser supports native lazy loading
        const images = document.querySelectorAll('img[data-src]');
        images.forEach(img => {
            img.src = img.dataset.src;
            img.loading = 'lazy';
            if (img.dataset.srcset) {
                img.srcset = img.dataset.srcset;
            }
        });
    } else {
        // Fallback for browsers that don't support native lazy loading
        const lazyImages = [].slice.call(document.querySelectorAll('img[data-src]'));
        
        if ('IntersectionObserver' in window) {
            const lazyImageObserver = new IntersectionObserver((entries) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        const lazyImage = entry.target;
                        lazyImage.src = lazyImage.dataset.src;
                        if (lazyImage.dataset.srcset) {
                            lazyImage.srcset = lazyImage.dataset.srcset;
                        }
                        lazyImageObserver.unobserve(lazyImage);
                    }
                });
            });
            
            lazyImages.forEach(lazyImage => {
                lazyImageObserver.observe(lazyImage);
            });
        } else {
            // Fallback for older browsers without IntersectionObserver
            const lazyLoad = () => {
                const scrollTop = window.pageYOffset;
                lazyImages.forEach(lazyImage => {
                    if (lazyImage.offsetTop < window.innerHeight + scrollTop) {
                        lazyImage.src = lazyImage.dataset.src;
                        if (lazyImage.dataset.srcset) {
                            lazyImage.srcset = lazyImage.dataset.srcset;
                        }
                        lazyImages = lazyImages.filter(image => image !== lazyImage);
                        
                        if (lazyImages.length === 0) {
                            document.removeEventListener('scroll', lazyLoad);
                            window.removeEventListener('resize', lazyLoad);
                            window.removeEventListener('orientationchange', lazyLoad);
                        }
                    }
                });
            };
            
            document.addEventListener('scroll', debounce(lazyLoad, 200));
            window.addEventListener('resize', debounce(lazyLoad, 200));
            window.addEventListener('orientationchange', debounce(lazyLoad, 200));
        }
    }
}

// Ensure all links use HTTPS
function ensureHttpsLinks() {
    const links = document.querySelectorAll('a[href^="http://"]');
    links.forEach(link => {
        const href = link.getAttribute('href');
        if (href.startsWith('http://')) {
            link.setAttribute('href', href.replace('http://', 'https://'));
        }
    });
} 