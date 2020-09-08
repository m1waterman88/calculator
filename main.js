/* Alias element selectors like JQuery does. */
function $(element) {
  const sel = element.slice(0, 1),
        el = element.slice(1);

  if (sel === '#') return document.getElementById(el);
  if (sel === '.') return document.getElementsByClassName(el);

  return document.getElementsByTagName(element);
}

const calculator = {
  displayValue: '0',
  firstOperand: null,
  waitingForSecondOperand: false,
  operator: null,
};

function inputDigit(digit) {
  const { displayValue, waitingForSecondOperand } = calculator;

  if (waitingForSecondOperand) {
    calculator.displayValue = digit;
    calculator.waitingForSecondOperand = false;
  } else {
    calculator.displayValue = displayValue === '0' ? digit : displayValue + digit;
  }
}

function inputDecimal(dot) {
  if (calculator.waitingForSecondOperand) {
  	calculator.displayValue = "0.";
    calculator.waitingForSecondOperand = false;
    return;
  }

  if (!calculator.displayValue.includes(dot)) {
    calculator.displayValue += dot;
  }
}

function handleOperator(nextOperator) {
  const { firstOperand, displayValue, operator } = calculator,
        inputValue = parseFloat(displayValue);

  if (operator && calculator.waitingForSecondOperand)  {
    calculator.operator = nextOperator;
    return;
  }

  if (!firstOperand && !isNaN(inputValue)) {
    calculator.firstOperand = inputValue;
  } else if (operator) {
    const result = calculate(firstOperand, inputValue, operator);

    calculator.displayValue = `${parseFloat(result.toFixed(7))}`;
    calculator.firstOperand = result;
  }

  calculator.waitingForSecondOperand = true;
  calculator.operator = nextOperator;
}

function calculate(firstOperand, secondOperand, operator) {
  if (operator === '+') {
    return firstOperand + secondOperand;
  } else if (operator === '-') {
    return firstOperand - secondOperand;
  } else if (operator === '*') {
    return firstOperand * secondOperand;
  } else if (operator === '/') {
    return firstOperand / secondOperand;
  }

  return secondOperand;
}

function resetCalculator() {
  calculator.displayValue = '0';
  calculator.firstOperand = null;
  calculator.waitingForSecondOperand = false;
  calculator.operator = null;
}

function updateDisplay() {
  $('.calc-screen')[0].value = calculator.displayValue;
}

updateDisplay();


const keys = $('.calc-keys')[0];
keys.onclick = event => {
  const { target } = event,
        { value } = target,
        memoryValue = Number(window.sessionStorage.getItem("memCalVal"));

  if (!target.matches('button')) {
    return;
  }

  switch (value) {
    case '+':
    case '-':
    case '*':
    case '/':
    case '=':
      handleOperator(value);
      break;
    case '+-':
      if (Number(calculator.displayValue) > 0) {
        -Math.abs(Number(calculator.displayValue));
        calculator.displayValue = -Math.abs(Number(calculator.displayValue));
      } else {
        Math.abs(Number(calculator.displayValue));
        calculator.displayValue = Math.abs(Number(calculator.displayValue));
      }
      break;
    case '.':
      inputDecimal(value);
      break;
    case 'all-clear':
      resetCalculator();
      break;
    case 'MC':
      window.sessionStorage.clear();
      break;
    case 'MR':
      calculator.displayValue = '';
      inputDigit(memoryValue || 0);
      break;
    case 'M+':
      window.sessionStorage.setItem("memCalVal", memoryValue + Number(calculator.displayValue));
      break;
    default:
      if (Number.isInteger(parseFloat(value))) {
        inputDigit(value);
      }
  }

  updateDisplay();
}
