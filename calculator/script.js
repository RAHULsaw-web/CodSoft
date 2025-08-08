let currentInput = '';
let operator = '';
let previousInput = '';
let shouldResetDisplay = false;

const display = document.getElementById('display');

// Initialize display
display.value = '0';

// Function to append values to display
function appendToDisplay(value) {
    if (shouldResetDisplay) {
        currentInput = '';
        shouldResetDisplay = false;
    }
    
    // Handle decimal point
    if (value === '.') {
        if (currentInput.includes('.')) {
            return; // Don't allow multiple decimal points
        }
        if (currentInput === '') {
            currentInput = '0.';
        } else {
            currentInput += value;
        }
    }
    // Handle operators
    else if (['+', '-', '*', '/'].includes(value)) {
        if (currentInput === '' && previousInput === '') {
            return; // Don't allow operator as first input
        }
        
        if (currentInput === '' && previousInput !== '') {
            operator = value;
            return;
        }
        
        if (previousInput !== '' && currentInput !== '' && operator !== '') {
            calculate();
        }
        
        operator = value;
        previousInput = currentInput;
        currentInput = '';
        shouldResetDisplay = true;
    }
    // Handle numbers
    else {
        if (currentInput === '0' && value !== '.') {
            currentInput = value;
        } else {
            currentInput += value;
        }
    }
    
    updateDisplay();
}

// Function to update display
function updateDisplay() {
    if (currentInput === '' && previousInput !== '' && operator !== '') {
        display.value = previousInput + ' ' + getOperatorSymbol(operator);
    } else if (currentInput === '') {
        display.value = '0';
    } else {
        display.value = currentInput;
    }
}

// Function to get operator symbol for display
function getOperatorSymbol(op) {
    switch(op) {
        case '*': return '×';
        case '/': return '/';
        case '+': return '+';
        case '-': return '-';
        default: return op;
    }
}

// Function to perform calculation
function calculate() {
    if (previousInput === '' || currentInput === '' || operator === '') {
        return;
    }
    
    const prev = parseFloat(previousInput);
    const current = parseFloat(currentInput);
    let result;
    
    try {
        switch(operator) {
            case '+':
                result = prev + current;
                break;
            case '-':
                result = prev - current;
                break;
            case '*':
                result = prev * current;
                break;
            case '/':
                if (current === 0) {
                    throw new Error('Division by zero');
                }
                result = prev / current;
                break;
            default:
                return;
        }
        
        // Handle floating point precision
        result = Math.round(result * 100000000) / 100000000;
        
        // Check for overflow
        if (!isFinite(result)) {
            throw new Error('Number too large');
        }
        
        currentInput = result.toString();
        operator = '';
        previousInput = '';
        shouldResetDisplay = true;
        display.value = currentInput;
        
    } catch (error) {
        display.value = 'Error';
        display.classList.add('error');
        setTimeout(() => {
            display.classList.remove('error');
            clearDisplay();
        }, 2000);
    }
}

// Function to clear entire display
function clearDisplay() {
    currentInput = '';
    operator = '';
    previousInput = '';
    shouldResetDisplay = false;
    display.value = '0';
    display.classList.remove('error');
}

// Function to clear current entry
function clearEntry() {
    currentInput = '';
    display.value = previousInput || '0';
}

// Function to delete last character
function deleteLast() {
    if (currentInput.length > 0) {
        currentInput = currentInput.slice(0, -1);
        if (currentInput === '' || currentInput === '-') {
            currentInput = '';
            display.value = previousInput || '0';
        } else {
            display.value = currentInput;
        }
    }
}

// Keyboard support
document.addEventListener('keydown', function(event) {
    const key = event.key;
    
    // Prevent default behavior for calculator keys
    if ('0123456789+-*/.='.includes(key) || key === 'Enter' || key === 'Escape' || key === 'Backspace') {
        event.preventDefault();
    }
    
    // Handle number and operator keys
    if ('0123456789'.includes(key)) {
        appendToDisplay(key);
    } else if ('+-*/'.includes(key)) {
        appendToDisplay(key);
    } else if (key === '.') {
        appendToDisplay('.');
    } else if (key === 'Enter' || key === '=') {
        calculate();
    } else if (key === 'Escape') {
        clearDisplay();
    } else if (key === 'Backspace') {
        deleteLast();
    }
});

// Add visual feedback for keyboard presses
document.addEventListener('keydown', function(event) {
    const key = event.key;
    let buttonToHighlight = null;
    
    // Find the corresponding button
    if ('0123456789'.includes(key)) {
        buttonToHighlight = Array.from(document.querySelectorAll('.number')).find(btn => btn.textContent === key);
    } else if (key === '+') {
        buttonToHighlight = Array.from(document.querySelectorAll('.operator')).find(btn => btn.textContent === '+');
    } else if (key === '-') {
        buttonToHighlight = Array.from(document.querySelectorAll('.operator')).find(btn => btn.textContent === '-');
    } else if (key === '*') {
        buttonToHighlight = Array.from(document.querySelectorAll('.operator')).find(btn => btn.textContent === '×');
    } else if (key === '/') {
        buttonToHighlight = Array.from(document.querySelectorAll('.operator')).find(btn => btn.textContent === '/');
    } else if (key === 'Enter' || key === '=') {
        buttonToHighlight = document.querySelector('.equals');
    } else if (key === 'Escape') {
        buttonToHighlight = Array.from(document.querySelectorAll('.clear')).find(btn => btn.textContent === 'C');
    } else if (key === '.') {
        buttonToHighlight = Array.from(document.querySelectorAll('.number')).find(btn => btn.textContent === '.');
    }
    
    // Add highlight effect
    if (buttonToHighlight) {
        buttonToHighlight.style.transform = 'scale(0.95)';
        setTimeout(() => {
            buttonToHighlight.style.transform = '';
        }, 100);
    }
});

// Initialize calculator
document.addEventListener('DOMContentLoaded', function() {
    display.value = '0';
});
