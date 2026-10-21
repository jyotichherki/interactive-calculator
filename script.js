const display = document.getElementById("display");
const buttons = document.querySelector(".buttons");

let currentInput = "0";
let previousInput = null;
let operator = null;
let resetInput = false;

// Show the current number
function updateDisplay() {
  display.value = currentInput;
}

// Enter a number
function enterNumber(number) {
  if (currentInput === "Error" || resetInput) {
    currentInput = number;
    resetInput = false;
  } else if (currentInput === "0") {
    currentInput = number;
  } else if (currentInput.length < 15) {
    currentInput += number;
  }

  updateDisplay();
}

// Enter a decimal point
function enterDecimal() {
  if (currentInput === "Error" || resetInput) {
    currentInput = "0.";
    resetInput = false;
  } else if (!currentInput.includes(".")) {
    currentInput += ".";
  }

  updateDisplay();
}

// Calculate two numbers
function calculate(a, b, op) {
  switch (op) {
    case "+":
      return a + b;
    case "-":
      return a - b;
    case "*":
      return a * b;
    case "/":
      return b === 0 ? null : a / b;
    default:
      return b;
  }
}

// Choose an operator
function chooseOperator(nextOperator) {
  if (currentInput === "Error") return;

  if (operator && !resetInput) {
    const result = calculate(
      Number(previousInput),
      Number(currentInput),
      operator
    );

    if (result === null || !Number.isFinite(result)) {
      showError();
      return;
    }

    currentInput = String(Number(result.toPrecision(12)));
    updateDisplay();
  }

  previousInput = currentInput;
  operator = nextOperator;
  resetInput = true;
}

// Show an error
function showError() {
  currentInput = "Error";
  previousInput = null;
  operator = null;
  resetInput = true;
  updateDisplay();
}

// Calculate the final answer
function showResult() {
  if (operator === null || previousInput === null) return;
  if (currentInput === "Error") return;

  const result = calculate(
    Number(previousInput),
    Number(currentInput),
    operator
  );

  if (result === null || !Number.isFinite(result)) {
    showError();
    return;
  }

  currentInput = String(Number(result.toPrecision(12)));
  previousInput = null;
  operator = null;
  resetInput = true;

  updateDisplay();
}

// Clear everything
function clearCalculator() {
  currentInput = "0";
  previousInput = null;
  operator = null;
  resetInput = false;
  updateDisplay();
}

// Delete the last digit
function deleteNumber() {
  if (currentInput === "Error" || resetInput) {
    currentInput = "0";
    resetInput = false;
  } else if (currentInput.length > 1) {
    currentInput = currentInput.slice(0, -1);

    if (currentInput === "-") {
      currentInput = "0";
    }
  } else {
    currentInput = "0";
  }

  updateDisplay();
}

// Handle button clicks
buttons.addEventListener("click", function (event) {
  const button = event.target.closest("button");

  if (!button) return;

  if (button.dataset.number !== undefined) {
    enterNumber(button.dataset.number);
  } else if (button.dataset.operator) {
    chooseOperator(button.dataset.operator);
  } else {
    switch (button.dataset.action) {
      case "clear":
        clearCalculator();
        break;

      case "delete":
        deleteNumber();
        break;

      case "decimal":
        enterDecimal();
        break;

      case "equals":
        showResult();
        break;
    }
  }
});

// Keyboard support
document.addEventListener("keydown", function (event) {
  const key = event.key;

  if (/^[0-9]$/.test(key)) {
    enterNumber(key);
  } else if (key === ".") {
    enterDecimal();
  } else if (["+", "-", "*", "/"].includes(key)) {
    chooseOperator(key);
  } else if (key === "Enter" || key === "=") {
    event.preventDefault();
    showResult();
  } else if (key === "Backspace") {
    deleteNumber();
  } else if (key === "Escape") {
    clearCalculator();
  }
});