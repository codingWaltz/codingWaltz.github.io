// 2026 - 09 - 09
// Simple Calculator


// Declarations
let runningTotal = null;
let buffer = "0";
let previousOperator = null;
let hitEqual = false;
let isLocked = false;

const screen = document.querySelector(".screen");
const buttons = document.querySelector(".calc-buttons");


// Functions
function updateScreen () {
    screen.textContent = buffer;
}

function buttonClick (value) {
    // DEBUG: console.log("Clicked:", value, "Buffer:", buffer);
    // User lockout if Error
    if (isLocked && value !== "C") {
        return;
    }

    if (isNaN(value)) {
    // this is not a number
        handleSymbol(value);

    } else {
    // this is a number
        if (hitEqual) {
            runningTotal = null;
            buffer = "0";
            hitEqual = false;
        }
        handleNumber(value);
        updateScreen();
    }
}

function handleSymbol (symbol) {
    // × ÷ − +
    switch (symbol) {
        case "C" :
            // Clear
            runningTotal = null;
            buffer = "0";
            previousOperator = null;
            hitEqual = false;
            isLocked = false;
            updateScreen();
            buttons.classList.remove("lockout");
            break;

        case "+" :
        case "−" :
        case "×" :
        case "÷" :
            // Send to handleMath
            handleMath(symbol);
            break;

        case "=" :
            // Do nothing if no operator used or if repeated =
            if (previousOperator === null || hitEqual === true) {
                return;
            }

            // Normal run
            performOperation(Number(buffer));
            
            // Return in case of error
            if (isLocked) {
                updateScreen();
                return;
            }

            // Continued normal run
            previousOperator = null;
            buffer = String(runningTotal);
            runningTotal = null;
            updateScreen();
            hitEqual = true;
            break; 

        case "←" :
            hitEqual = false;

            if (buffer.length === 1) {
                buffer = "0";
            } else {
                buffer = buffer.slice(0, -1);
                // buffer = buffer.substring(0, buffer.length - 1);
            }
            updateScreen();
            break;
    }
}

function handleNumber (numberString) {
    if(buffer === "0") {
        buffer = numberString;
    } else {
        buffer += numberString;
    }
}

function handleMath (symbol) {
// Edge Cases
    // User continues calculating after = 
    if (hitEqual === true) {
        runningTotal = Number(buffer);
        hitEqual = false;
    }

    // User enters symbols consecutively
    if (buffer === "0") {
        // check for previous operator and overwrite
        if (previousOperator !== null) {
            previousOperator = symbol;
        }
        return;
    }

    const bufferNumber = Number(buffer);

    if (runningTotal === null) {
        runningTotal = bufferNumber;
    } else {
        performOperation (bufferNumber);
    }
    
    previousOperator = symbol;
    buffer = "0";
    hitEqual = false;
}

function performOperation (bufferNumber) {
    switch (previousOperator) {
        case "+" :
            runningTotal += bufferNumber;
            break;
        case "−" :
            runningTotal -= bufferNumber;
            break;
        case "×" :
            runningTotal *= bufferNumber;
            break;
        case "÷" :
            if (bufferNumber === 0){
                buffer = "Error, press C";
                isLocked = true;
                buttons.classList.add("lockout");
            } else {
                runningTotal /= bufferNumber;
            }
            break;
    }
}

// Init function
function init () {
    buttons.addEventListener("click", function(event) {
        buttonClick(event.target.innerText);
    })
}

init();
