// DOM Loaded check
if (document.readyState === "complete" ||
  (document.readyState !== "loading" && !document.documentElement.doScroll)) {
  Init();
} else {
  document.addEventListener("DOMContentLoaded", () => Init());
}

//#region Variables
// -- Elements
let appEl,
  dispEvalEl,
  dispEquateEl;
// -- Flags

// -- Other
let currUserVal = '';
let currUserOperator = '';
let lastClicked = '';
let calcs = [];

//#endregion Variables

//#region App Functions
let Init = function () {
  appEl = document.getElementById('app');
  dispEvalEl = document.getElementById('display--eval');
  dispEquateEl = document.getElementById('display--equation');

  SetUpListeners();
}

let UpdateDisplay = (newVal) => {
  UpdateEval(newVal);
  UpdateEquation(); // Setup for later
}

let UpdateEval = (newVal) => {
  dispEvalEl.innerHTML = newVal;
}

let UpdateEquation = () => {
  let equateStr = '';

  for(let i = 0; i < calcs.length; i++) {
    if(i == 0) {
      equateStr += `${calcs[i].result} `;
    } else {
      equateStr += ` ${GetOperatorSymbol(calcs[i].operator)} ${calcs[i].num2} `;
    }
  }

  equateStr += ` ${GetOperatorSymbol(currUserOperator)} ${currUserVal}`;
  dispEquateEl.innerHTML = equateStr;
}

let AddCalculation = (calc, lastOp) => {
  calcs.push({ ...calc });
}

let EditCalculation = (index, edits) => {
  calcs[index] = {
    ...calcs[index],
    ...edits
  }
}

let Reset = () => {
  currUserVal = '';
  currUserOperator = '';
  lastClicked = '';
  calcs = [];
}
//#endregion App Functions

//#region Handler Function
let SetUpListeners = () => {
  let numEl = document.querySelectorAll('.btn--number');
  let operatorEl = document.querySelectorAll('.btn--operator');
  let functionEl = document.querySelectorAll('.btn--function');

  numEl.forEach(e => {
    e.addEventListener('click', HandleNumClick);
  });

  operatorEl.forEach(e => {
    e.addEventListener('click', HandleOperatorClick);
  });

  functionEl.forEach(e => {
    e.addEventListener('click', HandleFunctionClick);
  });
}

let HandleNumClick = function () {
  currUserVal = (calcs.length <= 0) && (currUserOperator === 'equal') ? '' : currUserVal.toString();

  // Check & set up decimal
  if (this.dataset.number === '.') {
    if(IsFloat(currUserVal)) return;

    return (currUserVal += '.');
  } else {
    currUserVal += this.dataset.number;
    currUserVal = Str2Float(currUserVal);
  }

  // If no calcs, just update display with the same value
  if (calcs.length <= 0) {
    UpdateDisplay(currUserVal);
  } else {
    UpdateDisplay(operate(currUserOperator, calcs[calcs.length-1].result, currUserVal));
  }

  lastClicked = 'number';
  console.clear();
  console.table(calcs);
}

let HandleOperatorClick = function () {
  if (this.dataset.operator === 'equal') {
    let tempResult = operate(currUserOperator, calcs[calcs.length - 1].result, currUserVal);

    Reset();
    currUserVal = tempResult;
    currUserOperator = this.dataset.operator;
    UpdateDisplay(currUserVal);
  } else if (lastClicked !== 'operator') { // If the user last clicked a number
    currUserVal = IsFloat(currUserVal) ? Str2Float(currUserVal) : Str2Num(currUserVal);

    // Fisrt calc, set up
    if (calcs.length === 0) {
      AddCalculation({
        num1: 0,
        num2: currUserVal,
        operator: this.dataset.operator, // currUserOperator will be overwritten add end of function
        result: operate('', currUserVal)
      });
    } else {
      AddCalculation({
        num1: calcs[calcs.length - 1].result,
        num2: currUserVal,
        operator: currUserOperator, // currUserOperator will be overwritten add end of function
        result: operate(currUserOperator, calcs[calcs.length - 1].result, currUserVal)
      });
    }
    
    currUserVal = '';
    lastClicked = 'operator';
    currUserOperator = this.dataset.operator;
  } else if (lastClicked === 'operator') { // lastClicked is an operator
    // Auto Invert value 
    if (currUserOperator === 'add' &&
      this.dataset.operator === 'subtract') {
      if (currUserVal === '-') 
        currUserOperator = this.dataset.operator;

      currUserVal = ToggleNegative(currUserVal);
    }
    else if (currUserOperator === 'subtract' &&
      this.dataset.operator === 'subtract') {
        currUserVal = ToggleNegative(currUserVal);
    } else {
      currUserOperator = this.dataset.operator;
      currUserVal = '';
    }
  }

  UpdateEquation();
  console.clear();
  console.table(calcs);
}

let HandleFunctionClick = function () {
  switch(this.dataset.function) {
    case 'clear':
      AllClear();
      break;
    case 'integer':
      currUserVal = InvertNumber(currUserVal);
      UpdateDisplay(currUserVal);
      break;
    case 'percent':
      currUserVal = Convert2Percent(currUserVal);
      break;
  }
}
//#endregion Handler Functions

//#region Helper Function
let IsNumber = (n) => {
  return typeof n === 'number';
}

let IsFloat = (n) => {
  return n > Math.floor(n);
}

let InvertVal = (n) => {
  if(n < 0)
    return Math.abs(n);

  return -Math.abs(n);
}

// Must take in whole value and find - 
let ToggleNegative = (val) => {
  if(val === '-')
    return '';
  return '-';
}

let InvertNumber = (num) => {
  // Check if number
  num = (typeof num === 'number') ? num : num.toString();
  num = (num < 0) ? Math.abs(num) : Math.abs(num) * -1;

  return num;
}

let Convert2Percent = (val)  => {
  return (val / 100);
}

let Str2Num = (str) => {
  let newNum = parseInt(str, 10);
  return !isNaN(newNum) ? newNum : console.error('ERROR, must be a valid number');
}

let Str2Float = (str) => {
  let newNum = parseFloat(str);
  return !isNaN(newNum) ? newNum : console.error('ERROR, must be a valid float');
}

let GetOperatorSymbol = (operator) => {
  switch (operator) {
    case 'add':
      return '+';
    case 'subtract':
      return '-';
    case 'multiply':
      return '*';
    case 'divide':
      return '/';
    default:
      return '';
  }
}
//#endregion Helper Functions

//#region Calculator Functions
let Add = (a, b = 0) => a + b;
let Subtract = (a, b = 0) => a - b;
let Multiply = (a, b = 1) => a * b;
let Divide = (a, b = 1) => a / b;

let AllClear = () => {
  dispEvalEl.innerHTML = '0';
  dispEquateEl.innerHTML = '0';

  Reset();
}

let operate = (o, a, b) => {
  switch (o.toLowerCase()) {
    case 'add':
      return Add(a, b);
    case 'subtract':
      return Subtract(a, b);
    case 'multiply':
      return Multiply(a, b);
    case 'divide':
      return Divide(a, b);
    default:
      return a;
  }
}

//#endregion Calculator Functions