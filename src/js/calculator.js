// Default values for different filament types
const filamentDefaults = {
    pla: { cost: 20, wattage: 150 },
    abs: { cost: 25, wattage: 180 },
    petg: { cost: 28, wattage: 165 },
    tpu: { cost: 35, wattage: 160 },
    custom: { cost: 20, wattage: 150 }
};

function updateDefaultValues() {
    const filamentType = document.getElementById('filamentType').value;
    const defaults = filamentDefaults[filamentType];
    
    if (filamentType !== 'custom') {
        document.getElementById('filamentCost').value = defaults.cost;
        document.getElementById('printerWattage').value = defaults.wattage;
    }
}

function calculateCost() {
    // Get input values
    const filamentCost = parseFloat(document.getElementById('filamentCost').value);
    const printWeight = parseFloat(document.getElementById('printWeight').value);
    const printHours = parseFloat(document.getElementById('printHours').value || 0);
    const printMinutes = parseFloat(document.getElementById('printMinutes').value || 0);
    const electricityCost = parseFloat(document.getElementById('electricityCost').value);
    const printerWattage = parseFloat(document.getElementById('printerWattage').value);
    const failureRate = parseFloat(document.getElementById('failureRate').value);
    const laborCost = parseFloat(document.getElementById('laborCost').value || 0);

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
}

function updateCostDisplay(elementId, value) {
    const element = document.getElementById(elementId);
    const formattedValue = `$${value.toFixed(2)}`;
    
    // Add animation class
    element.classList.add('update-animation');
    element.textContent = formattedValue;
    
    // Remove animation class after animation completes
    setTimeout(() => {
        element.classList.remove('update-animation');
    }, 300);
}

// Initialize the calculator
document.addEventListener('DOMContentLoaded', () => {
    updateDefaultValues();
    calculateCost();
}); 